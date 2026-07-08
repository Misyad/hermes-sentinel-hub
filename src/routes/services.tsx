import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Panel";
import { getServices } from "@/services";
import type { Service } from "@/types";
import { mockServiceMetrics } from "@/mock";
import { RefreshCw, Box, Activity, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Hermes" },
      { name: "description", content: "Service catalog with health and performance metrics." },
    ],
  }),
  component: ServicesPage,
});

type ServiceStatus = "all" | "healthy" | "degraded" | "critical" | "offline";
type ViewMode = "grid" | "list";

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ServiceStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Filter services
  const filteredServices = useMemo(() => {
    if (statusFilter === "all") return services;
    return services.filter((s) => s.status === statusFilter);
  }, [services, statusFilter]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader
        eyebrow="platform"
        title="Services"
        description="Service catalog with health and performance metrics"
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
          label="Total Services"
          value={mockServiceMetrics.totalServices}
          delta=""
          deltaTone="neutral"
        />
        <Metric
          label="Healthy"
          value={mockServiceMetrics.healthyServices}
          delta=""
          deltaTone="positive"
        />
        <Metric
          label="Degraded"
          value={mockServiceMetrics.degradedServices}
          delta=""
          deltaTone="negative"
        />
        <Metric
          label="Critical"
          value={mockServiceMetrics.criticalServices}
          delta=""
          deltaTone="negative"
        />
        <Metric
          label="Avg Uptime"
          value={`${mockServiceMetrics.avgUptime}%`}
          delta=""
          deltaTone="neutral"
        />
        <Metric
          label="Avg Latency"
          value={`${mockServiceMetrics.avgLatency}ms`}
          delta=""
          deltaTone="neutral"
        />
      </div>

      {/* Filters & Service Grid/List */}
      <Panel
        title="Services"
        action={
          <span className="font-mono text-[10.5px] text-muted-foreground">
            {filteredServices.length} of {services.length}
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                status:
              </span>
              {(["all", "healthy", "degraded", "critical"] as ServiceStatus[]).map((status) => (
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <button
                onClick={() => setViewMode("grid")}
                className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                list
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <Box className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No services match your filters</p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col gap-2 border-2 border-border-strong bg-surface p-3 transition-all hover:-translate-y-0.5 hover:shadow-brutal-sm"
                >
                  {/* Service Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {service.name}
                    </span>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        service.status === "healthy"
                          ? "bg-healthy"
                          : service.status === "degraded"
                            ? "bg-warning"
                            : service.status === "critical"
                              ? "bg-critical"
                              : "bg-zinc-600"
                      }`}
                    />
                  </div>

                  {/* Service Metrics */}
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uptime</span>
                      <span
                        className={`font-mono ${
                          service.uptime >= 99.9
                            ? "text-healthy"
                            : service.uptime >= 99.0
                              ? "text-warning"
                              : "text-critical"
                        }`}
                      >
                        {service.uptime}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latency</span>
                      <span
                        className={`font-mono ${
                          service.latency < 100
                            ? "text-healthy"
                            : service.latency < 500
                              ? "text-warning"
                              : "text-critical"
                        }`}
                      >
                        {service.latency}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span
                        className={`font-mono ${
                          service.errorRate < 1.0
                            ? "text-healthy"
                            : service.errorRate < 3.0
                              ? "text-warning"
                              : "text-critical"
                        }`}
                      >
                        {service.errorRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Req/s</span>
                      <span className="font-mono text-foreground">
                        {service.requestsPerSec.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="flex flex-col gap-2">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col gap-3 border-2 border-border-strong bg-surface p-3 transition-all hover:bg-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Service Name & Status */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        service.status === "healthy"
                          ? "bg-healthy"
                          : service.status === "degraded"
                            ? "bg-warning"
                            : service.status === "critical"
                              ? "bg-critical"
                              : "bg-zinc-600"
                      }`}
                    />
                    <span className="font-mono text-sm font-medium text-foreground">
                      {service.name}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex flex-wrap gap-4 text-xs sm:gap-6">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Uptime</span>
                      <span
                        className={`font-mono font-medium ${
                          service.uptime >= 99.9
                            ? "text-healthy"
                            : service.uptime >= 99.0
                              ? "text-warning"
                              : "text-critical"
                        }`}
                      >
                        {service.uptime}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Latency</span>
                      <span
                        className={`font-mono font-medium ${
                          service.latency < 100
                            ? "text-healthy"
                            : service.latency < 500
                              ? "text-warning"
                              : "text-critical"
                        }`}
                      >
                        {service.latency}ms
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Errors</span>
                      <span
                        className={`font-mono font-medium ${
                          service.errorRate < 1.0
                            ? "text-healthy"
                            : service.errorRate < 3.0
                              ? "text-warning"
                              : "text-critical"
                        }`}
                      >
                        {service.errorRate}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Box className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Req/s</span>
                      <span className="font-mono font-medium text-foreground">
                        {service.requestsPerSec.toLocaleString()}
                      </span>
                    </div>
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
