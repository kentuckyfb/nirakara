import cartContent from "@/content/cart.json";

export default function Cart() {
  const { intro, items, summary } = cartContent;

  return (
    <div className="bg-white text-black min-h-screen">
      <section className="border-b border-black/10 px-6 py-12">
        <div className="mx-auto max-w-4xl space-y-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">{intro.eyebrow}</p>
          <h1 className="text-4xl font-brand tracking-[0.08em]">{intro.title}</h1>
          <p className="text-sm text-black/60">{intro.description}</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.code} className="border border-black/10 p-4 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-black/60">{item.code}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50 mt-1">{item.status}</p>
                </div>
                <p className="font-semibold">{item.price}</p>
              </div>
            ))}
          </div>
          <div className="border border-black/10 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Summary</h2>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{summary.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{summary.shipping}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{summary.total}</span>
            </div>
            <button className="w-full border border-black bg-black text-white py-3 text-xs uppercase tracking-[0.35em]">
              {summary.cta}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
