import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  CarouselCategoryError,
  createCarouselCategory,
  listCarouselCategories,
  parseCarouselCategoryInput,
} from "@/lib/carousel-category-service";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const categories = await listCarouselCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to load admin carousel categories", error);
    return NextResponse.json(
      { error: "Unable to load carousel categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseCarouselCategoryInput(body);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const category = await createCarouselCategory(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof CarouselCategoryError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error("Failed to create carousel category", error);
    return NextResponse.json(
      { error: "Unable to create carousel category." },
      { status: 500 },
    );
  }
}
