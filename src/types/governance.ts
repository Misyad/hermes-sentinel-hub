// Governance domain types

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  resourceType: string;
  result: "success" | "failure";
  details?: string;
  ip?: string;
}

export interface ComplianceCheck {
  id: string;
  policy: string;
  status: "pass" | "fail" | "warning";
  lastCheck: string;
  findings: string[];
  severity: "critical" | "high" | "medium" | "low";
}

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "implemented";
  requester: string;
  approver?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  scheduledAt?: string;
  createdAt: string;
}
