import { NextResponse } from "next/server";
import { quoteShippingForPostalCode } from "@/lib/pincode-geocode";
import { SHIPPING_ORIGIN, SHIPPING_RATE_TIERS } from "@/lib/shipping-distance";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postalCode = searchParams.get("postalCode")?.trim() ?? "";

  if (!/^\d{6}$/.test(postalCode)) {
    return NextResponse.json(
      {
        error: "Enter a valid 6-digit postal code",
        origin: SHIPPING_ORIGIN,
        tiers: SHIPPING_RATE_TIERS,
      },
      { status: 400 },
    );
  }

  try {
    const quote = await quoteShippingForPostalCode(postalCode);
    return NextResponse.json({
      ...quote,
      origin: SHIPPING_ORIGIN,
      tiers: SHIPPING_RATE_TIERS,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to calculate shipping for this postal code";
    return NextResponse.json(
      {
        error: message,
        origin: SHIPPING_ORIGIN,
        tiers: SHIPPING_RATE_TIERS,
      },
      { status: 400 },
    );
  }
}
