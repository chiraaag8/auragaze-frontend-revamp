import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const product = await prisma.product.create({
        data: {
            name: body.name,
            description: body.description,
            price: body.price,
            category: body.category,
            variants: {
                create: body.variants?.map((v: { size: string; color: string; stock: number }) => ({
                    size: v.size,
                    color: v.color,
                    stock: v.stock,
                    sku: `${body.name.slice(0, 3).toUpperCase()}-${v.size}-${v.color}`.toUpperCase(),
                })) ?? [],
            },
        },
        include: { variants: true },
    });

    return NextResponse.json(product);
}
