import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alert Center — Hermes" },
      { name: "description", content: "Firing alerts, silences, and routing across all monitors." },
    ],
  }),
  component: () => (
    <PlaceholderModule
      eyebrow="observability · alert center"
      title="Alert Center"
      description="Every firing, resolved, and silenced alert, with routing, escalation, and burn-rate context."
      sections={[
        { title: "Firing", items: ["By severity", "By service", "By runbook", "Grouped by root cause"] },
        { title: "Silences", items: ["Active silences", "Scheduled maintenance", "Suppression rules"] },
        { title: "Routing", items: ["Notification tree", "Escalation policies", "On-call schedules", "Fallback rules"] },
      ]}
    />
  ),
});
