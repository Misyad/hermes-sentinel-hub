import { Sparkles } from "lucide-react";
import { Panel } from "./Panel";

type Recommendation = {
  id: string;
  title: string;
  reasoning: string;
  action: string;
  confidence: number;
  risk: "low" | "medium" | "high";
  evidence: string[];
};

const DEFAULT_RECS: Recommendation[] = [
  {
    id: "r1",
    title: "Roll back api-gateway to v2.14.0",
    reasoning:
      "5xx rate on api-gateway rose from 0.14% to 3.8% within 90s of the v2.14.1 rollout. Two upstream services show correlated latency regressions.",
    action: "Trigger playbook: rollback-canary",
    confidence: 0.92,
    risk: "low",
    evidence: [
      "Deployment CHG-2140 at 14:02 UTC",
      "SLO burn rate 14x on api-gateway.availability",
      "Trace sample: 3.2s p99 (baseline 320ms)",
    ],
  },
  {
    id: "r2",
    title: "Scale eks-prod-01 node group +2",
    reasoning:
      "CPU pressure sustained > 82% across 6/12 nodes for 12m. Predicted saturation at 96% within 18m at current growth rate.",
    action: "Run: eks-scale-nodegroup --count +2",
    confidence: 0.81,
    risk: "low",
    evidence: [
      "Node CPU trend +6%/hr",
      "Pod pending count: 4",
      "Cost impact: +$1.42/hr",
    ],
  },
];

export function AIPanel({
  title = "AI Recommendations",
  recommendations = DEFAULT_RECS,
}: {
  title?: string;
  recommendations?: Recommendation[];
}) {
  return (
    <Panel
      title={
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          {title}
        </span>
      }
      action={
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
          hermes / online
        </span>
      }
    >
      <ul className="space-y-3">
        {recommendations.map((r) => (
          <li key={r.id} className="border-l-2 border-primary bg-background p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-foreground">
                  {r.title}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {r.reasoning}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  confidence
                </span>
                <span className="font-mono text-lg font-bold leading-none text-primary">
                  {Math.round(r.confidence * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {r.evidence.map((e) => (
                <span
                  key={e}
                  className="border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {e}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span
                className={
                  "font-mono text-[10px] uppercase tracking-widest " +
                  (r.risk === "high"
                    ? "text-critical"
                    : r.risk === "medium"
                      ? "text-warning"
                      : "text-healthy")
                }
              >
                risk · {r.risk}
              </span>
              <div className="flex gap-1.5">
                <button className="h-7 border-2 border-border-strong bg-background px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  dismiss
                </button>
                <button className="h-7 border-2 border-primary bg-primary px-2 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                  {r.action}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
