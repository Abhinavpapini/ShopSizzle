import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import ProductGrid from "@/components/products/ProductGrid";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const Index = () => {
  const products = useSelector((s: RootState) => s.products.items);
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'Product',
      position: i + 1,
      name: p.title,
      image: p.image,
      offers: { '@type': 'Offer', price: p.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    })),
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container space-y-12 py-8">
        <Hero />
        <ProductGrid />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
    </div>
  );
};

export default Index;
