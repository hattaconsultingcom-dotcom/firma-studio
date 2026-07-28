import { createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/studio/PageHeader";
import { AUTHORS } from "@/lib/mock";
import { Plus, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team · FIRMA Studio" },
      { name: "description", content: "Members and roles for the Studio workspace." },
    ],
  }),
  component: TeamPage,
});

const ROLES = ["Owner", "Admin", "Editor", "Author", "Reviewer"];

const MEMBERS = [
  { id: "a1", role: "Owner", status: "Active", lastActive: "Just now" },
  { id: "a2", role: "Admin", status: "Active", lastActive: "2h ago" },
  { id: "a3", role: "Editor", status: "Active", lastActive: "Yesterday" },
  { id: "a4", role: "Editor", status: "Active", lastActive: "3h ago" },
  { id: "a5", role: "Reviewer", status: "Invited", lastActive: "—" },
];

function TeamPage() {
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
        eyebrow="System · Team"
        title="Team & roles"
        description="Studio access. Real permissions land with the auth service."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> Invite member
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="surface-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-left">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Member</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 font-medium">Role</th>
                  <th className="hidden md:table-cell px-3 py-2.5 font-medium">Status</th>
                  <th className="hidden md:table-cell px-3 py-2.5 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MEMBERS.map((m) => {
                  const a = AUTHORS.find((x) => x.id === m.id)!;
                  return (
                    <tr key={m.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-medium">{a.initials}</div>
                          <div>
                            <div className="text-sm font-medium">{a.name}</div>
                            <div className="text-xs text-muted-foreground">{a.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-3">
                        <span className="chip">{m.role}</span>
                      </td>
                      <td className="hidden md:table-cell px-3 py-3">
                        <span className={`chip ${m.status === "Active" ? "!bg-success/10 !text-success !border-success/20" : ""}`}>{m.status}</span>
                      </td>
                      <td className="hidden md:table-cell px-3 py-3 text-xs text-muted-foreground">{m.lastActive}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="surface-card p-4">
            <div className="flex items-center gap-2 mono-label"><ShieldCheck className="h-3.5 w-3.5" /> Roles</div>
            <ul className="mt-3 space-y-2">
              {ROLES.map((r) => (
                <li key={r} className="rounded-md border border-border p-2.5">
                  <div className="text-sm font-medium">{r}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {r === "Owner" && "Full access to workspace, billing and destructive actions."}
                    {r === "Admin" && "Manages content, media, SEO and integrations."}
                    {r === "Editor" && "Publishes and schedules across all sections."}
                    {r === "Author" && "Creates drafts and requests review."}
                    {r === "Reviewer" && "Comments and approves without publish rights."}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageBody>
    </>
  );
}
