import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Rss } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA } from "@/components/public/NewsletterCTA";
import { RELEASES, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — FIRMA" },
      { name: "description", content: "New features, improvements and fixes to the FIRMA platform, in reverse chronological order." },
      { property: "og:title", content: "FIRMA Changelog" },
      { property: "og:description", content: "Everything new in FIRMA, week by week." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChangelogPage,
});

const CATS = ["All", "New", "Improved", "Fixed"] as const;
const CAT_STYLE: Record<string, string> = {
  New: "bg-primary-soft text-accent-foreground",
  Improved: "bg-accent text-accent-foreground",
  Fixed: "bg-muted text-muted-foreground",
};

function ChangelogPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const filtered = cat === "All" ? RELEASES : RELEASES.filter(r => r.category === cat);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 md:py-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mono-label mb-3 text-accent-foreground">Product Changelog</div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight max-w-2xl leading-[1.05]">
              Everything new in FIRMA, week by week.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl">
              We ship most weeks. Follow along here, or subscribe to the RSS feed and never miss a release.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`h-8 px-3 rounded-full text-xs border ${cat === c ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
            <a href="#rss" className="ml-2 inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border text-xs hover:bg-muted">
              <Rss className="h-3.5 w-3.5" /> RSS
            </a>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-[1000px] px-5 lg:px-8 py-14">
        <div className="relative">
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" aria-hidden />
          <div className="space-y-14">
            {filtered.map(r => (
              <article key={r.slug} className="relative pl-10">
                <div className="absolute left-0 top-2 h-5 w-5 rounded-full bg-background border-2 border-primary shadow" />
                <div className="mono-label text-muted-foreground">{formatDate(r.publishedAt)} · {r.version}</div>
                <h2 className="mt-1 font-display text-2xl md:text-3xl tracking-tight">
                  <Link to="/journal/changelog/$slug" params={{ slug: r.slug }} className="hover:text-primary">
                    {r.title}
                  </Link>
                </h2>
                <div className={`mt-2 inline-flex items-center h-6 px-2 rounded-full text-xs font-medium ${CAT_STYLE[r.category]}`}>{r.category}</div>
                <p className="mt-3 text-muted-foreground max-w-2xl">{r.summary}</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {r.highlights.map((h, i) => (
                    <li key={i} className="rounded-lg border border-border bg-card p-4">
                      <div className="font-medium">{h.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{h.body}</div>
                    </li>
                  ))}
                </ul>
                <Link to="/journal/changelog/$slug" params={{ slug: r.slug }} className="mt-4 inline-flex text-sm font-medium text-primary">
                  Read the full release →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA eyebrow="Release notifications" title="Get every FIRMA release in your inbox." />
      <PublicFooter />
    </div>
  );
}
