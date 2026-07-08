// Service catalog domain types

import type { Status } from "./common";

export interface Service {
  id: string;
  name: string;
  description: string;
  status: Status;
  version: string;
  owner: string;
  uptime: number;
  requestRate: number;
  errorRate: number;
  latency: number;
  dependencies?: string[];
  endpoints?: ServiceEndpoint[];
}

export interface ServiceEndpoint {
  path: string;
  method: string;
  status: Status;
  responseTime: number;
}

export interface ServiceDependency {
  from: string;
  to: string;
  type: "sync" | "async" | "cache";
  critical: boolean;
}
