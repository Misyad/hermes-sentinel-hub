// Authentication service layer

import { apiClient } from "@/lib/api";
import type { 
  AuthUser, 
  LoginCredentials, 
  LoginResponse, 
  RefreshResponse 
} from "@/types/auth";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post<void>("/auth/logout", {});
}

export async function refreshToken(refreshToken: string): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken });
  return response.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<AuthUser>("/auth/me");
  return response.data;
}

export async function validateSession(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}
