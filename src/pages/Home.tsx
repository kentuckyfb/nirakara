import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import homeContent from "@/content/home.json";
import { SEO } from "@/components/SEO";

export default function Home() {
  const { data: products = [], isError } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { hero, featured, newsletter } = homeContent;

  useEffect(() => {
    if (products.length) {
      setFeaturedProducts(products.filter((p: any) => p.isFeatured).slice(0, 4));
    }
  }, [products]);

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-brand mb-2">Connection Error</h2>
        <p className="text-sm font-mono text-black/60 mb-4">Unable to load content. Please ensure the backend server is running.</p>
        <div className="bg-black/5 p-4 rounded text-xs font-mono text-left">
          <p className="mb-2 font-bold">Try running:</p>
          <code>npm start</code>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const renderRitualButton = (to: string, label: string, className?: string) => (
    <Button asChild variant="ghost" className={`btn-ritual text-black ${className ?? ""}`}>
      <Link to={to}>
        <span>{label}</span>
        <span className="arrow" aria-hidden>
          {"\u2197"}
        </span>
      </Link>
    </Button>
  );

  return (
    <div className="relative">
      <SEO />
      <section className="relative h-[100dvh] overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        {/* Scrolling background text */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none opacity-[0.04]">
          <div className="animate-scroll-left whitespace-nowrap text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-brand font-bold tracking-tight">
            SILVER WITHOUT EDGES · HAND FORGED · RECYCLED SILVER · MINIMAL FORMS · SILVER WITHOUT EDGES · HAND FORGED ·
          </div>
        </div>

        {/* Animated gradient orbs */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-black/[0.03] blur-[100px] pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: `${20 + mousePosition.x * 0.015}%`,
            top: `${10 + mousePosition.y * 0.01}%`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-black/[0.02] blur-[80px] pointer-events-none transition-all duration-1200 ease-out"
          style={{
            right: `${10 + mousePosition.x * 0.01}%`,
            bottom: `${15 + mousePosition.y * 0.015}%`,
          }}
        />

        {/* Grid background with fade */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `
            linear-gradient(to right, black 0.5px, transparent 0.5px),
            linear-gradient(to bottom, black 0.5px, transparent 0.5px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%)',
        }} />

        {/* Main content - asymmetric layout */}
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
            {/* Left side - Main content */}
            <div className="lg:col-span-7 space-y-8 lg:space-y-10">
              {/* Index number */}
              <div className="flex items-center gap-3">
                <div className="text-[10px] tracking-[0.5em] text-black/20 font-mono">001</div>
                <div className="h-[1px] w-12 bg-black/10" />
              </div>

              {/* Main headline - stacked and tight */}
              <div className="space-y-2">
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] font-brand leading-[0.85] tracking-[-0.03em]">
                  Silver
                </h1>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-brand leading-none tracking-wide text-black/40">
                    Without Edges
                  </h2>
                </div>
              </div>

              {/* Tagline */}
              <div className="max-w-md">
                <p className="text-sm sm:text-base leading-relaxed text-black/60 tracking-wide">
                  {hero.subtitle}
                </p>
              </div>

              {/* CTA */}
              <div className="pt-2">
                {renderRitualButton("/shop", "Explore Collection")}
              </div>
            </div>

            {/* Right side - Metadata display */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="space-y-10 border-l border-black/5 pl-8">
                {/* Status */}
                <div className="space-y-3">
                  <div className="text-[8px] uppercase tracking-[0.5em] text-black/30">Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                    <div className="text-xs tracking-wide text-black/60">{hero.signals[0]}</div>
                  </div>
                </div>

                {/* Craft */}
                <div className="space-y-3">
                  <div className="text-[8px] uppercase tracking-[0.5em] text-black/30">Craft</div>
                  <div className="space-y-2 text-xs text-black/60">
                    <div>Recycled Silver</div>
                    <div>Hand Forged</div>
                    <div>Limited Batches</div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <div className="text-[8px] uppercase tracking-[0.5em] text-black/30">Studio</div>
                  <div className="text-xs text-black/60">Colombo, Sri Lanka</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex">
          <div className="text-[8px] tracking-[0.5em] text-black/20 uppercase">Scroll</div>
          <div className="w-[1px] h-12 bg-gradient-to-b from-black/15 to-transparent" />
        </div>
      </section>

      <section className="bg-white text-black py-16 border-b border-black/10">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p
                className="text-xs uppercase tracking-[0.4em] text-transparent"
                style={{ WebkitTextStroke: "0.7px black" }}
              >
                {featured.eyebrow}
              </p>
              <h2 className="text-4xl font-brand leading-tight">{featured.heading}</h2>
              <p className="text-sm text-black/60">{featured.summary}</p>
            </div>
            <div className="flex md:flex-col gap-4 md:items-end md:text-right">
              <div className="text-xs uppercase tracking-[0.4em] text-black/60">
                [{featuredProducts.length.toString().padStart(2, "0")}] selections
              </div>
              <div>{renderRitualButton("/shop", featured.ctaLabel, "self-start md:self-end")}</div>
            </div>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="bg-white text-black py-20">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p
                className="text-xs uppercase tracking-[0.4em] text-transparent"
                style={{ WebkitTextStroke: "0.7px black" }}
              >
                {newsletter.eyebrow}
              </p>
              <h2 className="text-4xl font-brand">{newsletter.heading}</h2>
              <p className="text-sm text-black/70">{newsletter.body}</p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <input
                  type="email"
                  placeholder={newsletter.placeholder}
                  className="flex-1 border border-black/20 px-4 py-3 uppercase tracking-[0.3em] text-xs focus:outline-none"
                />
                {renderRitualButton("#", newsletter.ctaLabel, "shrink-0")}
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-black/40">{newsletter.footnote}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
