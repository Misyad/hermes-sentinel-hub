// Infrastructure domain types

import type { Status } from "./common";

export interface Node {
  id: string;
  name: string;
  type: "controller" | "worker" | "database" | "cache" | "edge";
  status: Status;
  cpu: number;
  memory: number;
  disk: number;
  network?: number;
  uptime: string;
  region: string;
  zone?: string;
}

export interface Cluster {
  id: string;
  name: string;
  status: Status;
  nodeCount: number;
  region: string;
  version: string;
}

export interface Resource {
  id: string;
  name: string;
  type: "compute" | "storage" | "network";
  status: Status;
  utilization: number;
  capacity: number;
  unit: string;
}
