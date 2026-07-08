import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Panel";
import { getMonitoringMetrics, getServiceHealth } from "@/services";
import type { Metric as MetricType, ServiceHealth } from "@/types";
import {
  mockCpuTimeSeries,
  mockMemoryTimeSeries,
  mockNetworkTimeSeries,
  mockErrorRateTimeSeries,
  mockActiveAlerts,
} from "@/mock";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Monitoring — Hermes" },
      { name: "description", content: "Real-time platform metrics and service health." },
    ],
  }),
  component: MonitoringPage,
});

type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d";

function MonitoringPage() {
  const [metrics, setMetrics] = useState<MetricType[]>([]);
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    Promise.all([getMonitoringMetrics(), getServiceHealth()]).then(([metricsData, servicesData]) => {
      setMetrics(metricsData);
      setServices(servicesData);
      setLoading(false);
    });
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Format timestamp for charts (HH:MM)
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader
        eyebrow="observability"
        title="Monitoring"
        description="Real-time platform metrics and service health"
        actions={
          <div className="flex gap-2">
            {/* Time Range Selector */}
            <div className="flex border-2 border-border-strong">
              {(["1h", "6h", "24h", "7d", "30d"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`h-8 w-12 font-mono text-[10.5px] uppercase tracking-widest transition-colors ${
                    timeRange === range
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
              refresh
            </button>
          </div>
        }
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <Metric
            key={i}
            label={metric.label}
            value={`${metric.value}${metric.unit || ""}`}
            delta={metric.delta}
            deltaTone={metric.deltaTone}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CPU Usage Chart */}
        <Panel title="CPU Usage" action={<span className="font-mono text-[10.5px] text-muted-foreground">AVG: 67.4%</span>}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockCpuTimeSeries.map((d) => ({ t: formatTime(d.timestamp), value: d.value }))}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.29 0.006 286)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.006 285.9)",
                    border: "2px solid oklch(0.36 0.006 286)",
                    borderRadius: "4px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "oklch(0.98 0 0)" }}
                  itemStyle={{ color: "oklch(0.696 0.17 162.48)" }}
                />
                <Area type="monotone" dataKey="value" stroke="oklch(0.696 0.17 162.48)" strokeWidth={1.5} fill="url(#cpuGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Memory Usage Chart */}
        <Panel title="Memory Usage" action={<span className="font-mono text-[10.5px] text-muted-foreground">AVG: 82.1%</span>}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMemoryTimeSeries.map((d) => ({ t: formatTime(d.timestamp), value: d.value }))}>
                <defs>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.764 0.184 194.77)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.764 0.184 194.77)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.29 0.006 286)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.006 285.9)",
                    border: "2px solid oklch(0.36 0.006 286)",
                    borderRadius: "4px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "oklch(0.98 0 0)" }}
                  itemStyle={{ color: "oklch(0.764 0.184 194.77)" }}
                />
                <Area type="monotone" dataKey="value" stroke="oklch(0.764 0.184 194.77)" strokeWidth={1.5} fill="url(#memGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Network & Error Rate Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Network I/O" action={<span className="font-mono text-[10.5px] text-muted-foreground">AVG: 245 Mbps</span>}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockNetworkTimeSeries.map((d) => ({ t: formatTime(d.timestamp), value: d.value }))}>
                <CartesianGrid stroke="oklch(0.29 0.006 286)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.006 285.9)",
                    border: "2px solid oklch(0.36 0.006 286)",
                    borderRadius: "4px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "oklch(0.98 0 0)" }}
                  itemStyle={{ color: "oklch(0.696 0.17 162.48)" }}
                />
                <Line type="monotone" dataKey="value" stroke="oklch(0.696 0.17 162.48)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Error Rate" action={<span className="font-mono text-[10.5px] text-muted-foreground">AVG: 0.34%</span>}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockErrorRateTimeSeries.map((d) => ({ t: formatTime(d.timestamp), value: d.value }))}>
                <CartesianGrid stroke="oklch(0.29 0.006 286)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "oklch(0.68 0.01 286)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(0.36 0.006 286)" }}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.006 285.9)",
                    border: "2px solid oklch(0.36 0.006 286)",
                    borderRadius: "4px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "oklch(0.98 0 0)" }}
                  itemStyle={{ color: "oklch(0.703 0.221 29.23)" }}
                />
                <Line type="monotone" dataKey="value" stroke="oklch(0.703 0.221 29.23)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Active Alerts (if any) */}
      {mockActiveAlerts.length > 0 && (
        <Panel
          title="Active Alerts"
          action={
            <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-critical">
              <AlertTriangle className="h-3 w-3" />
              {mockActiveAlerts.length} firing
            </span>
          }
        >
          <div className="flex flex-col gap-2">
            {mockActiveAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between border-l-2 border-critical bg-surface p-3 transition-colors hover:bg-zinc-800"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                        alert.severity === "critical"
                          ? "bg-critical text-white"
                          : alert.severity === "high"
                            ? "bg-warning text-zinc-900"
                            : "bg-info text-white"
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-sm font-medium text-foreground">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">{alert.service}</span>
                    <span>•</span>
                    <span className="font-mono">{alert.duration}</span>
                  </div>
                </div>
                <button className="h-8 border-2 border-border-strong bg-surface px-3 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  view
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Service Health Grid */}
      <Panel title="Service Health" action={<span className="font-mono text-[10.5px] text-muted-foreground">{services.length} services</span>}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-2 border-2 border-border-strong bg-surface p-3 transition-all hover:-translate-y-0.5 hover:shadow-brutal-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-foreground">{service.name}</span>
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
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-mono text-foreground">{service.uptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-mono text-foreground">{service.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className="font-mono text-foreground">{service.errorRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Req/s</span>
                  <span className="font-mono text-foreground">{service.requestsPerSec.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
