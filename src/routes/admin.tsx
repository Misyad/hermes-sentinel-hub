import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — Hermes" }, { name: "description", content: "Environments, integrations, feature flags, and system settings." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="platform · administration"
      title="Platform Administration"
      description="Environments, AI providers, secrets, integrations, notification channels, feature flags, and branding."
      sections={[
        { title: "Environments", items: ["Production", "Staging", "Dev", "Sandbox", "Promotion rules"] },
        { title: "Integrations", items: ["AI providers", "Cloud", "SCM", "CI/CD", "Ticketing", "Chat"] },
        { title: "Platform", items: ["Secrets", "Notification channels", "Feature flags", "Backups", "Branding"] },
      ]}
    />
  ),
});
