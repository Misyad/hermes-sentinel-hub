// API configuration

export const API_MODE = (import.meta.env.VITE_API_MODE || "mock") as "mock" | "rest";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
export const API_TIMEOUT = 30000;

export const config = {
  mode: API_MODE,
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
} as const;
