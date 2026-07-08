// Automation domain service (Wave 3)

import { apiClient } from "@/lib/api";
import type { AutomationMetric, Playbook, Workflow, Job } from "@/types";

export async function getAutomationMetrics(): Promise<AutomationMetric[]> {
  const response = await apiClient.get<AutomationMetric[]>("/automation/metrics");
  return response.data;
}

export async function getPlaybooks(): Promise<Playbook[]> {
  const response = await apiClient.get<Playbook[]>("/automation/playbooks");
  return response.data;
}

export async function getPlaybook(id: string): Promise<Playbook> {
  const response = await apiClient.get<Playbook>(`/automation/playbooks/${id}`);
  return response.data;
}

export async function executePlaybook(id: string, params?: Record<string, unknown>): Promise<{ success: boolean; workflowId: string }> {
  const response = await apiClient.post<{ success: boolean; workflowId: string }>(`/automation/playbooks/${id}/execute`, params);
  return response.data;
}

export async function getWorkflows(): Promise<Workflow[]> {
  const response = await apiClient.get<Workflow[]>("/automation/workflows");
  return response.data;
}

export async function getJobs(): Promise<Job[]> {
  const response = await apiClient.get<Job[]>("/automation/jobs");
  return response.data;
}
