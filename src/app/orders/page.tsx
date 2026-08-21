"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, LoaderCircle, Package } from "lucide-react";
import TopBar from "@/components/TopBar";
import PageShell from "@/components/PageShell";
import { orderStatusLabel, orderStatusTone } from "@/lib/order-status";
import { formatDateTime, formatPrice, cn } from "@/lib/utils";
import type { OrderSummary } from "@/types/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const res = await fetch("/api/orders");
        const data = (await res.json()) as { orders?: OrderSummary[]; error?: string };
        if (!active) return;
        if (!res.ok) {
          setError(data.error ?? "Unable to load orders");
          return;
        }
        setOrders(data.orders ?? []);
      } catch {
        if (active) setError("Unable to load orders");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen pb-6">
      <TopBar title="My Orders" />

      <PageShell className="pt-16 lg:pt-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="animate-spin label-accent" />
          </div>
        ) : error ? (
          <p className="py-20 text-center text-sm text-muted">{error}</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-(--border) bg-(--surface)">
              <Package size={32} className="label-accent" />
            </div>
            <h2 className="text-xl font-bold">No orders yet</h2>
            <p className="mt-2 max-w-xs text-sm text-muted">
              When you place an order, it will show up here.
            </p>
            <Link href="/shop" className="btn-gradient mt-6 rounded-xl px-5 py-3 text-sm font-bold">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-4 lg:grid lg:grid-cols-2 lg:gap-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="surface-card rounded-2xl p-4 lg:p-5 h-full">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] text-muted">{order.id.slice(0, 12)}…</p>
                      <p className="mt-1 text-sm font-bold">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDateTime(order.createdAt)} · {order.itemCount}{" "}
                        {order.itemCount === 1 ? "item" : "items"}
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
                  <div className="flex items-center justify-between text-xs font-semibold label-accent">
                    <span>View details</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageShell>
    </div>
  );
}
