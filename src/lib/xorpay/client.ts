import { signPaymentRequest, signQueryRequest } from "./signature";

export interface CreateXorpayOrderInput {
  name: string;
  payType: "native" | "alipay" | "jsapi";
  price: string;
  orderId: string;
  orderUid?: string;
  notifyUrl: string;
  more?: string;
  expire?: number;
}

export interface XorpayPayResponse {
  status: string;
  aoid?: string;
  expires_in?: number;
  expire_in?: number;
  info?: {
    qr?: string;
    [key: string]: unknown;
  };
}

export function getXorpayConfig() {
  const aid = process.env.XORPAY_AID;
  const appSecret = process.env.XORPAY_APP_SECRET;
  const baseUrl = process.env.XORPAY_BASE_URL ?? "https://xorpay.com";

  if (!aid || !appSecret) {
    throw new Error("Missing XORPAY_AID or XORPAY_APP_SECRET");
  }

  return { aid, appSecret, baseUrl };
}

export async function createXorpayOrder(input: CreateXorpayOrderInput): Promise<XorpayPayResponse> {
  const { aid, appSecret, baseUrl } = getXorpayConfig();
  const body = new URLSearchParams({
    name: input.name,
    pay_type: input.payType,
    price: input.price,
    order_id: input.orderId,
    notify_url: input.notifyUrl,
    sign: signPaymentRequest({
      name: input.name,
      payType: input.payType,
      price: input.price,
      orderId: input.orderId,
      notifyUrl: input.notifyUrl,
      appSecret
    })
  });

  if (input.orderUid) body.set("order_uid", input.orderUid);
  if (input.more) body.set("more", input.more);
  if (input.expire) body.set("expire", String(input.expire));

  const response = await fetch(`${baseUrl}/api/pay/${aid}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    throw new Error(`XORPAY pay request failed: ${response.status}`);
  }

  return response.json() as Promise<XorpayPayResponse>;
}

export async function queryXorpayOrder(orderId: string) {
  const { aid, appSecret, baseUrl } = getXorpayConfig();
  const sign = signQueryRequest({ orderId, appSecret });
  const url = `${baseUrl}/api/query2/${aid}?order_id=${encodeURIComponent(orderId)}&sign=${sign}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`XORPAY query request failed: ${response.status}`);
  }

  return response.json() as Promise<{ status: string }>;
}
