import returnsContent from "@/content/returns.json";

export default function Returns() {
  const { intro, policy, help } = returnsContent;

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
        <div className="mx-auto max-w-4xl space-y-6">
          {policy.map((section) => (
            <article key={section.heading} className="border border-black/10 p-6 space-y-3">
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <p className="text-sm text-black/60">{section.text}</p>
            </article>
          ))}
          <div className="border border-black/10 p-6">
            <h3 className="text-lg font-semibold mb-2">{help.title}</h3>
            <p className="text-sm text-black/60">{help.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
