import aboutContent from "@/content/about.json";

export default function About() {
  const { intro, studio, production, values } = aboutContent;

  return (
    <div className="bg-white text-black min-h-screen">
      <section className="border-b border-black/10 px-6 py-12">
        <div className="mx-auto max-w-4xl space-y-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">{intro.eyebrow}</p>
          <h1 className="text-4xl font-brand tracking-[0.1em]">{intro.title}</h1>
          <p className="text-sm text-black/60">{intro.description}</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{studio.title}</h2>
            {studio.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-black/60">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{production.title}</h2>
            {production.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-black/60">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="border border-black/10 p-5 space-y-3">
              <h3 className="text-xl font-semibold">{value.title}</h3>
              <p className="text-sm text-black/60">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
