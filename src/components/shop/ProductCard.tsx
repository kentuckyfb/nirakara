import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="flex w-full transform flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] cursor-pointer outline-none group"
    >
      <div className="relative w-full aspect-square border border-black bg-white">
        {/* Placeholder - no image */}
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-wider text-center text-black/70 group-hover:text-black transition-colors w-full">
        {product.unitCode || product.slug.toUpperCase()}
      </p>
    </Link>
  );
}
