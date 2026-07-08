import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/change")({
  head: () => ({ meta: [{ title: "Change Management — Hermes" }, { name: "description", content: "Change requests, approvals, and maintenance windows." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="governance · change"
      title="Change Management"
      description="Change requests, approval workflows, maintenance windows, rollback plans, and risk analysis."
      sections={[
        { title: "Requests", items: ["Open", "Awaiting approval", "Scheduled", "Completed"] },
        { title: "Approvals", items: ["Approval matrix", "Reviewers", "SLA", "Emergency path"] },
        { title: "Scheduling", items: ["Maintenance calendar", "Blackout windows", "Freeze periods"] },
      ]}
    />
  ),
});
