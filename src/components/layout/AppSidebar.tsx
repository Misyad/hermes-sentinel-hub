import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  AlertOctagon,
  Activity,
  Bell,
  Server,
  Boxes,
  Network,
  Workflow,
  BookOpen,
  Sparkles,
  GitPullRequest,
  ShieldCheck,
  FileBarChart2,
  Users,
  Settings,
  Cog,
  TerminalSquare,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    label: "Operate",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Incidents", to: "/incidents", icon: AlertOctagon },
      { label: "Monitoring", to: "/monitoring", icon: Activity },
      { label: "Alert Center", to: "/alerts", icon: Bell },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Overview", to: "/infrastructure", icon: Server },
      { label: "Assets", to: "/assets", icon: Boxes },
      { label: "Services", to: "/services", icon: Network },
    ],
  },
  {
    label: "Automation",
    items: [
      { label: "Automation", to: "/automation", icon: Workflow },
      { label: "Playbooks", to: "/playbooks", icon: BookOpen },
      { label: "AI Workspace", to: "/ai", icon: Sparkles },
      { label: "Knowledge Base", to: "/knowledge", icon: BookOpen },
    ],
  },
  {
    label: "Governance",
    items: [
      { label: "Change Management", to: "/change", icon: GitPullRequest },
      { label: "Audit", to: "/audit", icon: ShieldCheck },
      { label: "Compliance", to: "/compliance", icon: ShieldCheck },
      { label: "Reports", to: "/reports", icon: FileBarChart2 },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Identity & Access", to: "/identity", icon: Users },
      { label: "Administration", to: "/admin", icon: Cog },
      { label: "Developer Hub", to: "/developer", icon: TerminalSquare },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [orgOpen, setOrgOpen] = useState(false);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r-2 border-border bg-sidebar text-sidebar-foreground md:flex">
      {/* Brand */}
      <div className="flex h-12 items-center gap-2 border-b-2 border-border px-3">
        <div className="flex h-6 w-6 items-center justify-center border-2 border-primary bg-primary/10 text-[10px] font-bold text-primary">
          H
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            Hermes
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            control center
          </span>
        </div>
      </div>

      {/* Org / Env switcher */}
      <button
        onClick={() => setOrgOpen((v) => !v)}
        className="mx-2 mt-2 flex items-center justify-between gap-2 border-2 border-border bg-surface px-2 py-1.5 text-left transition-colors hover:border-border-strong"
      >
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold text-foreground">
            Acme / Platform
          </div>
          <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 bg-healthy" />
            production · us-east-1
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {orgOpen && (
        <div className="mx-2 mt-1 border-2 border-border bg-surface text-[11px]">
          {["production", "staging", "dev", "sandbox"].map((env) => (
            <button
              key={env}
              onClick={() => setOrgOpen(false)}
              className="flex w-full items-center gap-2 px-2 py-1.5 font-mono uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5",
                  env === "production" && "bg-healthy",
                  env === "staging" && "bg-info",
                  env === "dev" && "bg-warning",
                  env === "sandbox" && "bg-unknown",
                )}
              />
              {env}
            </button>
          ))}
        </div>
      )}

      {/* Nav */}
      <nav className="mt-2 flex-1 overflow-y-auto px-2 pb-4">
        {NAV.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="mb-1 px-2 font-mono text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.to === "/"
                    ? pathname === "/"
                    : pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2 border-l-2 px-2 py-1.5 text-[12.5px] font-medium transition-colors",
                        active
                          ? "border-primary bg-sidebar-accent text-foreground"
                          : "border-transparent text-sidebar-foreground hover:border-border-strong hover:bg-sidebar-accent hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer status */}
      <div className="border-t-2 border-border px-3 py-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-widest">status</span>
          <span className="flex items-center gap-1 text-healthy">
            <span className="inline-block h-1.5 w-1.5 bg-healthy" /> operational
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-widest">build</span>
          <span>v24.11.3-a3f9c</span>
        </div>
      </div>
    </aside>
  );
}
