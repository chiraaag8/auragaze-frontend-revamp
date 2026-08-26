"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RemoteImage from "@/components/RemoteImage";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import PromoCodeForm from "@/components/PromoCodeForm";
import TopBar from "@/components/TopBar";
import PageShell from "@/components/PageShell";
import { useCart } from "@/context/CartContext";
import { SHIPPING_RATE_TIERS } from "@/lib/shipping-distance";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, hydrated, syncing } =
    useCart();
  const [promoDiscount, setPromoDiscount] = useState(0);

  const hasItems = items.length > 0;
  const total = Math.max(0, subtotal - promoDiscount);

  const SummaryCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4 lg:sticky lg:top-24"
    >
      <div className="p-4 rounded-2xl surface-card">
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--foreground)" }}>
          Promo code
        </h3>
        <PromoCodeForm
          subtotal={subtotal}
          onApplied={(promo) => setPromoDiscount(promo?.discount ?? 0)}
        />
      </div>

      <div className="p-4 rounded-2xl surface-card">
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--foreground)" }}>
          Order Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="text-[var(--foreground)]">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Shipping</span>
            <span style={{ color: "var(--foreground)" }}>At checkout</span>
          </div>
          {promoDiscount > 0 ? (
            <div className="flex justify-between text-emerald-600">
              <span>Promo discount</span>
              <span>-{formatPrice(promoDiscount)}</span>
            </div>
          ) : null}
          <p className="text-[11px] text-muted">
            Free within 10 km of Malleshwaram · then{" "}
            {SHIPPING_RATE_TIERS.filter((t) => t.fee > 0)
              .map((t) => t.shortLabel)
              .join(" / ")}{" "}
            by distance
          </p>
          <div
            className="flex justify-between pt-2 mt-2 font-bold"
            style={{ borderTop: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            <span>Total (excl. shipping)</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout" className="hidden lg:block">
        <motion.span
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white btn-gradient no-select shadow-lg"
        >
          Checkout · {formatPrice(total)}
        </motion.span>
      </Link>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${hasItems ? "pb-52 lg:pb-16" : "pb-6"}`}>
      <TopBar title="Cart" />

      <PageShell className="pt-16 lg:pt-24">
        {!hydrated ? (
          <div className="py-20 text-center text-sm" style={{ color: "var(--muted)" }}>
            Loading cart...
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <ShoppingBag size={32} className="label-accent" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
              Your cart is empty
            </h2>
            <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--muted)" }}>
              Discover oversized tees and add pieces to your cart.
            </p>
            <Link href="/shop">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-2xl text-sm font-bold btn-gradient no-select"
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:items-start">
            <div>
              <p className="text-xs lg:text-sm pt-4 pb-3" style={{ color: "var(--muted)" }}>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                  {itemCount}
                </span>{" "}
                {itemCount === 1 ? "item" : "items"}
                {syncing && (
                  <span className="ml-2 text-[10px] uppercase tracking-wide">
                    Syncing…
                  </span>
                )}
              </p>

              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      className="flex gap-3 p-3 lg:p-4 rounded-2xl surface-card"
                    >
                      <Link
                        href={`/product/${item.productId}`}
                        className="relative w-20 h-24 lg:w-24 lg:h-28 flex-none overflow-hidden rounded-xl"
                      >
                        <RemoteImage
                          src={item.image}
                          alt={item.productName}
                          fill
                          width={200}
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <Link href={`/product/${item.productId}`}>
                            <h3
                              className="font-bold text-sm leading-tight line-clamp-2 mb-1"
                              style={{ color: "var(--foreground)" }}
                            >
                              {item.productName}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="price-pill">{formatPrice(item.price)}</span>
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                color: "var(--muted)",
                              }}
                            >
                              Size {item.size}
                            </span>
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                color: "var(--muted)",
                              }}
                            >
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-black/10"
                                style={{ backgroundColor: item.color }}
                              />
                              Color
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 gap-2">
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-lg flex items-center justify-center no-select disabled:opacity-50"
                              style={{
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                              }}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} style={{ color: "var(--foreground)" }} />
                            </motion.button>
                            <span
                              className="w-6 text-center text-sm font-bold"
                              style={{ color: "var(--foreground)" }}
                            >
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 rounded-lg flex items-center justify-center no-select disabled:opacity-50"
                              style={{
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                              }}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} style={{ color: "var(--foreground)" }} />
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.variantId)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center no-select disabled:opacity-50"
                              style={{
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.2)",
                              }}
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} className="text-rose-500" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-6 lg:hidden">
                <SummaryCard />
              </div>
            </div>

            <div className="hidden lg:block">
              <SummaryCard />
            </div>
          </div>
        )}
      </PageShell>

      {hasItems && (
        <div className="fixed bottom-[5.75rem] left-0 right-0 z-[45] px-4 lg:hidden">
          <div className="max-w-lg mx-auto">
            <Link href="/checkout">
              <motion.span
                whileTap={{ scale: 0.97 }}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white btn-gradient no-select shadow-lg"
              >
                Checkout · {formatPrice(total)}
              </motion.span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
