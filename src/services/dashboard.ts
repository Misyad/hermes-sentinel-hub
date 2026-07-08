// Dashboard domain service

import { apiClient } from "@/lib/api";
import type { DashboardMetrics, Metric, Alert, Incident, ServiceHealth } from "@/types";

export async function getDashboardMetrics(): Promise<Metric[]> {
  const response = await apiClient.get<Metric[]>("/dashboard/metrics");
  return response.data;
}

export async function getDashboardAlerts(): Promise<Alert[]> {
  const response = await apiClient.get<Alert[]>("/dashboard/alerts");
  return response.data;
}

export async function getDashboardIncidents(): Promise<Incident[]> {
  const response = await apiClient.get<Incident[]>("/dashboard/incidents");
  return response.data;
}

export async function getDashboardServices(): Promise<ServiceHealth[]> {
  const response = await apiClient.get<ServiceHealth[]>("/dashboard/services");
  return response.data;
}
