import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Panel";
import { mockNodes, mockInfrastructureMetrics } from "@/mock";
import { RefreshCw, Server, Database, Cpu, HardDrive } from "lucide-react";

export const Route = createFileRoute("/infrastructure")({
  head: () => ({
    meta: [
      { title: "Infrastructure — Hermes" },
      { name: "description", content: "Infrastructure nodes, resources, and capacity." },
    ],
  }),
  component: InfrastructurePage,
});

type NodeType = "all" | "controller" | "worker" | "database" | "cache";
type NodeStatus = "all" | "healthy" | "degraded" | "critical" | "offline";

function InfrastructurePage() {
  const [typeFilter, setTypeFilter] = useState<NodeType>("all");
  const [statusFilter, setStatusFilter] = useState<NodeStatus>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Filter nodes
  const filteredNodes = useMemo(() => {
    let filtered = mockNodes;

    if (typeFilter !== "all") {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((n) => n.status === statusFilter);
    }

    return filtered;
  }, [typeFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader
        eyebrow="infrastructure"
        title="Infrastructure"
        description="Infrastructure nodes, resources, and capacity"
        actions={
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            refresh
          </button>
        }
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric
          label="Total Nodes"
          value={mockInfrastructureMetrics.totalNodes}
          delta=""
          deltaTone="neutral"
        />
        <Metric
          label="Healthy"
          value={mockInfrastructureMetrics.healthyNodes}
          delta=""
          deltaTone="positive"
        />
        <Metric
          label="Degraded"
          value={mockInfrastructureMetrics.degradedNodes}
          delta=""
          deltaTone="negative"
        />
        <Metric
          label="Critical"
          value={mockInfrastructureMetrics.criticalNodes}
          delta=""
          deltaTone="negative"
        />
        <Metric
          label="Offline"
          value={mockInfrastructureMetrics.offlineNodes}
          delta=""
          deltaTone="negative"
        />
        <Metric
          label="Avg CPU"
          value={`${mockInfrastructureMetrics.avgCpu}%`}
          delta=""
          deltaTone="neutral"
        />
      </div>

      {/* Filters & Node Grid */}
      <Panel
        title="Nodes"
        action={
          <span className="font-mono text-[10.5px] text-muted-foreground">
            {filteredNodes.length} of {mockNodes.length}
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                type:
              </span>
              {(["all", "controller", "worker", "database", "cache"] as NodeType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    typeFilter === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                status:
              </span>
              {(["all", "healthy", "degraded", "critical", "offline"] as NodeStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Node Grid */}
          {filteredNodes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <Server className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No nodes match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex flex-col gap-3 border-2 border-border-strong bg-surface p-3 transition-all hover:-translate-y-0.5 hover:shadow-brutal-sm"
                >
                  {/* Node Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {node.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                          {node.type}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {node.region}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        node.status === "healthy"
                          ? "bg-healthy"
                          : node.status === "degraded"
                            ? "bg-warning"
                            : node.status === "critical"
                              ? "bg-critical"
                              : "bg-zinc-600"
                      }`}
                    />
                  </div>

                  {/* Node Metrics */}
                  <div className="flex flex-col gap-2">
                    {/* CPU */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Cpu className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">CPU</span>
                        </div>
                        <span
                          className={`font-mono font-medium ${
                            node.cpu > 90
                              ? "text-critical"
                              : node.cpu > 75
                                ? "text-warning"
                                : "text-foreground"
                          }`}
                        >
                          {node.cpu}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800">
                        <div
                          className={`h-full transition-all ${
                            node.cpu > 90
                              ? "bg-critical"
                              : node.cpu > 75
                                ? "bg-warning"
                                : "bg-healthy"
                          }`}
                          style={{ width: `${node.cpu}%` }}
                        />
                      </div>
                    </div>

                    {/* Memory */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Database className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Memory</span>
                        </div>
                        <span
                          className={`font-mono font-medium ${
                            node.memory > 90
                              ? "text-critical"
                              : node.memory > 80
                                ? "text-warning"
                                : "text-foreground"
                          }`}
                        >
                          {node.memory}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800">
                        <div
                          className={`h-full transition-all ${
                            node.memory > 90
                              ? "bg-critical"
                              : node.memory > 80
                                ? "bg-warning"
                                : "bg-info"
                          }`}
                          style={{ width: `${node.memory}%` }}
                        />
                      </div>
                    </div>

                    {/* Disk */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Disk</span>
                        </div>
                        <span
                          className={`font-mono font-medium ${
                            node.disk > 85
                              ? "text-critical"
                              : node.disk > 75
                                ? "text-warning"
                                : "text-foreground"
                          }`}
                        >
                          {node.disk}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800">
                        <div
                          className={`h-full transition-all ${
                            node.disk > 85
                              ? "bg-critical"
                              : node.disk > 75
                                ? "bg-warning"
                                : "bg-healthy"
                          }`}
                          style={{ width: `${node.disk}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Uptime */}
                  <div className="flex items-center justify-between border-t border-border-strong pt-2 text-xs">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-mono text-foreground">{node.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
