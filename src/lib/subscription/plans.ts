import type { BillingPeriod, SubscriptionPlan, XorpayPayType } from "@/types/domain";

export const paidPlans = {
  basic: {
    name: "基础版",
    monthly: 68,
    yearly: 680,
    dailyAiLimit: 50,
    projectLimit: 10
  },
  pro: {
    name: "专业版",
    monthly: 128,
    yearly: 1280,
    dailyAiLimit: 200,
    projectLimit: null
  }
} as const;

export type PaidPlan = Exclude<SubscriptionPlan, "trial">;

export function getPlanAmount(plan: PaidPlan, billingPeriod: BillingPeriod) {
  return paidPlans[plan][billingPeriod === "monthly" ? "monthly" : "yearly"];
}

export function formatCny(amount: number) {
  return amount.toFixed(2);
}

export function normalizePayType(value: unknown): XorpayPayType {
  return value === "alipay" || value === "jsapi" || value === "native" ? value : "native";
}

export function normalizePlan(value: unknown): PaidPlan {
  return value === "pro" ? "pro" : "basic";
}

export function normalizeBillingPeriod(value: unknown): BillingPeriod {
  return value === "yearly" ? "yearly" : "monthly";
}
