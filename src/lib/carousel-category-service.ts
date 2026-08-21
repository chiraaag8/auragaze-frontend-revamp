import { prisma } from "@/lib/prisma";
import { carouselCategories as fallbackCategories } from "@/lib/data";
import type {
  CarouselCategoryInput,
  CarouselCategoryRecord,
} from "@/types/carousel-category";

export class CarouselCategoryError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "CarouselCategoryError";
    this.status = status;
  }
}

function mapRecord(row: {
  id: string;
  name: string;
  slug: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): CarouselCategoryRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function parseInput(body: unknown): {
  data?: CarouselCategoryInput;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const slug = typeof record.slug === "string" ? record.slug.trim() : "";
  const image = typeof record.image === "string" ? record.image.trim() : "";

  if (!name) return { error: "Name is required." };
  if (!slug) return { error: "Category slug is required." };
  if (!image) return { error: "Image URL is required." };

  const sortOrder =
    record.sortOrder === undefined ? 0 : Number(record.sortOrder);
  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    return { error: "Sort order must be a non-negative number." };
  }

  const isActive =
    record.isActive === undefined ? true : Boolean(record.isActive);

  return {
    data: {
      name,
      slug,
      image,
      sortOrder: Math.round(sortOrder),
      isActive,
    },
  };
}

export function parseCarouselCategoryInput(body: unknown) {
  return parseInput(body);
}

export function parseCarouselCategoryPatch(body: unknown): {
  data?: Partial<CarouselCategoryInput>;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const data: Partial<CarouselCategoryInput> = {};

  if ("name" in record) {
    const name = typeof record.name === "string" ? record.name.trim() : "";
    if (!name) return { error: "Name cannot be empty." };
    data.name = name;
  }

  if ("slug" in record) {
    const slug = typeof record.slug === "string" ? record.slug.trim() : "";
    if (!slug) return { error: "Category slug cannot be empty." };
    data.slug = slug;
  }

  if ("image" in record) {
    const image = typeof record.image === "string" ? record.image.trim() : "";
    if (!image) return { error: "Image URL cannot be empty." };
    data.image = image;
  }

  if ("sortOrder" in record) {
    const sortOrder = Number(record.sortOrder);
    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      return { error: "Sort order must be a non-negative number." };
    }
    data.sortOrder = Math.round(sortOrder);
  }

  if ("isActive" in record) {
    data.isActive = Boolean(record.isActive);
  }

  if (Object.keys(data).length === 0) {
    return { error: "No fields to update." };
  }

  return { data };
}

export async function listCarouselCategories(options?: {
  activeOnly?: boolean;
}): Promise<CarouselCategoryRecord[]> {
  const rows = await prisma.carouselCategory.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return rows.map(mapRecord);
}

export async function getStorefrontCarouselCategories(): Promise<
  Pick<CarouselCategoryRecord, "id" | "name" | "slug" | "image">[]
> {
  try {
    const rows = await listCarouselCategories({ activeOnly: true });

    if (rows.length > 0) {
      return rows.map(({ id, name, slug, image }) => ({
        id,
        name,
        slug,
        image,
      }));
    }
  } catch (error) {
    console.error("Failed to load carousel categories from database", error);
  }

  return fallbackCategories;
}

export async function createCarouselCategory(
  input: CarouselCategoryInput,
): Promise<CarouselCategoryRecord> {
  try {
    const created = await prisma.carouselCategory.create({
      data: input,
    });
    return mapRecord(created);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      throw new CarouselCategoryError(
        "A carousel category with this slug already exists.",
        409,
      );
    }
    throw error;
  }
}

export async function updateCarouselCategory(
  id: string,
  input: Partial<CarouselCategoryInput>,
): Promise<CarouselCategoryRecord> {
  try {
    const updated = await prisma.carouselCategory.update({
      where: { id },
      data: input,
    });
    return mapRecord(updated);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      throw new CarouselCategoryError("Carousel category not found.", 404);
    }
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      throw new CarouselCategoryError(
        "A carousel category with this slug already exists.",
        409,
      );
    }
    throw error;
  }
}

export async function deleteCarouselCategory(id: string): Promise<void> {
  try {
    await prisma.carouselCategory.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      throw new CarouselCategoryError("Carousel category not found.", 404);
    }
    throw error;
  }
}
