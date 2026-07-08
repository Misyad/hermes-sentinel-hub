import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { SevPill, StatusBadge } from "@/components/shared/StatusBadge";
import { AIPanel } from "@/components/shared/AIPanel";
import {
  ArrowLeft,
  Radio,
  UserPlus,
  MessageSquare,
  FileText,
  Paperclip,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/incidents/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Incident — Hermes` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: IncidentDetail,
});

function IncidentDetail() {
  const { id } = Route.useParams();

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow={`incidents / ${id}`}
        title="Elevated 5xx on api-gateway (v2.14.1 rollout)"
        description="Investigation in progress · sre-oncall · production · us-east-1"

        actions={
          <>
            <button className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <UserPlus className="h-3 w-3" /> assign
            </button>
            <button className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <Radio className="h-3 w-3" /> broadcast
            </button>
            <button className="flex h-8 items-center gap-1.5 border-2 border-primary bg-primary px-3 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              <ShieldAlert className="h-3 w-3" /> mitigate
            </button>
          </>
        }
      >
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SevPill sev="SEV1" />
          <StatusBadge status="investigating" />
          <span className="font-mono text-[11px] text-muted-foreground">
            opened 14:04 UTC · age 00:14:22 · SLA 38m remaining
          </span>
        </div>
      </PageHeader>

      <div className="grid gap-3 p-4 md:p-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Panel title="Timeline" dense>
            <ol className="divide-y divide-border">
              {TIMELINE.map((e) => (
                <li key={e.id} className="grid grid-cols-[110px_1fr] gap-3 px-3 py-2">
                  <div className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
                    {e.time}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium text-foreground">
                      {e.title}
                    </div>
                    {e.detail && (
                      <div className="mt-0.5 text-[12px] text-muted-foreground">
                        {e.detail}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Root Cause Analysis" dense>
            <div className="grid grid-cols-2 gap-0 divide-x divide-border border-b-2 border-border">
              {[
                ["hypothesis", "Bad deploy · v2.14.1"],
                ["confidence", "92%"],
                ["blast radius", "api-gateway, checkout, billing"],
                ["error budget", "62% remaining"],
              ].map(([k, v]) => (
                <div key={k} className="p-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </div>
                  <div className="mt-0.5 text-[13px] font-medium text-foreground">
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <p className="p-3 text-[12.5px] leading-relaxed text-muted-foreground">
              A regression in the request retry loop introduced in commit{" "}
              <code className="font-mono text-foreground">a3f9c21</code> caused
              excessive backend fanout when the upstream returned 503. The
              retry-storm saturated the connection pool on{" "}
              <code className="font-mono text-foreground">billing-svc</code>,
              cascading to <code className="font-mono text-foreground">checkout</code>.
            </p>
          </Panel>

          <Panel title="Postmortem draft" dense>
            <div className="border-l-2 border-primary bg-background p-3 text-[12.5px] leading-relaxed text-muted-foreground">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                AI-generated draft · edit before publish
              </div>
              At 14:02 UTC, the api-gateway v2.14.1 rollout began. Within 90 seconds,
              5xx error rates rose from a baseline of 0.14% to 3.8%. On-call was paged
              via automatic burn-rate alerting. Mitigation via rollback playbook is in
              progress. Blameless retrospective scheduled for T+24h.
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Details" dense>
            <dl className="divide-y divide-border text-[12px]">
              {[
                ["Service", "api-gateway"],
                ["Environment", "production"],
                ["Region", "us-east-1"],
                ["Detected by", "burn-rate alert"],
                ["Runbook", "rb/api-gateway-5xx"],
                ["Change", "CHG-2140"],
                ["Deploy", "v2.14.1"],
                ["Commander", "j.doe"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-2 px-3 py-1.5">
                  <dt className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel
            title="Evidence"
            action={
              <button className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                add
              </button>
            }
            dense
          >
            <ul className="divide-y divide-border text-[12px]">
              {[
                { i: FileText, t: "trace-3921.json", s: "trace · 3.2s p99" },
                { i: FileText, t: "logs-api-gateway.txt", s: "logs · 8.4MB" },
                { i: Paperclip, t: "grafana-snapshot.png", s: "dashboard" },
                { i: FileText, t: "diff-a3f9c21..v2.14.1", s: "code diff" },
              ].map((e, idx) => {
                const Icon = e.i;
                return (
                  <li
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted"
                  >
                    <Icon className="h-3 w-3 text-muted-foreground" />
                    <span className="flex-1 font-mono text-[11.5px] text-foreground">
                      {e.t}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {e.s}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <AIPanel title="Recommendations" />

          <Panel title="Chat" dense>
            <div className="max-h-72 divide-y divide-border overflow-auto text-[12px]">
              {CHAT.map((m) => (
                <div key={m.id} className="px-3 py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] font-semibold text-foreground">
                      {m.who}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.time}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-foreground">
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t-2 border-border bg-background p-2">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                placeholder="Post update…"
                className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
              />
              <button className="h-7 border-2 border-primary bg-primary px-2 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground">
                post
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

const TIMELINE = [
  { id: "1", time: "14:04 UTC", title: "Incident declared (auto-triage)", detail: "SLO burn rate 14x on api-gateway.availability" },
  { id: "2", time: "14:05 UTC", title: "sre-oncall paged", detail: "PagerDuty · escalation policy platform-p1" },
  { id: "3", time: "14:06 UTC", title: "Hermes opened root cause workspace" },
  { id: "4", time: "14:08 UTC", title: "Hypothesis: bad deploy CHG-2140", detail: "Correlated with 14:02 UTC rollout of v2.14.1" },
  { id: "5", time: "14:11 UTC", title: "j.doe acknowledged", detail: "Assumed commander role" },
  { id: "6", time: "14:14 UTC", title: "Rollback playbook queued", detail: "playbook/rollback-canary · dry-run OK" },
  { id: "7", time: "14:16 UTC", title: "Broadcast · #incidents", detail: "Customer-facing impact estimated at ~3% error rate" },
];

const CHAT = [
  { id: "c1", who: "j.doe", time: "14:11", msg: "Taking commander. Kicking off rollback." },
  { id: "c2", who: "hermes", time: "14:12", msg: "Rollback dry-run OK. Estimated recovery 4m post-execute." },
  { id: "c3", who: "m.patel", time: "14:14", msg: "Confirmed customer 5xx on /checkout endpoints." },
  { id: "c4", who: "a.chen", time: "14:16", msg: "Feature flag `new-cart` disabled as a precaution." },
];
