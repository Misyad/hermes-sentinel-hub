// Knowledge base domain types

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: RunbookStep[];
  lastUsed?: string;
  usageCount: number;
}

export interface RunbookStep {
  order: number;
  title: string;
  description: string;
  command?: string;
  expectedResult?: string;
}
