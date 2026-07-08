import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base — Hermes" }, { name: "description", content: "Runbooks, docs, and operational guides." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="knowledge"
      title="Knowledge Base"
      description="Runbooks, documentation, operational guides, and searchable institutional knowledge."
      sections={[
        { title: "Runbooks", items: ["Incident response", "Failover", "Capacity", "Security response"] },
        { title: "Documentation", items: ["Architecture", "Services", "APIs", "Data flows"] },
        { title: "Discovery", items: ["Search", "Categories", "Tags", "Recently updated"] },
      ]}
    />
  ),
});
