import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { getXorpayConfig } from "@/lib/xorpay/client";
import { signCallback, verifyXorpaySignature } from "@/lib/xorpay/signature";

export async function POST(request: Request) {
  const form = await request.formData();
  const aoid = String(form.get("aoid") ?? "");
  const orderId = String(form.get("order_id") ?? "");
  const payPrice = String(form.get("pay_price") ?? "");
  const payTime = String(form.get("pay_time") ?? "");
  const more = String(form.get("more") ?? "");
  const detail = String(form.get("detail") ?? "");
  const sign = String(form.get("sign") ?? "");

  if (!aoid || !orderId || !payPrice || !payTime || !sign) {
    return NextResponse.json({ error: "missing_argument" }, { status: 400 });
  }

  const { appSecret } = getXorpayConfig();
  const expected = signCallback({ aoid, orderId, payPrice, payTime, appSecret });

  if (!verifyXorpaySignature(sign, expected)) {
    return NextResponse.json({ error: "sign_error" }, { status: 400 });
  }

  const service = createSupabaseServiceClient();
  const { data: order, error } = await service
    .from("payment_orders")
    .select("user_id,plan,billing_period,status")
    .eq("order_id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "order_not_found" }, { status: 404 });
  }

  await service
    .from("payment_orders")
    .update({
      xorpay_aoid: aoid,
      status: "paid",
      paid_at: new Date(payTime.replace(" ", "T")).toISOString(),
      raw_response: {
        aoid,
        order_id: orderId,
        pay_price: payPrice,
        pay_time: payTime,
        more,
        detail
      }
    })
    .eq("order_id", orderId);

  const now = new Date();
  const current = await service
    .from("subscriptions")
    .select("current_period_end")
    .eq("user_id", order.user_id)
    .single();
  const base =
    current.data?.current_period_end && new Date(current.data.current_period_end) > now
      ? new Date(current.data.current_period_end)
      : now;
  const nextEnd = new Date(base);
  if (order.billing_period === "yearly") {
    nextEnd.setFullYear(nextEnd.getFullYear() + 1);
  } else {
    nextEnd.setMonth(nextEnd.getMonth() + 1);
  }

  await service
    .from("subscriptions")
    .update({
      plan: order.plan,
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: nextEnd.toISOString()
    })
    .eq("user_id", order.user_id);

  return new Response("ok", { status: 200 });
}
