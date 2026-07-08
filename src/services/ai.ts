// AI domain service

import { apiClient } from "@/lib/api";
import type { AIRecommendation, AIAnalysis, AIChatMessage } from "@/types";

export async function getRecommendations(context?: string): Promise<AIRecommendation[]> {
  const params = context ? `?context=${encodeURIComponent(context)}` : "";
  const response = await apiClient.get<AIRecommendation[]>(`/ai/recommendations${params}`);
  return response.data;
}

export async function getAnalysis(type: string, targetId?: string): Promise<AIAnalysis> {
  const params = targetId ? `?target=${targetId}` : "";
  const response = await apiClient.get<AIAnalysis>(`/ai/analysis/${type}${params}`);
  return response.data;
}

export async function askAI(message: string, history?: AIChatMessage[]): Promise<AIChatMessage> {
  const response = await apiClient.post<AIChatMessage>("/ai/chat", { message, history });
  return response.data;
}
