import { PrismaClient, ProductBadge, PromoType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { carouselCategories, products } from "../src/lib/data";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@auragaze.local";
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ?? "change-me-before-production";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toBadge(badge?: string): ProductBadge | null {
  if (!badge) return null;

  const normalized = badge.toUpperCase();
  return normalized in ProductBadge
    ? ProductBadge[normalized as keyof typeof ProductBadge]
    : null;
}

function variantStock(
  productStock: number,
  productIndex: number,
  colorIndex: number,
  sizeIndex: number,
) {
  if (productStock <= 0) return 0;

  // Keep the seed deterministic while producing useful low/healthy stock ranges.
  return Math.max(
    1,
    ((productStock + productIndex + colorIndex * 3 + sizeIndex * 2) % 14) + 1,
  );
}

async function seedAdmin() {
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: "AURAGAZE Admin",
      password,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
    create: {
      name: "AURAGAZE Admin",
      email: ADMIN_EMAIL,
      password,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
}

async function seedProducts() {
  for (const [productIndex, source] of products.entries()) {
    const slug = `${slugify(source.name)}-${source.id}`;
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: source.name,
        brand: source.brand,
        description: source.description,
        category: source.category,
        subcategory: source.subcategory,
        price: source.price,
        originalPrice: source.originalPrice ?? null,
        badge: toBadge(source.badge),
        features: source.features,
        rating: source.rating,
        reviewCount: source.reviews,
        isActive: true,
        isFeatured: productIndex < 6,
      },
      create: {
        slug,
        name: source.name,
        brand: source.brand,
        description: source.description,
        category: source.category,
        subcategory: source.subcategory,
        price: source.price,
        originalPrice: source.originalPrice ?? null,
        badge: toBadge(source.badge),
        features: source.features,
        rating: source.rating,
        reviewCount: source.reviews,
        isActive: true,
        isFeatured: productIndex < 6,
      },
    });

    // The seed is intentionally repeatable and makes source data authoritative.
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productVariant.deleteMany({ where: { productId: product.id } });

    await prisma.productImage.createMany({
      data: source.images.map((imageUrl, sortOrder) => ({
        productId: product.id,
        imageUrl,
        sortOrder,
      })),
    });

    for (const [colorIndex, color] of source.colors.entries()) {
      for (const [sizeIndex, size] of source.sizes.entries()) {
        const stock = variantStock(
          source.stock,
          productIndex,
          colorIndex,
          sizeIndex,
        );
        const sku = [
          "AGZ",
          source.id.padStart(3, "0"),
          slugify(color).slice(-6).toUpperCase() || "COLOR",
          size.toUpperCase(),
        ].join("-");

        await prisma.productVariant.create({
          data: {
            productId: product.id,
            color,
            size,
            sku,
            stock,
            inventoryTransactions: {
              create: {
                type: "IN",
                quantity: stock,
                note: "Initial catalog seed",
              },
            },
          },
        });
      }
    }
  }
}

async function seedPromoCodes() {
  await prisma.promoCode.upsert({
    where: { code: "AURA20" },
    update: {
      description: "20% off your order",
      type: PromoType.PERCENTAGE,
      value: 20,
      minOrderAmount: 0,
      maxDiscount: 2000,
      isActive: true,
    },
    create: {
      code: "AURA20",
      description: "20% off your order",
      type: PromoType.PERCENTAGE,
      value: 20,
      minOrderAmount: 0,
      maxDiscount: 2000,
      isActive: true,
    },
  });
}

async function seedCarouselCategories() {
  for (const [index, source] of carouselCategories.entries()) {
    await prisma.carouselCategory.upsert({
      where: { slug: source.slug },
      update: {
        name: source.name,
        image: source.image,
        sortOrder: index,
        isActive: true,
      },
      create: {
        name: source.name,
        slug: source.slug,
        image: source.image,
        sortOrder: index,
        isActive: true,
      },
    });
  }
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      shippingFee: 99,
      freeShippingThreshold: 4000,
    },
  });
}

async function main() {
  await seedAdmin();
  await seedProducts();
  await seedPromoCodes();
  await seedCarouselCategories();
  await seedSiteSettings();

  const [productCount, variantCount] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.count(),
  ]);

  console.info(
    `Seeded ${productCount} products and ${variantCount} variants. Admin: ${ADMIN_EMAIL}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
