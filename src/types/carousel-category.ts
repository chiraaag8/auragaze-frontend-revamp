export type CarouselCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CarouselCategoryInput = {
  name: string;
  slug: string;
  image: string;
  sortOrder?: number;
  isActive?: boolean;
};

export const CAROUSEL_CATEGORY_SLUGS = [
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "oversized-tees", label: "Oversized Tees" },
  { value: "basics", label: "Basics" },
  { value: "graphic", label: "Graphic Tees" },
  { value: "full-sleeve", label: "Full Sleeve" },
  { value: "caps", label: "Caps" },
  { value: "racing-club", label: "Racing Club" },
  { value: "iconics", label: "Iconics" },
] as const;
