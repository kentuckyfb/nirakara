import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { mainNav, footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const dropdownMap: Record<string, { label: string; href: string }[]> = {
  Shop: footerNav.shop,
  Lookbook: footerNav.explore,
  About: footerNav.info,
  Journal: [
    { label: "Studio Log", href: "/journal" },
    { label: "Campaign Archive", href: "/campaigns" },
    { label: "Care Notes", href: "/materials" },
  ],
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const openDropdown = (label: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveDropdown(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/10">
      <div className="border-b border-black/10 px-2 py-4">
        <Link
          to="/"
          className="block text-center font-brand text-[clamp(3rem,7vw,6rem)] tracking-[0.35em] uppercase leading-tight font-semibold hover:opacity-80 transition-opacity"
        >
          {siteConfig.name}
        </Link>
      </div>

      <div className="border-t border-black/10">
        <div className="container mx-auto px-4 py-3 flex flex-col gap-4 relative">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.45em] text-black/60">
            <div className="flex flex-wrap gap-4">
              <span>Coord · 06°56'N / 79°51'E</span>
              <span>Studio · Colombo</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/account" className="hidden sm:inline hover:text-black transition-colors">
                Profile
              </Link>
              <Link to="/cart" className="hover:opacity-60" aria-label="Cart">
                <ShoppingCart className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden hover:opacity-60"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-between text-xs uppercase tracking-[0.35em] text-black/60">
            <div className="flex flex-wrap gap-5">
              {mainNav.map((item, index) => (
                <div key={item.href} className="relative" onMouseEnter={() => openDropdown(item.label)} onMouseLeave={scheduleClose}>
                  <Link to={item.href} className="hover:text-black transition-colors">
                    [{index + 1}] {item.label}
                  </Link>
                  {activeDropdown === item.label && dropdownMap[item.label] && (
                    <div
                      className="absolute left-0 top-full mt-3 bg-white border border-black/10 p-4 text-[10px] tracking-[0.3em] min-w-[15rem]"
                      onMouseEnter={() => openDropdown(item.label)}
                      onMouseLeave={scheduleClose}
                    >
                      <div className="flex flex-col gap-2">
                        {dropdownMap[item.label].map((sub) => (
                          <Link key={sub.href} to={sub.href} className="hover:text-black/80 transition-colors">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-[10px] tracking-[0.4em]">Signal · 2025</div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-black/10 bg-white w-full">
          <div className="px-4 py-4 space-y-2 text-xs uppercase tracking-[0.3em] text-black/60">
            <div className="flex flex-wrap gap-4">
              <span>Coord · 06°56'N / 79°51'E</span>
              <span>Studio · Colombo</span>
            </div>
            <div className="flex flex-col border-t border-black/10 pt-4">
              {mainNav.map((item, i) => (
                <div key={item.href} className="border-b border-black/10 last:border-0">
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-black/80"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-black/40">[0{i + 1}]</span>
                  </Link>
                  {dropdownMap[item.label] && (
                    <div className="pl-4 pb-3 space-y-1 text-[10px] tracking-[0.3em]">
                      {dropdownMap[item.label].map((sub) => (
                        <Link
                          key={sub.href}
                          to={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-black/60"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
