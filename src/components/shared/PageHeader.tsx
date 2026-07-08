import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-b-2 border-border bg-background px-4 py-4 md:px-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {eyebrow}
            </div>
          )}
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-3xl text-[12.5px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
