import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getAllProducts } from "@/lib/data/products";
import homeContent from "@/content/home.json";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { hero, featured, newsletter } = homeContent;

  useEffect(() => {
    getAllProducts().then((products) => {
      setFeaturedProducts(products.filter((p) => p.isFeatured).slice(0, 4));
    });
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
      <section className="relative bg-white text-black min-h-screen flex items-center py-24 border-b border-black/10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div
              className="lg:col-span-3 space-y-4 text-xs uppercase tracking-[0.35em] text-transparent"
              style={{ WebkitTextStroke: "1px black" }}
            >
              {hero.signals.map((signal) => (
                <div key={signal}>{signal}</div>
              ))}
            </div>
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-brand leading-[1.05] tracking-tight">{hero.title}</h1>
              <p className="text-[0.85rem] text-black/70 max-w-2xl">{hero.subtitle}</p>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div
                className="text-xs uppercase tracking-[0.3em] text-transparent"
                style={{ WebkitTextStroke: "0.7px black" }}
              >
                Studio Index
              </div>
              {hero.studioIndex.map((item) => (
                <div key={item.label} className="border border-black/10 p-4 space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-black/50">{item.label}</p>
                  <p className="text-3xl font-brand text-black">{item.value}</p>
                </div>
              ))}
              <div className="text-xs uppercase tracking-[0.3em] text-black/50">Studio Log</div>
              <p className="text-sm leading-relaxed text-black/80">{hero.quote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-black py-16 border-b border-black/10">
        <div className="container mx-auto px-4 space-y-12">
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
        <div className="container mx-auto px-4">
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

