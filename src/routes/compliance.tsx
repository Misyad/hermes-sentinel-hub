import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/compliance")({
  head: () => ({ meta: [{ title: "Compliance — Hermes" }, { name: "description", content: "Compliance frameworks, controls, and evidence." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="governance · compliance"
      title="Compliance"
      description="Framework coverage, control status, and evidence for SOC 2, ISO 27001, HIPAA, PCI-DSS."
      sections={[
        { title: "Frameworks", items: ["SOC 2", "ISO 27001", "HIPAA", "PCI-DSS", "GDPR"] },
        { title: "Controls", items: ["Passing", "Failing", "Manual review", "Automated tests"] },
        { title: "Evidence", items: ["Auto-collected", "Uploaded", "Attestations", "Auditor exports"] },
      ]}
    />
  ),
});
