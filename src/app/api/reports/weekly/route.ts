import { NextResponse } from "next/server";
import { z } from "zod";
import { callDeepseekJson, hasDeepseekConfig } from "@/lib/ai/deepseek";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const weeklyReportRequestSchema = z.object({
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

interface WeeklyInsightResponse {
  summary: string;
  insights: Array<{
    title: string;
    detail: string;
    action: string;
  }>;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedBody = weeklyReportRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Invalid weekly report request.",
          details: parsedBody.error.flatten()
        }
      },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "请先登录后再生成周报。" } },
        { status: 401 }
      );
    }

    const context = await loadWeeklyContext(user.id, parsedBody.data.weekStartDate);
    const report = await generateWeeklyReport(context);

    const { error } = await supabase.from("weekly_reports").upsert(
      {
        user_id: user.id,
        week_start_date: parsedBody.data.weekStartDate,
        report_data: context,
        ai_insights: report.insights
      },
      { onConflict: "user_id,week_start_date" }
    );

    if (error) {
      return NextResponse.json(
        { error: { code: "save_failed", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      weekStartDate: parsedBody.data.weekStartDate,
      summary: report.summary,
      insights: report.insights,
      source: hasDeepseekConfig() ? "deepseek" : "local_fallback"
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "weekly_report_failed",
          message: error instanceof Error ? error.message : "生成周报失败。"
        }
      },
      { status: 500 }
    );
  }
}

async function loadWeeklyContext(userId: string, weekStartDate: string) {
  const supabase = createSupabaseServerClient();
  const weekEnd = addDays(weekStartDate, 7);

  const [{ data: tasks }, { data: outcomes }, { data: review }, { data: moodNotes }] = await Promise.all([
    supabase
      .from("tasks")
      .select("title,project_id,category,priority,estimated_minutes,status,scheduled_start,completed_at")
      .eq("user_id", userId)
      .gte("scheduled_start", `${weekStartDate}T00:00:00+00:00`)
      .lt("scheduled_start", `${weekEnd}T00:00:00+00:00`),
    supabase
      .from("outcome_metrics")
      .select("metric_date,platform,metric_key,metric_value")
      .eq("user_id", userId)
      .gte("metric_date", weekStartDate)
      .lt("metric_date", weekEnd)
      .order("metric_date", { ascending: false }),
    supabase
      .from("weekly_self_reviews")
      .select("most_satisfied,most_frustrated,next_week_focus")
      .eq("user_id", userId)
      .eq("week_start_date", weekStartDate)
      .maybeSingle(),
    supabase
      .from("daily_mood_notes")
      .select("note_date,energy_mode,mood_note")
      .eq("user_id", userId)
      .gte("note_date", weekStartDate)
      .lt("note_date", weekEnd)
      .order("note_date", { ascending: true })
  ]);

  const taskRows = tasks || [];
  const completedTasks = taskRows.filter((task) => task.status === "completed");
  const totalMinutes = taskRows.reduce((sum, task) => sum + Number(task.estimated_minutes || 0), 0);
  const completedMinutes = completedTasks.reduce((sum, task) => sum + Number(task.estimated_minutes || 0), 0);

  return {
    weekStartDate,
    weekEndDate: addDays(weekStartDate, 6),
    taskStats: {
      total: taskRows.length,
      completed: completedTasks.length,
      completionRate: taskRows.length ? Math.round((completedTasks.length / taskRows.length) * 100) : 0,
      plannedHours: Number((totalMinutes / 60).toFixed(1)),
      completedHours: Number((completedMinutes / 60).toFixed(1))
    },
    tasks: taskRows.slice(0, 20),
    outcomes: outcomes || [],
    selfReview: review || null,
    moodNotes: moodNotes || []
  };
}

async function generateWeeklyReport(context: Awaited<ReturnType<typeof loadWeeklyContext>>) {
  if (!hasDeepseekConfig()) return generateLocalReport(context);

  try {
    return await callDeepseekJson<WeeklyInsightResponse>({
      systemPrompt: buildWeeklyReportPrompt(),
      userMessage: JSON.stringify(context),
      temperature: 0.2,
      maxTokens: 900
    });
  } catch {
    return generateLocalReport(context);
  }
}

function generateLocalReport(context: Awaited<ReturnType<typeof loadWeeklyContext>>): WeeklyInsightResponse {
  const insights: WeeklyInsightResponse["insights"] = [];
  const review = context.selfReview;

  if (review?.most_frustrated) {
    insights.push({
      title: "先处理你明确感到受挫的地方",
      detail: `你提到最受挫的是「${review.most_frustrated}」。这类信息比单纯完成率更重要，说明下周需要减少阻力而不是硬加任务。`,
      action: "把相关任务拆成 30-60 分钟的小块，并放在上午第一个时间段。"
    });
  }

  if (context.taskStats.completionRate < 60 && context.taskStats.total > 0) {
    insights.push({
      title: "本周排程可能偏满",
      detail: `本周完成率为 ${context.taskStats.completionRate}%，计划投入 ${context.taskStats.plannedHours} 小时，实际完成约 ${context.taskStats.completedHours} 小时。`,
      action: "下周先把每日产能按 80% 安排，保留缓冲给突发沟通和返工。"
    });
  } else {
    insights.push({
      title: "保持当前节奏",
      detail: `本周完成 ${context.taskStats.completed}/${context.taskStats.total} 件任务，完成投入约 ${context.taskStats.completedHours} 小时。`,
      action: "下周继续保留每天 1 件关键任务，不要让运营杂事挤掉主线推进。"
    });
  }

  if (context.outcomes.length > 0) {
    const metricCount = context.outcomes.length;
    insights.push({
      title: "运营数据已经开始形成样本",
      detail: `本周记录了 ${metricCount} 条运营指标，可以开始把任务投入和外部结果放在一起看。`,
      action: "下周固定同一时间补报数据，至少覆盖播放/阅读、互动、涨粉三个指标。"
    });
  } else {
    insights.push({
      title: "复盘缺少外部结果数据",
      detail: "本周还没有运营指标，AI 只能根据任务完成情况判断，容易漏掉内容/销售效果。",
      action: "从明天开始只补 1 个平台的 2-3 个关键指标，先让数据链路跑起来。"
    });
  }

  return {
    summary: `本周完成率 ${context.taskStats.completionRate}%，记录 ${context.outcomes.length} 条运营指标。`,
    insights: insights.slice(0, 3)
  };
}

function buildWeeklyReportPrompt() {
  return `
你是一人公司任务工作站的周复盘助手。根据 JSON 上下文生成严格 JSON。

要求：
- 先尊重用户自评，再结合任务完成和运营数据提出建议。
- 只给 2-3 条洞察。
- 每条洞察必须具体、克制、可执行。
- 不要鸡汤，不要夸张。

返回 JSON：
{
  "summary": "一句话总结",
  "insights": [
    {
      "title": "短标题",
      "detail": "结合具体数据或用户自评的解释",
      "action": "下周可执行动作"
    }
  ]
}
`;
}

function addDays(dateInput: string, days: number) {
  const date = new Date(`${dateInput}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
