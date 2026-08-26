"use client";

import { SHIPPING_ORIGIN, SHIPPING_RATE_TIERS } from "@/lib/shipping-distance";
import { formatPrice } from "@/lib/utils";

export default function AdminShippingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--label-accent)]">
          Store
        </p>
        <h1 className="font-heading text-3xl font-black tracking-tight">
          Shipping
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted-strong)]">
          Distance-based rates from {SHIPPING_ORIGIN.name}, {SHIPPING_ORIGIN.city}.
          Checkout calculates the fee from the customer&apos;s postal code.
        </p>
      </div>

      <div className="surface-card max-w-lg space-y-3 rounded-2xl p-5">
        <h2 className="text-sm font-bold">Live rate card</h2>
        <ul className="space-y-2 text-sm">
          {SHIPPING_RATE_TIERS.map((tier) => (
            <li
              key={tier.label}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5"
            >
              <span className="text-[var(--muted-strong)]">{tier.label}</span>
              <span className="font-semibold">
                {tier.fee === 0 ? "Free" : formatPrice(tier.fee)}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-[var(--muted)]">
          These tiers are fixed in code. Cash on delivery is disabled — checkout
          is online payment only.
        </p>
      </div>
    </div>
  );
}
