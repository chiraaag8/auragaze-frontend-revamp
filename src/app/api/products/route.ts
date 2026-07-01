import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const products = await prisma.product.findMany({
        include: {
            images: true,
            variants: true,
        },
    });
    return NextResponse.json(products);
}
