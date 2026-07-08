import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit — Hermes" }, { name: "description", content: "Immutable audit trail and governance timeline." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="governance · audit"
      title="Audit"
      description="Immutable audit trail, governance timeline, evidence explorer, and policy violation review."
      sections={[
        { title: "Trail", items: ["User actions", "System events", "API calls", "Signed logs"] },
        { title: "Governance", items: ["Policy checks", "Violations", "Exceptions", "Reviews"] },
        { title: "Evidence", items: ["Attestations", "Screenshots", "Diffs", "Approvals"] },
      ]}
    />
  ),
});
