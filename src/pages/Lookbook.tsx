import lookbookContent from "@/content/lookbook.json";

export default function Lookbook() {
  const { intro, looks, spotlight } = lookbookContent;

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b border-black/[0.05] px-6 py-16 md:py-20">
        {/* Decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-[10px] tracking-[0.5em] text-black/20 font-mono">007</div>
            <div className="h-[1px] w-12 bg-black/10" />
          </div>

          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-[0.45em] text-black/40">{intro.eyebrow}</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-brand leading-[0.9] tracking-tight">
              {intro.title}
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-black/60 max-w-2xl tracking-wide">
              {intro.description}
            </p>
          </div>
        </div>
      </section>

      {/* Looks Grid */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-black/40" />
              <h2 className="text-xs uppercase tracking-[0.45em] text-black/70">Collection</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-black/10 to-transparent" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {looks.map((look) => (
              <article key={look.title} className="group space-y-4">
                <div className="aspect-[3/4] bg-black/5 border border-black/[0.08] overflow-hidden group-hover:border-black/[0.15] transition-all duration-300">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2 pl-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                    <h2 className="text-sm font-brand tracking-wider text-black/70 group-hover:text-black transition-colors duration-300">
                      {look.title}
                    </h2>
                  </div>
                  <p className="text-[11px] leading-relaxed text-black/60 tracking-wide pl-3">
                    {look.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-black/40" />
              <h2 className="text-xs uppercase tracking-[0.45em] text-black/70">Spotlight</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-black/10 to-transparent" />
          </div>

          <div className="space-y-16">
            {spotlight.map((entry, idx) => (
              <div key={entry.heading} className="grid gap-8 md:grid-cols-2 items-center">
                <div className={idx % 2 === 1 ? "md:order-2" : ""}>
                  <div className="aspect-[4/3] bg-black/5 border border-black/[0.08] overflow-hidden">
                    <img
                      src={entry.image}
                      alt={entry.heading}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="space-y-5 pl-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-black/30" />
                      <p className="text-[9px] uppercase tracking-[0.4em] text-black/40">Featured</p>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-brand tracking-wide text-black/80 leading-tight">
                      {entry.heading}
                    </h3>
                  </div>
                  <p className="text-[11px] leading-relaxed text-black/60 tracking-wide max-w-md">
                    {entry.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Decorative */}
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-2 pb-8">
          <div className="w-1 h-1 rounded-full bg-black/10" />
          <div className="flex-1 h-px bg-gradient-to-r from-black/[0.06] via-black/[0.03] to-transparent" />
        </div>
      </div>
    </div>
  );
}
