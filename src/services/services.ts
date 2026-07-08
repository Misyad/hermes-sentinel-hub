// Service catalog domain service

import { apiClient } from "@/lib/api";
import type { Service, ServiceDependency } from "@/types";

export async function getServices(): Promise<Service[]> {
  const response = await apiClient.get<Service[]>("/services");
  return response.data;
}

export async function getService(id: string): Promise<Service> {
  const response = await apiClient.get<Service>(`/services/${id}`);
  return response.data;
}

export async function getServiceDependencies(id: string): Promise<ServiceDependency[]> {
  const response = await apiClient.get<ServiceDependency[]>(`/services/${id}/dependencies`);
  return response.data;
}
