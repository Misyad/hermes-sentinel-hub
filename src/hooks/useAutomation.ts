import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAutomationMetrics,
  getWorkflows,
  getPlaybooks,
  getJobs,
} from "@/services";
import type { AutomationMetric, Workflow, Playbook, Job } from "@/types";

// Query Keys
export const automationKeys = {
  all: ["automation"] as const,
  metrics: () => [...automationKeys.all, "metrics"] as const,
  workflows: () => [...automationKeys.all, "workflows"] as const,
  workflow: (id: string) => [...automationKeys.workflows(), id] as const,
  playbooks: () => [...automationKeys.all, "playbooks"] as const,
  playbook: (id: string) => [...automationKeys.playbooks(), id] as const,
  jobs: () => [...automationKeys.all, "jobs"] as const,
  job: (id: string) => [...automationKeys.jobs(), id] as const,
};

// Automation Metrics
export function useAutomationMetrics() {
  return useQuery({
    queryKey: automationKeys.metrics(),
    queryFn: getAutomationMetrics,
  });
}

// Workflows
export function useWorkflows() {
  return useQuery({
    queryKey: automationKeys.workflows(),
    queryFn: getWorkflows,
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: automationKeys.workflow(id),
    queryFn: async () => {
      const workflows = await getWorkflows();
      return workflows.find((w) => w.id === id);
    },
    enabled: !!id,
  });
}

// Playbooks
export function usePlaybooks() {
  return useQuery({
    queryKey: automationKeys.playbooks(),
    queryFn: getPlaybooks,
  });
}

export function usePlaybook(id: string) {
  return useQuery({
    queryKey: automationKeys.playbook(id),
    queryFn: async () => {
      const playbooks = await getPlaybooks();
      return playbooks.find((p) => p.id === id);
    },
    enabled: !!id,
  });
}

// Jobs
export function useJobs() {
  return useQuery({
    queryKey: automationKeys.jobs(),
    queryFn: getJobs,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: automationKeys.job(id),
    queryFn: async () => {
      const jobs = await getJobs();
      return jobs.find((j) => j.id === id);
    },
    enabled: !!id,
  });
}

// Mutations
export function useRunPlaybook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playbookId: string) => {
      // Mock implementation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, jobId: `job-${Date.now()}` };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: automationKeys.workflows() });
    },
  });
}

export function useRerunJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      // Mock implementation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, newJobId: `job-${Date.now()}` };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.jobs() });
    },
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      // Mock implementation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.jobs() });
    },
  });
}

export function useDeletePlaybook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playbookId: string) => {
      // Mock implementation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.playbooks() });
    },
  });
}
