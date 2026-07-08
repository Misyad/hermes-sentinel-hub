// Monitoring domain types

import type { Metric, Status, TimeSeriesPoint } from "./common";

export interface MonitoringMetric extends Metric {
  id: string;
  category: "performance" | "availability" | "capacity" | "latency";
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: Status;
  uptime: number;
  latency: number;
  errorRate: number;
  requestsPerSec: number;
  lastCheck: string;
}

export interface TimeSeriesData {
  metric: string;
  label: string;
  points: TimeSeriesPoint[];
  unit?: string;
}
