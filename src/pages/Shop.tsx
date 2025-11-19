import { Link } from "react-router-dom";
import shopContent from "@/content/shop.json";

type ApparelItem = (typeof shopContent.items)[number];
const apparelItems: ApparelItem[] = shopContent.items;
const filterGroups = [
  { label: "Category", values: shopContent.filters.categories },
  { label: "Material", values: shopContent.filters.materials },
  { label: "Finish", values: shopContent.filters.finishes },
];

export default function Shop() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col relative overflow-x-hidden">
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex gap-12">
            <aside className="w-48 flex-shrink-0 hidden md:block">
              <div className="sticky top-6 space-y-8">
                {filterGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs uppercase tracking-wider font-medium mb-4">{group.label}</h3>
                    <div className="space-y-2">
                      {group.values.map((value) => (
                        <button key={value} className="block text-xs text-black/60 hover:text-black transition-colors">
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div
                className="grid gap-6 md:gap-8"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))'
                }}
              >
                {apparelItems.map((item, idx) => (
                  <Link
                    key={`${item.code}-${idx}`}
                    to={`/product/${item.code.toLowerCase()}`}
                    className="flex w-full transform flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] cursor-pointer outline-none group"
                  >
                    <div className="relative w-full aspect-square border border-black bg-white flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.code}
                        loading="lazy"
                        className={`h-24 w-24 object-cover ${item.tone === "dark" ? "brightness-110" : "brightness-95"}`}
                      />
                    </div>
                    <p className="mt-3 text-[10px] uppercase tracking-wider text-center text-black/70 group-hover:text-black transition-colors w-full">
                      {item.code}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
