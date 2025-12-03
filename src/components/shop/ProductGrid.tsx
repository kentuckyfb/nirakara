import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="lg:border lg:border-black/20 lg:bg-white/30 lg:backdrop-blur-sm lg:p-8 relative mt-4 lg:mt-0">
      <div className="hidden lg:block absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="hidden lg:block absolute top-0 right-0 w-12 h-12 border-r border-t border-blue-500/20" />
      <div className="hidden lg:block absolute bottom-0 left-0 w-12 h-12 border-l border-b border-blue-500/20" />

      <div
        className="grid gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
        }}
      >
        {!products || products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 mx-auto border-2 border-dashed border-black/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">∅</span>
              </div>
              <h3 className="text-lg font-brand uppercase tracking-wider">No Products Found</h3>
              <p className="text-sm text-black/60 font-mono">
                No products match your current filters. Try adjusting your selection or browse all products.
              </p>
            </div>
          </div>
        ) : (
          products.map((product, idx) => (
            <ProductCard
              key={`${product.unitCode}-${idx}`}
              item={{ code: product.unitCode, image: product.image }}
              product={product}
              index={idx}
            />
          ))
        )}
      </div>
    </div>
  );
}
