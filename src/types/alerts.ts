// Alert domain types

import type { Severity, AlertStatus } from "./common";

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  status: AlertStatus;
  service: string;
  timestamp: string;
  duration: string;
  message?: string;
  labels?: Record<string, string>;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: Severity;
  enabled: boolean;
}
