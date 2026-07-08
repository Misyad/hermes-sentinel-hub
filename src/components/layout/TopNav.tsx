import { Search, Bell, User, Star, Plus, GitBranch, LogOut, ChevronDown } from "lucide-react";
import { useCommandPalette } from "../command/CommandPaletteProvider";
import { useRouterState, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "./Breadcrumbs";
import { useState } from "react";
import { useAuth, useUser } from "@/hooks/useAuth";
import { ROLE_METADATA } from "@/types/auth";

export function TopNav() {
  const { open } = useCommandPalette();
  const { logout, isAuthenticated } = useAuth();
  const user = useUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [notifOpen, setNotifOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  async function handleLogout() {
    setShowProfileMenu(false);
    await logout();
  }

  // If not authenticated, show minimal nav
  if (!isAuthenticated || !user) {
    return (
      <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b-2 border-border bg-background px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center border-2 border-primary bg-primary/10">
            <span className="font-mono text-xs font-bold text-primary">H</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Hermes Sentinel Hub</span>
        </div>
      </header>
    );
  }

  const roleMetadata = ROLE_METADATA[user.role];

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

      {/* Profile Menu */}
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex h-8 items-center gap-1.5 border-2 border-border bg-surface px-2 text-[11px] transition-colors hover:border-border-strong"
        >
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden text-foreground md:inline">{user.name.split(' ')[0]}</span>
          <span className={`hidden font-medium ${roleMetadata.color} md:inline`}>({roleMetadata.label})</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        {showProfileMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileMenu(false)}
            />
            <div className="absolute right-0 top-9 z-50 w-72 border-2 border-border-strong bg-popover shadow-[4px_4px_0_0_hsl(0_0_0_/_0.6)]">
              {/* User Info */}
              <div className="border-b-2 border-border p-3">
                <div className="flex items-start gap-2">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-1">
                      <span className={`text-[10px] font-medium ${roleMetadata.color}`}>
                        {roleMetadata.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 border-2 border-transparent px-2 py-1.5 text-[12px] text-foreground transition-colors hover:border-border hover:bg-muted"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

const NOTIFS = [
  {
    id: 1,
    sev: "critical",
    title: "Database CPU threshold exceeded",
    body: "prod-db-01 at 94% CPU for 5 minutes",
    time: "2m ago",
  },
  {
    id: 2,
    sev: "warning",
    title: "Deployment completed with warnings",
    body: "api-gateway@v2.14.1 deployed to prod",
    time: "15m ago",
  },
  {
    id: 3,
    sev: "info",
    title: "Weekly infrastructure report ready",
    body: "Review capacity planning recommendations",
    time: "1h ago",
  },
];
