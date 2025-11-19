import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section>
      {title && (
        <h2 className="font-brand text-3xl md:text-5xl uppercase mb-12 tracking-tight">
          {title}
        </h2>
      )}

      <div
        className="grid gap-6 md:gap-8"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))'
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-brand-muted">No products found.</p>
        </div>
      )}
    </section>
  );
}
