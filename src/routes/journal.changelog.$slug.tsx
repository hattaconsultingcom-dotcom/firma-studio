import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, FirmaCTA } from "@/components/public/NewsletterCTA";
import { RELEASES, getRelease, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/changelog/$slug")({
  loader: ({ params }) => {
    const release = getRelease(params.slug);
    if (!release) throw notFound();
    return { release };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Release not found — FIRMA" }, { name: "robots", content: "noindex" }] };
    const r = loaderData.release;
    return {
      meta: [
        { title: `${r.version} · ${r.title} — FIRMA Changelog` },
        { name: "description", content: r.summary },
        { property: "og:title", content: `${r.version} · ${r.title}` },
        { property: "og:description", content: r.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ReleaseDetail,
});

const CAT_STYLE: Record<string, string> = {
  New: "bg-primary text-primary-foreground",
  Improved: "bg-accent text-accent-foreground",
  Fixed: "bg-muted text-muted-foreground border border-border",
};

function ReleaseDetail() {
  const { release: r } = Route.useLoaderData() as { release: import("@/lib/public-content").Release };
  const idx = RELEASES.findIndex(x => x.slug === r.slug);
  const prev = RELEASES[idx + 1];
  const next = RELEASES[idx - 1];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[900px] px-5 lg:px-8 py-14">
          <Link to="/journal/changelog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Changelog
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center h-7 px-3 rounded-full text-xs font-medium ${CAT_STYLE[r.category]}`}>{r.category}</span>
            <span className="mono-label text-muted-foreground">{r.version}</span>
            <span className="text-xs text-muted-foreground">{formatDate(r.publishedAt)}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">{r.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{r.summary}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 lg:px-8 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {r.highlights.map((h, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="mono-label text-primary">Highlight {i + 1}</div>
              <div className="mt-2 font-display text-xl">{h.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{h.body}</p>
            </div>
          ))}
        </div>

        {/* prev/next */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link to="/journal/changelog/$slug" params={{ slug: prev.slug }} className="group rounded-lg border border-border p-5 hover:border-primary">
              <div className="text-xs text-muted-foreground">← Previous release</div>
              <div className="mt-1 font-display group-hover:text-primary">{prev.version} — {prev.title}</div>
            </Link>
          ) : <div />}
          {next ? (
            <Link to="/journal/changelog/$slug" params={{ slug: next.slug }} className="group rounded-lg border border-border p-5 text-right hover:border-primary">
              <div className="text-xs text-muted-foreground">Next release →</div>
              <div className="mt-1 font-display group-hover:text-primary">{next.version} — {next.title}</div>
            </Link>
          ) : <div />}
        </div>

        <div className="mt-10 text-center">
          <Link to="/journal/changelog" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
            All releases <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <NewsletterCTA />
      <FirmaCTA />
      <PublicFooter />
    </div>
  );
}
