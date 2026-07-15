import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertOctagon,
  Play,
  Pause,
  RefreshCw,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel, Metric } from "@/components/shared/Panel";
import { StatusBadge, SevPill } from "@/components/shared/StatusBadge";
import { AIPanel } from "@/components/shared/AIPanel";
import { api, type InfrastructureStatus, type ContainersStatus } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Hermes Control Center" },
      {
        name: "description",
        content:
          "Live platform reliability overview: incidents, alerts, SLO burn, deployments, automation health, and AI recommendations.",
      },
    ],
  }),
  component: Dashboard,
});

const errorSeries = Array.from({ length: 48 }, (_, i) => ({
  t: i,
  err: 0.1 + Math.sin(i / 3) * 0.15 + (i > 34 ? (i - 34) * 0.35 : 0),
  base: 0.14,
}));

const latencySeries = Array.from({ length: 48 }, (_, i) => ({
  t: i,
  p50: 80 + Math.sin(i / 4) * 8,
  p95: 220 + Math.cos(i / 5) * 40 + (i > 38 ? (i - 38) * 60 : 0),
  p99: 380 + Math.cos(i / 4) * 70 + (i > 38 ? (i - 38) * 120 : 0),
}));

const deployBars = Array.from({ length: 14 }, (_, i) => ({
  d: `d${i}`,
  ok: 4 + Math.round(Math.random() * 6),
  fail: Math.random() > 0.8 ? Math.round(Math.random() * 2) + 1 : 0,
}));

function Dashboard() {
  const [infraData, setInfraData] = useState<InfrastructureStatus | null>(null);
  const [containersData, setContainersData] = useState<ContainersStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [infra, containers] = await Promise.all([
          api.getInfrastructureStatus(),
          api.getContainersStatus(),
        ]);
        setInfraData(infra);
        setContainersData(containers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="operations · production · us-east-1"
        title="Platform Overview"
        description="Real-time reliability posture across services, infrastructure, and automation. Updated every 15 seconds."
        actions={
          <>
            <button className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-3 w-3" />
              15s
            </button>
            <button className="flex h-8 items-center gap-1.5 border-2 border-primary bg-primary px-3 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              <Zap className="h-3 w-3" />
              declare incident
            </button>
          </>
        }
      />

      <div className="grid gap-3 p-4 md:p-6">
        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          <Metric
            label="Platform Health"
            value="97.4"
            suffix="%"
            delta="▲ 0.2 vs 7d"
            deltaTone="up"
          />
          <Metric
            label="Open Incidents"
            value={<span className="text-critical">3</span>}
            delta="1 SEV1 · 2 SEV2"
            deltaTone="down"
          />
          <Metric
            label="MTTR (30d)"
            value="42"
            suffix="min"
            delta="▼ 18% vs prev"
            deltaTone="up"
          />
          <Metric
            label="SLO Budget"
            value={<span className="text-warning">62</span>}
            suffix="%"
            delta="burn 14x last 1h"
            deltaTone="down"
          />
          <Metric
            label="Deploys / 24h"
            value="47"
            delta="94% success"
            deltaTone="muted"
          />
          <Metric
            label="Cloud Spend"
            value="$18.4k"
            delta="▲ 3% forecast"
            deltaTone="down"
          />
        </div>

        {/* Row: charts */}
        <div className="grid gap-3 lg:grid-cols-3">
          <Panel
            title="Error rate · api-gateway"
            action={
              <span className="font-mono text-[10px] text-critical">
                +12σ anomaly
              </span>
            }
            className="lg:col-span-2"
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorSeries}>
                  <defs>
                    <linearGradient id="errFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="oklch(0.65 0.23 25)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="oklch(0.65 0.23 25)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="oklch(0.29 0.006 286)"
                    strokeDasharray="2 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="t"
                    tick={{
                      fill: "oklch(0.68 0.01 286)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={{ stroke: "oklch(0.29 0.006 286)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "oklch(0.68 0.01 286)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.21 0.006 285.9)",
                      border: "2px solid oklch(0.36 0.006 286)",
                      borderRadius: 2,
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="err"
                    stroke="oklch(0.65 0.23 25)"
                    strokeWidth={1.5}
                    fill="url(#errFill)"
                  />
                  <Line
                    type="monotone"
                    dataKey="base"
                    stroke="oklch(0.55 0.01 286)"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Latency percentiles · edge">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencySeries}>
                  <CartesianGrid
                    stroke="oklch(0.29 0.006 286)"
                    strokeDasharray="2 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="t"
                    tick={{
                      fill: "oklch(0.68 0.01 286)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={{ stroke: "oklch(0.29 0.006 286)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "oklch(0.68 0.01 286)",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.21 0.006 285.9)",
                      border: "2px solid oklch(0.36 0.006 286)",
                      borderRadius: 2,
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    stroke="oklch(0.72 0.17 162.48)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="p95"
                    stroke="oklch(0.65 0.18 245)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="p99"
                    stroke="oklch(0.78 0.17 78)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1 text-healthy">
                <span className="h-1.5 w-3 bg-healthy" /> p50 82ms
              </span>
              <span className="flex items-center gap-1 text-info">
                <span className="h-1.5 w-3 bg-info" /> p95 264ms
              </span>
              <span className="flex items-center gap-1 text-warning">
                <span className="h-1.5 w-3 bg-warning" /> p99 621ms
              </span>
            </div>
          </Panel>
        </div>

        {/* Row: incidents + infra + deployments */}
        <div className="grid gap-3 lg:grid-cols-3">
          <Panel title="Open Incidents" dense>
            <table className="w-full text-[12px]">
              <thead>
                <tr className="hairline-b bg-background/40 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-3 py-1.5">id</th>
                  <th className="px-2 py-1.5">sev</th>
                  <th className="px-2 py-1.5">title</th>
                  <th className="px-2 py-1.5">owner</th>
                  <th className="px-2 py-1.5 text-right">age</th>
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map((i) => (
                  <tr
                    key={i.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted"
                  >
                    <td className="px-3 py-1.5 font-mono text-[11px] text-foreground">
                      {i.id}
                    </td>
                    <td className="px-2 py-1.5">
                      <SevPill sev={i.sev} />
                    </td>
                    <td className="max-w-[16rem] truncate px-2 py-1.5 text-foreground">
                      {i.title}
                    </td>
                    <td className="px-2 py-1.5 font-mono text-[11px] text-muted-foreground">
                      {i.owner}
                    </td>
                    <td className="px-2 py-1.5 text-right font-mono text-[11px] text-muted-foreground">
                      {i.age}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Infrastructure Status" dense>
            <ul className="divide-y divide-border">
              {INFRA.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between px-3 py-1.5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-medium text-foreground">
                      {s.name}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {s.region} · {s.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {s.usage}
                    </span>
                    <StatusBadge status={s.status} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Deploys (14d)">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deployBars}>
                  <CartesianGrid
                    stroke="oklch(0.29 0.006 286)"
                    strokeDasharray="2 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="d"
                    tick={{
                      fill: "oklch(0.68 0.01 286)",
                      fontSize: 9,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={{ stroke: "oklch(0.29 0.006 286)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "oklch(0.68 0.01 286)",
                      fontSize: 9,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={22}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.21 0.006 285.9)",
                      border: "2px solid oklch(0.36 0.006 286)",
                      borderRadius: 2,
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                    }}
                  />
                  <Bar dataKey="ok" stackId="a" fill="oklch(0.72 0.17 162.48)" />
                  <Bar dataKey="fail" stackId="a" fill="oklch(0.65 0.23 25)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-widest">
              <div>
                <div className="text-muted-foreground">success</div>
                <div className="mt-0.5 text-sm font-bold text-healthy">94%</div>
              </div>
              <div>
                <div className="text-muted-foreground">rolled back</div>
                <div className="mt-0.5 text-sm font-bold text-warning">3</div>
              </div>
              <div>
                <div className="text-muted-foreground">lead time</div>
                <div className="mt-0.5 text-sm font-bold text-foreground">
                  1.2h
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Row: AI + Timeline + Automation */}
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AIPanel />
          </div>
          <Panel title="Recent Changes" dense>
            <ol className="relative divide-y divide-border">
              {TIMELINE.map((e) => (
                <li key={e.id} className="flex gap-3 px-3 py-2">
                  <span
                    className={
                      "mt-1 inline-block h-2 w-2 shrink-0 " +
                      (e.kind === "deploy"
                        ? "bg-info"
                        : e.kind === "incident"
                          ? "bg-critical"
                          : e.kind === "change"
                            ? "bg-warning"
                            : "bg-healthy")
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-foreground">
                      {e.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>{e.who}</span>
                      <span>·</span>
                      <span>{e.time}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        {/* Row: automation + SLO + risk */}
        <div className="grid gap-3 lg:grid-cols-3">
          <Panel
            title="Automation Jobs"
            action={
              <button className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                view queue
              </button>
            }
            dense
          >
            <ul className="divide-y divide-border">
              {AUTOMATION.map((j) => (
                <li
                  key={j.id}
                  className="flex items-center gap-2 px-3 py-1.5 text-[12px]"
                >
                  {j.status === "running" ? (
                    <Play className="h-3 w-3 text-info" />
                  ) : j.status === "paused" ? (
                    <Pause className="h-3 w-3 text-warning" />
                  ) : j.status === "failed" ? (
                    <AlertOctagon className="h-3 w-3 text-critical" />
                  ) : (
                    <span className="h-2 w-2 bg-healthy" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{j.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {j.duration}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="SLO Compliance">
            <ul className="space-y-2">
              {SLOS.map((s) => (
                <li key={s.name}>
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {s.actual}% / {s.target}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full bg-muted">
                    <div
                      className={
                        "h-full " +
                        (s.actual >= s.target
                          ? "bg-healthy"
                          : s.actual >= s.target - 0.5
                            ? "bg-warning"
                            : "bg-critical")
                      }
                      style={{ width: `${Math.min(100, s.actual)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Risk & Cost">
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  k: "risk score",
                  v: "34",
                  tone: "text-warning",
                  d: "▲ 4 (24h)",
                },
                {
                  k: "attack surface",
                  v: "128",
                  tone: "text-info",
                  d: "endpoints",
                },
                {
                  k: "waste",
                  v: "$412",
                  tone: "text-critical",
                  d: "idle · 7d",
                },
                {
                  k: "savings ready",
                  v: "$1.2k",
                  tone: "text-healthy",
                  d: "3 actions",
                },
              ].map((it) => (
                <div
                  key={it.k}
                  className="border-2 border-border bg-background p-2"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {it.k}
                  </div>
                  <div className={"mt-0.5 font-mono text-lg font-bold " + it.tone}>
                    {it.v}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {it.d}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t-2 border-border pt-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                monthly forecast
              </span>
              <span className="flex items-center gap-1 font-mono text-[12px] font-bold text-foreground">
                $547,821
                <ArrowUpRight className="h-3 w-3 text-warning" />
              </span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

const INCIDENTS = [
  {
    id: "INC-4821",
    sev: "SEV1" as const,
    title: "Elevated 5xx on api-gateway (v2.14.1 rollout)",
    owner: "sre-oncall",
    age: "00:14:22",
  },
  {
    id: "INC-4818",
    sev: "SEV2" as const,
    title: "Kafka lag on billing-events > 12k",
    owner: "data-plat",
    age: "01:42:08",
  },
  {
    id: "INC-4815",
    sev: "SEV2" as const,
    title: "Postgres replica lag us-east-1b",
    owner: "db-ops",
    age: "03:11:47",
  },
  {
    id: "INC-4802",
    sev: "SEV3" as const,
    title: "Intermittent DNS resolution eu-west",
    owner: "netops",
    age: "18:22:11",
  },
];

const INFRA = [
  {
    name: "eks-prod-01",
    region: "us-east-1",
    type: "kubernetes",
    usage: "82%",
    status: "warning" as const,
  },
  {
    name: "eks-prod-02",
    region: "eu-west-1",
    type: "kubernetes",
    usage: "54%",
    status: "healthy" as const,
  },
  {
    name: "rds-billing",
    region: "us-east-1",
    type: "postgres",
    usage: "71%",
    status: "warning" as const,
  },
  {
    name: "kafka-events",
    region: "us-east-1",
    type: "msk",
    usage: "38%",
    status: "healthy" as const,
  },
  {
    name: "redis-session",
    region: "us-east-1",
    type: "elasticache",
    usage: "22%",
    status: "healthy" as const,
  },
  {
    name: "s3-artifacts",
    region: "global",
    type: "object",
    usage: "18%",
    status: "healthy" as const,
  },
  {
    name: "cf-edge",
    region: "global",
    type: "cdn",
    usage: "—",
    status: "unknown" as const,
  },
];

const TIMELINE = [
  {
    id: "t1",
    kind: "incident",
    title: "INC-4821 declared · api-gateway",
    who: "auto-triage",
    time: "14:04 UTC",
  },
  {
    id: "t2",
    kind: "deploy",
    title: "api-gateway v2.14.1 deployed",
    who: "j.doe",
    time: "14:02 UTC",
  },
  {
    id: "t3",
    kind: "change",
    title: "CHG-2140 approved",
    who: "m.patel",
    time: "13:41 UTC",
  },
  {
    id: "t4",
    kind: "deploy",
    title: "billing-svc v3.9.0 canary 25%",
    who: "cd-pipeline",
    time: "13:22 UTC",
  },
  {
    id: "t5",
    kind: "ok",
    title: "SLO burn recovered · checkout",
    who: "system",
    time: "12:51 UTC",
  },
  {
    id: "t6",
    kind: "change",
    title: "Feature flag `new-cart` @ 50%",
    who: "a.chen",
    time: "12:14 UTC",
  },
];

const AUTOMATION = [
  { id: "a1", name: "rollback-canary · api-gateway", status: "running", duration: "00:02:14" },
  { id: "a2", name: "eks-scale-nodegroup · +2", status: "queued", duration: "—" },
  { id: "a3", name: "cert-renew · *.internal", status: "ok", duration: "00:08:41" },
  { id: "a4", name: "backup-verify · rds-billing", status: "paused", duration: "00:14:02" },
  { id: "a5", name: "runbook-diagnose · kafka-lag", status: "failed", duration: "00:00:47" },
];

const SLOS = [
  { name: "api-gateway.availability", actual: 99.72, target: 99.9 },
  { name: "checkout.p99-latency", actual: 99.4, target: 99.5 },
  { name: "billing-svc.availability", actual: 99.96, target: 99.9 },
  { name: "search.error-rate", actual: 99.88, target: 99.5 },
];

// silence unused import warnings if any
void ArrowDownRight;
