import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  item: any;
  product: any;
  index: number;
}

export function ProductCard({ item, product, index }: ProductCardProps) {
  const secondImage = product?.images?.[1] || item.image;
  const primaryImage = item.image;
  const secondaryImage = secondImage;

  return (
    <Link
      to={`/product/${product ? product.slug : item.code.toLowerCase()}`}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[4/5] bg-white border border-black/20 overflow-hidden mb-3 transition-all duration-500 group-hover:border-black/30 group-hover:-translate-y-1">
        {/* Image Swap on Hover */}
        <img
          src={primaryImage}
          alt={item.code}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          onContextMenu={(event) => event.preventDefault()}
          style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
        />
        <img
          src={secondaryImage}
          alt={`${item.code} alternate`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-105"
          onContextMenu={(event) => event.preventDefault()}
          style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
        />

        {/* Overlay Details */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 backdrop-blur-[2px]">
          <div className="flex justify-between items-start">
            <span className="bg-black text-white text-[8px] px-1.5 py-0.5 font-mono uppercase tracking-widest">
              {item.code}
            </span>
          </div>
          <div className="flex justify-end">
            <div className="bg-white p-1.5 border border-black/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-0.5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] group-hover:text-black/70 transition-colors">
            {product ? product.name.split("/")[1]?.trim() || product.name : item.code}
          </h3>
          {product && (
            <span className="text-[10px] font-mono text-black/60">
              LKR {product.priceLKR.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 font-mono">
          {product?.category || "Accessory"}
        </p>
      </div>
    </Link>
  );
}
