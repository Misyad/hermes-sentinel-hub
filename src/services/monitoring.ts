// Monitoring domain service

import { apiClient } from "@/lib/api";
import type { Metric, ServiceHealth, TimeSeriesData } from "@/types";

export async function getMonitoringMetrics(): Promise<Metric[]> {
  const response = await apiClient.get<Metric[]>("/monitoring/metrics");
  return response.data;
}

export async function getServiceHealth(): Promise<ServiceHealth[]> {
  const response = await apiClient.get<ServiceHealth[]>("/monitoring/services");
  return response.data;
}

export async function getTimeSeriesData(metric: string): Promise<TimeSeriesData> {
  const response = await apiClient.get<TimeSeriesData>(`/monitoring/timeseries/${metric}`);
  return response.data;
}
