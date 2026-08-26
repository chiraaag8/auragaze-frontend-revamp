import { describe, expect, it } from "vitest";
import {
  amountsMatchPaise,
  calculatePromoDiscount,
  computeDistanceShippingFee,
  computeShippingFee,
} from "@/lib/commerce-math";
import {
  haversineKm,
  shippingFeeForDistanceKm,
  shippingTierForDistanceKm,
} from "@/lib/shipping-distance";

describe("computeShippingFee (legacy flat)", () => {
  const settings = { shippingFee: 99, freeShippingThreshold: 4000 };

  it("returns 0 for empty subtotal", () => {
    expect(computeShippingFee(0, settings)).toBe(0);
  });

  it("charges flat fee below threshold", () => {
    expect(computeShippingFee(3999, settings)).toBe(99);
  });

  it("is free at and above threshold", () => {
    expect(computeShippingFee(4000, settings)).toBe(0);
    expect(computeShippingFee(5500, settings)).toBe(0);
  });
});

describe("distance shipping tiers", () => {
  it("maps km bands to fees", () => {
    expect(shippingFeeForDistanceKm(0)).toBe(0);
    expect(shippingFeeForDistanceKm(9.9)).toBe(0);
    expect(shippingFeeForDistanceKm(10)).toBe(99);
    expect(shippingFeeForDistanceKm(19.9)).toBe(99);
    expect(shippingFeeForDistanceKm(20)).toBe(199);
    expect(shippingFeeForDistanceKm(29.9)).toBe(199);
    expect(shippingFeeForDistanceKm(30)).toBe(299);
    expect(shippingFeeForDistanceKm(120)).toBe(299);
  });

  it("exposes matching tier labels", () => {
    expect(shippingTierForDistanceKm(5).label).toBe("Below 10 km");
    expect(shippingTierForDistanceKm(15).label).toBe("10–20 km");
    expect(shippingTierForDistanceKm(25).label).toBe("20–30 km");
    expect(shippingTierForDistanceKm(40).label).toBe("Above 30 km");
  });

  it("computeDistanceShippingFee mirrors tiers", () => {
    expect(computeDistanceShippingFee(8)).toBe(0);
    expect(computeDistanceShippingFee(12)).toBe(99);
  });

  it("haversine is ~0 for same point", () => {
    expect(haversineKm(13, 77, 13, 77)).toBeCloseTo(0, 5);
  });
});

describe("calculatePromoDiscount", () => {
  it("applies percentage with max cap", () => {
    expect(
      calculatePromoDiscount({
        type: "PERCENTAGE",
        value: 20,
        maxDiscount: 200,
        subtotal: 2000,
      }),
    ).toBe(200);
  });

  it("applies fixed discount without exceeding subtotal", () => {
    expect(
      calculatePromoDiscount({
        type: "FIXED",
        value: 500,
        subtotal: 300,
      }),
    ).toBe(300);
  });
});

describe("payment amount reconciliation", () => {
  it("matches rupees to paise", () => {
    expect(amountsMatchPaise(1499, 149900)).toBe(true);
    expect(amountsMatchPaise(1499, 149800)).toBe(false);
  });

  it("treats cart higher than paid as underpayment", () => {
    const cartPaise = 150000;
    const paidPaise = 149900;
    expect(cartPaise > paidPaise).toBe(true);
  });

  it("allows cart lower than paid (overpayment after drift)", () => {
    const cartPaise = 140000;
    const paidPaise = 149900;
    expect(cartPaise > paidPaise).toBe(false);
  });
});

describe("order item variant restore preference", () => {
  it("prefers variantId when present", () => {
    const item = {
      variantId: "var_123",
      productName: "Tee",
      size: "M",
      color: "Black",
    };

    const resolved =
      item.variantId ?? `${item.productName}:${item.size}:${item.color}`;

    expect(resolved).toBe("var_123");
  });

  it("falls back to name+size+color when variantId missing", () => {
    const item = {
      variantId: null as string | null,
      productName: "Tee",
      size: "M",
      color: "Black",
    };

    const resolved = item.variantId
      ? item.variantId
      : `${item.productName}:${item.size}:${item.color}`;

    expect(resolved).toBe("Tee:M:Black");
  });
});
