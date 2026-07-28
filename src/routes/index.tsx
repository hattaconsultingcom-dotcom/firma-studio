import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { ACTIVITY, TOP_PAGES, SEO_ISSUES, MEDIA, authorById } from "@/lib/mock";
import { supabase, type ArticleWithRelations } from "@/lib/supabase";
import { ArrowUpRight, AlertTriangle, Calendar, Clock, Sparkles, Plus, FileText, Image as ImageIcon, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · FIRMA Studio" },
      { name: "description", content: "Editorial operations overview for the FIRMA team." },
    ],
  }),
  component: Overview,
});

function Stat({ label, value, sub, tone, loading }: { label: string; value: string; sub?: string; tone?: "ok" | "warn" | "danger"; loading?: boolean }) {
  const dot = tone === "warn" ? "bg-warn" : tone === "danger" ? "bg-destructive" : "bg-success";
  return (
    <div className="surface-card p-4">
      <div className="mono-label flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-2 h-display text-3xl">
        {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Overview() {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("articles")
        .select(`
          *,
          authors:author_id (id, name, slug, bio, avatar_url, created_at, updated_at),
          categories:category_id (id, name, slug, created_at, updated_at),
          article_tags ( tags:tag_id (id, name, slug, created_at, updated_at) )
        `)
        .order("updated_at", { ascending: false });
      setArticles((data ?? []) as unknown as ArticleWithRelations[]);
      setLoading(false);
    }
    load();
  }, []);

  const drafts = articles.filter((a) => a.status === "draft");
  const published = articles.filter((a) => a.status === "published");
  const archived = articles.filter((a) => a.status === "archived");
  const criticalIssues = SEO_ISSUES.filter((i) => i.severity === "critical" && i.state === "open");
  const recentlyUpdated = articles.slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="Studio · Editorial operations"
        title="Overview"
        description="What needs your attention across the FIRMA public website today."
        actions={
          <>
            <a
              href="/journal"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
            >
              <ArrowUpRight className="h-4 w-4" /> Open public blog
            </a>
            <Link to="/blog" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <FileText className="h-4 w-4" /> Open blog
            </Link>
            <Link to="/blog/$id" params={{ id: "new" }} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95">
              <Plus className="h-4 w-4" /> New article
            </Link>
          </>
        }
      />
      <PageBody>
        {/* Real article stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Stat label="Total articles" value={String(articles.length)} loading={loading} />
          <Stat label="Drafts" value={String(drafts.length)} loading={loading} />
          <Stat label="Published" value={String(published.length)} loading={loading} />
          <Stat label="Archived" value={String(archived.length)} loading={loading} />
        </div>

        {/* Preview stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Stat label="Needs attention" value="—" sub="Preview · SEO center coming soon" tone="warn" />
          <Stat label="Scheduled" value="—" sub="Preview · Scheduling coming soon" />
          <Stat label="Published (30d)" value="—" sub="Preview · Analytics coming soon" />
          <Stat label="Views (30d)" value="—" sub="Preview · Analytics coming soon" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recently updated */}
          <div className="surface-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" /> Recently updated articles
              </div>
              <Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : recentlyUpdated.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No articles yet. <Link to="/blog/$id" params={{ id: "new" }} className="text-primary hover:underline">Create your first article</Link>.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentlyUpdated.map((a) => (
                  <li key={a.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                    {a.featured_image_url ? (
                      <img src={a.featured_image_url} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="grid h-10 w-14 shrink-0 place-items-center rounded-md bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link to="/blog/$id" params={{ id: a.id }} className="truncate text-sm font-medium hover:underline">
                        {a.headline}
                      </Link>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {a.authors?.name ?? "—"} · {a.categories?.name ?? "—"} · {new Date(a.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Publishing calendar preview */}
          <div className="surface-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-primary" /> Publishing calendar
              </div>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Preview</span>
            </div>
            <div className="p-4 text-sm text-muted-foreground">
              Scheduling is coming soon. For now, publish directly from the article editor.
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* SEO center preview */}
          <div className="surface-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-warn" /> SEO center
              </div>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Coming Soon</span>
            </div>
            <div className="p-4 text-sm text-muted-foreground">
              The SEO audit, structured data and FAQ schema tools are coming soon.
            </div>
          </div>

          {/* Top pages preview */}
          <div className="surface-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Search className="h-4 w-4 text-primary" /> Top pages
              </div>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Preview</span>
            </div>
            <ul className="divide-y divide-border">
              {TOP_PAGES.slice(0, 3).map((p) => (
                <li key={p.path} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 px-4 py-2.5">
                  <div className="min-w-0 truncate font-mono text-xs text-muted-foreground">{p.path}</div>
                  <div className="font-mono text-xs tabular-nums">{p.views.toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick actions */}
        <div className="surface-card p-4">
          <div className="mono-label mb-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Quick actions
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/blog/$id" params={{ id: "new" }} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
              New article
            </Link>
            <Link to="/taxonomy" className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
              Manage taxonomy
            </Link>
            <Link to="/media" className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
              Media library
            </Link>
            <span className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              New landing page — Coming Soon
            </span>
            <span className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              Create redirect — Coming Soon
            </span>
            <span className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              Draft changelog — Coming Soon
            </span>
          </div>
        </div>
      </PageBody>
    </>
  );
}
