import { createFileRoute } from "@tanstack/react-router";
import { ContentList, type ContentItem } from "@/components/studio/ContentList";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates · FIRMA Studio" },
      { name: "description", content: "Reusable templates for the FIRMA public site." },
    ],
  }),
  component: () => (
    <>
      <div className="surface-card mb-4 flex items-center gap-3 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Coming Soon
        </span>
        <span className="text-sm text-muted-foreground">This module is part of the FIRMA Studio roadmap. The UI below is a preview.</span>
      </div>
      <ContentList
        eyebrow="Publishing · Templates"
        title="Templates"
        description="Reusable page and section templates for landing pages and blog posts."
        ctaLabel="New template"
        items={ITEMS}
      />
    </>
  ),
});

const ITEMS: ContentItem[] = [
  { id: "t1", title: "Product landing — hero + features + pricing", meta: "Section template · 6 blocks", chips: ["Landing", "Product"], status: "published", updated: "1 week ago" },
  { id: "t2", title: "Long-form article — table of contents", meta: "Article layout · TOC + callouts", chips: ["Blog"], status: "published", updated: "2 weeks ago" },
  { id: "t3", title: "Case study — metrics-forward", meta: "Section template · 5 blocks", chips: ["Case study"], status: "published", updated: "3 weeks ago" },
  { id: "t4", title: "Comparison table — FIRMA vs. spreadsheet", meta: "Reusable block · Comparison", chips: ["Block"], status: "in_review", updated: "yesterday" },
  { id: "t5", title: "Newsletter — 3-story layout", meta: "Email template", chips: ["Newsletter"], status: "published", updated: "5 days ago" },
  { id: "t6", title: "Announcement banner — release", meta: "Reusable block", chips: ["Announcement"], status: "draft", updated: "yesterday" },
];
