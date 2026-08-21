"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Search } from "lucide-react";
import { toast } from "sonner";
import {
  orderStatusLabel,
  orderStatusTone,
} from "@/lib/order-status";
import type { AdminOrderSummary } from "@/types/admin-order";
import { cn, formatDateTime, formatPrice } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (status) params.set("status", status);

    try {
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Unable to load orders.");
        setOrders([]);
        return;
      }
      setOrders(data);
    } catch {
      toast.error("Unable to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrders();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadOrders]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--label-accent)]">
          Fulfillment
        </p>
        <h1 className="font-heading text-3xl font-black tracking-tight">
          Orders
        </h1>
      </div>

      <div className="surface-card rounded-2xl p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order ID, customer name, or email"
              className="admin-input pl-9"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="admin-input"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="surface-card overflow-hidden rounded-2xl">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-[var(--muted)]">
            <LoaderCircle size={18} className="animate-spin" />
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-semibold">No orders found</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Try a different filter or wait for customers to check out.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Placed</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <p className="font-mono text-xs">{order.id.slice(0, 10)}…</p>
                    </td>
                    <td>
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td>{order.itemCount}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                          orderStatusTone(order.status),
                        )}
                      >
                        {orderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="text-sm text-[var(--muted)]">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="admin-button-secondary"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
