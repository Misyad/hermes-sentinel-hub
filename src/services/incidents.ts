// Incident domain service

import { apiClient } from "@/lib/api";
import type { Incident, IncidentDetail } from "@/types";

export async function getIncidents(filters?: { severity?: string; status?: string }): Promise<Incident[]> {
  const params = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : "";
  const response = await apiClient.get<Incident[]>(`/incidents${params}`);
  return response.data;
}

export async function getIncident(id: string): Promise<IncidentDetail> {
  const response = await apiClient.get<IncidentDetail>(`/incidents/${id}`);
  return response.data;
}

export async function createIncident(data: Partial<Incident>): Promise<Incident> {
  const response = await apiClient.post<Incident>("/incidents", data);
  return response.data;
}

export async function updateIncident(id: string, data: Partial<Incident>): Promise<Incident> {
  const response = await apiClient.put<Incident>(`/incidents/${id}`, data);
  return response.data;
}

export async function resolveIncident(id: string, resolution: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(`/incidents/${id}/resolve`, { resolution });
  return response.data;
}
