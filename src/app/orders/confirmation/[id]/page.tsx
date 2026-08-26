"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, LoaderCircle, Package } from "lucide-react";
import TopBar from "@/components/TopBar";
import PageShell from "@/components/PageShell";
import { formatPrice } from "@/lib/utils";
import type { OrderDetail } from "@/types/order";

export default function OrderConfirmationPage() {
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
        if (active) setError("Unable to load order confirmation");
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
        <TopBar title="Confirmation" />
        <PageShell narrow className="pt-24 text-center">
          <p className="mb-4 text-sm text-muted">{error || "Order not found"}</p>
          <Link href="/orders" className="btn-gradient rounded-xl px-5 py-3 text-sm font-bold">
            View orders
          </Link>
        </PageShell>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6 lg:pb-12">
      <TopBar title="Order placed" />

      <PageShell narrow className="pt-20 lg:pt-28">
        <div className="surface-card rounded-3xl p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="font-heading text-2xl font-black">Thank you!</h1>
          <p className="mt-2 text-sm text-muted">
            {order.paymentMethod === "razorpay"
              ? "Your payment was successful and your order is confirmed."
              : "Your order has been placed successfully."}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
            Order ID
          </p>
          <p className="font-mono text-sm font-semibold">{order.id}</p>
          <p className="mt-4 text-3xl font-black">{formatPrice(order.total)}</p>
          <p className="mt-1 text-xs text-muted">
            {order.itemCount} {order.itemCount === 1 ? "item" : "items"} ·{" "}
            {order.paymentMethod === "razorpay" ? "Paid online" : "Payment pending"}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/orders/${order.id}`}
            className="surface-card flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold"
          >
            <Package size={16} className="label-accent" />
            Track order
          </Link>
          <Link
            href="/shop"
            className="btn-gradient flex items-center justify-center rounded-2xl py-3.5 text-sm font-bold"
          >
            Continue shopping
          </Link>
        </div>
      </PageShell>
    </div>
  );
}
