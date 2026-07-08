import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Hermes" }, { name: "description", content: "Operational reports and executive summaries." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="governance · reports"
      title="Reports"
      description="Weekly operational reports, executive summaries, SLA/SLO dashboards, and cost analytics."
      sections={[
        { title: "Operational", items: ["Weekly ops", "Incident review", "Change failure rate", "MTTR trends"] },
        { title: "Executive", items: ["Board summary", "SLA posture", "Cost & efficiency", "Risk register"] },
        { title: "Custom", items: ["Report builder", "Scheduled delivery", "Exports", "Shared dashboards"] },
      ]}
    />
  ),
});
