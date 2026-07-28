import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { StatusBadge } from "@/components/studio/StatusBadge";
import { Plus, LifeBuoy, MessageCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center · FIRMA Studio" },
      { name: "description", content: "Manage the customer help center." },
    ],
  }),
  component: HelpPage,
});

const COLLECTIONS = [
  { name: "Getting started", articles: 12, updated: "3d ago" },
  { name: "Billing & subscriptions", articles: 9, updated: "1w ago" },
  { name: "Orders & delivery", articles: 18, updated: "yesterday" },
  { name: "Inventory & stock", articles: 14, updated: "5d ago" },
  { name: "Storefronts", articles: 11, updated: "1w ago" },
  { name: "API & integrations", articles: 22, updated: "2w ago" },
];

const TOP_ARTICLES = [
  { title: "How to import your first crop catalog", views: 4210, helpful: "94%", status: "published" as const },
  { title: "Setting up wholesale routes", views: 3184, helpful: "91%", status: "published" as const },
  { title: "Reconciling stock counts", views: 2890, helpful: "88%", status: "published" as const },
  { title: "Enabling storefront checkout", views: 2150, helpful: "82%", status: "in_review" as const },
];

function HelpPage() {
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
        eyebrow="Publishing · Help Center"
        title="Help Center"
        description="Customer-facing help articles served under firma.farm/help."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> New article
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-3 sm:grid-cols-4">
          <StatCard Icon={LifeBuoy} label="Articles" value="86" />
          <StatCard Icon={MessageCircle} label="Feedback (30d)" value="412" sub="89% helpful" />
          <StatCard Icon={LifeBuoy} label="Searches (30d)" value="12,410" />
          <StatCard Icon={LifeBuoy} label="Zero-result searches" value="184" sub="Action needed" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="surface-card">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Collections</div>
            <ul className="divide-y divide-border">
              {COLLECTIONS.map((c) => (
                <li key={c.name} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer">
                  <div className="text-sm font-medium">{c.name}</div>
                  <span className="text-xs text-muted-foreground">{c.articles} articles · updated {c.updated}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Top articles</div>
            <ul className="divide-y divide-border">
              {TOP_ARTICLES.map((a) => (
                <li key={a.title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {a.views.toLocaleString()} views · {a.helpful} helpful
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageBody>
    </>
  );
}

function StatCard({ Icon, label, value, sub }: { Icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="surface-card p-4">
      <div className="mono-label flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="mt-1.5 h-display text-2xl">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
