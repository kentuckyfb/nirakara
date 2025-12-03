import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { footerNav, mainNav } from "@/config/navigation";

const announcements = [
  "Up to 30% off ends 2.12",
  "Buy now, pay later with Sezzle",
  "Complimentary shipping over $300",
  "Limited drops monthly",
];

const languages = ["EN", "JP", "ZH"];
const navGroups: { label: string; note: string; items: { label: string; href: string }[] }[] = [
  { label: "Shop", note: "Forms and finishes", items: footerNav.shop },
  { label: "Explore", note: "Archive and visuals", items: footerNav.explore },
  { label: "Info", note: "Care and support", items: footerNav.info },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<string>(languages[0]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < 1024);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    // Lock body scroll on mobile when menu is open so scrolling happens inside the dropdown only
    if (isMobile && menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, isMobile]);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const accentDot = <span className="mr-2 text-[10px] leading-none text-black/60">*</span>;
  // Compact segment base
  const segmentBase =
    "relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-[10px] sm:text-[10px] uppercase tracking-[0.25em] text-black/80 hover:bg-black/[0.02] transition-all duration-300";

  return (
    <header className="sticky top-2 z-[120] transition-all duration-500 px-2 sm:px-4">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-2 relative">
        {/* Announcement rail */}
        <div className="w-full bg-black/90 backdrop-blur-md text-white border border-black/10 overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-1.5 overflow-hidden">
            <div className="animate-scroll-left flex gap-8 whitespace-nowrap">
              {[...announcements, ...announcements].map((note, idx) => (
                <div
                  key={`${note}-${idx}`}
                  className="flex items-center gap-2 text-[9px] sm:text-[9px] uppercase tracking-[0.25em] text-white/80"
                >
                  <span className="text-[8px] leading-none text-white/40">*</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main nav bar */}
        <div className="relative bg-white/80 backdrop-blur-md border border-black/10 overflow-visible z-20">
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-black/5">
            <button
              ref={menuButtonRef}
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setSearchOpen(false);
              }}
              className={`${segmentBase} font-medium ${menuOpen ? "bg-black/5" : ""}`}
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              {accentDot}
              Menu
              <span className="text-black/40 transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(90deg)' : 'none' }}>
                {menuOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
              </span>
            </button>

            <div className={`${segmentBase} hidden sm:flex`}>
              {languages.map((lang, idx) => (
                <div key={lang} className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLanguage(lang)}
                    className={`transition-all duration-300 hover:scale-105 ${activeLanguage === lang ? "text-black font-medium" : "text-black/50"
                      }`}
                  >
                    {lang}
                  </button>
                  {idx < languages.length - 1 && <span className="text-black/20">/</span>}
                </div>
              ))}
            </div>

            <Link to="/" className={`${segmentBase} hidden sm:flex font-bold tracking-[0.25em] group`}>
              <span className="text-[11px] group-hover:tracking-[0.35em] transition-all duration-500">Nirakara</span>
            </Link>

            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className={`${segmentBase} hidden sm:flex`}
              aria-expanded={searchOpen}
              aria-label="Toggle search"
            >
              <span className="text-black/60">Search</span>
              <Search className="w-3.5 h-3.5 text-black/60 transition-transform duration-300 group-hover:scale-110" />
            </button>

            <Link to="/account" className={`${segmentBase} hidden sm:flex justify-center group`}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500/80 rounded-full animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-black/60 group-hover:text-black">
                  Account
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile compact controls */}
          <div className="sm:hidden flex items-center justify-between px-4 py-2.5 bg-white/0">
            <Link to="/" className="text-xs uppercase tracking-[0.25em] font-semibold text-black/90">
              Nirakara
            </Link>
            <div className="flex items-center gap-5">
              <button onClick={() => setSearchOpen((prev) => !prev)} aria-label="Search">
                <Search className="w-4 h-4 text-black/70" />
              </button>
              <button
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setSearchOpen(false);
                }}
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-4 h-4 text-black/70" /> : <Menu className="w-4 h-4 text-black/70" />}
              </button>
            </div>
          </div>

          {/* Mobile compact controls */}
          <div className="sm:hidden flex items-center justify-between px-4 py-2.5 bg-white/0">
            <Link to="/" className="text-xs uppercase tracking-[0.25em] font-semibold text-black/90">
              Nirakara
            </Link>
            <div className="flex items-center gap-5">
              <button onClick={() => setSearchOpen((prev) => !prev)} aria-label="Search">
                <Search className="w-4 h-4 text-black/70" />
              </button>
              <button
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setSearchOpen(false);
                }}
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-4 h-4 text-black/70" /> : <Menu className="w-4 h-4 text-black/70" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search tray - Now constrained to parent width */}
        <div
          className={`absolute top-full left-0 w-full z-10 transition-all duration-500 ease-out ${searchOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          <div className="bg-white/90 backdrop-blur-md border border-black/20 relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 bg-black/50" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-black/40 font-mono">Search</span>
                </div>
                <input
                  type="text"
                  placeholder="Search rituals, codes, materials..."
                  className="w-full bg-transparent border-b border-black/10 px-0 py-2 sm:py-3 text-xs sm:text-sm uppercase tracking-[0.15em] text-black/80 focus:outline-none focus:border-black/40 transition-colors placeholder:text-black/30"
                  autoFocus={searchOpen}
                />
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/40 absolute right-0 bottom-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu overlay - Now constrained to parent width */}
        <div
          className={`absolute top-full left-0 w-full z-10 transition-all duration-500 ease-out ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          ref={menuRef}
        >
          <div
            className="border border-black/10 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-4 sm:py-6 overflow-y-auto relative"
            style={isMobile ? { height: "calc(100vh - 140px)" } : { maxHeight: "80vh" }}
          >
            {/* Decorative lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {navGroups.map((group, idx) => (
                  <div
                    key={group.label}
                    className="space-y-3 relative"
                  >
                    {/* Vertical accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-black/10 via-black/5 to-transparent" />

                    <div className="pb-2 border-b border-black/10 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-1 bg-black" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-black font-bold">{group.label}</span>
                      </div>
                      <p className="text-[9px] tracking-wide text-black/50 font-mono">{group.note}</p>
                    </div>
                    <div className="space-y-1 pl-3">
                      {group.items.map((sub) => (
                        <Link
                          key={sub.href}
                          to={sub.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-black/70 hover:text-black hover:bg-black/5 transition-all py-2 px-2 group relative"
                        >
                          <span className="w-1 h-px bg-black/20 group-hover:w-2 group-hover:bg-black transition-all" />
                          <span className="group-hover:translate-x-0.5 transition-transform duration-200">{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative pt-4 border-t border-black/10">
                {/* Horizontal decorative line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-black/10 via-transparent to-black/10" />

                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-black/60">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-1.5 border border-black/10 hover:border-black/30 hover:bg-black/5 hover:text-black transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
