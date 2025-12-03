import faqContent from "@/content/faq.json";
import { useState } from "react";

export default function Faq() {
  const { intro, questions } = faqContent;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

      {/* FAQ Section */}
      <main className="pb-8 md:pb-10 relative z-10">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="border border-black/20 bg-white/50 backdrop-blur-sm p-6 md:p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-blue-500/20" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-blue-500/20" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 bg-blue-500" />
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">FAQ</span>
            </div>

            <div className="space-y-2">
              {questions.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={item.q} className="border border-black/15 bg-white/70 hover:border-black/30 transition-colors duration-200">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left px-4 py-4 md:px-5 md:py-5 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500/60" />
                          <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/75">
                            {item.q}
                          </h2>
                        </div>
                        {isOpen && (
                          <p className="text-[11px] leading-relaxed text-black/65 font-mono pl-3">
                            {item.a}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 w-6 h-6 relative flex items-center justify-center">
                        <div className={`w-3 h-px bg-black/40 transition-transform duration-200 ${isOpen ? "rotate-0" : ""}`} />
                        <div className={`w-px h-3 bg-black/40 absolute transition-all duration-200 ${isOpen ? "rotate-90 opacity-0" : ""}`} />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
