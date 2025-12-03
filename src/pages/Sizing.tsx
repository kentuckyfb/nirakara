import sizingContent from "@/content/sizing.json";

export default function Sizing() {
  const { intro, method, notes, ringChart } = sizingContent;

  return (
    <div className="bg-[#f8f8f8] text-black flex flex-col relative overflow-x-hidden font-body selection:bg-black selection:text-white">
      {/* Top Bar Decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-blue-500/40 to-black z-50" />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="py-10 md:py-12 relative z-10">
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
      <main className="pb-8 md:pb-10 relative z-10">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr,1fr] gap-6 lg:gap-8">
            {/* Left Column - Measurement Method */}
            <div className="border border-black/20 bg-white/50 backdrop-blur-sm p-6 lg:p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-blue-500/20" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-blue-500/20" />

              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-1 bg-blue-500/70" />
                <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">How to Measure</h2>
              </div>

              <div className="space-y-6">
                {method.map((step, index) => (
                  <div key={step} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute w-8 h-8 border border-black/20 rounded-full group-hover:border-black/40 transition-all duration-300" />
                        <div className="relative z-10 text-[10px] font-mono text-black/60 group-hover:text-black transition-all duration-300">
                          0{index + 1}
                        </div>
                      </div>
                    </div>
                    <p className="flex-1 text-[11px] leading-relaxed text-black/65 pt-1.5 tracking-wide">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Important Note */}
              <div className="mt-8 p-6 border border-black/20 bg-white/60 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-blue-500/60 mt-2" />
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black/60 mb-2">Important</p>
                    <p className="text-[11px] leading-relaxed text-black/65 tracking-wide">{notes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Size Chart */}
            <div className="border border-black/20 bg-white/50 backdrop-blur-sm p-6 lg:p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-blue-500/20" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-blue-500/20" />

              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-1 bg-blue-500/70" />
                <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">Size Chart</h2>
              </div>

              <div className="border border-black/15 overflow-hidden bg-white/60">
                <div className="grid grid-cols-3 gap-4 px-5 py-4 bg-gradient-to-r from-transparent via-black/5 to-transparent border-b border-black/10">
                  <div className="text-[9px] uppercase tracking-[0.4em] text-black/60">US Size</div>
                  <div className="text-[9px] uppercase tracking-[0.4em] text-black/60">Inner Diameter</div>
                  <div className="text-[9px] uppercase tracking-[0.4em] text-black/60">Fit</div>
                </div>
                {ringChart.map((row, index) => (
                  <div
                    key={row.us}
                    className={`grid grid-cols-3 gap-4 px-5 py-4 group hover:bg-black/[0.02] transition-all duration-300 ${
                      index !== ringChart.length - 1 ? "border-b border-black/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-px bg-transparent group-hover:bg-blue-500/50 transition-all duration-300" />
                      <span className="text-[11px] font-medium tracking-wider">US {row.us}</span>
                    </div>
                    <div className="text-[11px] text-black/70 font-mono">{row.inner}</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-black/50">{row.note}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/70 animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">Free Resizing</p>
                </div>
                <p className="text-[11px] leading-relaxed text-black/65 tracking-wide pl-4">
                  Complimentary resizing available within 60 days of delivery for all sterling silver bands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
