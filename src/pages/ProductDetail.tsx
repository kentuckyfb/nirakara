import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useProduct } from "@/hooks/useProducts";
import { SEO } from "@/components/SEO";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading } = useProduct(slug || "");

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-black/40">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-6">Product not found</div>
        <Link to="/shop" className="text-[10px] uppercase tracking-[0.4em] text-black hover:text-black/60 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <SEO
        title={product.name}
        description={product.description}
        image={product.image}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images && product.images.length > 0 ? product.images : [product.image],
            "description": product.description,
            "sku": product.unitCode,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "LKR",
              "price": product.priceLKR,
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-6">
        <Link
          to="/shop"
          className="inline-flex items-center hover:text-black/60 transition-colors"
          aria-label="Back to shop"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[500px] flex flex-col items-center">
          {/* Image Carousel */}
          <div className="relative w-full mb-12 flex items-center gap-4">
            {/* Previous Arrow */}
            <button
              onClick={prevImage}
              disabled={!product.images || product.images.length <= 1}
              className="w-10 h-10 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <div className="relative aspect-square flex-1 border border-black/10 bg-gradient-to-br from-white to-neutral-50 flex items-center justify-center overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover select-none"
                />
              ) : product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover select-none"
                />
              ) : (
                <div className="w-8 h-8 border border-black/10 rounded-full" />
              )}
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextImage}
              disabled={!product.images || product.images.length <= 1}
              className="w-10 h-10 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Image Indicators */}
          {product.images && product.images.length > 1 && (
            <div className="flex justify-center gap-1.5 mb-12">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? "bg-black" : "bg-black/20"
                    }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Product Info */}
          <div className="text-center space-y-5">
            <h1 className="text-xs uppercase tracking-[0.35em] font-medium">
              {product.unitCode || product.name}
            </h1>
            <p className="text-base font-medium">
              LKR {product.priceLKR.toLocaleString()}
            </p>

            {/* Subtle Inquiry Notice */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-black/10" />
                <p className="text-[8px] uppercase tracking-[0.5em] text-black/30">Not Available Online</p>
                <div className="h-px w-8 bg-black/10" />
              </div>
              <button
                onClick={() => navigate(`/contact?product=${encodeURIComponent(product.unitCode || product.name)}`)}
                className="text-[9px] uppercase tracking-[0.4em] text-black/50 hover:text-black underline underline-offset-4 decoration-black/20 hover:decoration-black/50 transition-all duration-300"
              >
                Inquire About This Piece
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
