import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Store timezone — order times are always shown in India local time. */
export const STORE_TIME_ZONE = "Asia/Kolkata";

export function formatDateTime(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: STORE_TIME_ZONE,
    ...(options ?? { dateStyle: "medium", timeStyle: "short" }),
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatDate(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: STORE_TIME_ZONE,
    ...(options ?? {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function getDiscountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
