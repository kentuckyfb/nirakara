import journalContent from "@/content/journal.json";

export default function Journal() {
  const { intro, posts } = journalContent;

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b border-black/[0.05] px-6 py-16 md:py-20">
        {/* Decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-[10px] tracking-[0.5em] text-black/20 font-mono">006</div>
            <div className="h-[1px] w-12 bg-black/10" />
          </div>

          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-[0.45em] text-black/40">{intro.eyebrow}</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-brand leading-[0.9] tracking-tight">
              {intro.title}
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-black/60 max-w-2xl tracking-wide">
              {intro.description}
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-8">
          {posts.map((post, index) => (
            <article key={post.title} className="group">
              <div className="p-6 md:p-8 border border-black/[0.08] bg-gradient-to-br from-black/[0.01] to-transparent hover:border-black/[0.15] transition-all duration-300">
                {/* Post Meta */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-black/[0.05]">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-black/20" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-black/40">{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.tags.map((tag, idx) => (
                      <span key={tag} className="text-[9px] uppercase tracking-[0.35em] text-black/30">
                        {tag}
                        {idx < post.tags.length - 1 && " / "}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-brand tracking-wide text-black/80 group-hover:text-black transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-[11px] leading-relaxed text-black/60 tracking-wide">
                    {post.excerpt}
                  </p>

                  {/* Read More Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <button className="text-[9px] uppercase tracking-[0.4em] text-black/50 hover:text-black transition-colors duration-300">
                      Read Entry
                    </button>
                    <div className="h-px w-8 bg-black/10 group-hover:w-12 group-hover:bg-black/20 transition-all duration-300" />
                  </div>
                </div>
              </div>

              {/* Separator - not on last item */}
              {index !== posts.length - 1 && (
                <div className="my-6 h-px bg-gradient-to-r from-black/[0.06] via-black/[0.03] to-transparent" />
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Decorative */}
      <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 pb-8">
          <div className="w-1 h-1 rounded-full bg-black/10" />
          <div className="flex-1 h-px bg-gradient-to-r from-black/[0.06] via-black/[0.03] to-transparent" />
        </div>
      </div>
    </div>
  );
}
