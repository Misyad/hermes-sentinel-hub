// Unified API client

import { API_MODE } from "./config";
import { MockAdapter } from "./adapters/mock";
import { RestAdapter } from "./adapters/rest";
import type { ApiAdapter } from "./types";

const adapter: ApiAdapter = API_MODE === "mock" ? new MockAdapter() : new RestAdapter();

export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>) => adapter.get<T>(url, params),
  post: <T>(url: string, data: unknown) => adapter.post<T>(url, data),
  put: <T>(url: string, data: unknown) => adapter.put<T>(url, data),
  delete: <T>(url: string) => adapter.delete<T>(url),
};
