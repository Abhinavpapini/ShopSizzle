import hero from "@/assets/hero/hero-ecommerce.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-subtle shadow-elevated">
      <div className="absolute inset-0">
        <img src={hero} alt="Premium e‑commerce hero visual" className="h-full w-full object-cover opacity-70" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/60 to-background/10" />
      </div>
      <div className="relative z-10 container py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Modern E‑Commerce, Elevated
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover curated products with a delightful, fast shopping experience. Smooth animations, premium visuals, and instant feedback.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/products">
              <Button className="hover-scale" aria-label="Shop now CTA">Shop Now</Button>
            </Link>
            <a href="#products" className="story-link text-sm font-medium">Explore featured</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
