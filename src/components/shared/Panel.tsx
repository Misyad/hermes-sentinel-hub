import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  dense,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  dense?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex flex-col border-2 border-border bg-surface",
        className,
      )}
    >
      {title && (
        <header className="flex items-center justify-between gap-2 border-b-2 border-border px-3 py-2">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </div>
          {action && <div className="flex items-center gap-1">{action}</div>}
        </header>
      )}
      <div className={cn(dense ? "p-0" : "p-3", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Metric({
  label,
  value,
  delta,
  deltaTone = "muted",
  suffix,
  mono = true,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: "up" | "down" | "muted" | "positive" | "negative" | "neutral";
  suffix?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col border-2 border-border bg-surface px-3 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "mt-0.5 flex items-baseline gap-1 text-2xl font-bold leading-none text-foreground",
          mono && "font-mono",
        )}
      >
        {value}
        {suffix && (
          <span className="text-[11px] font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {delta && (
        <div
          className={cn(
            "mt-1 font-mono text-[10.5px]",
            (deltaTone === "up" || deltaTone === "positive") && "text-healthy",
            (deltaTone === "down" || deltaTone === "negative") && "text-critical",
            (deltaTone === "muted" || deltaTone === "neutral") && "text-muted-foreground",
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
