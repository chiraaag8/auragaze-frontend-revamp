import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  sendNewOrderAdminAlert,
  maybeSendLowStockAlert,
} from "@/lib/admin-alert-email";
import { sendOrderConfirmationEmail } from "@/lib/order-email";
import { mapOrderDetail, mapOrderSummary } from "@/lib/order-mapper";
import { reservePromoCode, validatePromoCode } from "@/lib/promo-service";
import { rupeesToPaise } from "@/lib/razorpay";
import { quoteShippingForPostalCode } from "@/lib/pincode-geocode";
import type { CheckoutResult, ShippingAddress } from "@/types/order";

export class CheckoutError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

export interface PlaceOrderOptions {
  saveAddress?: boolean;
  promoCode?: string;
  paymentMethod?: "COD" | "RAZORPAY";
  paymentStatus?: "PENDING" | "PAID";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  /** Paid amount in paise from Razorpay — must match recomputed cart total. */
  expectedPaidAmountPaise?: number;
}

export interface CheckoutTotals {
  subtotal: number;
  shippingFee: number;
  discount: number;
  promoCode?: string;
  total: number;
}

function validateShippingAddress(address: ShippingAddress): ShippingAddress {
  const name = address.name?.trim();
  const line1 = address.line1?.trim();
  const city = address.city?.trim();
  const state = address.state?.trim();
  const postalCode = address.postalCode?.trim();
  const phone = address.phone?.trim();

  if (!name || name.length < 2) {
    throw new CheckoutError("Enter a valid recipient name");
  }
  if (!line1 || line1.length < 5) {
    throw new CheckoutError("Enter a complete street address");
  }
  if (!city || city.length < 2) {
    throw new CheckoutError("Enter a valid city");
  }
  if (!state || state.length < 2) {
    throw new CheckoutError("Enter a valid state");
  }
  if (!postalCode || !/^\d{6}$/.test(postalCode)) {
    throw new CheckoutError("Enter a valid 6-digit postal code");
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    throw new CheckoutError("Enter a valid phone number");
  }

  return {
    name,
    label: address.label?.trim() || "Home",
    line1,
    line2: address.line2?.trim() || undefined,
    city,
    state,
    postalCode,
    phone,
  };
}

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        variant: {
          include: {
            product: true;
          };
        };
      };
    };
  };
}>;

function validateCartItems(cart: CartWithItems | null) {
  if (!cart || cart.items.length === 0) {
    throw new CheckoutError("Your cart is empty", 400);
  }

  for (const item of cart.items) {
    const product = item.variant.product;
    if (!product.isActive) {
      throw new CheckoutError(`${product.name} is no longer available`, 409);
    }
    if (item.variant.stock < item.quantity) {
      throw new CheckoutError(
        `Only ${item.variant.stock} left for ${product.name} (${item.variant.size})`,
        409,
      );
    }
  }
}

async function resolveShippingFee(postalCode?: string): Promise<number> {
  const pin = postalCode?.trim() ?? "";
  if (!/^\d{6}$/.test(pin)) {
    throw new CheckoutError("Enter a valid 6-digit postal code for shipping");
  }
  try {
    const quote = await quoteShippingForPostalCode(pin);
    return quote.shippingFee;
  } catch (error) {
    throw new CheckoutError(
      error instanceof Error
        ? error.message
        : "Unable to calculate shipping for this postal code",
      400,
    );
  }
}

async function computeTotals(
  cart: CartWithItems,
  promoCodeInput: string | undefined,
  shippingFee: number,
  tx?: Prisma.TransactionClient,
): Promise<CheckoutTotals> {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.variant.product.price) * item.quantity,
    0,
  );

  let discount = 0;
  let promoCode: string | undefined;
  if (promoCodeInput?.trim()) {
    const promo = tx
      ? await reservePromoCode(promoCodeInput, subtotal, tx)
      : await validatePromoCode(promoCodeInput, subtotal);
    discount = promo.discount;
    promoCode = promo.code;
  }

  const total = subtotal + shippingFee - discount;

  return {
    subtotal,
    shippingFee,
    discount,
    promoCode,
    total,
  };
}

export async function getCheckoutTotals(
  userId: string,
  promoCode?: string,
  postalCode?: string,
): Promise<CheckoutTotals> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  validateCartItems(cart);
  const shippingFee = await resolveShippingFee(postalCode);
  return computeTotals(cart!, promoCode, shippingFee);
}

export async function placeOrder(
  userId: string,
  rawAddress: ShippingAddress,
  options?: PlaceOrderOptions,
): Promise<CheckoutResult> {
  const shippingAddress = validateShippingAddress(rawAddress);
  const paymentMethod = options?.paymentMethod ?? "RAZORPAY";
  if (paymentMethod === "COD") {
    throw new CheckoutError(
      "Cash on delivery is no longer available. Please pay online.",
      400,
    );
  }
  const paymentStatus = options?.paymentStatus ?? "PAID";

  if (paymentMethod === "RAZORPAY") {
    if (!options?.razorpayOrderId || !options?.razorpayPaymentId) {
      throw new CheckoutError("Razorpay payment details are required", 400);
    }
    if (options.expectedPaidAmountPaise == null) {
      throw new CheckoutError("Paid amount verification is required", 400);
    }

    const existingPayment = await prisma.order.findUnique({
      where: { razorpayPaymentId: options.razorpayPaymentId },
      select: { id: true, total: true },
    });
    if (existingPayment) {
      return {
        orderId: existingPayment.id,
        total: Number(existingPayment.total),
      };
    }
  }

  const shippingFee = await resolveShippingFee(shippingAddress.postalCode);

  const order = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    validateCartItems(cart);

    const totals = await computeTotals(
      cart!,
      options?.promoCode,
      shippingFee,
      tx,
    );

    if (paymentMethod === "RAZORPAY") {
      const cartPaise = rupeesToPaise(totals.total);
      const paidPaise = options!.expectedPaidAmountPaise!;
      // Reject only underpayment (cart grew / price rose after pay).
      // Overpayment (cart shrunk) still creates the order so a captured
      // payment is not left without a matching order.
      if (cartPaise > paidPaise) {
        throw new CheckoutError(
          "Your cart total is higher than the amount paid. Contact support with your Razorpay payment ID.",
          409,
        );
      }
    }

    const createdOrder = await tx.order.create({
      data: {
        userId,
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        discount: totals.discount,
        promoCode: totals.promoCode,
        total: totals.total,
        paymentMethod,
        paymentStatus,
        razorpayOrderId: options?.razorpayOrderId,
        razorpayPaymentId: options?.razorpayPaymentId,
        status: "PENDING",
        shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
        items: {
          create: cart!.items.map((item) => ({
            productName: item.variant.product.name,
            size: item.variant.size,
            color: item.variant.color,
            quantity: item.quantity,
            price: item.variant.product.price,
            variantId: item.variantId,
          })),
        },
      },
      include: { items: true },
    });

    const touchedVariantIds: string[] = [];

    for (const item of cart!.items) {
      const updated = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (updated.count === 0) {
        throw new CheckoutError(
          `Insufficient stock for ${item.variant.product.name} (${item.variant.size})`,
          409,
        );
      }

      touchedVariantIds.push(item.variantId);

      await tx.inventoryTransaction.create({
        data: {
          variantId: item.variantId,
          quantity: item.quantity,
          type: "OUT",
          note: `Order ${createdOrder.id}`,
        },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart!.id } });

    if (options?.saveAddress) {
      const existingDefault = await tx.address.findFirst({
        where: { userId, isDefault: true },
        select: { id: true },
      });

      await tx.address.create({
        data: {
          userId,
          label: shippingAddress.label,
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          phone: shippingAddress.phone,
          isDefault: !existingDefault,
        },
      });
    }

    return { order: createdOrder, touchedVariantIds };
  });

  void sendOrderConfirmationEmail(order.order.id);
  void sendNewOrderAdminAlert(order.order.id);
  void maybeSendLowStockAlert(order.touchedVariantIds);

  return {
    orderId: order.order.id,
    total: Number(order.order.total),
  };
}

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(mapOrderSummary);
}

export async function getUserOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) return null;
  return mapOrderDetail(order);
}
