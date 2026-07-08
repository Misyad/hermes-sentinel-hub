import type { Incident, Service, Playbook, Workflow, Job, Node } from "@/types";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: SearchCategory;
  icon: string;
  route?: string;
  action?: () => void;
  status?: string;
  badge?: string;
  metadata?: Record<string, string>;
}

export type SearchCategory =
  | "incidents"
  | "services"
  | "playbooks"
  | "workflows"
  | "jobs"
  | "nodes"
  | "knowledge"
  | "users"
  | "settings"
  | "navigation"
  | "actions";

export interface SearchOptions {
  query: string;
  categories?: SearchCategory[];
  limit?: number;
}

export interface SearchRanking {
  exactMatch: number;
  startsWith: number;
  contains: number;
  recentlyOpened: number;
  pinned: number;
}

const RANKING_WEIGHTS: SearchRanking = {
  exactMatch: 100,
  startsWith: 50,
  contains: 10,
  recentlyOpened: 20,
  pinned: 80,
};

function calculateScore(item: string, query: string, isPinned = false, isRecent = false): number {
  const lowerItem = item.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  let score = 0;
  
  if (lowerItem === lowerQuery) {
    score += RANKING_WEIGHTS.exactMatch;
  } else if (lowerItem.startsWith(lowerQuery)) {
    score += RANKING_WEIGHTS.startsWith;
  } else if (lowerItem.includes(lowerQuery)) {
    score += RANKING_WEIGHTS.contains;
  }
  
  if (isPinned) score += RANKING_WEIGHTS.pinned;
  if (isRecent) score += RANKING_WEIGHTS.recentlyOpened;
  
  return score;
}

export async function search(options: SearchOptions): Promise<SearchResult[]> {
  const { query, categories, limit = 50 } = options;
  
  if (!query.trim()) {
    return [];
  }
  
  const results: Array<SearchResult & { score: number }> = [];
  
  // Import data from services
  const { getIncidents } = await import("@/services");
  const { getServices } = await import("@/services");
  const { getPlaybooks } = await import("@/services");
  const { getWorkflows } = await import("@/services");
  const { getJobs } = await import("@/services");
  const { getNodes } = await import("@/services");
  
  // Search Incidents
  if (!categories || categories.includes("incidents")) {
    const incidents = await getIncidents();
    incidents.forEach((incident: Incident) => {
      const score = calculateScore(incident.title, query);
      if (score > 0) {
        results.push({
          id: `incident-${incident.id}`,
          title: incident.title,
          subtitle: `${incident.service} • ${incident.assignee}`,
          category: "incidents",
          icon: "AlertCircle",
          route: `/incidents/${incident.id}`,
          status: incident.status,
          badge: incident.severity,
          score,
        });
      }
    });
  }
  
  // Search Services
  if (!categories || categories.includes("services")) {
    const services = await getServices();
    services.forEach((service: Service) => {
      const score = calculateScore(service.name, query);
      if (score > 0) {
        results.push({
          id: `service-${service.id}`,
          title: service.name,
          subtitle: service.description,
          category: "services",
          icon: "Server",
          route: `/services/${service.id}`,
          status: service.status,
          score,
        });
      }
    });
  }
  
  // Search Playbooks
  if (!categories || categories.includes("playbooks")) {
    const playbooks = await getPlaybooks();
    playbooks.forEach((playbook: Playbook) => {
      const score = calculateScore(playbook.name, query);
      if (score > 0) {
        results.push({
          id: `playbook-${playbook.id}`,
          title: playbook.name,
          subtitle: playbook.description,
          category: "playbooks",
          icon: "FileText",
          route: `/playbooks/${playbook.id}`,
          status: playbook.status,
          badge: playbook.risk,
          score,
        });
      }
    });
  }
  
  // Search Workflows
  if (!categories || categories.includes("workflows")) {
    const workflows = await getWorkflows();
    workflows.forEach((workflow: Workflow) => {
      const score = calculateScore(workflow.name, query);
      if (score > 0) {
        results.push({
          id: `workflow-${workflow.id}`,
          title: workflow.name,
          subtitle: workflow.description,
          category: "workflows",
          icon: "GitBranch",
          route: `/workflows/${workflow.id}`,
          status: workflow.status,
          score,
        });
      }
    });
  }
  
  // Search Jobs
  if (!categories || categories.includes("jobs")) {
    const jobs = await getJobs();
    jobs.forEach((job: Job) => {
      const score = calculateScore(job.workflowName, query);
      if (score > 0) {
        results.push({
          id: `job-${job.id}`,
          title: job.workflowName,
          subtitle: `Triggered by ${job.triggeredBy}`,
          category: "jobs",
          icon: "Play",
          route: `/jobs?id=${job.id}`,
          status: job.status,
          score,
        });
      }
    });
  }
  
  // Search Nodes
  if (!categories || categories.includes("nodes")) {
    const nodes = await getNodes();
    nodes.forEach((node: Node) => {
      const score = calculateScore(node.name, query);
      if (score > 0) {
        results.push({
          id: `node-${node.id}`,
          title: node.name,
          subtitle: `${node.type} • ${node.zone}`,
          category: "nodes",
          icon: "Database",
          route: `/infrastructure/nodes/${node.id}`,
          status: node.status,
          score,
        });
      }
    });
  }
  
  // Sort by score (highest first) and apply limit
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...result }) => result);
}
