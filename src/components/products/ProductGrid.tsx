import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/productsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => (
  <div className="rounded-xl border p-4">
    <div className="aspect-square overflow-hidden rounded-lg">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
    <div className="mt-4">
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

const ProductGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((s: RootState) => s.products);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const loading = status === "loading" || status === "idle";

  return (
    <section id="products" className="container py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Popular Products</h2>
        <a href="#" className="story-link text-sm">View all</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default ProductGrid;
