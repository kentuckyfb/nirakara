import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header Section */}
      <div className="border-b border-black/10 px-6 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-black/50 mb-6">
            <span>Signal // 404</span>
            <span>Coord // Lost Route</span>
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-brand tracking-tight">
              Nowhere Found
            </h1>
            <p className="text-[10px] uppercase tracking-[0.35em] text-black/40">
              The requested ritual has been misplaced
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="border border-black/10 bg-white p-8 md:p-12 space-y-8">
            {/* 404 Number */}
            <div className="text-center">
              <p className="text-7xl md:text-8xl font-brand tracking-tight text-black/10">
                404
              </p>
            </div>

            {/* Error Message */}
            <div className="text-center space-y-3">
              <p className="text-sm text-black/60 leading-relaxed">
                You stepped past the mapped coordinates. The archive holds no entry for
              </p>
              <p className="font-mono text-xs text-black border border-black/10 bg-black/5 px-4 py-2 inline-block">
                {location.pathname}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link
                to="/"
                className="px-8 py-3 border border-black text-xs uppercase tracking-[0.35em] hover:bg-black hover:text-white transition-all text-center"
              >
                Return Home
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3 border border-black text-xs uppercase tracking-[0.35em] hover:bg-black hover:text-white transition-all text-center"
              >
                Browse Catalogue
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
