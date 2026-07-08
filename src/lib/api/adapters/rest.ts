// REST adapter stub (Phase 3 implementation)

import type { ApiAdapter, ApiResponse } from "../types";

export class RestAdapter implements ApiAdapter {
  async get<T>(_url: string, _params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    throw new Error("REST adapter not implemented yet (Phase 3)");
  }

  async post<T>(_url: string, _data: unknown): Promise<ApiResponse<T>> {
    throw new Error("REST adapter not implemented yet (Phase 3)");
  }

  async put<T>(_url: string, _data: unknown): Promise<ApiResponse<T>> {
    throw new Error("REST adapter not implemented yet (Phase 3)");
  }

  async delete<T>(_url: string): Promise<ApiResponse<T>> {
    throw new Error("REST adapter not implemented yet (Phase 3)");
  }
}
