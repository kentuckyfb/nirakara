import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Hero Section */}
      <section className="relative border-b border-black/[0.05] px-6 py-16 md:py-20">
        {/* Decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="text-[10px] tracking-[0.5em] text-black/20 font-mono">404</div>
              <div className="h-[1px] w-12 bg-black/10" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-black/20">Route Lost</div>
          </div>

          <div className="space-y-6 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-brand leading-[0.9] tracking-tight">
              Nowhere Found
            </h1>
            <p className="text-[10px] uppercase tracking-[0.45em] text-black/40">
              The Requested Ritual Has Been Misplaced
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl w-full">
          <div className="p-8 md:p-12 border border-black/[0.08] bg-gradient-to-br from-black/[0.01] to-transparent">
            {/* 404 Number */}
            <div className="text-center mb-12">
              <p className="text-8xl md:text-9xl font-brand tracking-tight text-black/[0.06]">
                404
              </p>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-6 mb-12">
              <p className="text-[11px] leading-relaxed text-black/60 tracking-wide">
                You stepped past the mapped coordinates. The archive holds no entry for
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-3 border border-black/[0.08] bg-gradient-to-br from-black/[0.01] to-transparent">
                <div className="w-1 h-1 rounded-full bg-black/20" />
                <p className="font-mono text-[10px] text-black/50 tracking-wider">
                  {location.pathname}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/"
                className="flex-1 py-3 text-[9px] uppercase tracking-[0.4em] border border-black/[0.08] text-black/60 hover:bg-black hover:text-white hover:border-black transition-all text-center"
              >
                Return Home
              </Link>
              <Link
                to="/shop"
                className="flex-1 py-3 text-[9px] uppercase tracking-[0.4em] border border-black/[0.08] text-black/60 hover:bg-black hover:text-white hover:border-black transition-all text-center"
              >
                Browse Catalogue
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Decorative */}
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-2 pb-8">
          <div className="w-1 h-1 rounded-full bg-black/10" />
          <div className="flex-1 h-px bg-gradient-to-r from-black/[0.06] via-black/[0.03] to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
