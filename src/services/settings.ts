// Settings domain service (Wave 5)

import { apiClient } from "@/lib/api";
import type { SystemSettings, UserPreferences, IntegrationSettings } from "@/types";

export async function getSettings(): Promise<SystemSettings> {
  const response = await apiClient.get<SystemSettings>("/settings");
  return response.data;
}

export async function updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
  const response = await apiClient.put<SystemSettings>("/settings", data);
  return response.data;
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const response = await apiClient.get<UserPreferences>("/settings/preferences");
  return response.data;
}

export async function updateUserPreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
  const response = await apiClient.put<UserPreferences>("/settings/preferences", data);
  return response.data;
}

export async function getIntegrations(): Promise<IntegrationSettings[]> {
  const response = await apiClient.get<IntegrationSettings[]>("/settings/integrations");
  return response.data;
}
