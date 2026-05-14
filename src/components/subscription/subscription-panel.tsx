"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface SubscriptionState {
  authenticated: boolean;
  subscription: {
    plan: "trial" | "basic" | "pro";
    status: "trialing" | "active" | "past_due" | "expired";
    trial_ends_at: string | null;
    current_period_end: string | null;
  } | null;
  error?: string;
}

interface CheckoutState {
  orderId: string;
  status: string;
  qrUrl: string | null;
  amount: number;
  expiresIn: number;
}

export function SubscriptionPanel() {
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/subscription")
      .then((response) => response.json())
      .then((data: SubscriptionState) => setSubscription(data))
      .catch((error: Error) => setMessage(error.message));
  }, []);

  async function startCheckout(plan: "basic" | "pro", billingPeriod: "monthly" | "yearly") {
    setLoading(true);
    setMessage(null);
    setCheckout(null);

    const response = await fetch("/api/subscription/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan, billingPeriod, payType: "native" })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error?.message ?? "创建支付订单失败。请确认 XORPAY 环境变量已配置。");
      return;
    }

    setCheckout(data as CheckoutState);
  }

  const sub = subscription?.subscription;
  const periodEnd = sub?.current_period_end || sub?.trial_ends_at;

  return (
    <section className="mt-5 max-w-[720px] rounded-lg border border-border-default bg-bg-subtle p-4">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-medium">订阅</h2>
          <p className="mt-1 text-sm text-text-muted">
            {sub
              ? `${planLabel(sub.plan)} · ${statusLabel(sub.status)}${periodEnd ? ` · 有效至 ${new Date(periodEnd).toLocaleDateString("zh-CN")}` : ""}`
              : subscription?.authenticated === false
                ? "登录后可查看 14 天试用和套餐状态。"
                : "正在读取订阅状态..."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <PlanCard
          description="每日 50 次 AI 调用，最多 10 个项目。"
          disabled={loading || subscription?.authenticated === false}
          name="基础版"
          onMonthly={() => startCheckout("basic", "monthly")}
          onYearly={() => startCheckout("basic", "yearly")}
          price="¥68/月"
        />
        <PlanCard
          description="每日 200 次 AI 调用，不限项目。"
          disabled={loading || subscription?.authenticated === false}
          name="专业版"
          onMonthly={() => startCheckout("pro", "monthly")}
          onYearly={() => startCheckout("pro", "yearly")}
          price="¥128/月"
        />
      </div>

      {checkout ? (
        <div className="mt-4 rounded-md border border-border-default bg-bg-default p-3">
          <div className="text-sm font-medium">支付订单已创建</div>
          <p className="mt-1 text-sm text-text-muted">
            订单 {checkout.orderId} · ¥{checkout.amount} · 请使用微信扫码支付。
          </p>
          {checkout.qrUrl ? (
            <Image
              alt="XORPAY payment QR code"
              className="mt-3 h-40 w-40 rounded-md border border-border-default bg-white p-2"
              height={160}
              src={`https://xorpay.com/qr?data=${encodeURIComponent(checkout.qrUrl)}`}
              width={160}
            />
          ) : null}
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-md border border-border-default bg-[var(--warning-bg)] px-3 py-2 text-sm text-[var(--warning-fg)]">
          {message}
        </div>
      ) : null}
    </section>
  );
}

function PlanCard({
  name,
  price,
  description,
  disabled,
  onMonthly,
  onYearly
}: {
  name: string;
  price: string;
  description: string;
  disabled: boolean;
  onMonthly: () => void;
  onYearly: () => void;
}) {
  return (
    <article className="rounded-md border border-border-default bg-bg-default p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">{name}</h3>
          <p className="mt-1 text-xs text-text-muted">{description}</p>
        </div>
        <span className="text-sm font-medium">{price}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          className="h-8 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse disabled:opacity-50"
          disabled={disabled}
          onClick={onMonthly}
        >
          月付
        </button>
        <button
          className="h-8 rounded-md border border-border-default px-3 text-sm hover:bg-bg-hover disabled:opacity-50"
          disabled={disabled}
          onClick={onYearly}
        >
          年付
        </button>
      </div>
    </article>
  );
}

function planLabel(plan: string) {
  return { trial: "14 天试用", basic: "基础版", pro: "专业版" }[plan] ?? plan;
}

function statusLabel(status: string) {
  return { trialing: "试用中", active: "有效", past_due: "待续费", expired: "已过期" }[status] ?? status;
}
