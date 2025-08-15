import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/hooks/useWishlist";
import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag } from "lucide-react";

const Wishlist = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length > 0 
              ? `You have ${wishlistItems.length} item${wishlistItems.length === 1 ? '' : 's'} in your wishlist`
              : "Your wishlist is empty"
            }
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div />
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="text-destructive hover:text-destructive"
              >
                Clear Wishlist
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white shadow-sm"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-4">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Save items you love by clicking the heart icon on any product.
              </p>
              <Link to="/products">
                <Button>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
