// AI domain types

export interface AIRecommendation {
  id: string;
  title: string;
  reasoning: string;
  action: string;
  confidence: number;
  risk: "low" | "medium" | "high";
  evidence: string[];
  category: "performance" | "cost" | "security" | "reliability";
}

export interface AIAnalysis {
  id: string;
  type: "root-cause" | "prediction" | "optimization" | "anomaly";
  summary: string;
  findings: string[];
  recommendations: AIRecommendation[];
  confidence: number;
  timestamp: string;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}
