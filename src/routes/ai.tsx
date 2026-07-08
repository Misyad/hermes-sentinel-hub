import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { AIPanel } from "@/components/shared/AIPanel";
import { Sparkles, Send } from "lucide-react";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Workspace — Hermes" },
      { name: "description", content: "AI-assisted troubleshooting, root cause analysis, and operational recommendations." },
    ],
  }),
  component: AIWorkspace,
});

function AIWorkspace() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="hermes · ai workspace"
        title="AI Workspace"
        description="Chat with Hermes, inspect evidence, and drive remediation with full audit trail."
      />

      <div className="grid gap-3 p-4 md:p-6 lg:grid-cols-[1fr_360px]">
        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" /> Root cause chat · INC-4821
            </span>
          }
        >
          <div className="space-y-3">
            {CHAT.map((m) => (
              <div key={m.id} className={m.who === "you" ? "flex justify-end" : ""}>
                <div
                  className={
                    "max-w-[80%] border-2 p-3 text-[12.5px] leading-relaxed " +
                    (m.who === "you"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-foreground")
                  }
                >
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {m.who}
                  </div>
                  {m.msg}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 border-2 border-border bg-background p-2">
            <input
              placeholder="Ask Hermes… (e.g. why is checkout p99 spiking?)"
              className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
            />
            <button className="flex h-7 items-center gap-1 border-2 border-primary bg-primary px-2 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground">
              <Send className="h-3 w-3" /> send
            </button>
          </div>
        </Panel>

        <div className="space-y-3">
          <AIPanel />
          <Panel title="Prompt history" dense>
            <ul className="divide-y divide-border text-[12px]">
              {[
                "why is checkout p99 spiking?",
                "explain drift on eks-prod-01",
                "summarize INC-4818",
                "draft postmortem for INC-4802",
              ].map((p) => (
                <li key={p} className="px-3 py-1.5 font-mono text-[11.5px] text-muted-foreground hover:bg-muted hover:text-foreground">
                  › {p}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

const CHAT = [
  { id: "1", who: "you", msg: "What triggered INC-4821 and what's the fastest safe mitigation?" },
  {
    id: "2",
    who: "hermes",
    msg: "INC-4821 correlates with the api-gateway v2.14.1 rollout at 14:02 UTC. Error rate rose 27× within 90s. Fastest safe mitigation is a rollback to v2.14.0 via playbook rollback-canary — dry-run passed, estimated recovery 4m. Confidence 92%.",
  },
  { id: "3", who: "you", msg: "Show the diff." },
  {
    id: "4",
    who: "hermes",
    msg: "Diff a3f9c21..v2.14.1 introduces an unbounded retry loop in RequestForwarder.forward() when upstream returns 503. Suggested: revert commit or gate behind feature flag `retry-v2`.",
  },
];
