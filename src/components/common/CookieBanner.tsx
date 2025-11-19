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
    <div className="fixed bottom-6 left-6 z-40 max-w-xs border border-black/15 bg-white p-4 text-black shadow-xl">
      <h3 className="font-brand text-sm uppercase tracking-[0.4em] mb-2">Cookies</h3>
      <p className="text-[12px] leading-relaxed text-black/70 mb-4">
        We use cookies to analyse signals, improve the experience, and keep rituals consistent. Accept to continue.
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleAccept}
          className="w-full border border-black px-4 py-2 uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition-colors"
        >
          Accept All
        </button>
        <button
          onClick={handlePreferences}
          className="w-full border border-black/30 px-4 py-2 uppercase tracking-[0.3em] text-xs hover:text-black transition-colors"
        >
          Manage Preferences
        </button>
      </div>
    </div>
  );
}
