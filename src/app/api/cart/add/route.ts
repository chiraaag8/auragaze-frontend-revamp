import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const cart = await prisma.cart.findFirst({
    where: {
      userId: body.userId,
    },
  });

  const cartItem =
    await prisma.cartItem.create({
      data: {
        cartId: cart!.id,
        variantId: body.variantId,
        quantity: 1,
      },
    });

  return NextResponse.json(cartItem);
}
