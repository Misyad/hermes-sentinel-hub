// Governance domain service (Wave 4)

import { apiClient } from "@/lib/api";
import type { AuditLog, ComplianceCheck, ChangeRequest } from "@/types";

export async function getAuditLogs(filters?: { actor?: string; action?: string }): Promise<AuditLog[]> {
  const params = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : "";
  const response = await apiClient.get<AuditLog[]>(`/governance/audit${params}`);
  return response.data;
}

export async function getComplianceStatus(): Promise<ComplianceCheck[]> {
  const response = await apiClient.get<ComplianceCheck[]>("/governance/compliance");
  return response.data;
}

export async function getChangeRequests(status?: string): Promise<ChangeRequest[]> {
  const params = status ? `?status=${status}` : "";
  const response = await apiClient.get<ChangeRequest[]>(`/governance/changes${params}`);
  return response.data;
}
