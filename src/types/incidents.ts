// Incident domain types

export interface Incident {
  id: string;
  title: string;
  severity: "SEV1" | "SEV2" | "SEV3" | "SEV4";
  status: "open" | "investigating" | "mitigated" | "resolved";
  service: string;
  startTime: string;
  duration?: string;
  impact: string;
  assignee?: string;
  affectedUsers?: number;
}

export interface IncidentTimeline {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface IncidentDetail extends Incident {
  description: string;
  timeline: IncidentTimeline[];
  relatedAlerts: string[];
  rootCause?: string;
  resolution?: string;
}
