import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { MEDIA, authorById } from "@/lib/mock";
import { Upload, Grid3x3, List, Folder, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media Library · FIRMA Studio" },
      { name: "description", content: "Manage all FIRMA marketing assets." },
    ],
  }),
  component: MediaPage,
});

const FOLDERS = ["All", "Blog", "Landing", "Product", "Resources"];

function MediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [folder, setFolder] = useState("All");
  const [selected, setSelected] = useState(MEDIA[0]);
  const rows = MEDIA.filter((m) => folder === "All" || m.folder === folder);

  return (
    <>
      <div className="surface-card mb-4 flex items-center gap-3 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Coming Soon
        </span>
        <span className="text-sm text-muted-foreground">This module is part of the FIRMA Studio roadmap. The UI below is a preview.</span>
      </div>
      <PageHeader
        eyebrow="Growth · Media Library"
        title="Media library"
        description="Images, video, and documents used across firma.farm."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Upload className="h-4 w-4" /> Upload
          </button>
        }
      />
      <PageBody>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search media" className="w-full h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm" />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
            <button onClick={() => setView("grid")} className={`grid h-7 w-7 place-items-center rounded ${view === "grid" ? "bg-muted" : ""}`}><Grid3x3 className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} className={`grid h-7 w-7 place-items-center rounded ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)_320px]">
          <aside className="surface-card p-2">
            <div className="mono-label px-2 pb-2 pt-1">Folders</div>
            <ul className="space-y-0.5">
              {FOLDERS.map((f) => (
                <li key={f}>
                  <button
                    onClick={() => setFolder(f)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                      folder === f ? "bg-primary-soft text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Folder className="h-4 w-4" /> {f}
                    <span className="ml-auto text-[10px] font-mono">
                      {f === "All" ? MEDIA.length : MEDIA.filter((m) => m.folder === f).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-md border border-dashed border-border p-3 text-center">
              <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
              <div className="mt-1.5 text-xs font-medium">Drop files here</div>
              <div className="text-[11px] text-muted-foreground">or click Upload</div>
            </div>
          </aside>

          <div>
            {view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {rows.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className={`surface-card overflow-hidden text-left transition ${selected.id === m.id ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-2">
                      <div className="truncate text-xs font-medium">{m.name}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">{m.size} · {m.dimensions}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="surface-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-muted-foreground text-left">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">File</th>
                      <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Size</th>
                      <th className="hidden md:table-cell px-3 py-2.5 font-medium">Uploaded</th>
                      <th className="hidden md:table-cell px-3 py-2.5 font-medium">By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((m) => (
                      <tr key={m.id} onClick={() => setSelected(m)} className={`cursor-pointer hover:bg-muted/30 ${selected.id === m.id ? "bg-primary-soft/40" : ""}`}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <img src={m.url} alt="" className="h-9 w-12 rounded object-cover" />
                            <div>
                              <div className="text-sm font-medium">{m.name}</div>
                              <div className="text-xs text-muted-foreground">{m.dimensions}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 py-2.5 text-xs text-muted-foreground">{m.size}</td>
                        <td className="hidden md:table-cell px-3 py-2.5 text-xs text-muted-foreground">{m.uploadedAt}</td>
                        <td className="hidden md:table-cell px-3 py-2.5 text-xs">{authorById(m.uploader).name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside className="surface-card overflow-hidden">
            <div className="aspect-video overflow-hidden bg-muted">
              <img src={selected.url} alt={selected.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="mono-label">File</div>
                <div className="text-sm font-medium truncate">{selected.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="mono-label">Size</div>
                  <div>{selected.size}</div>
                </div>
                <div>
                  <div className="mono-label">Dimensions</div>
                  <div>{selected.dimensions}</div>
                </div>
                <div>
                  <div className="mono-label">Uploaded</div>
                  <div>{selected.uploadedAt}</div>
                </div>
                <div>
                  <div className="mono-label">By</div>
                  <div>{authorById(selected.uploader).name}</div>
                </div>
              </div>
              <label className="block space-y-1">
                <div className="mono-label">Alt text</div>
                <textarea rows={2} className="w-full rounded-md border border-border bg-card p-2 text-sm" defaultValue="Fresh microgreens harvest in tray" />
              </label>
              <label className="block space-y-1">
                <div className="mono-label">Caption</div>
                <input className="w-full h-9 rounded-md border border-border bg-card px-2.5 text-sm" defaultValue="" />
              </label>
              <label className="block space-y-1">
                <div className="mono-label">Credit</div>
                <input className="w-full h-9 rounded-md border border-border bg-card px-2.5 text-sm" defaultValue="FIRMA Studio" />
              </label>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 h-9 rounded-md border border-border bg-card text-sm hover:bg-muted">Replace</button>
                <button className="flex-1 h-9 rounded-md bg-destructive text-destructive-foreground text-sm">Delete</button>
              </div>
            </div>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
