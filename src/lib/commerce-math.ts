import type { ShippingSettings } from "@/types/admin-settings";
import { shippingFeeForDistanceKm } from "@/lib/shipping-distance";

/**
 * Legacy flat-fee helper (admin threshold). Prefer distance-based
 * `computeDistanceShippingFee` for checkout.
 */
export function computeShippingFee(
  subtotal: number,
  settings: ShippingSettings,
): number {
  if (subtotal <= 0) return 0;
  return subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
}

/** Distance-tier shipping from Malleshwaram origin. */
export function computeDistanceShippingFee(distanceKm: number): number {
  return shippingFeeForDistanceKm(distanceKm);
}

export function calculatePromoDiscount(input: {
  type: "PERCENTAGE" | "FIXED";
  value: number;
  maxDiscount?: number | null;
  subtotal: number;
}): number {
  const { type, value, maxDiscount, subtotal } = input;
  if (subtotal <= 0) return 0;

  let discount = 0;
  if (type === "PERCENTAGE") {
    discount = (subtotal * value) / 100;
    if (maxDiscount != null) {
      discount = Math.min(discount, maxDiscount);
    }
  } else {
    discount = value;
  }

  return Math.min(subtotal, Math.max(0, Math.round(discount)));
}

export function amountsMatchPaise(orderTotalRupees: number, paidPaise: number) {
  return Math.round(orderTotalRupees * 100) === paidPaise;
}
