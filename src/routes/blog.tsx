import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { supabase, type ArticleStatus, type ArticleWithRelations } from "@/lib/supabase";
import { Filter, Plus, Search as SearchIcon, MoreHorizontal, ArrowUpDown, Loader2, AlertCircle, FileText } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog · FIRMA Studio" },
      { name: "description", content: "Manage articles, drafts, scheduled and published content." },
    ],
  }),
  component: BlogList,
});

type TabKey = "all" | ArticleStatus;
const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
];

function BlogList() {
  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadArticles() {
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from("articles")
      .select(`
        *,
        authors:author_id (id, name, slug, bio, avatar_url, created_at, updated_at),
        categories:category_id (id, name, slug, created_at, updated_at),
        article_tags ( tags:tag_id (id, name, slug, created_at, updated_at) )
      `)
      .order("updated_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setArticles([]);
    } else {
      setArticles((data ?? []) as unknown as ArticleWithRelations[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  const counts: Record<string, number> = { all: articles.length };
  articles.forEach((a) => {
    counts[a.status] = (counts[a.status] ?? 0) + 1;
  });

  const rows = articles.filter(
    (a) =>
      (tab === "all" || a.status === tab) &&
      (q === "" || a.headline.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHeader
        eyebrow="Publishing · Blog"
        title="All articles"
        description="Every post across the public FIRMA blog. Filter, edit, schedule and publish."
        actions={
          <>
            <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <Link
              to="/blog/$id"
              params={{ id: "new" }}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> New article
            </Link>
          </>
        }
      />
      <PageBody>
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative -mb-px px-3 py-2 text-sm transition ${
                tab === t.key
                  ? "text-foreground border-b-2 border-primary font-medium"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              }`}
            >
              {t.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {counts[t.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search / toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles"
              className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="surface-card flex items-center justify-center p-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-3 text-sm text-muted-foreground">Loading articles…</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="surface-card flex items-start gap-3 p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <div className="text-sm font-medium text-foreground">Couldn't load articles</div>
              <div className="mt-1 text-xs text-muted-foreground">{error}</div>
              <button
                onClick={loadArticles}
                className="mt-3 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Desktop table */}
        {!loading && !error && (
          <div className="surface-card hidden md:block overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium">
                    <span className="inline-flex items-center gap-1">Article <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-3 py-2.5 font-medium">Author</th>
                  <th className="px-3 py-2.5 font-medium">Category</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Updated</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link to="/blog/$id" params={{ id: a.id }} className="flex items-center gap-3 min-w-0">
                        {a.featured_image_url ? (
                          <img src={a.featured_image_url} alt={a.featured_image_alt ?? ""} className="h-9 w-12 shrink-0 rounded object-cover" />
                        ) : (
                          <div className="grid h-9 w-12 shrink-0 place-items-center rounded bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">{a.headline}</div>
                          <div className="truncate text-xs text-muted-foreground font-mono">/journal/articles/{a.slug}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[10px] font-medium">
                          {(a.authors?.name ?? "?").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <span className="text-xs">{a.authors?.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{a.categories?.name ?? "—"}</td>
                    <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {new Date(a.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-3">
                      <button className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile cards */}
        {!loading && !error && (
          <div className="grid gap-3 md:hidden">
            {rows.map((a) => (
              <Link
                key={a.id}
                to="/blog/$id"
                params={{ id: a.id }}
                className="surface-card block p-3 hover:border-border-strong"
              >
                <div className="flex gap-3">
                  {a.featured_image_url ? (
                    <img src={a.featured_image_url} alt={a.featured_image_alt ?? ""} className="h-16 w-20 shrink-0 rounded object-cover" />
                  ) : (
                    <div className="grid h-16 w-20 shrink-0 place-items-center rounded bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-medium">{a.headline}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{a.authors?.name ?? "—"} · {a.categories?.name ?? "—"}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={a.status} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && rows.length === 0 && (
          <div className="surface-card p-10 text-center">
            <div className="mono-label mb-2">Empty</div>
            <h3 className="h-display text-xl">No articles match your filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {articles.length === 0
                ? "Create your first article to get started."
                : "Try clearing the search or switching tab."}
            </p>
            {articles.length === 0 && (
              <Link
                to="/blog/$id"
                params={{ id: "new" }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
              >
                <Plus className="h-4 w-4" /> New article
              </Link>
            )}
          </div>
        )}
      </PageBody>
    </>
  );
}
