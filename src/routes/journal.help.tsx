import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ArrowRight, LifeBuoy, MessageCircle, Book } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { FirmaCTA } from "@/components/public/NewsletterCTA";
import { HELP_ARTICLES, HELP_CATEGORIES, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/help")({
  head: () => ({
    meta: [
      { title: "Help Center — FIRMA" },
      { name: "description", content: "Documentation and answers for FIRMA operators. Search-first, written by the team that built the product." },
      { property: "og:title", content: "FIRMA Help Center" },
      { property: "og:description", content: "Guides, how-tos and answers for FIRMA operators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (q.trim() === "") return [];
    return HELP_ARTICLES.filter(a => (a.title + a.summary).toLowerCase().includes(q.toLowerCase())).slice(0, 6);
  }, [q]);
  const popular = HELP_ARTICLES.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Search-first hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-16 md:py-24 text-center">
          <div className="mono-label mb-3 text-accent-foreground">FIRMA Help Center</div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight max-w-3xl mx-auto leading-[1.05]">
            How can we help you run your farm?
          </h1>
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search for &quot;invite team&quot;, &quot;billing&quot;, &quot;order&quot;…"
              className="h-14 w-full rounded-full border border-border bg-background pl-12 pr-4 text-base outline-none focus:border-primary shadow-sm"
            />
            {results.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-xl overflow-hidden text-left">
                {results.map(r => (
                  <Link key={r.slug} to="/journal/help/$slug" params={{ slug: r.slug }} className="flex items-center gap-3 px-4 py-3 hover:bg-muted border-b border-border last:border-0">
                    <Book className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.summary}</div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-muted-foreground">Popular:</span>
            {["invite team", "billing", "production plan", "orders", "inventory"].map(s => (
              <button key={s} onClick={() => setQ(s)} className="h-7 px-3 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground">{s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
        <div className="mono-label mb-4">Browse by topic</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_CATEGORIES.map(c => {
            const count = HELP_ARTICLES.filter(a => a.category === c.slug).length;
            return (
              <a key={c.slug} href={`#${c.slug}`} className="group flex gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary transition">
                <div className="text-3xl">{c.icon}</div>
                <div className="flex-1">
                  <div className="font-display text-lg group-hover:text-primary">{c.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{c.description}</div>
                  <div className="mt-3 text-xs text-muted-foreground">{count} articles</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Popular articles */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 pb-14">
        <div className="mono-label mb-4">Popular articles</div>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {popular.map(a => (
            <Link key={a.slug} to="/journal/help/$slug" params={{ slug: a.slug }} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50">
              <Book className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{a.title}</div>
                <div className="text-xs text-muted-foreground">Updated {formatDate(a.updated)}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Categorized lists */}
      <section className="mx-auto max-w-[1240px] px-5 lg:px-8 pb-14 grid gap-10 md:grid-cols-2">
        {HELP_CATEGORIES.map(c => {
          const items = HELP_ARTICLES.filter(a => a.category === c.slug);
          if (items.length === 0) return null;
          return (
            <div id={c.slug} key={c.slug}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{c.icon}</span>
                <h2 className="font-display text-xl">{c.name}</h2>
              </div>
              <ul className="rounded-lg border border-border divide-y divide-border bg-card">
                {items.map(a => (
                  <li key={a.slug}>
                    <Link to="/journal/help/$slug" params={{ slug: a.slug }} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50">
                      <span className="flex-1">{a.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Contact */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Still need help?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Our team answers within 4 business hours, in English or French.</p>
            <a href="#chat" className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Contact support</a>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <LifeBuoy className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Status page</h3>
            <p className="mt-2 text-sm text-muted-foreground">All systems operational. Check the live status of the FIRMA platform.</p>
            <a href="#status" className="mt-4 inline-flex h-10 items-center rounded-md border border-border px-4 text-sm hover:bg-muted">View status</a>
          </div>
        </div>
      </section>

      <FirmaCTA title="Ready to try FIRMA?" body="Start a free trial and set up your farm in an afternoon." />
      <PublicFooter />
    </div>
  );
}
