import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/assets")({
  head: () => ({ meta: [{ title: "Assets — Hermes" }, { name: "description", content: "Owned infrastructure and platform assets." }] }),
  component: () => (
    <PlaceholderModule
      eyebrow="infrastructure · inventory"
      title="Assets"
      description="Every asset the platform owns or depends on — hosts, containers, buckets, keys, certificates, and vendors."
      sections={[
        { title: "By Type", items: ["Hosts", "Containers", "Databases", "Queues", "Secrets", "Certificates"] },
        { title: "By Owner", items: ["Team assignments", "Cost centers", "SLA tier", "Compliance scope"] },
        { title: "Lifecycle", items: ["Provisioned", "In use", "Deprecated", "Scheduled for removal"] },
      ]}
    />
  ),
});
