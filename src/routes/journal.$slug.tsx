import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { getPost, relatedPosts, formatDate, POSTS } from "@/lib/journal";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found — FIRMA Journal" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    const url = `/journal/${params.slug}`;
    return {
      meta: [
        { title: `${post.title} — FIRMA Journal` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: post.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.cover },
        { name: "author", content: post.author.name },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:modified_time", content: post.updatedAt },
        { property: "article:section", content: post.category },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { "@type": "Person", name: post.author.name },
            publisher: {
              "@type": "Organization",
              name: "FIRMA",
            },
            mainEntityOfPage: `https://firma.farm${url}`,
            articleSection: post.category,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Blog", item: "https://firma.farm/journal" },
              { "@type": "ListItem", position: 2, name: post.category },
              { "@type": "ListItem", position: 3, name: post.title, item: `https://firma.farm${url}` },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 grid place-items-center px-5 py-24">
        <div className="text-center max-w-md">
          <div className="mono-label mb-2">404</div>
          <h1 className="font-display text-3xl">This article isn't available</h1>
          <p className="mt-2 text-muted-foreground text-sm">It may have been moved or unpublished.</p>
          <Link to="/journal" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Journal
          </Link>
        </div>
      </div>
      <PublicFooter />
    </div>
  ),
  component: ArticlePage,
});

const TOC = [
  { id: "context", label: "The context" },
  { id: "capacity", label: "Production capacity" },
  { id: "costs", label: "Costs and margins" },
  { id: "pricing", label: "Pricing strategy" },
  { id: "labor", label: "Labor and workflow" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ = [
  {
    q: "How much revenue can a 40 m² microgreens operation realistically generate?",
    a: "A well-run 40 m² facility running weekly cycles across 8–10 varieties typically generates €6,000–€12,000 in monthly wholesale revenue, depending on price positioning and channel mix.",
  },
  {
    q: "What is the largest recurring cost for a small microgreens farm?",
    a: "Labor is almost always the largest recurring cost, followed by substrates and seed. Electricity is meaningful but rarely dominant for microgreens compared with vertical leafy-green operations.",
  },
  {
    q: "Should a small farm sell to restaurants, retail or direct-to-consumer first?",
    a: "Most farms start with restaurants for stable weekly orders and price stability, then layer retail and direct-to-consumer once production cadence is reliable.",
  },
];

function ArticlePage() {
  const { post } = Route.useLoaderData();
  const related = relatedPosts(post.slug, post.category, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-4 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link to="/journal" className="hover:text-foreground">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{post.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-[860px] px-5 lg:px-8 py-14 lg:py-20">
          <div className="mono-label">{post.category}</div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            {post.title}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-medium">
                {post.author.initials}
              </span>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-xs text-muted-foreground">{post.author.role}</div>
              </div>
            </div>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              Published {formatDate(post.publishedAt)}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Updated {formatDate(post.updatedAt)}</span>
            <span className="text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1080px] px-5 lg:px-8 py-8">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full rounded-xl border border-border object-cover aspect-[16/9]"
          />
        </div>
      </div>

      {/* Body */}
      <section>
        <div className="mx-auto max-w-[1080px] px-5 lg:px-8 py-14 grid gap-14 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mono-label mb-3">On this page</div>
              <ul className="space-y-2 text-sm">
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-muted-foreground hover:text-foreground">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <article className="max-w-[680px] mx-auto lg:mx-0 text-[17px] leading-[1.75] text-foreground/90">
            <p className="text-xl leading-relaxed text-foreground">
              A serious microgreens operation is less about growing skill and more about the honest
              math behind capacity, labor and pricing. This piece breaks down how a professional
              40&nbsp;m² facility actually earns money — and where most operators quietly lose it.
            </p>

            <h2 id="context" className="font-display text-3xl mt-12 tracking-tight">The context</h2>
            <p className="mt-4">
              We use a benchmark facility: 40&nbsp;m² of usable production area, 6-day cycles,
              8–10 varieties, and a mixed channel strategy weighted toward restaurants. Values here
              are directionally correct across most European and North American markets.
            </p>

            <blockquote className="mt-8 border-l-2 border-primary pl-5 italic text-lg text-foreground/85">
              &ldquo;The farms that succeed at this scale don&rsquo;t out-grow the market — they
              out-operate it. Consistency is the moat.&rdquo;
            </blockquote>

            <h2 id="capacity" className="font-display text-3xl mt-12 tracking-tight">Production capacity</h2>
            <p className="mt-4">
              At 40&nbsp;m² with tight rack spacing, a well-managed facility supports roughly 700
              10&#215;20 trays across a 6-day cycle, yielding 5–8&nbsp;kg of finished microgreens per
              week per variety when planned carefully.
            </p>

            <div className="mt-8 rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Variety</th>
                    <th className="px-4 py-2.5 font-medium">Cycle</th>
                    <th className="px-4 py-2.5 font-medium">Yield / tray</th>
                    <th className="px-4 py-2.5 font-medium">Wholesale €/kg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {[
                    ["Sunflower", "8 d", "180 g", "28"],
                    ["Pea shoots", "10 d", "220 g", "26"],
                    ["Radish daikon", "6 d", "90 g", "34"],
                    ["Broccoli", "8 d", "110 g", "40"],
                    ["Basil micro", "18 d", "35 g", "80"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((c, i) => (
                        <td key={i} className={`px-4 py-2.5 ${i === 3 ? "font-mono tabular-nums" : ""}`}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 id="costs" className="font-display text-3xl mt-12 tracking-tight">Costs and margins</h2>
            <p className="mt-4">
              For most 40&nbsp;m² operations, cost of goods breaks down roughly as:
            </p>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>Labor: 45–55% of revenue</li>
              <li>Substrate + seed: 12–18%</li>
              <li>Packaging + labels: 4–6%</li>
              <li>Utilities: 5–10%</li>
              <li>Delivery: 3–8% depending on radius</li>
            </ul>

            <div className="mt-8 rounded-lg border border-primary/30 bg-primary-soft/50 p-5">
              <div className="mono-label text-primary">Operator note</div>
              <p className="mt-2 text-sm">
                Farms that automate seeding and packaging first — not lighting — consistently gain the
                most margin in year two. Labor is the lever.
              </p>
            </div>

            <h2 id="pricing" className="font-display text-3xl mt-12 tracking-tight">Pricing strategy</h2>
            <p className="mt-4">
              Restaurant pricing should anchor on the finished dish, not on cost-plus. If a €22 pasta
              relies on 8&nbsp;g of basil micro, a chef will accept €80/kg without hesitation — but
              only if delivery, freshness and packaging are consistently correct.
            </p>

            <h2 id="labor" className="font-display text-3xl mt-12 tracking-tight">Labor and workflow</h2>
            <p className="mt-4">
              A single trained operator can manage a 40&nbsp;m² facility in 25–32 hours per week
              once workflows stabilise. The step-change comes from documenting SOPs and running the
              same seeding day, harvest day, and delivery day each week.
            </p>

            <h2 id="faq" className="font-display text-3xl mt-12 tracking-tight">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {FAQ.map((f) => (
                <div key={f.q} className="py-5">
                  <div className="font-medium">{f.q}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl mt-12 tracking-tight">References</h2>
            <ol className="mt-4 space-y-1.5 text-sm text-muted-foreground list-decimal pl-5">
              <li>USDA Economic Research Service — Small farm operations survey (2024).</li>
              <li>FAO — Urban and peri-urban horticulture indicators (2023).</li>
              <li>FIRMA benchmark dataset — 82 microgreens operations, 2025–2026.</li>
            </ol>
          </article>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 lg:py-20">
          <div className="mono-label mb-6">Related articles</div>
          <div className="grid gap-y-12 gap-x-10 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/journal/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="overflow-hidden rounded-lg border border-border bg-card aspect-[4/3]">
                  <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" loading="lazy" />
                </div>
                <div className="mt-4">
                  <div className="mono-label">{p.category}</div>
                  <h3 className="mt-2 font-display text-lg tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter mini */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[820px] px-5 lg:px-8 py-14 text-center">
          <div className="mono-label">Newsletter</div>
          <h2 className="mt-3 font-display text-3xl tracking-tight">Keep reading, weekly.</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            One considered email each week — new FIRMA guides, product updates and operational insight.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="you@yourfarm.com"
              className="flex-1 h-11 rounded-md border border-border bg-card px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Product CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 lg:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="mono-label">FIRMA OS</div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl tracking-tight max-w-lg">
              Run the farm you just read about — from one operating system.
            </h2>
          </div>
          <div className="flex gap-2">
            <a href="#product" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95">
              Explore FIRMA
            </a>
            <a href="#trial" className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm hover:bg-muted">
              Start free trial
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

// Force include for TS
export const _all = POSTS.length;
