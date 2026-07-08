// Mock adapter - routes API calls to mock data

import type { ApiAdapter, ApiResponse } from "../types";
import * as mockOps from "@/mock/operations";
import * as mockInfra from "@/mock/infrastructure";
import * as mockAuto from "@/mock/automation";
import * as mockAuth from "@/mock/auth";

export class MockAdapter implements ApiAdapter {
  private getMockAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_access_token");
    }
    return null;
  }

  async get<T>(url: string, _params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    await this.delay(100);
    const data = this.route(url, "GET");
    return { data: data as T };
  }

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    await this.delay(150);
    const result = this.route(url, "POST", data);
    return { data: result as T };
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    await this.delay(150);
    const result = this.route(url, "PUT", data);
    return { data: result as T };
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    await this.delay(100);
    const result = this.route(url, "DELETE");
    return { data: result as T };
  }

  private route(url: string, method: string = "GET", data?: unknown): unknown {
    // Auth routes (Wave 4 Phase 1)
    if (url === "/auth/login" && method === "POST") {
      const { email, password } = data as { email: string; password: string };
      const result = mockAuth.mockLogin(email, password);
      if (!result) {
        throw new Error("Invalid credentials");
      }
      return result;
    }
    if (url === "/auth/logout" && method === "POST") {
      return { success: true };
    }
    if (url === "/auth/refresh" && method === "POST") {
      const { refreshToken } = data as { refreshToken: string };
      const result = mockAuth.mockRefreshToken(refreshToken);
      if (!result) {
        throw new Error("Invalid refresh token");
      }
      return result;
    }
    if (url === "/auth/me") {
      const token = this.getMockAuthToken();
      if (!token) {
        throw new Error("Unauthorized");
      }
      const user = mockAuth.mockCurrentUser(token);
      if (!user) {
        throw new Error("Invalid token");
      }
      return user;
    }
    
    // Dashboard routes
    if (url === "/dashboard/metrics") {
      return mockOps.mockMonitoringMetrics;
    }
    
    // Monitoring routes
    if (url === "/monitoring/metrics") {
      return mockOps.mockMonitoringMetrics;
    }
    if (url === "/monitoring/services") {
      return mockOps.mockServiceHealth;
    }
    
    // Alert routes
    if (url === "/alerts" || url.startsWith("/alerts?")) {
      return mockOps.mockAlerts;
    }
    if (url.match(/^\/alerts\/[^/]+$/)) {
      const id = url.split("/")[2];
      return mockOps.mockAlerts.find((a: any) => a.id === id) || mockOps.mockAlerts[0];
    }
    if (url.match(/^\/alerts\/[^/]+\/acknowledge$/) && method === "POST") {
      return { success: true, message: "Alert acknowledged" };
    }
    if (url.match(/^\/alerts\/[^/]+\/resolve$/) && method === "POST") {
      return { success: true, message: "Alert resolved" };
    }
    
    // Infrastructure routes
    if (url === "/infrastructure/nodes") {
      return mockInfra.mockNodes;
    }
    if (url.match(/^\/infrastructure\/nodes\/[^/]+$/)) {
      const id = url.split("/")[3];
      return mockInfra.mockNodes.find((n: any) => n.id === id) || mockInfra.mockNodes[0];
    }
    
    // Service catalog routes
    if (url === "/services") {
      return mockInfra.mockServices;
    }
    if (url.match(/^\/services\/[^/]+$/)) {
      const id = url.split("/")[2];
      return mockInfra.mockServices.find((s: any) => s.id === id) || mockInfra.mockServices[0];
    }
    
    // Incidents routes
    if (url === "/incidents" || url.startsWith("/incidents?")) {
      return [];
    }
    if (url.match(/^\/incidents\/[^/]+$/)) {
      return null;
    }
    
    // Automation routes (Wave 3)
    if (url === "/automation/metrics") {
      return mockAuto.mockAutomationMetrics;
    }
    if (url === "/automation/playbooks") {
      return mockAuto.mockPlaybooks;
    }
    if (url.match(/^\/automation\/playbooks\/[^/]+$/)) {
      const id = url.split("/")[3];
      return mockAuto.mockPlaybooks.find((p: any) => p.id === id) || mockAuto.mockPlaybooks[0];
    }
    if (url.match(/^\/automation\/playbooks\/[^/]+\/run$/) && method === "POST") {
      return { success: true, message: "Playbook execution started", jobId: `job_${Date.now()}` };
    }
    if (url === "/automation/workflows") {
      return mockAuto.mockWorkflows;
    }
    if (url === "/automation/jobs") {
      return mockAuto.mockJobs;
    }
    
    // Default 404
    throw new Error(`Mock route not found: ${method} ${url}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
