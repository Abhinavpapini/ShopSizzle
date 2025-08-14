import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  currentProduct: Product;
  maxItems?: number;
}

const RelatedProducts = ({ currentProduct, maxItems = 4 }: RelatedProductsProps) => {
  const products = useSelector((s: RootState) => s.products.items);
  
  // Get related products based on category, excluding current product
  const relatedProducts = products
    .filter((product) => 
      product.id !== currentProduct.id && 
      product.category === currentProduct.category
    )
    .slice(0, maxItems);

  // If no products in same category, get random products
  const finalProducts = relatedProducts.length > 0 
    ? relatedProducts 
    : products
        .filter((product) => product.id !== currentProduct.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, maxItems);

  if (finalProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {finalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
