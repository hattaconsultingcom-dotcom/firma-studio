import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { CHANGELOG } from "@/lib/mock";
import { Plus, Tag } from "lucide-react";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog · FIRMA Studio" },
      { name: "description", content: "Release notes for FIRMA OS." },
    ],
  }),
  component: ChangelogPage,
});

const tagCls: Record<string, string> = {
  Feature: "!bg-primary-soft !text-primary !border-primary/20",
  Improvement: "!bg-info/10 !text-info !border-info/20",
  Fix: "!bg-warn/10 !text-warn-foreground !border-warn/25",
};

function ChangelogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Changelog"
        title="Product changelog"
        description="Release notes surfaced on firma.farm/changelog."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> Draft release
          </button>
        }
      />
      <PageBody>
        <ol className="space-y-4">
          {CHANGELOG.map((c) => (
            <li key={c.version} className="surface-card p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_minmax(0,1fr)]">
                <div>
                  <div className="mono-label">Version</div>
                  <div className="mt-0.5 font-mono text-sm">{c.version}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{c.date}</div>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="h-display text-lg">{c.title}</h3>
                    <span className={`chip ${tagCls[c.tag] ?? ""}`}><Tag className="h-3 w-3" /> {c.tag}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{c.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </PageBody>
    </>
  );
}
