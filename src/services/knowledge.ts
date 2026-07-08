// Knowledge base domain service

import { apiClient } from "@/lib/api";
import type { KnowledgeArticle, Runbook } from "@/types";

export async function getArticles(filters?: { category?: string; tag?: string }): Promise<KnowledgeArticle[]> {
  const params = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : "";
  const response = await apiClient.get<KnowledgeArticle[]>(`/knowledge/articles${params}`);
  return response.data;
}

export async function getArticle(id: string): Promise<KnowledgeArticle> {
  const response = await apiClient.get<KnowledgeArticle>(`/knowledge/articles/${id}`);
  return response.data;
}

export async function searchKnowledge(query: string): Promise<KnowledgeArticle[]> {
  const response = await apiClient.get<KnowledgeArticle[]>(`/knowledge/search?q=${encodeURIComponent(query)}`);
  return response.data;
}

export async function getRunbooks(): Promise<Runbook[]> {
  const response = await apiClient.get<Runbook[]>("/knowledge/runbooks");
  return response.data;
}
