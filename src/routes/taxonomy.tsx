import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { AUTHORS, CATEGORIES, CLUSTERS } from "@/lib/mock";
import { Plus, Tags, Users, Layers } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/taxonomy")({
  head: () => ({
    meta: [
      { title: "Taxonomy · FIRMA Studio" },
      { name: "description", content: "Authors, categories, tags, topics and content clusters." },
    ],
  }),
  component: TaxonomyPage,
});

const TABS = [
  { key: "authors", label: "Authors", Icon: Users },
  { key: "categories", label: "Categories", Icon: Tags },
  { key: "clusters", label: "Content Clusters", Icon: Layers },
] as const;

const TAGS = ["unit-economics", "microgreens", "hydroponics", "nft", "dwc", "vpd", "energy", "opex", "compliance", "wholesale", "planner", "release"];
const TOPICS = ["Indoor Farming", "Microgreens", "Hydroponics", "NFT Systems", "Vertical Farming", "Controlled Environment Agriculture", "Greenhouses", "Farm Management", "Production Planning", "Inventory", "Orders", "Wholesale", "Direct-to-Consumer", "Food Safety"];

function TaxonomyPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("authors");
  return (
    <>
      <PageHeader
        eyebrow="Growth · Taxonomy"
        title="Content taxonomy"
        description="How content is organised across the FIRMA public site."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> New
          </button>
        }
      />
      <PageBody>
        <div className="flex flex-wrap items-center gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px px-3 py-2 text-sm inline-flex items-center gap-1.5 ${
                tab === t.key ? "text-foreground border-b-2 border-primary font-medium" : "text-muted-foreground border-b-2 border-transparent hover:text-foreground"
              }`}
            >
              <t.Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "authors" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AUTHORS.map((a) => (
              <div key={a.id} className="surface-card p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-medium">{a.initials}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.role}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div><div className="font-mono text-sm">12</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Articles</div></div>
                  <div><div className="font-mono text-sm">3</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Drafts</div></div>
                  <div><div className="font-mono text-sm">28k</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Views</div></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "categories" && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="surface-card">
              <div className="border-b border-border px-4 py-3 text-sm font-medium">Categories</div>
              <ul className="divide-y divide-border">
                {CATEGORIES.map((c) => (
                  <li key={c} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm">{c}</span>
                    <span className="chip font-mono">{Math.floor(Math.random() * 20) + 3} posts</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="surface-card">
                <div className="border-b border-border px-4 py-3 text-sm font-medium">Tags</div>
                <div className="p-3 flex flex-wrap gap-1.5">
                  {TAGS.map((t) => <span key={t} className="chip">#{t}</span>)}
                </div>
              </div>
              <div className="surface-card">
                <div className="border-b border-border px-4 py-3 text-sm font-medium">Topics</div>
                <div className="p-3 flex flex-wrap gap-1.5">
                  {TOPICS.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "clusters" && (
          <div className="grid gap-4 lg:grid-cols-2">
            {CLUSTERS.map((c) => (
              <div key={c.name} className="surface-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="eyebrow mb-1">Cluster</div>
                    <h3 className="h-display text-xl">{c.name}</h3>
                  </div>
                  <span className="chip">{c.langs} languages</span>
                </div>
                <div className="mt-3 rounded-md border border-border p-3">
                  <div className="mono-label mb-1">Pillar page</div>
                  <div className="font-mono text-xs">{c.pillar}</div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Stat label="Supporting" value={c.supporting} />
                  <Stat label="Missing" value={c.missing} tone="warn" />
                  <Stat label="Languages" value={c.langs} />
                </div>
              </div>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warn" }) {
  return (
    <div className="rounded-md border border-border p-2">
      <div className="mono-label">{label}</div>
      <div className={`font-mono text-lg ${tone === "warn" ? "text-warn-foreground" : ""}`}>{value}</div>
    </div>
  );
}
