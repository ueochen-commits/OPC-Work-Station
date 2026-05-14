import { createHash, timingSafeEqual } from "crypto";

export function md5(input: string) {
  return createHash("md5").update(input, "utf8").digest("hex").toLowerCase();
}

export function signPaymentRequest(params: {
  name: string;
  payType: string;
  price: string;
  orderId: string;
  notifyUrl: string;
  appSecret: string;
}) {
  return md5(
    `${params.name}${params.payType}${params.price}${params.orderId}${params.notifyUrl}${params.appSecret}`
  );
}

export function signQueryRequest(params: { orderId: string; appSecret: string }) {
  return md5(`${params.orderId}${params.appSecret}`);
}

export function signCallback(params: {
  aoid: string;
  orderId: string;
  payPrice: string;
  payTime: string;
  appSecret: string;
}) {
  return md5(`${params.aoid}${params.orderId}${params.payPrice}${params.payTime}${params.appSecret}`);
}

export function verifyXorpaySignature(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}
