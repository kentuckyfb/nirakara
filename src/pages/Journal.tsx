import journalContent from "@/content/journal.json";

export default function Journal() {
  const { intro, posts } = journalContent;

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
        <div className="mx-auto max-w-4xl space-y-8">
          {posts.map((post) => (
            <article key={post.title} className="border border-black/10 p-6 space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-black/50">
                <span>{post.date}</span>
                <span>{post.tags.join(" / ")}</span>
              </div>
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="text-sm text-black/60">{post.excerpt}</p>
              <button className="text-xs uppercase tracking-[0.35em] text-black/60 border-b border-black/30 pb-1">
                Read Entry
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
