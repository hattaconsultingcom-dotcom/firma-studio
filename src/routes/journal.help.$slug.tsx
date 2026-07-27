import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, ThumbsDown, ThumbsUp } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { HELP_ARTICLES, HELP_CATEGORIES, getHelpArticle, formatDate } from "@/lib/public-content";

export const Route = createFileRoute("/journal/help/$slug")({
  loader: ({ params }) => {
    const article = getHelpArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Help article not found" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} — FIRMA Help Center` },
        { name: "description", content: a.summary },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: HelpArticleDetail,
});

function HelpArticleDetail() {
  const { article: a } = Route.useLoaderData() as { article: import("@/lib/public-content").HelpArticle };
  const category = HELP_CATEGORIES.find(c => c.slug === a.category);
  const inCategory = HELP_ARTICLES.filter(x => x.category === a.category);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicHeader />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/journal/help" className="hover:text-foreground">Help Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="hover:text-foreground">{category?.name}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate">{a.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-10 grid gap-12 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Link to="/journal/help" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All help
          </Link>
          <div className="mt-6 mono-label mb-3">{category?.name}</div>
          <ul className="space-y-1 text-sm">
            {inCategory.map(x => (
              <li key={x.slug}>
                <Link
                  to="/journal/help/$slug"
                  params={{ slug: x.slug }}
                  className={`block rounded-md px-3 py-2 ${x.slug === a.slug ? "bg-primary-soft text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  {x.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Body */}
        <article className="max-w-[720px]">
          <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-tight">{a.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{a.summary}</p>
          <div className="mt-3 text-xs text-muted-foreground">Updated {formatDate(a.updated)}</div>

          <div className="mt-8 prose prose-neutral max-w-none">
            {a.body.map((b, i) => (
              <div key={i} className="mb-6">
                {b.heading && <h2 className="font-display text-xl md:text-2xl mt-8 mb-3 tracking-tight">{b.heading}</h2>}
                <p className="text-[16px] leading-[1.7] text-foreground/90">{b.paragraph}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-border bg-card p-5 flex flex-wrap items-center gap-4">
            <div className="text-sm">Was this article helpful?</div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm hover:bg-muted"><ThumbsUp className="h-4 w-4" /> Yes</button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm hover:bg-muted"><ThumbsDown className="h-4 w-4" /> No</button>
            </div>
            <a href="#chat" className="ml-auto text-sm text-primary font-medium">Contact support →</a>
          </div>
        </article>
      </div>

      <PublicFooter />
    </div>
  );
}
