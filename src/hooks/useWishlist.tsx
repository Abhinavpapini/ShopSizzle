import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import type { Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";

export const useWishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Get the storage key for the current user
  const getStorageKey = useCallback(() => {
    return user ? `wishlist_${user.id}` : "wishlist_guest";
  }, [user]);

  // Load wishlist from localStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch {
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  }, [getStorageKey]);

  // Save wishlist to localStorage
  const saveWishlist = useCallback((items: Product[]) => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(items));
    setWishlistItems(items);
  }, [getStorageKey]);

  // Add item to wishlist
  const addToWishlist = useCallback((product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      });
      return false;
    }

    const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isAlreadyInWishlist) {
      toast({
        title: "Already in wishlist",
        description: `${product.title} is already in your wishlist.`,
      });
      return false;
    }

    const updatedWishlist = [...wishlistItems, product];
    saveWishlist(updatedWishlist);
    toast({
      title: "Added to wishlist",
      description: `${product.title} has been added to your wishlist.`,
    });
    return true;
  }, [wishlistItems, isAuthenticated, saveWishlist]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    saveWishlist(updatedWishlist);
    
    const removedProduct = wishlistItems.find(item => item.id === productId);
    if (removedProduct) {
      toast({
        title: "Removed from wishlist",
        description: `${removedProduct.title} has been removed from your wishlist.`,
      });
    }
  }, [wishlistItems, saveWishlist]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  // Clear all wishlist items
  const clearWishlist = useCallback(() => {
    saveWishlist([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
  }, [saveWishlist]);

  // Toggle item in wishlist
  const toggleWishlist = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      return addToWishlist(product);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    toggleWishlist,
    wishlistCount: wishlistItems.length,
  };
};
