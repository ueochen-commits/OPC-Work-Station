export type Priority = "high" | "key" | "normal" | "low";

export type TaskStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "postponed"
  | "cancelled";

export type ProjectStatus = "planning" | "active" | "paused" | "completed" | "cancelled";

export type EnergyMode = "normal" | "light" | "paused";

export type SubscriptionPlan = "trial" | "basic" | "pro";

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "expired";

export type BillingPeriod = "monthly" | "yearly";

export type XorpayPayType = "native" | "alipay" | "jsapi";

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  priority: Priority;
  estimated_minutes: number;
  actual_minutes: number | null;
  hard_deadline: string | null;
  recurrence_rule: string | null;
  status: TaskStatus;
  scheduled_start: string | null;
  scheduled_end: string | null;
  completed_at: string | null;
  completion_note: string | null;
  lessons_learned: string | null;
  tags: string[];
  source_input: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  target_end_date: string | null;
  actual_end_date: string | null;
  status: ProjectStatus;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentOrder {
  id: string;
  user_id: string;
  order_id: string;
  xorpay_aoid: string | null;
  plan: Exclude<SubscriptionPlan, "trial">;
  billing_period: BillingPeriod;
  pay_type: XorpayPayType;
  amount_cny: number;
  status: "created" | "pending" | "paid" | "failed" | "expired" | "refunded";
  qr_url: string | null;
  raw_response: unknown;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}
