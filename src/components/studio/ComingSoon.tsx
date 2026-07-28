import type { ReactNode } from "react";

export function ComingSoon({
  title = "Coming Soon",
  description = "This module is part of the FIRMA Studio roadmap and will be available in a future release.",
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="surface-card mx-auto max-w-2xl p-12 text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {title}
      </div>
      <h2 className="h-display mt-4 text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
