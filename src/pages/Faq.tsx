import faqContent from "@/content/faq.json";

export default function Faq() {
  const { intro, questions } = faqContent;

  return (
    <div className="bg-white text-black min-h-screen">
      <section className="border-b border-black/10 px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">{intro.eyebrow}</p>
          <h1 className="text-4xl font-brand tracking-[0.08em]">{intro.title}</h1>
          <p className="text-sm text-black/60">{intro.description}</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          {questions.map((item) => (
            <details key={item.q} className="border border-black/10 p-4">
              <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.2em]">{item.q}</summary>
              <p className="mt-3 text-sm text-black/60">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
