// Alert domain service

import { apiClient } from "@/lib/api";
import type { Alert, AlertRule } from "@/types";

export async function getAlerts(filters?: { severity?: string; status?: string }): Promise<Alert[]> {
  const params = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : "";
  const response = await apiClient.get<Alert[]>(`/alerts${params}`);
  return response.data;
}

export async function getAlert(id: string): Promise<Alert> {
  const response = await apiClient.get<Alert>(`/alerts/${id}`);
  return response.data;
}

export async function acknowledgeAlert(id: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(`/alerts/${id}/acknowledge`, {});
  return response.data;
}

export async function resolveAlert(id: string, resolution?: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(`/alerts/${id}/resolve`, { resolution });
  return response.data;
}

export async function getAlertRules(): Promise<AlertRule[]> {
  const response = await apiClient.get<AlertRule[]>("/alerts/rules");
  return response.data;
}
