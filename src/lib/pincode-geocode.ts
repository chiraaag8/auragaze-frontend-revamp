import {
  distanceFromOriginKm,
  shippingFeeForDistanceKm,
  shippingTierForDistanceKm,
  type ShippingRateTier,
} from "@/lib/shipping-distance";

export type PincodeCoords = {
  postalCode: string;
  lat: number;
  lng: number;
  placeName: string;
};

export type ShippingQuote = {
  postalCode: string;
  distanceKm: number;
  shippingFee: number;
  tier: ShippingRateTier;
  placeName: string;
};

type CacheEntry = PincodeCoords & { cachedAt: number };

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const cache = new Map<string, CacheEntry>();
let lastNominatimAt = 0;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function respectNominatimRateLimit() {
  const elapsed = Date.now() - lastNominatimAt;
  if (elapsed < 1100) {
    await sleep(1100 - elapsed);
  }
  lastNominatimAt = Date.now();
}

export async function geocodeIndianPincode(
  postalCode: string,
): Promise<PincodeCoords> {
  const pin = postalCode.trim();
  if (!/^\d{6}$/.test(pin)) {
    throw new Error("Enter a valid 6-digit postal code");
  }

  const cached = cache.get(pin);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return {
      postalCode: cached.postalCode,
      lat: cached.lat,
      lng: cached.lng,
      placeName: cached.placeName,
    };
  }

  await respectNominatimRateLimit();

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("postalcode", pin);
  url.searchParams.set("country", "India");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "AuragazeCheckout/1.0 (shipping distance)",
      Accept: "application/json",
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error("Unable to look up this postal code right now");
  }

  const data = (await response.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
  }>;

  const hit = data[0];
  const lat = hit?.lat ? Number(hit.lat) : NaN;
  const lng = hit?.lon ? Number(hit.lon) : NaN;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("We couldn't locate this postal code. Check and try again.");
  }

  const coords: CacheEntry = {
    postalCode: pin,
    lat,
    lng,
    placeName: hit?.display_name?.split(",")[0]?.trim() || pin,
    cachedAt: Date.now(),
  };
  cache.set(pin, coords);

  return {
    postalCode: coords.postalCode,
    lat: coords.lat,
    lng: coords.lng,
    placeName: coords.placeName,
  };
}

export async function quoteShippingForPostalCode(
  postalCode: string,
): Promise<ShippingQuote> {
  const coords = await geocodeIndianPincode(postalCode);
  const distanceKm = distanceFromOriginKm(coords.lat, coords.lng);
  const roundedKm = Math.round(distanceKm * 10) / 10;
  const shippingFee = shippingFeeForDistanceKm(distanceKm);
  const tier = shippingTierForDistanceKm(distanceKm);

  return {
    postalCode: coords.postalCode,
    distanceKm: roundedKm,
    shippingFee,
    tier,
    placeName: coords.placeName,
  };
}
