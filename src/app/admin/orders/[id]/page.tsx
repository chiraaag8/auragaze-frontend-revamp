import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, User } from "lucide-react";
import OrderStatusActions from "@/components/admin/OrderStatusActions";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { getAdminOrder } from "@/lib/admin-order-service";
import {
  orderStatusLabel,
  orderStatusTone,
} from "@/lib/order-status";
import { cn, formatDateTime, formatPrice } from "@/lib/utils";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  const address = order.shippingAddress;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"
        >
          <ArrowLeft size={16} />
          Back to orders
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--label-accent)]">
              Order detail
            </p>
            <h1 className="font-heading text-3xl font-black tracking-tight">
              {formatPrice(order.total)}
            </h1>
            <p className="mt-1 font-mono text-xs text-[var(--muted)]">
              {order.id}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Placed{" "}
              {formatDateTime(order.createdAt, {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
              orderStatusTone(order.status),
            )}
          >
            {orderStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <section className="surface-card rounded-2xl p-5">
        <h2 className="font-heading text-lg font-bold">Fulfillment</h2>
        <div className="mt-4 space-y-4">
          <OrderStatusTimeline status={order.status} />
          <OrderStatusActions order={order} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <User size={18} className="text-[var(--label-accent)]" />
            <h2 className="font-heading text-lg font-bold">Customer</h2>
          </div>
          <p className="font-semibold">{order.customerName}</p>
          <p className="text-sm text-[var(--muted)]">{order.customerEmail}</p>
          <p className="mt-3 text-sm">
            Payment: {order.paymentMethod.toUpperCase()} ·{" "}
            {order.paymentStatus.replace("_", " ")}
          </p>
        </section>

        <section className="surface-card rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-[var(--label-accent)]" />
            <h2 className="font-heading text-lg font-bold">Shipping address</h2>
          </div>
          <p className="font-semibold">{address.name}</p>
          <p className="mt-1 text-sm text-[var(--muted-strong)]">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
          </p>
          <p className="text-sm text-[var(--muted-strong)]">
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{address.phone}</p>
        </section>
      </div>

      <section className="surface-card overflow-hidden rounded-2xl">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-heading text-lg font-bold">Line items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.productName}</td>
                  <td>
                    {item.color} / {item.size}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{formatPrice(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2 border-t border-[var(--border)] px-5 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Shipping</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          {order.discount > 0 ? (
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">
                Promo{order.promoCode ? ` (${order.promoCode})` : ""}
              </span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
