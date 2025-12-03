import { Link } from "react-router-dom";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";
import { footerNav } from "@/config/navigation";

export function Footer() {
  return (
    <footer className="bg-[#f5f3ee] text-black relative overflow-hidden pb-4 px-2 sm:px-4">
      <div className="max-w-[1600px] mx-auto pt-6 relative z-10">
        <div className="border border-black/10 bg-white/80 backdrop-blur-md overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

          {/* Desktop: Top rail echoing header grid */}
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-black/5 border-b border-black/5">
            <div className="flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] uppercase tracking-[0.25em] text-black/70">
              <span className="mr-2 text-[10px] leading-none text-black/60">*</span>
              Menu
            </div>
            <div className="hidden sm:flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] uppercase tracking-[0.25em] text-black/60">
              Studio Signals
            </div>
            <div className="hidden sm:flex items-center justify-center px-3 py-2.5 text-[11px] uppercase tracking-[0.25em] font-bold">
              Nirakara
            </div>
            <div className="hidden md:flex items-center justify-center px-3 py-2.5 text-[10px] uppercase tracking-[0.25em] text-black/60">
              Search
            </div>
            <div className="hidden md:flex items-center justify-center px-3 py-2.5 text-[10px] uppercase tracking-[0.25em] text-black/70">
              Account
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Newsletter section */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-brand leading-[0.9] tracking-tight">
                  Signals from <br /> the studio.
                </h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed max-w-md font-mono">
                  Exclusive pieces, behind-the-scenes insights, and early access to limited drops.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-2 max-w-md group">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-transparent border-b border-black/10 px-0 py-2 sm:py-3 text-xs sm:text-sm uppercase tracking-[0.1em] focus:outline-none focus:border-black/40 transition-all placeholder:text-black/30"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-500 group-focus-within:w-full" />
                </div>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-3 text-[10px] uppercase tracking-[0.35em] font-bold hover:text-black/60 transition-colors flex items-center justify-center sm:justify-start gap-2 border border-black/10 sm:border-0"
                >
                  Join <ArrowUpRight className="w-3 h-3" />
                </button>
              </form>
            </div>

              {/* Navigation columns - Mobile: stacked, Desktop: side by side */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                {/* Shop links */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-black/80 font-bold flex items-center gap-2">
                    <span className="w-1 h-1 bg-black/40" />
                    Shop
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {footerNav.shop.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block text-[10px] sm:text-[10px] uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors hover:translate-x-0.5 duration-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Info links */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-black/80 font-bold flex items-center gap-2">
                    <span className="w-1 h-1 bg-black/40" />
                    Info
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {footerNav.info.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block text-[10px] sm:text-[10px] uppercase tracking-[0.15em] text-black/60 hover:text-black transition-colors hover:translate-x-0.5 duration-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Social */}
                <div className="space-y-3 sm:space-y-4 col-span-2 sm:col-span-1">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-black/80 font-bold flex items-center gap-2">
                    <span className="w-1 h-1 bg-black/40" />
                    Connect
                  </h4>
                  <div className="flex gap-2">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border border-black/20 p-2.5 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
                    </a>
                    <a
                      href="mailto:hello@nirakara.com"
                      className="group border border-black/20 p-2.5 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
                      aria-label="Email"
                    >
                      <Mail className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-12" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom legal + copyright */}
            <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-6 border-t border-black/10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[9px] uppercase tracking-[0.2em] text-black/50">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
                  <Link to="/cookie-policy" className="hover:text-black transition-colors">
                    Cookie Policy
                  </Link>
                  <span className="text-black/30">·</span>
                  <Link to="/returns" className="hover:text-black transition-colors">
                    Returns
                  </Link>
                </div>
                <p className="font-mono text-center sm:text-right">© 2024 Nirakara</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
