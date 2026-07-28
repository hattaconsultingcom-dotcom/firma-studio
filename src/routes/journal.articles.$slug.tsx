import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Share2, Loader2, FileText } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, FirmaCTA } from "@/components/public/NewsletterCTA";
import { supabase, type ArticleWithRelations } from "@/lib/supabase";

export const Route = createFileRoute("/journal/articles/$slug")({
  head: () => ({
    meta: [
      { title: "Article — FIRMA Journal" },
      { name: "description", content: "An article from the FIRMA Journal." },
    ],
  }),
  component: ArticleDetail,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

type PublicArticle = ArticleWithRelations;

function ArticleDetail() {
  const { slug } = Route.useParams();
  const [article, setArticle] = useState<PublicArticle | null>(null);
  const [related, setRelated] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("articles")
        .select(`
          *,
          authors:author_id (id, name, slug, bio, avatar_url, created_at, updated_at),
          categories:category_id (id, name, slug, created_at, updated_at),
          article_tags ( tags:tag_id (id, name, slug, created_at, updated_at) )
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!data) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      const a = data as unknown as PublicArticle;
      setArticle(a);

      // Load related
      if (a.category_id) {
        const { data: relData } = await supabase
          .from("articles")
          .select(`
            *,
            authors:author_id (id, name, slug, bio, avatar_url, created_at, updated_at),
            categories:category_id (id, name, slug, created_at, updated_at),
            article_tags ( tags:tag_id (id, name, slug, created_at, updated_at) )
          `)
          .eq("status", "published")
          .eq("category_id", a.category_id)
          .neq("id", a.id)
          .limit(3);
        setRelated((relData ?? []) as unknown as PublicArticle[]);
      }

      setLoading(false);
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (article) {
      document.title = `${article.headline} — FIRMA Journal`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", article.excerpt ?? "");
    }
    return () => { document.title = "FIRMA Journal"; };
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <PublicHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-3 text-sm text-muted-foreground">Loading article…</span>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (notFoundFlag || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <PublicHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="h-display mt-4 text-3xl">Article not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This article may have been moved, archived, or never existed.
            </p>
            <Link to="/journal/articles" className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted">
              <ArrowLeft className="h-4 w-4" /> Back to articles
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const a = article;
  const headings = (a.body ?? "").split("\n").filter((l) => l.startsWith("#"));
  const bodyParagraphs = (a.body ?? "").split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      <article>
        {/* Cover */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-10">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link to="/journal/articles" className="inline-flex items-center gap-2 hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> All articles
              </Link>
              {a.categories?.name && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{a.categories.name}</span>
                </>
              )}
            </nav>
            <div className="mono-label mt-6 text-accent-foreground">{a.categories?.name ?? "Article"}</div>
            <h1 className="mt-3 font-display text-4xl md:text-6xl leading-[1.03] tracking-tight max-w-5xl">{a.headline}</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-3xl leading-relaxed">{a.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm">
              {a.authors && (
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                    {a.authors.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <div className="font-medium">{a.authors.name}</div>
                    <div className="text-xs text-muted-foreground">{a.authors.bio ?? "Contributor"}</div>
                  </div>
                </div>
              )}
              {a.publish_date && <div className="text-muted-foreground text-sm">{formatDate(a.publish_date)}</div>}
              <div className="inline-flex items-center gap-1.5 text-muted-foreground text-sm"><Clock className="h-3.5 w-3.5" /> {a.reading_time} min read</div>
              <button className="ml-auto inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm hover:bg-muted">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {a.featured_image_url && (
          <img src={a.featured_image_url} alt={a.featured_image_alt ?? a.headline} className="w-full aspect-[16/7] object-cover" />
        )}

        {/* Body */}
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 grid gap-10 lg:grid-cols-[1fr_220px]">
          <div className="min-w-0 max-w-[720px]">
            {bodyParagraphs.map((para, i) => {
              if (para.startsWith("## ")) {
                return <h2 key={i} className="font-display text-2xl md:text-3xl mt-10 mb-4 tracking-tight">{para.replace(/^##\s+/, "")}</h2>;
              }
              if (para.startsWith("# ")) {
                return <h2 key={i} className="font-display text-2xl md:text-3xl mt-10 mb-4 tracking-tight">{para.replace(/^#\s+/, "")}</h2>;
              }
              return <p key={i} className="mb-6 text-[17px] leading-[1.75] text-foreground/90">{para}</p>;
            })}
            {a.authors && (
              <div className="mt-14 rounded-lg border border-border bg-accent/40 p-6">
                <div className="mono-label text-accent-foreground mb-2">About the author</div>
                <div className="font-medium">{a.authors.name}</div>
                <div className="text-sm text-muted-foreground">{a.authors.bio ?? "Contributor at FIRMA Journal."}</div>
              </div>
            )}
          </div>

          {/* Table of contents */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="mono-label mb-3">Contents</div>
                <nav className="space-y-1.5 text-sm">
                  {headings.map((h, i) => {
                    const text = h.replace(/^#+\s+/, "");
                    return (
                      <a
                        key={i}
                        href={`#${slugifyLocal(text)}`}
                        className="block text-muted-foreground hover:text-foreground transition"
                      >
                        {text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
            <div className="mono-label mb-6">Keep reading</div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} to="/journal/articles/$slug" params={{ slug: r.slug }} className="group">
                  {r.featured_image_url ? (
                    <img src={r.featured_image_url} alt={r.featured_image_alt ?? r.headline} className="aspect-[4/3] w-full rounded-md object-cover group-hover:opacity-90" />
                  ) : (
                    <div className="grid aspect-[4/3] w-full place-items-center rounded-md bg-muted">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {r.categories?.name && <div className="mono-label mt-4">{r.categories.name}</div>}
                  <h3 className="mt-2 font-display text-lg leading-snug group-hover:underline underline-offset-4">{r.headline}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterCTA />
      <FirmaCTA />
      <PublicFooter />
    </div>
  );
}

function slugifyLocal(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}
