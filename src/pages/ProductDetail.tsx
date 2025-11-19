import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock product data - replace with actual data fetching
  const product = {
    code: slug?.toUpperCase() || "BD-03",
    price: 20,
    images: [
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
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
              disabled={product.images.length <= 1}
              className="w-10 h-10 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <div className="relative aspect-square flex-1 border border-black/10">
              <img
                src={product.images[currentImageIndex]}
                alt={product.code}
                className="w-full h-full object-cover select-none"
              />
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextImage}
              disabled={product.images.length <= 1}
              className="w-10 h-10 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Image Indicators */}
          {product.images.length > 1 && (
            <div className="flex justify-center gap-1.5 mb-12">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === currentImageIndex ? "bg-black" : "bg-black/20"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Product Info */}
          <div className="text-center space-y-5">
            <h1 className="text-xs uppercase tracking-[0.25em] font-medium">
              {product.code}
            </h1>
            <p className="text-base font-medium">
              LKR {product.price.toLocaleString()}
            </p>
            <button
              className="w-11 h-11 mx-auto flex items-center justify-center border border-black hover:bg-black hover:text-white transition-all"
              aria-label="Add to cart"
            >
              <span className="text-xl leading-none">+</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
