import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  incidents: "Incidents",
  monitoring: "Monitoring",
  alerts: "Alert Center",
  infrastructure: "Infrastructure",
  assets: "Assets",
  services: "Services",
  automation: "Automation",
  playbooks: "Playbooks",
  ai: "AI Workspace",
  knowledge: "Knowledge Base",
  change: "Change Management",
  audit: "Audit",
  compliance: "Compliance",
  reports: "Reports",
  identity: "Identity & Access",
  admin: "Administration",
  developer: "Developer Hub",
  settings: "Settings",
};

export function Breadcrumbs({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground"
        aria-label="Home"
      >
        <Home className="h-3 w-3" />
      </Link>
      {parts.map((p, i) => {
        const label = LABELS[p] ?? p;
        const isLast = i === parts.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            <span className={isLast ? "text-foreground" : ""}>{label}</span>
          </span>
        );
      })}
    </nav>
  );
}
