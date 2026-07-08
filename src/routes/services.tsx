import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Services — Hermes" }, { name: "description", content: "Service catalog with ownership and SLOs." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="platform · service catalog"
      title="Services"
      description="Every service in the platform with ownership, SLOs, dependencies, deploys, and on-call."
      sections={[
        { title: "Ownership", items: ["Team", "Tech lead", "On-call rotation", "Escalation policy"] },
        { title: "Reliability", items: ["SLIs", "SLOs", "Error budget", "MTTR / MTTA"] },
        { title: "Delivery", items: ["Deploy pipeline", "Frequency", "Lead time", "Change failure rate"] },
      ]}
    />
  ),
});
