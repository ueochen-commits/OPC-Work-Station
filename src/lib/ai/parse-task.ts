import { callDeepseekJson, hasDeepseekConfig } from "@/lib/ai/deepseek";
import { parseLocalNaturalTask } from "@/lib/local/natural-language";
import type { ParseResponse, QuickTaskParseResult } from "@/types/parse";

interface DeepseekQuickTask {
  title: string;
  project?: string | null;
  estimatedMinutes: number;
  priority: "high" | "key" | "normal" | "low";
  scheduledDate: string;
  scheduledTime: string;
  reasoning: string;
  confidence: number;
}

export async function parseTaskInput(input: string, existingTaskCount = 0): Promise<ParseResponse> {
  const fallback = parseLocalNaturalTask(input, existingTaskCount);

  if (!hasDeepseekConfig()) {
    return {
      intent: "quick_task",
      confidence: fallback.confidence,
      source: "local_fallback",
      result: fallback,
      warning: "DeepSeek is not configured; used local parser."
    };
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const parsed = await callDeepseekJson<DeepseekQuickTask>({
      systemPrompt: buildQuickTaskPrompt(today),
      userMessage: input,
      temperature: 0.1,
      maxTokens: 600
    });

    const result: QuickTaskParseResult = {
      title: parsed.title || fallback.title,
      project: parsed.project || fallback.project,
      estimatedMinutes: normalizeMinutes(parsed.estimatedMinutes, fallback.estimatedMinutes),
      priority: parsed.priority || fallback.priority,
      scheduledDate: parsed.scheduledDate || fallback.scheduledDate,
      scheduledTime: parsed.scheduledTime || fallback.scheduledTime,
      reasoning: parsed.reasoning || "DeepSeek parsed this as a quick task.",
      confidence: clampConfidence(parsed.confidence)
    };

    return {
      intent: "quick_task",
      confidence: result.confidence,
      source: "deepseek",
      result
    };
  } catch (error) {
    return {
      intent: "quick_task",
      confidence: fallback.confidence,
      source: "local_fallback",
      result: fallback,
      warning: error instanceof Error ? error.message : "DeepSeek failed; used local parser."
    };
  }
}

function buildQuickTaskPrompt(today: string) {
  return `
你是一个一人公司任务工作站的快速任务解析器。把用户的一句话解析为严格 JSON。

今天日期：${today}

规则：
- 只处理 quick_task。若用户输入不像任务，也尽量抽取最接近的待办。
- title: 精简成 4-18 个中文字符，不要包含日期、时长、语气词。
- project: 可为空。客户名 + 合作可作为项目，例如“小米合作”。
- estimatedMinutes: 分钟。用户未说明时：简单沟通 30，内容/脚本 90，课程/方案 120，其他 60。
- priority: high | key | normal | low。客户/截止/今天/明天通常 high；关键/必须通常 key；不急/有空通常 low。
- scheduledDate: YYYY-MM-DD。
- scheduledTime: HH:mm。上午 09:00，下午 14:00，晚上 19:30；未说明时 09:00。
- reasoning: 20 字以内，说明你怎么理解。
- confidence: 0-1。

只返回 JSON：
{
  "title": "...",
  "project": "...",
  "estimatedMinutes": 90,
  "priority": "normal",
  "scheduledDate": "YYYY-MM-DD",
  "scheduledTime": "09:00",
  "reasoning": "...",
  "confidence": 0.8
}
`;
}

function normalizeMinutes(value: number, fallback: number) {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(720, Math.max(5, Math.round(value)));
}

function clampConfidence(value: number) {
  if (!Number.isFinite(value)) return 0.7;
  return Math.min(1, Math.max(0, value));
}
