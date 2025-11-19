import campaignsContent from "@/content/campaigns.json";

export default function Campaigns() {
  const { intro, entries } = campaignsContent;

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
        <div className="mx-auto max-w-4xl space-y-8">
          {entries.map((campaign) => (
            <article key={campaign.title} className="border border-black/10 p-6 space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-black/50">
                <span>{campaign.date}</span>
                <span>{campaign.location}</span>
              </div>
              <h2 className="text-2xl font-semibold">{campaign.title}</h2>
              <p className="text-sm text-black/60">{campaign.description}</p>
              <p className="text-[11px] uppercase tracking-[0.35em] text-black/50">{campaign.accent}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
