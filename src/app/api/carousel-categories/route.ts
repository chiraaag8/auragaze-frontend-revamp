import { NextResponse } from "next/server";
import { getStorefrontCarouselCategories } from "@/lib/carousel-category-service";

export async function GET() {
  try {
    const categories = await getStorefrontCarouselCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to load carousel categories", error);
    return NextResponse.json(
      { error: "Unable to load carousel categories." },
      { status: 500 },
    );
  }
}
