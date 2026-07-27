type Props = { iconOnly?: boolean; className?: string };

export function StudioLogo({ iconOnly, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      <div
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
        style={{ background: "linear-gradient(135deg, #1f4a37 0%, #3f8f6b 100%)" }}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4">
          <path
            d="M4 16 L4 4 L16 4 M4 10 L13 10"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="square"
          />
        </svg>
      </div>
      {!iconOnly && (
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-display text-[19px] leading-none tracking-[-0.035em] text-foreground">
            FIRMA
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Studio
          </span>
        </div>
      )}
    </div>
  );
}
