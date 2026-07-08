import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/identity")({
  head: () => ({ meta: [{ title: "Identity & Access — Hermes" }, { name: "description", content: "Users, roles, service accounts, and RBAC." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="platform · identity"
      title="Identity & Access"
      description="Users, roles, permissions, service accounts, API keys, sessions, MFA, and RBAC policy."
      sections={[
        { title: "Principals", items: ["Users", "Service accounts", "Groups", "External identities"] },
        { title: "Access", items: ["Roles", "Permissions", "RBAC policy", "Just-in-time"] },
        { title: "Security", items: ["MFA", "Sessions", "API keys", "Auth policies"] },
      ]}
    />
  ),
});
