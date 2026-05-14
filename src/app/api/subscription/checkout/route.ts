import { NextResponse } from "next/server";
import { z } from "zod";
import { createXorpayOrder } from "@/lib/xorpay/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  formatCny,
  getPlanAmount,
  normalizeBillingPeriod,
  normalizePayType,
  normalizePlan
} from "@/lib/subscription/plans";

const checkoutSchema = z.object({
  plan: z.enum(["basic", "pro"]).default("basic"),
  billingPeriod: z.enum(["monthly", "yearly"]).default("monthly"),
  payType: z.enum(["native", "alipay", "jsapi"]).default("native")
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: { code: "validation_error", message: "Invalid checkout request." } }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "Please sign in first." } }, { status: 401 });
  }

  const plan = normalizePlan(parsed.data.plan);
  const billingPeriod = normalizeBillingPeriod(parsed.data.billingPeriod);
  const payType = normalizePayType(parsed.data.payType);
  const amount = getPlanAmount(plan, billingPeriod);
  const orderId = `opc_${Date.now()}_${user.id.slice(0, 8)}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const notifyUrl = `${appUrl}/api/webhooks/xorpay`;

  try {
    const response = await createXorpayOrder({
      name: `OPC Work Station ${plan === "basic" ? "基础版" : "专业版"}${billingPeriod === "yearly" ? "年付" : "月付"}`,
      payType,
      price: formatCny(amount),
      orderId,
      orderUid: user.email ?? user.id,
      notifyUrl,
      more: JSON.stringify({ userId: user.id, plan, billingPeriod }),
      expire: 7200
    });

    const service = createSupabaseServiceClient();
    const { error } = await service.from("payment_orders").insert({
      user_id: user.id,
      order_id: orderId,
      xorpay_aoid: response.aoid ?? null,
      plan,
      billing_period: billingPeriod,
      pay_type: payType,
      amount_cny: amount,
      status: response.status === "ok" ? "pending" : "failed",
      qr_url: response.info?.qr ?? null,
      raw_response: response
    });

    if (error) {
      return NextResponse.json({ error: { code: "order_record_failed", message: error.message } }, { status: 500 });
    }

    return NextResponse.json({
      orderId,
      status: response.status,
      qrUrl: response.info?.qr ?? null,
      aoid: response.aoid ?? null,
      amount,
      expiresIn: response.expires_in ?? response.expire_in ?? 7200
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "xorpay_unavailable",
          message: error instanceof Error ? error.message : "XORPAY checkout failed."
        }
      },
      { status: 502 }
    );
  }
}
