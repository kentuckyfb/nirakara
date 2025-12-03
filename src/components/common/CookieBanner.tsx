import { useEffect, useState } from "react";

const storageKey = "nirakara-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "accepted");
    }
    setVisible(false);
  };

  const handlePreferences = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "custom");
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-xl text-black">
      <div className="border border-black/20 bg-white/80 backdrop-blur-md p-5 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-blue-500/20" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-blue-500/20" />

        <div className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 bg-blue-500 flex-shrink-0 mt-1" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">Cookies</span>
              <span className="text-[9px] font-mono text-black/40">Local consent</span>
            </div>
            <p className="text-[12px] md:text-[13px] leading-relaxed text-black/70 font-mono">
              We use cookies to analyse signals, improve the experience, and keep rituals consistent. Accept to continue or adjust preferences.
            </p>
            <div className="flex flex-col md:flex-row gap-2 pt-1">
              <button
                onClick={handleAccept}
                className="flex-1 border border-black bg-black text-white px-4 py-2 uppercase tracking-[0.3em] text-[11px] hover:bg-black/80 transition-colors rounded-none"
              >
                Accept All
              </button>
              <button
                onClick={handlePreferences}
                className="flex-1 border border-black/30 bg-white px-4 py-2 uppercase tracking-[0.3em] text-[11px] hover:border-black/60 hover:text-black transition-colors rounded-none"
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
