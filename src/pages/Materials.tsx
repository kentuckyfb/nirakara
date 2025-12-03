import materialsContent from "@/content/materials.json";

export default function Materials() {
  const { intro, materials, finishing } = materialsContent;

  return (
    <div className="bg-[#f8f8f8] text-black min-h-screen flex flex-col relative overflow-x-hidden font-body selection:bg-black selection:text-white">
      {/* Top Bar Decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-blue-500/40 to-black z-50" />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-black animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-mono">{intro.eyebrow}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-brand leading-[0.85] tracking-tighter uppercase">
                {intro.title}
              </h1>
            </div>
            <p className="text-xs leading-relaxed text-black/60 max-w-md font-mono border-l border-black/20 pl-4">
              {intro.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 pb-12 md:pb-16 relative z-10">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {materials.map((material) => (
              <article key={material.title} className="border border-black/20 bg-white/40 backdrop-blur-sm p-6 lg:p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-blue-500/20" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-blue-500/20" />

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-blue-500/60" />
                  <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">{material.title}</h2>
                </div>

                <p className="text-sm leading-relaxed text-black/65 font-mono mb-4">
                  {material.description}
                </p>

                <div className="space-y-3">
                  {material.details.map((detail) => (
                    <div key={detail} className="flex gap-3">
                      <div className="flex-shrink-0 w-1 h-1 bg-black/30 mt-2" />
                      <p className="flex-1 text-[11px] leading-relaxed text-black/60 tracking-wide">{detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="border border-black/20 bg-white/50 backdrop-blur-sm p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-blue-500/20" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-blue-500/20" />

            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-1 bg-blue-500/60" />
              <h3 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">{finishing.title}</h3>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-black/65 font-mono max-w-3xl">
              {finishing.description}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
