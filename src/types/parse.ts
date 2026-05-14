import type { Priority } from "@/types/domain";

export type ParseIntent =
  | "quick_task"
  | "goal_decomposition"
  | "bulk_import"
  | "task_maintenance"
  | "outcome_report"
  | "unknown";

export interface QuickTaskParseResult {
  title: string;
  project?: string;
  estimatedMinutes: number;
  priority: Priority;
  scheduledDate: string;
  scheduledTime: string;
  reasoning: string;
  confidence: number;
}

export interface ParseResponse {
  intent: ParseIntent;
  confidence: number;
  source: "deepseek" | "local_fallback";
  result: QuickTaskParseResult;
  warning?: string;
  quota?: {
    limit: number;
    used: number;
  } | null;
}
