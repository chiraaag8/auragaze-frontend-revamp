/** Dispatch origin for distance-based shipping (Malleshwaram, Bengaluru). */
export const SHIPPING_ORIGIN = {
  name: "Malleshwaram",
  city: "Bengaluru",
  lat: 13.0035,
  lng: 77.5647,
} as const;

export type ShippingRateTier = {
  /** Upper bound exclusive; use Infinity for the top tier. */
  maxKmExclusive: number;
  fee: number;
  label: string;
  shortLabel: string;
};

export const SHIPPING_RATE_TIERS: readonly ShippingRateTier[] = [
  {
    maxKmExclusive: 10,
    fee: 0,
    label: "Below 10 km",
    shortLabel: "Free",
  },
  {
    maxKmExclusive: 20,
    fee: 99,
    label: "10–20 km",
    shortLabel: "₹99",
  },
  {
    maxKmExclusive: 30,
    fee: 199,
    label: "20–30 km",
    shortLabel: "₹199",
  },
  {
    maxKmExclusive: Number.POSITIVE_INFINITY,
    fee: 299,
    label: "Above 30 km",
    shortLabel: "₹299",
  },
] as const;

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function shippingFeeForDistanceKm(distanceKm: number): number {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new Error("Invalid delivery distance");
  }
  for (const tier of SHIPPING_RATE_TIERS) {
    if (distanceKm < tier.maxKmExclusive) return tier.fee;
  }
  return 299;
}

export function shippingTierForDistanceKm(distanceKm: number): ShippingRateTier {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new Error("Invalid delivery distance");
  }
  for (const tier of SHIPPING_RATE_TIERS) {
    if (distanceKm < tier.maxKmExclusive) return tier;
  }
  return SHIPPING_RATE_TIERS[SHIPPING_RATE_TIERS.length - 1]!;
}

export function distanceFromOriginKm(lat: number, lng: number): number {
  return haversineKm(SHIPPING_ORIGIN.lat, SHIPPING_ORIGIN.lng, lat, lng);
}
