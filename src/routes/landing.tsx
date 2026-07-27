import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge, LangChip, SeoDot } from "@/components/studio/StatusBadge";
import { LANDING_PAGES } from "@/lib/mock";
import { Plus, LayoutTemplate } from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Landing Pages · FIRMA Studio" },
      { name: "description", content: "Campaign landing pages for FIRMA." },
    ],
  }),
  component: LandingList,
});

function LandingList() {
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Landing pages"
        title="Campaigns & landing pages"
        description="Standalone marketing pages, grouped by campaign."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> New landing page
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_PAGES.map((p) => (
            <div key={p.path} className="surface-card overflow-hidden">
              <div className="aspect-[16/9] grid-bg relative">
                <div className="absolute inset-0 grid place-items-center">
                  <LayoutTemplate className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <div className="absolute left-3 top-3 chip">{p.campaign}</div>
                <div className="absolute right-3 top-3"><StatusBadge status={p.status} /></div>
              </div>
              <div className="p-4">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="mt-0.5 font-mono text-xs text-muted-foreground truncate">{p.path}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <LangChip code={p.language} />
                  <SeoDot state={p.seo} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-border p-2">
                    <div className="mono-label">Conversion</div>
                    <div className="mt-0.5 font-mono text-sm tabular-nums">{p.conversion.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-md border border-border p-2">
                    <div className="mono-label">Updated</div>
                    <div className="mt-0.5 text-xs">{p.updatedAt}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
