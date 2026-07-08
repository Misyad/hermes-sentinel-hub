import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [{ title: "Automation — Hermes" }, { name: "description", content: "Workflows, schedules, queues, and AI-driven automation." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="platform · automation"
      title="Automation"
      description="Workflow builder, execution history, scheduler, and AI-driven auto-remediation."
      sections={[
        { title: "Workflows", items: ["Playbooks", "Workflow builder", "Templates", "Approvals"] },
        { title: "Execution", items: ["Live queue", "History", "Retries", "Rollback"] },
        { title: "Scheduling", items: ["Cron jobs", "Event triggers", "Windows", "Blackout policies"] },
      ]}
    />
  ),
});
