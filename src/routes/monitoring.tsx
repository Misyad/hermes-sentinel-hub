import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";
import { RefreshCw, Filter } from "lucide-react";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Monitoring — Hermes" },
      { name: "description", content: "Metrics, logs, traces, and live infrastructure health." },
    ],
  }),
  component: () => (
    <PlaceholderModule
      eyebrow="observability"
      title="Monitoring"
      description="Unified metrics, logs, traces, and live event stream across every service and cluster."
      actions={
        <>
          <button className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <Filter className="h-3 w-3" /> filters
          </button>
          <button className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-3 w-3" /> 15s
          </button>
        </>
      }
      sections={[
        { title: "Metrics", items: ["Service dashboards", "Custom queries (PromQL)", "SLO panels", "Anomaly detection"] },
        { title: "Logs", items: ["Live tail", "Structured search", "Log volumes", "Field extraction"] },
        { title: "Traces", items: ["Trace search", "Service map", "Waterfall inspector", "Sampling rules"] },
        { title: "Infrastructure Health", items: ["Cluster overview", "Node saturation", "Control plane events", "Capacity forecast"] },
        { title: "Live Event Stream", items: ["Deploys", "Alerts", "Kubernetes events", "Audit events"] },
        { title: "Alert Center", items: ["Firing alerts", "Silences", "Routing tree", "Escalations"] },
      ]}
    />
  ),
});
