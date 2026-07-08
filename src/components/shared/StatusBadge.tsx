import { cn } from "@/lib/utils";

type Status =
  | "healthy"
  | "warning"
  | "critical"
  | "info"
  | "unknown"
  | "resolved"
  | "open"
  | "acknowledged"
  | "investigating"
  | "mitigated";

const MAP: Record<Status, { dot: string; text: string; label?: string }> = {
  healthy: { dot: "bg-healthy", text: "text-healthy" },
  warning: { dot: "bg-warning", text: "text-warning" },
  critical: { dot: "bg-critical", text: "text-critical" },
  info: { dot: "bg-info", text: "text-info" },
  unknown: { dot: "bg-unknown", text: "text-muted-foreground" },
  resolved: { dot: "bg-healthy", text: "text-healthy" },
  open: { dot: "bg-critical", text: "text-critical" },
  acknowledged: { dot: "bg-warning", text: "text-warning" },
  investigating: { dot: "bg-info", text: "text-info" },
  mitigated: { dot: "bg-warning", text: "text-warning" },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const cfg = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
        cfg.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5", cfg.dot)} />
      {label ?? status}
    </span>
  );
}

export function SevPill({ sev }: { sev: "SEV1" | "SEV2" | "SEV3" | "SEV4" }) {
  const color =
    sev === "SEV1"
      ? "border-critical text-critical"
      : sev === "SEV2"
        ? "border-warning text-warning"
        : sev === "SEV3"
          ? "border-info text-info"
          : "border-border-strong text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 px-1.5 py-0 font-mono text-[10px] font-bold tracking-widest",
        color,
      )}
    >
      {sev}
    </span>
  );
}
