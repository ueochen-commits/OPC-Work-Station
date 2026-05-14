import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { queryXorpayOrder } from "@/lib/xorpay/client";

export async function GET(_request: Request, { params }: { params: { orderId: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "Please sign in first." } }, { status: 401 });
  }

  const { data: order, error } = await supabase
    .from("payment_orders")
    .select("order_id,status,qr_url,amount_cny,plan,billing_period,created_at")
    .eq("user_id", user.id)
    .eq("order_id", params.orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: { code: "not_found", message: "Order not found." } }, { status: 404 });
  }

  try {
    const xorpay = await queryXorpayOrder(params.orderId);
    return NextResponse.json({ order, xorpayStatus: xorpay.status });
  } catch {
    return NextResponse.json({ order, xorpayStatus: null });
  }
}
