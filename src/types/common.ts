// Common types shared across domains

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  trend: "up" | "down" | "stable";
  delta: string;
  deltaTone: "positive" | "negative" | "neutral";
  timeseries?: TimeSeriesPoint[];
}

export type Status = "healthy" | "degraded" | "critical" | "offline" | "unknown";

export type Severity = "critical" | "high" | "medium" | "low";

export type AlertStatus = "firing" | "pending" | "resolved" | "acknowledged";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
