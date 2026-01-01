import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts, useConfig } from "@/hooks/useProducts";
import { HeroSlider } from "@/components/shop/HeroSlider";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilterBar } from "@/components/shop/MobileFilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

export default function Shop() {
  const { data: products = [], isLoading: productsLoading, isError } = useProducts();
  const { data: config, isLoading: configLoading } = useConfig();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);
  const [activeFinish, setActiveFinish] = useState<string | null>(null);

  // Sticky Sidebar State
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({ position: "static" });
  const [filtersHeight, setFiltersHeight] = useState(0);
  const [catalogueHeight, setCatalogueHeight] = useState(0);
  const [mobileFiltersStyle, setMobileFiltersStyle] = useState<React.CSSProperties>({ position: "static" });
  const [mobileFiltersHeight, setMobileFiltersHeight] = useState(0);

  const filtersWrapperRef = useRef<HTMLDivElement>(null);
  const filterCardRef = useRef<HTMLDivElement>(null);
  const catalogueRef = useRef<HTMLDivElement>(null);
  const mobileFiltersWrapperRef = useRef<HTMLDivElement>(null);
  const mobileFilterCardRef = useRef<HTMLDivElement>(null);

  const STICKY_OFFSET = 96;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    return products.filter((product: any) => {
      // Only show visible products
      if (product.isVisible === false) return false;

      // Category filter
      if (activeCategory !== "All") {
        const categoryMap: Record<string, string> = {
          "Rings": "ring",
          "Chains": "chain",
          "Bracelets": "bracelet",
          "Ear Cuffs": "ear-cuff",
        };
        const categorySlug = categoryMap[activeCategory];
        if (categorySlug && product.category !== categorySlug) {
          return false;
        }
      }

      // Material and Finish filters
      if (activeFinish) {
        if (activeFinish === "Polished" && product.finish !== "polished") return false;
        if (activeFinish === "Matte" && product.finish !== "brushed") return false;
        if (activeFinish === "Oxidized" && product.finish !== "distressed") return false;
      }

      return true;
    });
  }, [products, activeCategory, activeMaterial, activeFinish]);

  const sliderItems = useMemo(() => {
    return products
      .filter((product: any) => product.isFeatured && product.isVisible !== false)
      .map((product: any) => ({
        code: product.unitCode,
        name: product.name,
        description: product.shortDescription,
        image: product.image,
        slug: product.slug,
        category: product.category,
      }));
  }, [products]);

  const handleFilterClick = (label: string, value: string) => {
    if (label === "Category") {
      setActiveCategory(value);
    } else if (label === "Material") {
      setActiveMaterial(activeMaterial === value ? null : value);
    } else if (label === "Finish") {
      setActiveFinish(activeFinish === value ? null : value);
    }
  };

  // Sticky Logic
  useEffect(() => {
    const handleStickySidebar = () => {
      const wrapperEl = filtersWrapperRef.current;
      const cardEl = filterCardRef.current;
      const catalogueEl = catalogueRef.current;

      if (!wrapperEl || !cardEl || !catalogueEl) return;

      const cardHeight = cardEl.offsetHeight;
      if (cardHeight && filtersHeight !== cardHeight) {
        setFiltersHeight(cardHeight);
      }
      const nextCatalogueHeight = catalogueEl.offsetHeight;
      if (nextCatalogueHeight && catalogueHeight !== nextCatalogueHeight) {
        setCatalogueHeight(nextCatalogueHeight);
      }

      // Desktop sticky logic
      if (window.innerWidth >= 1024) {
        const wrapperRect = wrapperEl.getBoundingClientRect();
        const wrapperTop = wrapperRect.top + window.scrollY;
        const wrapperWidth = wrapperRect.width;
        const wrapperLeft = wrapperRect.left + window.scrollX;
        const currentCatalogueHeight = catalogueHeight || catalogueEl.offsetHeight;
        const scrollTop = window.scrollY + STICKY_OFFSET;

        if (scrollTop <= wrapperTop) {
          setSidebarStyle({ position: "static" });
        } else {
          const maxScrollBeforeBottom = wrapperTop + currentCatalogueHeight - cardHeight;

          if (scrollTop >= maxScrollBeforeBottom) {
            setSidebarStyle({
              position: "absolute",
              top: currentCatalogueHeight - cardHeight,
              left: 0,
              width: "100%",
            });
          } else {
            setSidebarStyle({
              position: "fixed",
              top: STICKY_OFFSET,
              left: wrapperLeft,
              width: wrapperWidth,
              zIndex: 20,
            });
          }
        }
      } else {
        setSidebarStyle({ position: "static" });
      }

      // Mobile filters sticky logic
      const mobileWrapperEl = mobileFiltersWrapperRef.current;
      const mobileCardEl = mobileFilterCardRef.current;

      if (!mobileWrapperEl || !mobileCardEl) return;

      const mobileCardHeight = mobileCardEl.offsetHeight;
      if (mobileCardHeight && mobileFiltersHeight !== mobileCardHeight) {
        setMobileFiltersHeight(mobileCardHeight);
      }

      if (window.innerWidth >= 1024) {
        setMobileFiltersStyle({ position: "static" });
        return;
      }

      const mobileWrapperRect = mobileWrapperEl.getBoundingClientRect();
      const mobileWrapperTop = mobileWrapperRect.top + window.scrollY;
      const mobileWrapperWidth = mobileWrapperRect.width;
      const mobileWrapperLeft = mobileWrapperRect.left + window.scrollX;
      const currentCatalogueHeight = catalogueHeight || catalogueEl.offsetHeight;
      const headerOffset = 80;
      const scrollTop = window.scrollY + headerOffset;
      const maxScrollBeforeBottom = mobileWrapperTop + currentCatalogueHeight - mobileCardHeight;

      if (scrollTop <= mobileWrapperTop) {
        setMobileFiltersStyle({ position: "static" });
      } else if (scrollTop >= maxScrollBeforeBottom) {
        setMobileFiltersStyle({
          position: "absolute",
          top: currentCatalogueHeight - mobileCardHeight,
          left: 0,
          width: "100%",
        });
      } else {
        setMobileFiltersStyle({
          position: "fixed",
          top: headerOffset,
          left: mobileWrapperLeft,
          width: mobileWrapperWidth,
          zIndex: 20,
        });
      }
    };

    handleStickySidebar();
    window.addEventListener("scroll", handleStickySidebar, { passive: true });
    window.addEventListener("resize", handleStickySidebar);

    return () => {
      window.removeEventListener("scroll", handleStickySidebar);
      window.removeEventListener("resize", handleStickySidebar);
    };
  }, [filtersHeight, catalogueHeight, mobileFiltersHeight, filteredProducts.length]);

  if (productsLoading || configLoading) {
    return <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center">
      <div className="w-2 h-2 bg-black animate-ping" />
    </div>;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-brand mb-2">Connection Error</h2>
        <p className="text-sm font-mono text-black/60 mb-4">Unable to load the archive. Please ensure the backend server is running.</p>
        <div className="bg-black/5 p-4 rounded text-xs font-mono text-left">
          <p className="mb-2 font-bold">Try running:</p>
          <code>npm start</code>
        </div>
      </div>
    );
  }

  const filterGroups = [
    { label: "Category", values: config?.filters?.categories || [] },
    { label: "Material", values: config?.filters?.materials || [] },
    { label: "Finish", values: config?.filters?.finishes || [] },
  ];

  return (
    <div className="bg-[#f5f3ee] text-black min-h-screen flex flex-col relative overflow-x-hidden font-body selection:bg-black selection:text-white">
      <SEO
        title={config?.title || "Shop"}
        description={config?.subtitle}
      />

      {/* Top Bar Decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-blue-500/40 to-black z-50" />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
      </div>

      <HeroSlider items={sliderItems} />

      <main className="flex-1 py-6 relative z-10 px-2 sm:px-4">
        <div className="mx-auto max-w-[1600px]">
          <ShopHeader
            title={config?.title || "The Archive"}
            subtitle={config?.subtitle || "Explore our collection."}
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 relative" ref={catalogueRef}>
            {/* Abstract connecting lines */}
            <div className="hidden lg:block absolute left-56 top-12 bottom-12 w-px">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-blue-500/20 to-transparent" />
            </div>

            {/* Sidebar Filters - Desktop Only */}
            <div ref={filtersWrapperRef} className="hidden lg:block w-full lg:w-56 flex-shrink-0" style={{ minHeight: filtersHeight || undefined }}>
              <FilterSidebar
                ref={filterCardRef}
                filterGroups={filterGroups}
                activeCategory={activeCategory}
                activeMaterial={activeMaterial}
                activeFinish={activeFinish}
                onFilterClick={handleFilterClick}
                style={sidebarStyle}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filters - Sticky */}
              <div ref={mobileFiltersWrapperRef} className="lg:hidden relative z-30" style={{ minHeight: mobileFiltersHeight || undefined }}>
                <MobileFilterBar
                  ref={mobileFilterCardRef}
                  filterGroups={filterGroups}
                  activeCategory={activeCategory}
                  activeMaterial={activeMaterial}
                  activeFinish={activeFinish}
                  onFilterClick={handleFilterClick}
                  style={mobileFiltersStyle}
                />
              </div>

              <ProductGrid
                products={filteredProducts}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Philosophy / Content Section */}
      <section className="py-6 bg-[#f5f3ee] px-2 sm:px-4">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-brand uppercase tracking-tight">
                Material Philosophy
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-mono max-w-md">
                We believe in the inherent chaos of silver. Our process embraces the imperfections, the hammer marks, and the oxidation that occurs naturally over time. Each piece is a living object, evolving with its wearer.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-black/40">Purity</span>
                  <span className="text-sm font-bold">925 Sterling</span>
                </div>
                <div className="w-px h-10 bg-black/10" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-black/40">Origin</span>
                  <span className="text-sm font-bold">Studio Crafted</span>
                </div>
              </div>
            </div>
            <div className="h-64 bg-black/5 relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-[0.5em] text-black/20 group-hover:text-black/40 transition-colors">
                  Studio // Process
                </span>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Journal / Notes */}
      <section className="py-6 bg-[#f5f3ee] px-2 sm:px-4">
        <div className="mx-auto max-w-[1600px]">
          <div className="border border-black/20 bg-white/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-black/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-black/50" />
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/60">Studio Notes</h3>
                </div>
                <div className="flex gap-2">
                  <button className="w-7 h-7 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-xs">←</button>
                  <button className="w-7 h-7 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-xs">→</button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-x-0 sm:divide-x divide-black/5">
              {[
                { title: "Silver Care Guide", cat: "Maintenance", date: "02.12", desc: "Essential knowledge for maintaining the integrity of your pieces over time." },
                { title: "The Oxidation Process", cat: "Material", date: "28.11", desc: "Understanding how sterling silver develops its unique character through natural patina." },
                { title: "Sizing Your Fit", cat: "Guide", date: "25.11", desc: "Comprehensive guide to finding the perfect fit for rings, chains, and bracelets." }
              ].map((post, idx) => (
                <Link
                  key={idx}
                  to="/journal"
                  className="group cursor-pointer p-6 sm:p-8 hover:bg-black/[0.02] transition-colors border-b sm:border-b-0 last:border-b-0"
                >
                  <div className="aspect-[4/3] bg-black/5 mb-4 relative overflow-hidden border border-black/10">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-3 right-3">
                      <span className="text-[8px] uppercase tracking-[0.25em] text-black/40 bg-white/90 px-2 py-1 border border-black/10">{post.cat}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-brand uppercase tracking-wide group-hover:text-black/70 transition-colors leading-tight">{post.title}</h4>
                      <span className="text-[9px] font-mono text-black/40 whitespace-nowrap">{post.date}</span>
                    </div>
                    <p className="text-[10px] text-black/50 leading-relaxed">
                      {post.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}
