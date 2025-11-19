import cookiePolicyContent from "@/content/cookie-policy.json";

export default function CookiePolicy() {
  const { intro, sections } = cookiePolicyContent;

  const clearConsent = () => {
    localStorage.removeItem("nirakara-cookie-consent");
    window.location.reload();
  };

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
          {sections.map((section) => (
            <article key={section.title} className="border border-black/10 p-6 space-y-3">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-sm text-black/60">{section.body}</p>
            </article>
          ))}
          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em]">
            <button className="px-6 py-3 border border-black/40" onClick={clearConsent}>
              Reset Consent
            </button>
            <a href="mailto:privacy@nirakara.studio" className="px-6 py-3 border border-black/40 text-center">
              Contact Privacy Lead
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
