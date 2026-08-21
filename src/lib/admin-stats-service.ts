import { prisma } from "@/lib/prisma";
import { mapOrderSummary } from "@/lib/order-mapper";
import type { AdminStats } from "@/types/admin-order";
import { LOW_STOCK_THRESHOLD } from "@/types/admin-inventory";
import { STORE_TIME_ZONE } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

function startOfTodayInStoreTz() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  // Midnight Asia/Kolkata as an absolute UTC instant
  return new Date(`${year}-${month}-${day}T00:00:00+05:30`);
}

export async function getAdminStats(): Promise<AdminStats> {
  const today = startOfTodayInStoreTz();

  const [revenueAgg, ordersToday, openOrders, lowStockVariants, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({
        where: {
          status: { not: OrderStatus.CANCELLED },
          OR: [
            { paymentMethod: "COD" },
            { paymentMethod: "RAZORPAY", paymentStatus: "PAID" },
          ],
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.order.count({
        where: {
          status: {
            in: [
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
              OrderStatus.SHIPPED,
            ],
          },
        },
      }),
      prisma.productVariant.count({
        where: {
          stock: { lte: LOW_STOCK_THRESHOLD },
          product: { isActive: true },
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

  return {
    revenue: Number(revenueAgg._sum.total ?? 0),
    ordersToday,
    openOrders,
    lowStockVariants,
    recentOrders: recentOrders.map((order) => ({
      ...mapOrderSummary(order),
      customerName: order.user.name,
      customerEmail: order.user.email,
    })),
  };
}
