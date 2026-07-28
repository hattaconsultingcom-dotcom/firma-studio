import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { Mail, Users, MousePointerClick, Send, Plus } from "lucide-react";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter · FIRMA Studio" },
      { name: "description", content: "Manage the FIRMA newsletter." },
    ],
  }),
  component: NewsletterPage,
});

const ISSUES = [
  { num: 24, title: "Harvest windows and the case for tighter rotations", state: "Draft", sent: null, opens: null, clicks: null },
  { num: 23, title: "Vertical farming energy: the honest math", state: "Sent", sent: "2026-07-11", opens: "42.1%", clicks: "6.3%" },
  { num: 22, title: "Introducing FIRMA Planner 2.0", state: "Sent", sent: "2026-07-02", opens: "48.4%", clicks: "9.1%" },
  { num: 21, title: "Wholesale, refined", state: "Sent", sent: "2026-06-18", opens: "39.7%", clicks: "5.4%" },
];

function NewsletterPage() {
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
        eyebrow="Publishing · Newsletter"
        title="Newsletter"
        description="A twice-monthly briefing for growers, chefs and wholesalers."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> Draft issue
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat Icon={Users} label="Subscribers" value="8,412" sub="+124 this week" />
          <Stat Icon={Mail} label="Avg. open rate" value="43.7%" sub="Last 6 issues" />
          <Stat Icon={MousePointerClick} label="Avg. CTR" value="6.9%" sub="Last 6 issues" />
          <Stat Icon={Send} label="Sent (YTD)" value="14 issues" />
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">Recent issues</div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium">Issue</th>
                <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Status</th>
                <th className="hidden md:table-cell px-3 py-2.5 font-medium">Sent</th>
                <th className="hidden md:table-cell px-3 py-2.5 font-medium text-right">Opens</th>
                <th className="hidden md:table-cell px-3 py-2.5 font-medium text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ISSUES.map((i) => (
                <tr key={i.num} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">#{i.num} · {i.title}</div>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-3">
                    <span className={`chip ${i.state === "Sent" ? "!bg-success/10 !text-success !border-success/20" : ""}`}>{i.state}</span>
                  </td>
                  <td className="hidden md:table-cell px-3 py-3 text-xs text-muted-foreground">{i.sent ?? "—"}</td>
                  <td className="hidden md:table-cell px-3 py-3 text-right font-mono text-xs">{i.opens ?? "—"}</td>
                  <td className="hidden md:table-cell px-3 py-3 text-right font-mono text-xs">{i.clicks ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}

function Stat({ Icon, label, value, sub }: { Icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2 mono-label"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="mt-1.5 h-display text-2xl">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
