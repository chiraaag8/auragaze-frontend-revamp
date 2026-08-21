import Link from "next/link";
import {
  Boxes,
  IndianRupee,
  Package,
  Percent,
  Plus,
  ShoppingBag,
  TrendingUp,
  Truck,
} from "lucide-react";
import {
  orderStatusLabel,
  orderStatusTone,
} from "@/lib/order-status";
import { getAdminStats } from "@/lib/admin-stats-service";
import { cn, formatDateTime, formatPrice } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Revenue",
      value: formatPrice(stats.revenue),
      hint: "COD + paid online orders",
      icon: IndianRupee,
    },
    {
      label: "Orders today",
      value: String(stats.ordersToday),
      hint: "Placed since midnight",
      icon: TrendingUp,
    },
    {
      label: "Open orders",
      value: String(stats.openOrders),
      hint: "Pending, confirmed, or shipped",
      icon: ShoppingBag,
    },
    {
      label: "Low stock",
      value: String(stats.lowStockVariants),
      hint: "Active variants at or below threshold",
      icon: Boxes,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--label-accent)]">
            Dashboard
          </p>
          <h1 className="font-heading text-2xl font-black tracking-tight sm:text-3xl">
            Overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Revenue, open orders, low stock, and recent activity at a glance.
          </p>
        </div>
        <Link href="/admin/products/new" className="admin-button-primary">
          <Plus size={16} />
          New product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="surface-card rounded-2xl p-5">
              <div className="mb-3 inline-flex rounded-xl bg-[var(--primary-muted)] p-3 text-[var(--label-accent)]">
                <Icon size={20} />
              </div>
              <p className="text-sm text-[var(--muted)]">{card.label}</p>
              <p className="mt-1 font-heading text-2xl font-black">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="surface-card rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-[var(--label-accent)]">
              View all
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--muted)]">
              No orders yet.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-col gap-2 rounded-xl border border-[var(--border)] p-3 transition-colors hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatDateTime(order.createdAt)} · {order.itemCount} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <span
                      className={cn(
                        "mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        orderStatusTone(order.status),
                      )}
                    >
                      {orderStatusLabel(order.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-4">
          <Link
            href="/admin/products"
            className="surface-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-4 inline-flex rounded-xl bg-[var(--primary-muted)] p-3 text-[var(--label-accent)]">
              <Package size={20} />
            </div>
            <h2 className="font-heading text-lg font-bold">Products</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage catalog and variants.
            </p>
          </Link>
          <Link
            href="/admin/inventory"
            className="surface-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-4 inline-flex rounded-xl bg-[var(--primary-muted)] p-3 text-[var(--label-accent)]">
              <Boxes size={20} />
            </div>
            <h2 className="font-heading text-lg font-bold">Inventory</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {stats.lowStockVariants} low-stock variants need attention.
            </p>
          </Link>
          <Link
            href="/admin/orders"
            className="surface-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-4 inline-flex rounded-xl bg-[var(--primary-muted)] p-3 text-[var(--label-accent)]">
              <ShoppingBag size={20} />
            </div>
            <h2 className="font-heading text-lg font-bold">Orders</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {stats.openOrders} open orders awaiting fulfillment.
            </p>
          </Link>
          <Link
            href="/admin/promos"
            className="surface-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-4 inline-flex rounded-xl bg-[var(--primary-muted)] p-3 text-[var(--label-accent)]">
              <Percent size={20} />
            </div>
            <h2 className="font-heading text-lg font-bold">Promos</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Create and manage discount codes.
            </p>
          </Link>
          <Link
            href="/admin/shipping"
            className="surface-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-4 inline-flex rounded-xl bg-[var(--primary-muted)] p-3 text-[var(--label-accent)]">
              <Truck size={20} />
            </div>
            <h2 className="font-heading text-lg font-bold">Shipping</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Flat fee and free-shipping threshold.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
