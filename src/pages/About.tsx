import aboutContent from "@/content/about.json";

export default function About() {
  const { intro, studio, production, values } = aboutContent;

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b border-black/[0.05] px-6 py-16 md:py-20">
        {/* Decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-[10px] tracking-[0.5em] text-black/20 font-mono">005</div>
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

      {/* Main Content - Studio & Production */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Studio */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-black/40" />
                  <h2 className="text-xs uppercase tracking-[0.45em] text-black/70">{studio.title}</h2>
                </div>
                <div className="h-px bg-gradient-to-r from-black/10 to-transparent" />
              </div>

              <div className="space-y-5 pl-6">
                {studio.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[11px] leading-relaxed text-black/60 tracking-wide">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Production */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-black/40" />
                  <h2 className="text-xs uppercase tracking-[0.45em] text-black/70">{production.title}</h2>
                </div>
                <div className="h-px bg-gradient-to-r from-black/10 to-transparent" />
              </div>

              <div className="space-y-5 pl-6">
                {production.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[11px] leading-relaxed text-black/60 tracking-wide">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-black/40" />
              <h2 className="text-xs uppercase tracking-[0.45em] text-black/70">Values</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-black/10 to-transparent" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 pl-6">
            {values.map((value) => (
              <div key={value.title} className="p-6 border border-black/[0.08] bg-gradient-to-br from-black/[0.01] to-transparent space-y-4 group hover:border-black/[0.15] transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-black/30 group-hover:bg-black/50 transition-all duration-300" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-black/70">{value.title}</h3>
                </div>
                <p className="text-[11px] leading-relaxed text-black/60 tracking-wide">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Decorative */}
      <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 pb-8">
          <div className="w-1 h-1 rounded-full bg-black/10" />
          <div className="flex-1 h-px bg-gradient-to-r from-black/[0.06] via-black/[0.03] to-transparent" />
        </div>
      </div>
    </div>
  );
}
