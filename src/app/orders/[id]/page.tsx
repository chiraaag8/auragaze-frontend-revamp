"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LoaderCircle, MapPin } from "lucide-react";
import TopBar from "@/components/TopBar";
import PageShell from "@/components/PageShell";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import {
  orderStatusLabel,
  orderStatusTone,
} from "@/lib/order-status";
import { formatDateTime, formatPrice, cn } from "@/lib/utils";
import type { OrderDetail } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = (await res.json()) as OrderDetail & { error?: string };
        if (!active) return;
        if (!res.ok) {
          setError(data.error ?? "Order not found");
          return;
        }
        setOrder(data);
      } catch {
        if (active) setError("Unable to load order");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin label-accent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pb-6">
        <TopBar title="Order" />
        <PageShell className="pt-24 text-center">
          <p className="mb-4 text-sm text-muted">{error || "Order not found"}</p>
          <Link href="/orders" className="btn-gradient rounded-xl px-5 py-3 text-sm font-bold">
            Back to orders
          </Link>
        </PageShell>
      </div>
    );
  }

  const address = order.shippingAddress;

  return (
    <div className="min-h-screen pb-6 lg:pb-12">
      <TopBar title="Order details" />

      <PageShell className="space-y-4 pt-16 lg:pt-24">
        <section className="surface-card rounded-2xl p-4 lg:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] text-muted">{order.id}</p>
              <p className="mt-1 text-2xl font-black">{formatPrice(order.total)}</p>
              <p className="text-xs text-muted">
                Placed{" "}
                {formatDateTime(order.createdAt, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                orderStatusTone(order.status),
              )}
            >
              {orderStatusLabel(order.status)}
            </span>
          </div>
          <OrderStatusTimeline status={order.status} />
        </section>

        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <section className="surface-card rounded-2xl p-4 lg:p-5">
          <h2 className="mb-3 font-bold text-sm">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-(--border) pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-semibold">{item.productName}</p>
                  <p className="text-xs text-muted">
                    Size {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold">{formatPrice(item.lineTotal)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card rounded-2xl p-4 lg:p-5">
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={16} className="label-accent" />
            <h2 className="font-bold text-sm">Delivery address</h2>
          </div>
          <div className="text-sm leading-6 text-muted">
            <p className="font-semibold text-foreground">{address.name}</p>
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.phone}</p>
          </div>
        </section>

        </div>

        <section className="surface-card rounded-2xl p-4 lg:p-5 lg:max-w-xl">
          <h2 className="mb-3 font-bold text-sm">Payment summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</span>
            </div>
            {order.discount > 0 ? (
              <div className="flex justify-between text-emerald-600">
                <span>Promo{order.promoCode ? ` (${order.promoCode})` : ""}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-muted">
              <span>Payment</span>
              <span>Cash on Delivery</span>
            </div>
            <div className="flex justify-between border-t border-(--border) pt-2 font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>
      </PageShell>
    </div>
  );
}
