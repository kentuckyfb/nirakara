import lookbookContent from "@/content/lookbook.json";

export default function Lookbook() {
  const { intro, looks, spotlight } = lookbookContent;

  return (
    <div className="bg-white text-black">
      <section className="border-b border-black/10 px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">{intro.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-brand tracking-[0.1em]">{intro.title}</h1>
          <p className="text-sm text-black/60">{intro.description}</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          {looks.map((look) => (
            <article key={look.title} className="space-y-3">
              <div className="aspect-[3/4] bg-black/5">
                <img src={look.image} alt={look.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <h2 className="text-xl font-semibold">{look.title}</h2>
              <p className="text-sm text-black/60">{look.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl space-y-10">
          {spotlight.map((entry, idx) => (
            <div key={entry.heading} className="grid gap-6 md:grid-cols-2 items-center">
              <div className={idx % 2 === 1 ? "md:order-2" : ""}>
                <div className="aspect-[4/3] bg-black/5">
                  <img src={entry.image} alt={entry.heading} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">Spotlight</p>
                <h3 className="text-2xl font-brand tracking-[0.1em]">{entry.heading}</h3>
                <p className="text-sm text-black/60">{entry.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
