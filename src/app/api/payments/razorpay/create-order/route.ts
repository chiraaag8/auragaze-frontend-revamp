import { NextResponse } from "next/server";
import { CheckoutError, getCheckoutTotals } from "@/lib/checkout-service";
import {
  getRazorpayClient,
  getRazorpayKeyId,
  isRazorpayConfigured,
  rupeesToPaise,
} from "@/lib/razorpay";
import { getSessionUser } from "@/lib/session";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Online payments are not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const promoCode =
    body &&
    typeof body === "object" &&
    typeof (body as { promoCode?: unknown }).promoCode === "string"
      ? (body as { promoCode: string }).promoCode
      : undefined;

  const postalCode =
    body &&
    typeof body === "object" &&
    typeof (body as { postalCode?: unknown }).postalCode === "string"
      ? (body as { postalCode: string }).postalCode
      : undefined;

  try {
    const totals = await getCheckoutTotals(user.id, promoCode, postalCode);
    const amountPaise = rupeesToPaise(totals.total);

    if (amountPaise < 100) {
      return NextResponse.json(
        { error: "Order total must be at least ₹1" },
        { status: 400 },
      );
    }

    const razorpay = getRazorpayClient();
    const receipt = `agz_${user.id.slice(0, 8)}_${Date.now()}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        userId: user.id,
        promoCode: totals.promoCode ?? "",
      },
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: "INR",
      keyId: getRazorpayKeyId(),
      total: totals.total,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Razorpay create-order failed:", error);
    return NextResponse.json(
      { error: "Unable to start online payment" },
      { status: 500 },
    );
  }
}
