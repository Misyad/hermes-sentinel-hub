// Dashboard domain types

import type { Metric } from "./common";
import type { Alert } from "./alerts";
import type { Incident } from "./incidents";
import type { ServiceHealth } from "./monitoring";

export interface DashboardMetrics {
  metrics: Metric[];
  timestamp: string;
}

export interface DashboardSummary {
  metrics: Metric[];
  recentAlerts: Alert[];
  recentIncidents: Incident[];
  serviceHealth: ServiceHealth[];
  timestamp: string;
}
