import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge, SeoDot, LangChip } from "@/components/studio/StatusBadge";
import { WEBSITE_PAGES, authorById } from "@/lib/mock";
import { Plus, ExternalLink, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/website")({
  head: () => ({
    meta: [
      { title: "Website · FIRMA Studio" },
      { name: "description", content: "Manage public pages on firma.farm." },
    ],
  }),
  component: WebsitePage,
});

function WebsitePage() {
  const [selected, setSelected] = useState(WEBSITE_PAGES[0]);
  return (
    <>
      <PageHeader
        eyebrow="Publishing · Website"
        title="Public website"
        description="Every page on firma.farm — status, metadata, ownership."
        actions={
          <>
            <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <Search className="h-4 w-4" /> SEO scan
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
              <Plus className="h-4 w-4" /> New page
            </button>
          </>
        }
      />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="surface-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium">Page</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Status</th>
                  <th className="hidden md:table-cell px-3 py-2.5 font-medium">SEO</th>
                  <th className="hidden lg:table-cell px-3 py-2.5 font-medium">Lang</th>
                  <th className="hidden lg:table-cell px-3 py-2.5 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WEBSITE_PAGES.map((p) => (
                  <tr
                    key={p.path}
                    onClick={() => setSelected(p)}
                    className={`cursor-pointer hover:bg-muted/30 ${selected.path === p.path ? "bg-primary-soft/40" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="mt-0.5 font-mono text-xs text-muted-foreground">{p.path}</div>
                    </td>
                    <td className="hidden sm:table-cell px-3 py-3"><StatusBadge status={p.status} /></td>
                    <td className="hidden md:table-cell px-3 py-3"><SeoDot state={p.seo} /></td>
                    <td className="hidden lg:table-cell px-3 py-3"><LangChip code={p.language} /></td>
                    <td className="hidden lg:table-cell px-3 py-3 text-xs text-muted-foreground">{p.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="surface-card p-4">
            <div className="eyebrow mb-1">Page settings</div>
            <h3 className="h-display text-xl">{selected.name}</h3>
            <div className="mt-1 font-mono text-xs text-muted-foreground">{selected.path}</div>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge status={selected.status} />
              <SeoDot state={selected.seo} />
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-3 text-sm">
              <FieldRow label="Page title" value={`${selected.name} · FIRMA`} />
              <FieldRow label="Slug" value={selected.path} mono />
              <FieldRow label="Meta title" value={`${selected.name} · Vertical farming platform`} />
              <FieldRow label="Meta description" value="Grow more, waste less, with the FIRMA operating system for controlled-environment agriculture." textarea />
              <FieldRow label="Canonical URL" value={`https://firma.farm${selected.path}`} mono />
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
                <span>NoIndex</span>
                <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
                <span>Open Graph override</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
                <ExternalLink className="h-4 w-4" /> Preview
              </button>
              <button className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                Publish changes
              </button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Owner: {authorById(selected.author).name}
              {selected.lastPublished && <> · Published {selected.lastPublished}</>}
            </div>
          </aside>
        </div>
      </PageBody>
    </>
  );
}

function FieldRow({ label, value, mono, textarea }: { label: string; value: string; mono?: boolean; textarea?: boolean }) {
  return (
    <label className="block space-y-1">
      <div className="mono-label">{label}</div>
      {textarea ? (
        <textarea
          defaultValue={value}
          className={`w-full min-h-[70px] rounded-md border border-border bg-card p-2.5 text-sm ${mono ? "font-mono text-xs" : ""}`}
        />
      ) : (
        <input
          defaultValue={value}
          className={`w-full h-9 rounded-md border border-border bg-card px-2.5 text-sm ${mono ? "font-mono text-xs" : ""}`}
        />
      )}
    </label>
  );
}
