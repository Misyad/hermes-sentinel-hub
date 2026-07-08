// Shared TypeScript interfaces for mock data

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  delta: string;
  deltaTone: 'positive' | 'negative' | 'neutral';
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
  uptime: number;
  latency: number;
  errorRate: number;
  requestsPerSec: number;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'firing' | 'pending' | 'resolved';
  service: string;
  timestamp: string;
  duration: string;
}

export interface Node {
  id: string;
  name: string;
  type: 'controller' | 'worker' | 'database' | 'cache';
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  region: string;
}
