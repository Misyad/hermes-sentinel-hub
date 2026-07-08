import { Search, Bell, User, Star, Plus, GitBranch } from "lucide-react";
import { useCommandPalette } from "../command/CommandPaletteProvider";
import { useRouterState, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "./Breadcrumbs";
import { useState } from "react";

export function TopNav() {
  const { open } = useCommandPalette();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b-2 border-border bg-background px-3">
      <Breadcrumbs pathname={pathname} />

      <div className="flex-1" />

      {/* Global search / command palette trigger */}
      <button
        onClick={open}
        className="flex h-8 w-72 items-center gap-2 border-2 border-border bg-surface px-2 text-left text-[12px] text-muted-foreground transition-colors hover:border-border-strong"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 truncate">Search or run a command…</span>
        <span className="kbd">⌘</span>
        <span className="kbd">K</span>
      </button>

      <button
        title="Create"
        className="flex h-8 w-8 items-center justify-center border-2 border-border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>

      <Link
        to="/change"
        title="Recent deploy: api-gateway@v2.14.1"
        className="hidden h-8 items-center gap-1.5 border-2 border-border bg-surface px-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground lg:flex"
      >
        <GitBranch className="h-3 w-3" />
        <span className="text-foreground">api-gateway</span>
        <span>@</span>
        <span>v2.14.1</span>
      </Link>

      <button
        title="Favorites"
        className="hidden h-8 w-8 items-center justify-center border-2 border-border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground md:flex"
      >
        <Star className="h-3.5 w-3.5" />
      </button>

      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          title="Notifications"
          className="relative flex h-8 w-8 items-center justify-center border-2 border-border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center border border-background bg-critical px-1 font-mono text-[9px] font-bold text-white">
            3
          </span>
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-9 z-40 w-96 border-2 border-border-strong bg-popover shadow-[4px_4px_0_0_hsl(0_0_0_/_0.6)]">
            <div className="flex items-center justify-between border-b-2 border-border px-3 py-2">
              <div className="text-[12px] font-semibold">Notifications</div>
              <button className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                mark all read
              </button>
            </div>
            <div className="max-h-96 overflow-auto divide-y divide-border">
              {NOTIFS.map((n) => (
                <div key={n.id} className="flex gap-2 p-3 hover:bg-muted">
                  <span
                    className={
                      "mt-1 inline-block h-2 w-2 shrink-0 " +
                      (n.sev === "critical"
                        ? "bg-critical"
                        : n.sev === "warning"
                          ? "bg-warning"
                          : "bg-info")
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-foreground">
                      {n.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {n.body}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {n.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        title="Account"
        className="flex h-8 items-center gap-2 border-2 border-border bg-surface pl-1 pr-2 text-[12px] text-foreground transition-colors hover:border-border-strong"
      >
        <span className="flex h-6 w-6 items-center justify-center border border-border-strong bg-muted font-mono text-[10px] font-bold">
          JD
        </span>
        <span className="hidden font-medium md:inline">j.doe</span>
        <User className="h-3 w-3 text-muted-foreground" />
      </button>
    </header>
  );
}

const NOTIFS = [
  {
    id: "1",
    sev: "critical" as const,
    title: "INC-4821 · Elevated 5xx on api-gateway",
    body: "Error budget burned 12% in the last 30m. Auto-triage assigned to sre-oncall.",
    time: "2 min ago",
  },
  {
    id: "2",
    sev: "warning" as const,
    title: "Node pool saturation · eks-prod-01",
    body: "CPU > 82% across 6/12 nodes. Autoscaler cooldown active.",
    time: "14 min ago",
  },
  {
    id: "3",
    sev: "info" as const,
    title: "Change CHG-2140 approved",
    body: "Rollout of billing-svc@v3.9.0 approved by 2 reviewers.",
    time: "1 hr ago",
  },
];
