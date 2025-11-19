import materialsContent from "@/content/materials.json";

export default function Materials() {
  const { intro, materials, finishing } = materialsContent;

  return (
    <div className="bg-white text-black min-h-screen">
      <section className="border-b border-black/10 px-6 py-12">
        <div className="mx-auto max-w-5xl space-y-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">{intro.eyebrow}</p>
          <h1 className="text-4xl font-brand tracking-[0.08em]">{intro.title}</h1>
          <p className="text-sm text-black/60">{intro.description}</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          {materials.map((material) => (
            <article key={material.title} className="border border-black/10 p-6 space-y-4">
              <h2 className="text-2xl font-semibold">{material.title}</h2>
              <p className="text-sm text-black/60">{material.description}</p>
              <ul className="text-sm text-black/70 space-y-2">
                {material.details.map((detail) => (
                  <li key={detail}>• {detail}</li>
                ))}
              </ul>
            </article>
          ))}

          <div className="border border-black/10 p-6">
            <h3 className="text-xl font-semibold mb-2">{finishing.title}</h3>
            <p className="text-sm text-black/60">{finishing.description}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
