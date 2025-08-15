import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { formatINR } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
type Props = { product: Product };

const ProductCard = ({ product }: Props) => {
  const dispatch = useDispatch();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const onAdd = () => {
    dispatch(addToCart(product));
    toast({ title: "Added to cart", description: product.title });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking wishlist button
    toggleWishlist(product);
  };

  return (
    <Card className="transition-smooth hover:shadow-elevated hover-scale group">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-xl bg-muted relative">
          <img
            src={product.image}
            alt={`${product.title} product image`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link to={`/product/${product.id}`}>
              <Button variant="secondary" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
            </Link>
          </div>
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white shadow-sm ${
              isInWishlist(product.id) ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium leading-tight hover:text-primary transition-colors cursor-pointer">
                {product.title}
              </h3>
            </Link>
            {product.rating && (
              <p className="text-sm text-muted-foreground">⭐ {product.rating.toFixed(1)}</p>
            )}
          </div>
          <div className="text-right font-semibold">{formatINR(product.price)}</div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={onAdd} className="flex-1" aria-label={`Add ${product.title} to cart`}>
          Add to cart
        </Button>
        <Link to={`/product/${product.id}`}>
          <Button variant="outline" size="icon" aria-label={`View ${product.title} details`}>
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
