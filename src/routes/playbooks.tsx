import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/playbooks")({
  head: () => ({ meta: [{ title: "Playbooks — Hermes" }, { name: "description", content: "Runbooks and executable playbooks for common operations." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="automation · playbooks"
      title="Playbooks"
      description="Human-readable runbooks and machine-executable playbooks for incidents, deploys, and maintenance."
      sections={[
        { title: "Categories", items: ["Incident response", "Rollback", "Failover", "Capacity", "Security"] },
        { title: "Executable", items: ["One-click run", "Dry-run", "Parameterized", "Approvals"] },
        { title: "Governance", items: ["Ownership", "Review cadence", "Test coverage", "Version history"] },
      ]}
    />
  ),
});
