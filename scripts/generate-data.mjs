import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const res = await fetch(
  "https://bluorng.com/collections/oversized-t-shirts/products.json?limit=20"
);
if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
const raw = await res.json();

const capsImage =
  "https://cdn.shopify.com/s/files/1/0514/9494/4962/collections/WhatsApp_Image_2026-05-04_at_2.33.28_PM.jpg?v=1777886095";

const products = raw.products.map((p, i) => {
  const price = parseFloat(p.variants[0].price);
  const compare = p.variants[0].compare_at_price
    ? parseFloat(p.variants[0].compare_at_price)
    : null;
  const title = p.title;
  const isBasic = /basic/i.test(title);
  const isFullSleeve = /full sleeve/i.test(title);
  const subcategory = isBasic ? "basics" : isFullSleeve ? "full-sleeve" : "graphic";
  const badge = i < 3 ? "new" : i === 5 ? "hot" : i === 10 ? "limited" : undefined;
  const images = p.images.slice(0, 3).map((img) => img.src);
  const sizes = p.variants.map((v) => v.title);
  const obj = {
    id: String(i + 1),
    name: title,
    brand: "BLUORNG",
    price,
    category: "oversized-tees",
    subcategory,
    image: images[0],
    images,
    rating: +(4.5 + (i % 5) * 0.1).toFixed(1),
    reviews: 50 + i * 17,
    description: `${title.replace(/ T-Shirt$/i, "")} oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.`,
    features: ["100% Cotton", "260 GSM", "Screen Print", "Oversized Fit", "Reverse Wash Only"],
    colors: ["#1c1917", "#f5f5f4", "#1e3a8a"].slice(0, 1 + (i % 3)),
    sizes,
    stock: 10 + (i % 8) * 3,
    isFavorite: i % 4 === 0,
  };
  if (compare) obj.originalPrice = compare;
  if (badge) obj.badge = badge;
  return obj;
});

const img = (i) => products[i].image;

const carouselCategories = [
  { id: "c1", name: "New Arrivals", slug: "new-arrivals", image: img(0) },
  { id: "c2", name: "Oversized Tees", slug: "oversized-tees", image: img(1) },
  { id: "c3", name: "Bluorng Basics", slug: "basics", image: img(12) },
  { id: "c4", name: "Graphic Tees", slug: "graphic", image: img(4) },
  { id: "c5", name: "Full Sleeve", slug: "full-sleeve", image: img(3) },
  { id: "c6", name: "Caps", slug: "caps", image: capsImage },
  { id: "c7", name: "Racing Club", slug: "racing-club", image: img(9) },
  { id: "c8", name: "Iconics", slug: "iconics", image: img(11) },
];

const categories = [
  {
    id: "1",
    name: "Oversized Tees",
    slug: "oversized-tees",
    description: "Relaxed fit, premium cotton",
    image: img(1),
    count: 20,
    gradient: "from-blue-700 to-blue-950",
    accentColor: "#2563eb",
  },
  {
    id: "2",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Fresh drops weekly",
    image: img(0),
    count: 3,
    gradient: "from-blue-500 to-indigo-900",
    accentColor: "#6366f1",
  },
  {
    id: "3",
    name: "Basics",
    slug: "basics",
    description: "Everyday essentials",
    image: img(12),
    count: products.filter((p) => p.subcategory === "basics").length,
    gradient: "from-slate-600 to-slate-900",
    accentColor: "#64748b",
  },
  {
    id: "4",
    name: "Graphic Tees",
    slug: "graphic",
    description: "Bold prints & graphics",
    image: img(4),
    count: products.filter((p) => p.subcategory === "graphic").length,
    gradient: "from-fuchsia-600 to-purple-900",
    accentColor: "#c026d3",
  },
  {
    id: "5",
    name: "Full Sleeve",
    slug: "full-sleeve",
    description: "Long sleeve oversized tees",
    image: img(3),
    count: products.filter((p) => p.subcategory === "full-sleeve").length,
    gradient: "from-amber-600 to-orange-900",
    accentColor: "#f59e0b",
  },
  {
    id: "6",
    name: "Caps",
    slug: "caps",
    description: "Complete the look",
    image: capsImage,
    count: 11,
    gradient: "from-emerald-600 to-emerald-950",
    accentColor: "#10b981",
  },
];

const shopFilters = ["All", "Oversized Tees", "Basics", "Graphic", "Full Sleeve", "New Arrivals"];

const file = `export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  badge?: "new" | "sale" | "hot" | "limited";
  isFavorite?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
  gradient: string;
  accentColor: string;
}

export interface CarouselCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const FREE_SHIPPING_THRESHOLD = 4000;
export const SHIPPING_FEE = 99;

export const carouselCategories: CarouselCategory[] = ${JSON.stringify(carouselCategories, null, 2)};

export const shopFilters = ${JSON.stringify(shopFilters)};

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const heroSlides = [
  {
    id: 1,
    title: "Wear Your",
    subtitle: "Story",
    description: "Premium oversized tees curated for those who dress with intention.",
    cta: "Shop Now",
    image: ${JSON.stringify(img(0))},
    gradient: "from-blue-900/30 via-transparent to-slate-900/20",
  },
  {
    id: 2,
    title: "Oversized",
    subtitle: "Collection",
    description: "Fresh fits designed for the way you move.",
    cta: "Explore",
    image: ${JSON.stringify(img(2))},
    gradient: "from-cyan-600/30 via-transparent to-blue-600/20",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.subcategory === product.subcategory)
    .slice(0, limit);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === "new-arrivals") {
    return products.filter((p) => p.badge === "new");
  }
  if (categorySlug === "oversized-tees" || categorySlug === "iconics" || categorySlug === "racing-club") {
    return products;
  }
  if (categorySlug === "caps") {
    return [];
  }
  return products.filter((p) => p.subcategory === categorySlug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products
    .filter((p) => p.badge === "hot" || p.badge === "limited" || p.rating >= 4.8)
    .slice(0, limit);
}

export function getCategoryLabel(category: string): string {
  const match = categories.find((c) => c.slug === category);
  return match?.name ?? category.charAt(0).toUpperCase() + category.slice(1);
}
`;

fs.writeFileSync(path.join(__dirname, "../src/lib/data.ts"), file);
console.log("Written data.ts with", products.length, "products");
