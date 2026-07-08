import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { Panel } from "./Panel";
import { Sparkles } from "lucide-react";

/**
 * Renders a themed placeholder page for a module that isn't fully implemented yet.
 * Keeps the enterprise aesthetic while communicating the module's scope.
 */
export function PlaceholderModule({
  eyebrow,
  title,
  description,
  sections,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: { title: string; items: string[] }[];
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
      />
      <div className="grid gap-3 p-4 md:p-6 lg:grid-cols-3">
        {sections.map((s) => (
          <Panel key={s.title} title={s.title}>
            <ul className="space-y-1.5">
              {s.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 border-l-2 border-border bg-background px-2 py-1.5 text-[12.5px] text-foreground"
                >
                  <span className="inline-block h-1.5 w-1.5 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" /> Hermes Assistant
            </span>
          }
          className="lg:col-span-3"
        >
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["confidence", "94%", "text-primary"],
              ["root cause", "n/a", "text-muted-foreground"],
              ["risk", "low", "text-healthy"],
              ["recommended playbook", "auto-remediate", "text-info"],
            ].map(([label, value, tone]) => (
              <div key={label} className="border-2 border-border bg-background p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </div>
                <div className={`mt-1 font-mono text-lg font-bold ${tone}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            This module is scaffolded and ready to be extended. Hook it into your
            data plane — metrics, logs, traces, or the incident bus — and Hermes
            will surface reasoning, evidence, and one-click remediations.
          </p>
        </Panel>
      </div>
    </div>
  );
}
