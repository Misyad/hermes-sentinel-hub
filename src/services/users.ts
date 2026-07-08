// User management domain service (Wave 5)

import { apiClient } from "@/lib/api";
import type { User, Role, Team } from "@/types";

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<User[]>("/users");
  return response.data;
}

export async function getUser(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await apiClient.put<User>(`/users/${id}`, data);
  return response.data;
}

export async function getRoles(): Promise<Role[]> {
  const response = await apiClient.get<Role[]>("/users/roles");
  return response.data;
}

export async function getTeams(): Promise<Team[]> {
  const response = await apiClient.get<Team[]>("/users/teams");
  return response.data;
}
