import sizingContent from "@/content/sizing.json";

export default function Sizing() {
  const { intro, method, notes, ringChart } = sizingContent;

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
        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ring Method</h2>
            <ol className="list-decimal list-inside text-sm text-black/60 space-y-2">
              {method.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="text-sm text-black/60">{notes}</p>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Ring Size Chart</h2>
            <div className="border border-black/10 divide-y">
              {ringChart.map((row) => (
                <div key={row.us} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-semibold">US {row.us}</span>
                  <span>{row.inner}</span>
                  <span className="text-black/60">{row.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
