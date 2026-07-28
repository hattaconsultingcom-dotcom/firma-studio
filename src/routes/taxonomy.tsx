import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { supabase, type AuthorRow, type CategoryRow, type TagRow } from "@/lib/supabase";
import { Plus, Tags, Users, Layers, Loader as Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

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

function TaxonomyPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("authors");
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [tags, setTags] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  async function loadAll() {
    setLoading(true);
    const [{ data: a }, { data: c }, { data: t }] = await Promise.all([
      supabase.from("authors").select("*").order("name"),
      supabase.from("categories").select("*").order("name"),
      supabase.from("tags").select("*").order("name"),
    ]);
    setAuthors((a ?? []) as AuthorRow[]);
    setCategories((c ?? []) as CategoryRow[]);
    setTags((t ?? []) as TagRow[]);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function addEntity(table: "authors" | "categories" | "tags") {
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    await supabase.from(table).insert({ name: newName.trim(), slug });
    setNewName("");
    loadAll();
  }

  async function deleteEntity(table: "authors" | "categories" | "tags", id: string) {
    await supabase.from(table).delete().eq("id", id);
    loadAll();
  }

  return (
    <>
      <PageHeader
        eyebrow="Growth · Taxonomy"
        title="Content taxonomy"
        description="How content is organised across the FIRMA public site."
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

        {loading && (
          <div className="surface-card flex items-center justify-center p-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && tab === "authors" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New author name…"
                className="h-9 flex-1 rounded-md border border-border bg-card px-3 text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") addEntity("authors"); }}
              />
              <button onClick={() => addEntity("authors")} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {authors.map((a) => (
                <div key={a.id} className="surface-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {a.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{a.slug}</div>
                    </div>
                    <button onClick={() => deleteEntity("authors", a.id)} className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {authors.length === 0 && <div className="text-sm text-muted-foreground col-span-full">No authors yet. Add one above.</div>}
            </div>
          </div>
        )}

        {!loading && tab === "categories" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New category name…"
                className="h-9 flex-1 rounded-md border border-border bg-card px-3 text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") addEntity("categories"); }}
              />
              <button onClick={() => addEntity("categories")} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="surface-card">
                <div className="border-b border-border px-4 py-3 text-sm font-medium">Categories</div>
                <ul className="divide-y divide-border">
                  {categories.map((c) => (
                    <li key={c.id} className="flex items-center justify-between px-4 py-2.5">
                      <div>
                        <span className="text-sm">{c.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground font-mono">{c.slug}</span>
                      </div>
                      <button onClick={() => deleteEntity("categories", c.id)} className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                  {categories.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No categories yet.</li>}
                </ul>
              </div>
              <div className="surface-card">
                <div className="border-b border-border px-4 py-3 text-sm font-medium">Tags</div>
                <div className="p-3 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t.id} className="chip inline-flex items-center gap-1">
                      #{t.name}
                      <button onClick={() => deleteEntity("tags", t.id)} className="ml-0.5 text-muted-foreground hover:text-destructive">×</button>
                    </span>
                  ))}
                  {tags.length === 0 && <span className="text-sm text-muted-foreground">No tags yet.</span>}
                </div>
              </div>
            </div>
            <div className="surface-card p-4">
              <div className="mono-label mb-2">Topics</div>
              <div className="text-sm text-muted-foreground">Topics and content clusters are Coming Soon.</div>
            </div>
          </div>
        )}

        {!loading && tab === "clusters" && (
          <div className="surface-card mx-auto max-w-2xl p-12 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Coming Soon
            </div>
            <h2 className="h-display mt-4 text-2xl">Content Clusters</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pillar pages, supporting content graphs and cluster-aware internal linking are part of the FIRMA Studio roadmap.
            </p>
          </div>
        )}
      </PageBody>
    </>
  );
}
