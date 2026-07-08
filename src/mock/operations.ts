// Mock data for operations: incidents, alerts, monitoring

import type { TimeSeriesPoint, Metric, ServiceHealth, Alert } from './types';

// Monitoring Metrics
export const mockMonitoringMetrics: Metric[] = [
  {
    label: 'CPU Average',
    value: 67.4,
    unit: '%',
    trend: 'up',
    delta: '+4.2%',
    deltaTone: 'negative',
  },
  {
    label: 'Memory Average',
    value: 82.1,
    unit: '%',
    trend: 'stable',
    delta: '0%',
    deltaTone: 'neutral',
  },
  {
    label: 'Network I/O',
    value: 245,
    unit: 'Mbps',
    trend: 'up',
    delta: '+12%',
    deltaTone: 'positive',
  },
  {
    label: 'Error Rate',
    value: 0.34,
    unit: '%',
    trend: 'down',
    delta: '-0.08%',
    deltaTone: 'positive',
  },
];

// Generate time series data (last 48 data points = 24 hours at 30min intervals)
export const mockCpuTimeSeries: TimeSeriesPoint[] = Array.from({ length: 48 }, (_, i) => ({
  timestamp: Date.now() - (47 - i) * 30 * 60 * 1000,
  value: Math.max(0, Math.min(100, 60 + Math.sin(i / 3) * 10 + (i > 35 ? (i - 35) * 2 : 0) + (Math.random() - 0.5) * 5)),
}));

export const mockMemoryTimeSeries: TimeSeriesPoint[] = Array.from({ length: 48 }, (_, i) => ({
  timestamp: Date.now() - (47 - i) * 30 * 60 * 1000,
  value: Math.max(0, Math.min(100, 75 + Math.cos(i / 4) * 8 + (Math.random() - 0.5) * 3)),
}));

export const mockNetworkTimeSeries: TimeSeriesPoint[] = Array.from({ length: 48 }, (_, i) => ({
  timestamp: Date.now() - (47 - i) * 30 * 60 * 1000,
  value: Math.max(0, 200 + Math.sin(i / 2) * 50 + (Math.random() - 0.5) * 30),
}));

export const mockErrorRateTimeSeries: TimeSeriesPoint[] = Array.from({ length: 48 }, (_, i) => ({
  timestamp: Date.now() - (47 - i) * 30 * 60 * 1000,
  value: Math.max(0, 0.3 + Math.sin(i / 5) * 0.2 + (Math.random() - 0.5) * 0.1),
}));

// Service Health
export const mockServiceHealth: ServiceHealth[] = [
  {
    id: 'svc-1',
    name: 'api-gateway',
    status: 'healthy',
    uptime: 99.97,
    latency: 24,
    errorRate: 0.02,
    requestsPerSec: 1847,
  },
  {
    id: 'svc-2',
    name: 'auth-service',
    status: 'healthy',
    uptime: 99.99,
    latency: 18,
    errorRate: 0.01,
    requestsPerSec: 523,
  },
  {
    id: 'svc-3',
    name: 'db-primary',
    status: 'degraded',
    uptime: 98.45,
    latency: 156,
    errorRate: 1.2,
    requestsPerSec: 3204,
  },
  {
    id: 'svc-4',
    name: 'cache-redis',
    status: 'healthy',
    uptime: 99.92,
    latency: 3,
    errorRate: 0.0,
    requestsPerSec: 8942,
  },
  {
    id: 'svc-5',
    name: 'search-elastic',
    status: 'healthy',
    uptime: 99.89,
    latency: 45,
    errorRate: 0.08,
    requestsPerSec: 412,
  },
  {
    id: 'svc-6',
    name: 'queue-kafka',
    status: 'healthy',
    uptime: 99.94,
    latency: 12,
    errorRate: 0.03,
    requestsPerSec: 2145,
  },
  {
    id: 'svc-7',
    name: 'storage-s3',
    status: 'healthy',
    uptime: 99.99,
    latency: 89,
    errorRate: 0.01,
    requestsPerSec: 634,
  },
  {
    id: 'svc-8',
    name: 'cdn-cloudflare',
    status: 'healthy',
    uptime: 100.0,
    latency: 8,
    errorRate: 0.0,
    requestsPerSec: 12453,
  },
  {
    id: 'svc-9',
    name: 'worker-pool',
    status: 'healthy',
    uptime: 99.87,
    latency: 234,
    errorRate: 0.15,
    requestsPerSec: 567,
  },
  {
    id: 'svc-10',
    name: 'notification-svc',
    status: 'healthy',
    uptime: 99.91,
    latency: 67,
    errorRate: 0.04,
    requestsPerSec: 289,
  },
  {
    id: 'svc-11',
    name: 'analytics-pipeline',
    status: 'healthy',
    uptime: 99.84,
    latency: 421,
    errorRate: 0.12,
    requestsPerSec: 145,
  },
  {
    id: 'svc-12',
    name: 'ml-inference',
    status: 'critical',
    uptime: 94.23,
    latency: 1842,
    errorRate: 5.67,
    requestsPerSec: 23,
  },
];

// Active Alerts (Extended for Alerts screen)
export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'High CPU usage on worker-pool-3',
    severity: 'high',
    status: 'firing',
    service: 'worker-pool',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    duration: '12m',
  },
  {
    id: 'alert-2',
    title: 'Database replication lag detected',
    severity: 'medium',
    status: 'firing',
    service: 'db-primary',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    duration: '45m',
  },
  {
    id: 'alert-3',
    title: 'ML inference service degraded',
    severity: 'critical',
    status: 'firing',
    service: 'ml-inference',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: '2h 15m',
  },
  {
    id: 'alert-4',
    title: 'Memory threshold exceeded on api-gateway-2',
    severity: 'high',
    status: 'firing',
    service: 'api-gateway',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    duration: '5m',
  },
  {
    id: 'alert-5',
    title: 'Increased error rate on auth-service',
    severity: 'medium',
    status: 'pending',
    service: 'auth-service',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    duration: '2m',
  },
  {
    id: 'alert-6',
    title: 'Disk space low on storage node',
    severity: 'high',
    status: 'firing',
    service: 'storage-s3',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration: '30m',
  },
  {
    id: 'alert-7',
    title: 'Kafka consumer lag increasing',
    severity: 'medium',
    status: 'firing',
    service: 'queue-kafka',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    duration: '18m',
  },
  {
    id: 'alert-8',
    title: 'SSL certificate expiring soon',
    severity: 'low',
    status: 'firing',
    service: 'cdn-cloudflare',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '3d',
  },
  {
    id: 'alert-9',
    title: 'Elasticsearch cluster health degraded',
    severity: 'high',
    status: 'firing',
    service: 'search-elastic',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    duration: '22m',
  },
  {
    id: 'alert-10',
    title: 'Redis connection pool exhausted',
    severity: 'critical',
    status: 'firing',
    service: 'cache-redis',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    duration: '8m',
  },
  {
    id: 'alert-11',
    title: 'Background job queue backlog growing',
    severity: 'medium',
    status: 'pending',
    service: 'worker-pool',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    duration: '1m',
  },
  {
    id: 'alert-12',
    title: 'API rate limit threshold reached',
    severity: 'low',
    status: 'resolved',
    service: 'api-gateway',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    duration: '15m',
  },
  {
    id: 'alert-13',
    title: 'Database query performance degraded',
    severity: 'medium',
    status: 'resolved',
    service: 'db-primary',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    duration: '35m',
  },
  {
    id: 'alert-14',
    title: 'Network latency spike detected',
    severity: 'high',
    status: 'resolved',
    service: 'cdn-cloudflare',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: '8m',
  },
  {
    id: 'alert-15',
    title: 'Container restart loop detected',
    severity: 'critical',
    status: 'resolved',
    service: 'ml-inference',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    duration: '45m',
  },
];

// For Monitoring screen (active alerts only)
export const mockActiveAlerts = mockAlerts.filter((a) => a.status === 'firing');
