// Infrastructure domain service

import { apiClient } from "@/lib/api";
import type { Node, Cluster, Resource } from "@/types";

export async function getNodes(): Promise<Node[]> {
  const response = await apiClient.get<Node[]>("/infrastructure/nodes");
  return response.data;
}

export async function getNode(id: string): Promise<Node> {
  const response = await apiClient.get<Node>(`/infrastructure/nodes/${id}`);
  return response.data;
}

export async function getClusters(): Promise<Cluster[]> {
  const response = await apiClient.get<Cluster[]>("/infrastructure/clusters");
  return response.data;
}

export async function getResources(): Promise<Resource[]> {
  const response = await apiClient.get<Resource[]>("/infrastructure/resources");
  return response.data;
}
