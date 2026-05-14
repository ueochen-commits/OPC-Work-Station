import { NextResponse } from "next/server";
import { z } from "zod";
import { parseTaskInput } from "@/lib/ai/parse-task";
import { paidPlans } from "@/lib/subscription/plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const parseRequestSchema = z.object({
  input: z.string().trim().min(1).max(2000),
  existingTaskCount: z.number().int().min(0).max(200).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedBody = parseRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Invalid parse request.",
          details: parsedBody.error.flatten()
        }
      },
      { status: 400 }
    );
  }

  const quota = await consumeDailyAiQuota();
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: {
          code: quota.reason,
          message: quota.message,
          limit: quota.limit,
          used: quota.used
        }
      },
      { status: quota.reason === "subscription_required" ? 402 : 429 }
    );
  }

  const result = await parseTaskInput(parsedBody.data.input, parsedBody.data.existingTaskCount ?? 0);
  return NextResponse.json({
    ...result,
    quota: quota.tracked
      ? {
          limit: quota.limit,
          used: quota.used
        }
      : null
  });
}

async function consumeDailyAiQuota() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { allowed: true, tracked: false as const };
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan,status,trial_ends_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (subscription && !hasActiveAccess(subscription.status, subscription.trial_ends_at)) {
      return {
        allowed: false,
        tracked: true as const,
        reason: "subscription_required",
        message: "试用或订阅已到期，请订阅后继续使用 AI 解析。",
        limit: 0,
        used: 0
      };
    }

    const limit = subscription?.plan === "pro" ? paidPlans.pro.dailyAiLimit : paidPlans.basic.dailyAiLimit;
    const usageDate = new Date().toISOString().slice(0, 10);
    const { data: usage } = await supabase
      .from("daily_ai_usage")
      .select("call_count")
      .eq("user_id", user.id)
      .eq("usage_date", usageDate)
      .maybeSingle();

    const used = Number(usage?.call_count || 0);
    if (used >= limit) {
      return {
        allowed: false,
        tracked: true as const,
        reason: "ai_quota_exceeded",
        message: `今日 AI 解析次数已用完（${used}/${limit}）。`,
        limit,
        used
      };
    }

    const nextCount = used + 1;
    const { error } = await supabase.from("daily_ai_usage").upsert(
      {
        user_id: user.id,
        usage_date: usageDate,
        call_count: nextCount
      },
      { onConflict: "user_id,usage_date" }
    );

    if (error) {
      return { allowed: true, tracked: false as const };
    }

    return {
      allowed: true,
      tracked: true as const,
      limit,
      used: nextCount
    };
  } catch {
    return { allowed: true, tracked: false as const };
  }
}

function hasActiveAccess(status: string, trialEndsAt: string | null) {
  if (status === "active") return true;
  if (status !== "trialing") return false;
  if (!trialEndsAt) return true;
  return new Date(trialEndsAt).getTime() > Date.now();
}
