import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Clock, Search, Loader2, AlertCircle, FileText } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { NewsletterCTA, FirmaCTA } from "@/components/public/NewsletterCTA";
import { supabase, type ArticleWithRelations } from "@/lib/supabase";

export const Route = createFileRoute("/journal/articles")({
  head: () => ({
    meta: [
      { title: "Articles — FIRMA Journal" },
      { name: "description", content: "Field reports, analysis, interviews and long reads on the industrialisation of indoor farming." },
      { property: "og:title", content: "Articles — FIRMA Journal" },
      { property: "og:description", content: "A premium editorial publication for professional farm operators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArticlesPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

type PublicArticle = ArticleWithRelations;

function ArticlesPage() {
  const [section, setSection] = useState("All");
  const [q, setQ] = useState("");
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from("articles")
        .select(`
          *,
          authors:author_id (id, name, slug, bio, avatar_url, created_at, updated_at),
          categories:category_id (id, name, slug, created_at, updated_at),
          article_tags ( tags:tag_id (id, name, slug, created_at, updated_at) )
        `)
        .eq("status", "published")
        .order("publish_date", { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setArticles((data ?? []) as unknown as PublicArticle[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => { if (a.categories?.name) set.add(a.categories.name); });
    return ["All", ...Array.from(set)];
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter(
      (a) =>
        (section === "All" || a.categories?.name === section) &&
        (q === "" || (a.headline + " " + (a.excerpt ?? "")).toLowerCase().includes(q.toLowerCase())),
    );
  }, [section, q, articles]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <PublicHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-3 text-sm text-muted-foreground">Loading articles…</span>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <PublicHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
            <p className="mt-3 text-sm text-muted-foreground">Couldn't load articles. Please try again later.</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const [lead, ...rest] = filtered;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Masthead */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14 md:py-20">
          <div className="mono-label mb-3">FIRMA Journal · Articles</div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-4xl">
            Articles. Reporting on the operators, science and economics of modern farming.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
            An editorial publication produced by the FIRMA newsroom. Field reports, analysis, interviews and long-form
            essays for the people running indoor farms.
          </p>
        </div>
      </section>

      {articles.length === 0 ? (
        <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-20 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="h-display mt-4 text-2xl">No articles published yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Published articles will appear here. Check back soon.
          </p>
        </section>
      ) : (
        <>
          {/* Feature */}
          {lead && (
            <section className="border-b border-border">
              <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-12 grid gap-10 md:grid-cols-[1.15fr_1fr] items-start">
                <Link
                  to="/journal/articles/$slug"
                  params={{ slug: lead.slug }}
                  className="group block overflow-hidden rounded-lg border border-border"
                >
                  {lead.featured_image_url ? (
                    <img src={lead.featured_image_url} alt={lead.featured_image_alt ?? lead.headline} className="aspect-[16/10] w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                  ) : (
                    <div className="grid aspect-[16/10] w-full place-items-center bg-muted">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </Link>
                <div>
                  <div className="mono-label text-accent-foreground mb-3">
                    The lead story {lead.categories?.name ? `· ${lead.categories.name}` : ""}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl leading-tight tracking-tight">
                    <Link to="/journal/articles/$slug" params={{ slug: lead.slug }} className="hover:underline underline-offset-4">
                      {lead.headline}
                    </Link>
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{lead.excerpt}</p>
                  <div className="mt-6 flex items-center gap-3 text-sm">
                    {lead.authors && (
                      <>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                          {lead.authors.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                        <div>
                          <div className="font-medium">{lead.authors.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {lead.publish_date ? formatDate(lead.publish_date) : ""} · {lead.reading_time} min read
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section toolbar */}
          <section className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur">
            <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-4 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSection(s)}
                    className={`h-8 px-3 rounded-full text-xs border transition ${section === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="ml-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search articles"
                  className="h-9 w-64 rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </section>

          {/* Grid */}
          <section className="mx-auto max-w-[1240px] px-5 lg:px-8 py-14">
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <article key={a.id} className="group">
                  <Link to="/journal/articles/$slug" params={{ slug: a.slug }} className="block overflow-hidden rounded-md">
                    {a.featured_image_url ? (
                      <img src={a.featured_image_url} alt={a.featured_image_alt ?? a.headline} className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="grid aspect-[4/3] w-full place-items-center bg-muted">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </Link>
                  {a.categories?.name && <div className="mono-label mt-4">{a.categories.name}</div>}
                  <h3 className="mt-2 font-display text-xl leading-snug">
                    <Link to="/journal/articles/$slug" params={{ slug: a.slug }} className="hover:underline underline-offset-4">
                      {a.headline}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                  <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                    {a.authors && <span>{a.authors.name}</span>}
                    {a.authors && a.publish_date && <span>·</span>}
                    {a.publish_date && <span>{formatDate(a.publish_date)}</span>}
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.reading_time} min</span>
                  </div>
                </article>
              ))}
            </div>
            {rest.length === 0 && lead && (
              <div className="col-span-full text-center text-sm text-muted-foreground py-16">No more articles match this filter.</div>
            )}
          </section>
        </>
      )}

      <NewsletterCTA />
      <FirmaCTA />
      <PublicFooter />
    </div>
  );
}
