const API_BASE_URL = 'http://192.168.1.70:3005';

export interface Container {
  id: string;
  name: string;
  status: string;
  uptime: string;
  cpu: number;
  memory: number;
  node: string;
}

export interface DockerContainer {
  name: string;
  status: string;
  uptime: string;
  health: string;
  port: string;
}

export interface InfrastructureStatus {
  containers: Container[];
}

export interface ContainersStatus {
  containers: DockerContainer[];
}

export interface HealthSummary {
  overall: string;
  services: {
    proxmox: string;
    docker: string;
    containers: number;
    healthy: number;
    unhealthy: number;
  };
  timestamp: string;
}

export const apiClient = {
  async getInfrastructureStatus(): Promise<InfrastructureStatus> {
    const response = await fetch(`${API_BASE_URL}/api/infrastructure/status`);
    if (!response.ok) throw new Error('Failed to fetch infrastructure status');
    return response.json();
  },

  async getContainersStatus(): Promise<ContainersStatus> {
    const response = await fetch(`${API_BASE_URL}/api/containers/status`);
    if (!response.ok) throw new Error('Failed to fetch containers status');
    return response.json();
  },

  async getHealthSummary(): Promise<HealthSummary> {
    const response = await fetch(`${API_BASE_URL}/api/health/summary`);
    if (!response.ok) throw new Error('Failed to fetch health summary');
    return response.json();
  },
};
