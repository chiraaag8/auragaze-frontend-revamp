import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  CarouselCategoryError,
  deleteCarouselCategory,
  parseCarouselCategoryPatch,
  updateCarouselCategory,
} from "@/lib/carousel-category-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseCarouselCategoryPatch(body);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const category = await updateCarouselCategory(id, parsed.data);
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof CarouselCategoryError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error("Failed to update carousel category", error);
    return NextResponse.json(
      { error: "Unable to update carousel category." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    await deleteCarouselCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CarouselCategoryError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error("Failed to delete carousel category", error);
    return NextResponse.json(
      { error: "Unable to delete carousel category." },
      { status: 500 },
    );
  }
}
