import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-black/10 text-black mt-0">
      <div className="border-b border-black/10">
        <div className="container mx-auto px-4 py-4 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.4em] text-black/60">
          <span>Coord · 06°56'N / 79°51'E</span>
          <span>Studio · Colombo</span>
          <span>Signal · 2025</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10 text-xs uppercase tracking-[0.2em] text-black/70">
          <div className="space-y-4">
            <h3 className="font-brand text-sm tracking-[0.3em]">Shop</h3>
            <ul className="space-y-2">
              {footerNav.shop.map((item, i) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    <span className="text-[10px] text-black/40">[{i + 1}]</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-brand text-sm tracking-[0.3em]">Info</h3>
            <ul className="space-y-2">
              {footerNav.info.map((item, i) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    <span className="text-[10px] text-black/40">[{i + 1}]</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-brand text-sm tracking-[0.3em]">Status</h3>
            <p className="text-xs text-black/60">
              New forms release monthly. Check back for rituals.
            </p>
            <div className="text-[10px] uppercase tracking-[0.4em] text-black/40 space-y-1">
              <div>v1.0.0</div>
              <div>© {currentYear}</div>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center text-[10px] uppercase tracking-[0.4em] text-black/40">
          <span>Formed in Colombo</span>
          <span className="hidden md:block">{siteConfig.name} / {currentYear}</span>
          <span>[END]</span>
        </div>
      </div>
    </footer>
  );
}
