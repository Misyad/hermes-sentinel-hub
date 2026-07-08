import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/shared/PlaceholderModule";

export const Route = createFileRoute("/infrastructure")({
  head: () => ({
    meta: [
      { title: "Infrastructure — Hermes" },
      { name: "description", content: "Servers, containers, Kubernetes, networks, volumes, and topology." },
    ],
  }),
  component: () => (
    <PlaceholderModule
      eyebrow="platform · infrastructure"
      title="Infrastructure"
      description="Every host, container, cluster, network, and volume — with live topology and dependency mapping."
      sections={[
        { title: "Compute", items: ["Servers", "Containers", "Kubernetes clusters", "Docker hosts", "Serverless functions"] },
        { title: "Network", items: ["VPCs", "Subnets", "Load balancers", "DNS zones", "Firewall rules"] },
        { title: "Storage", items: ["Volumes", "Object buckets", "Snapshots", "Backups"] },
        { title: "Topology", items: ["Service graph", "Dependency map", "Blast radius", "Traffic flow"] },
        { title: "Assets", items: ["Owned resources", "Ownership", "Tags & metadata", "Drift detection"] },
        { title: "Dependencies", items: ["Internal services", "Third-party SaaS", "Data pipelines", "Certificates"] },
      ]}
    />
  ),
});
