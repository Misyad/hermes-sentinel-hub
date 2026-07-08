// Automation domain types

export interface AutomationMetric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change: string;
  trend: number[];
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  category: string;
  triggers: string[];
  actions: number;
  lastRun?: string;
  executions: number;
  successRate: number;
  avgDuration: string;
  status: "active" | "inactive" | "archived";
  version?: string;
  risk?: "low" | "medium" | "high" | "critical";
  tags?: string[];
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "running" | "completed" | "failed" | "pending" | "queued";
  progress: number;
  steps: WorkflowStep[];
  startTime: string;
  estimatedCompletion?: string;
  triggeredBy: string;
  version?: string;
  owner?: string;
  tags?: string[];
  executions?: number;
  successRate?: number;
  avgDuration?: string;
  dependencies?: string[];
  environment?: string;
  retryCount?: number;
  maxRetries?: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type?: "trigger" | "condition" | "action" | "approval" | "notification" | "rollback";
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  duration?: string;
  retryCount?: number;
  dependencies?: string[];
  output?: string;
  error?: string;
}

export interface Job {
  id: string;
  workflowName: string;
  status: "success" | "failed" | "running" | "pending";
  startTime: string;
  duration?: string;
  triggeredBy: string;
  result?: string;
}
