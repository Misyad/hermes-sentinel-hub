import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/developer")({
  head: () => ({ meta: [{ title: "Developer Hub — Hermes" }, { name: "description", content: "APIs, webhooks, SDKs, and CLI." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="platform · developer hub"
      title="Developer Hub"
      description="API explorer, documentation, webhooks, connector library, plugin marketplace, SDK center, and CLI."
      sections={[
        { title: "APIs", items: ["Explorer", "Documentation", "Rate limits", "Versioning"] },
        { title: "Extend", items: ["Webhooks", "Connectors", "Plugins", "Marketplace"] },
        { title: "Tooling", items: ["SDKs", "CLI", "Terraform provider", "Developer logs"] },
      ]}
    />
  ),
});
