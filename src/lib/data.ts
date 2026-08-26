export interface Product {
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

// These category definitions still power storefront presentation, but live counts
// are now derived from catalog API data at runtime.
export const carouselCategories: CarouselCategory[] = [
  {
    "id": "c1",
    "name": "New Arrivals",
    "slug": "new-arrivals",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork795_b2427b70-468f-42e8-9ace-3c2e8ce54a00.jpg?v=1705136125"
  },
  {
    "id": "c2",
    "name": "Oversized Tees",
    "slug": "oversized-tees",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3Q.jpg?v=1712056356"
  },
  {
    "id": "c3",
    "name": "Bluorng Basics",
    "slug": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/WEFDWEAD.jpg?v=1742804463"
  },
  {
    "id": "c4",
    "name": "Graphic Tees",
    "slug": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/bhbghbh.jpg?v=1738601070"
  },
  {
    "id": "c5",
    "name": "Full Sleeve",
    "slug": "full-sleeve",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/wecfxwedsa.jpg?v=1779355270"
  },
  {
    "id": "c6",
    "name": "Caps",
    "slug": "caps",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/collections/WhatsApp_Image_2026-05-04_at_2.33.28_PM.jpg?v=1777886095"
  },
  {
    "id": "c7",
    "name": "Racing Club",
    "slug": "racing-club",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/tt69105_54ff2625-582d-4312-80fc-c7e9e60e8374.jpg?v=1753515771"
  },
  {
    "id": "c8",
    "name": "Iconics",
    "slug": "iconics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/ewcew.jpg?v=1759241401"
  }
];

export const shopFilters = ["All","Oversized Tees","Basics","Graphic","Full Sleeve","New Arrivals"];

export const categories: Category[] = [
  {
    "id": "1",
    "name": "Oversized Tees",
    "slug": "oversized-tees",
    "description": "Relaxed fit, premium cotton",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3Q.jpg?v=1712056356",
    "count": 20,
    "gradient": "from-blue-700 to-blue-950",
    "accentColor": "#2563eb"
  },
  {
    "id": "2",
    "name": "New Arrivals",
    "slug": "new-arrivals",
    "description": "Fresh drops weekly",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork795_b2427b70-468f-42e8-9ace-3c2e8ce54a00.jpg?v=1705136125",
    "count": 3,
    "gradient": "from-blue-500 to-indigo-900",
    "accentColor": "#6366f1"
  },
  {
    "id": "3",
    "name": "Basics",
    "slug": "basics",
    "description": "Everyday essentials",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/WEFDWEAD.jpg?v=1742804463",
    "count": 7,
    "gradient": "from-slate-600 to-slate-900",
    "accentColor": "#64748b"
  },
  {
    "id": "4",
    "name": "Graphic Tees",
    "slug": "graphic",
    "description": "Bold prints & graphics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/bhbghbh.jpg?v=1738601070",
    "count": 11,
    "gradient": "from-fuchsia-600 to-purple-900",
    "accentColor": "#c026d3"
  },
  {
    "id": "5",
    "name": "Full Sleeve",
    "slug": "full-sleeve",
    "description": "Long sleeve oversized tees",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/wecfxwedsa.jpg?v=1779355270",
    "count": 2,
    "gradient": "from-amber-600 to-orange-900",
    "accentColor": "#f59e0b"
  },
  {
    "id": "6",
    "name": "Caps",
    "slug": "caps",
    "description": "Complete the look",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/collections/WhatsApp_Image_2026-05-04_at_2.33.28_PM.jpg?v=1777886095",
    "count": 11,
    "gradient": "from-emerald-600 to-emerald-950",
    "accentColor": "#10b981"
  }
];

// Legacy mock catalog kept only for seed/bootstrap data. Storefront pages should
// read products from the catalog API via CatalogContext instead of importing this.
export const products: Product[] = [
  {
    "id": "1",
    "name": "All Ears T-Shirt",
    "brand": "BLUORNG",
    "price": 6300,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork795_b2427b70-468f-42e8-9ace-3c2e8ce54a00.jpg?v=1705136125",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork795_b2427b70-468f-42e8-9ace-3c2e8ce54a00.jpg?v=1705136125",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork797_68195e7d-d847-4543-9baf-bc40f88a8b7a.jpg?v=1705136125",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork799.jpg?v=1705136125"
    ],
    "rating": 4.5,
    "reviews": 50,
    "description": "All Ears oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 10,
    "isFavorite": true,
    "badge": "new"
  },
  {
    "id": "2",
    "name": "All Stars Black T-Shirt",
    "brand": "BLUORNG",
    "price": 4200,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3Q.jpg?v=1712056356",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3Q.jpg?v=1712056356",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3A.jpg?v=1712056356",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/9MJ.jpg?v=1712056356"
    ],
    "rating": 4.6,
    "reviews": 67,
    "description": "All Stars Black oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 13,
    "isFavorite": false,
    "originalPrice": 3995,
    "badge": "new"
  },
  {
    "id": "3",
    "name": "All Stars White T-Shirt",
    "brand": "BLUORNG",
    "price": 4200,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3C.jpg?v=1712464614",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3C.jpg?v=1712464614",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3B.jpg?v=1712464614",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3V.jpg?v=1712464614"
    ],
    "rating": 4.7,
    "reviews": 84,
    "description": "All Stars White oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4",
      "#1e3a8a"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 16,
    "isFavorite": false,
    "originalPrice": 4200,
    "badge": "new"
  },
  {
    "id": "4",
    "name": "Amazon Papilio Full Sleeve T-Shirt",
    "brand": "BLUORNG",
    "price": 7200,
    "category": "oversized-tees",
    "subcategory": "full-sleeve",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/wecfxwedsa.jpg?v=1779355270",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/wecfxwedsa.jpg?v=1779355270",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/sdacadasw.jpg?v=1779355258",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/4tc4redscxe.jpg?v=1779355693"
    ],
    "rating": 4.8,
    "reviews": 101,
    "description": "Amazon Papilio Full Sleeve oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 19,
    "isFavorite": false
  },
  {
    "id": "5",
    "name": "Antagonist T-Shirt",
    "brand": "BLUORNG",
    "price": 4700,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/bhbghbh.jpg?v=1738601070",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/bhbghbh.jpg?v=1738601070",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/uhubh.jpg?v=1738601070",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/hijhw.png?v=1738601070"
    ],
    "rating": 4.9,
    "reviews": 118,
    "description": "Antagonist oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 22,
    "isFavorite": true,
    "originalPrice": 4700
  },
  {
    "id": "6",
    "name": "Aqua Bird Of Paradise Full Sleeve T-Shirt",
    "brand": "BLUORNG",
    "price": 7200,
    "category": "oversized-tees",
    "subcategory": "full-sleeve",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/KHB_JK.jpg?v=1770040270",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/KHB_JK.jpg?v=1770040270",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/RECDEWS_17e467e6-1528-42f0-ac7b-9558bd07bf0d.jpg?v=1770040976",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/JN_LKM.jpg?v=1770040964"
    ],
    "rating": 4.5,
    "reviews": 135,
    "description": "Aqua Bird Of Paradise Full Sleeve oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4",
      "#1e3a8a"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 25,
    "isFavorite": false,
    "badge": "hot"
  },
  {
    "id": "7",
    "name": "Aqua Bonsai T-Shirt",
    "brand": "BLUORNG",
    "price": 4700,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/sdzcas.jpg?v=1741003597",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/sdzcas.jpg?v=1741003597",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/wefsdcaZ.jpg?v=1741003597",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC08703.jpg?v=1741003597"
    ],
    "rating": 4.6,
    "reviews": 152,
    "description": "Aqua Bonsai oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 28,
    "isFavorite": false,
    "originalPrice": 4700
  },
  {
    "id": "8",
    "name": "Aqua Deep Sea T-Shirt",
    "brand": "BLUORNG",
    "price": 4700,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/efceds_ed75190c-142d-44dc-8256-edc922478c48.jpg?v=1774262569",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/efceds_ed75190c-142d-44dc-8256-edc922478c48.jpg?v=1774262569",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/dazCaSD.jpgt.jpg?v=1774262569",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/ewrceqxds_0d96fb89-d49e-42dc-b91a-0ab61adcb908.jpg?v=1774262452"
    ],
    "rating": 4.7,
    "reviews": 169,
    "description": "Aqua Deep Sea oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 31,
    "isFavorite": false,
    "originalPrice": 4700
  },
  {
    "id": "9",
    "name": "Aurora Stag T-Shirt",
    "brand": "BLUORNG",
    "price": 4700,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled-1front.jpg?v=1738659142",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled-1front.jpg?v=1738659142",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled-1back.jpg?v=1738659142",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled-1_4c17ceb6-ff9f-440c-841a-de7761a103a5.jpg?v=1738659142"
    ],
    "rating": 4.8,
    "reviews": 186,
    "description": "Aurora Stag oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4",
      "#1e3a8a"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 10,
    "isFavorite": true,
    "originalPrice": 4700
  },
  {
    "id": "10",
    "name": "Away Kit Jersey",
    "brand": "BLUORNG",
    "price": 6300,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/tt69105_54ff2625-582d-4312-80fc-c7e9e60e8374.jpg?v=1753515771",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/tt69105_54ff2625-582d-4312-80fc-c7e9e60e8374.jpg?v=1753515771",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/tt69109_328b9bc1-3861-43e0-8c79-ffa7237579d5.jpg?v=1753515779",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/tt69106.jpg?v=1753515791"
    ],
    "rating": 4.9,
    "reviews": 203,
    "description": "Away Kit Jersey oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 13,
    "isFavorite": false,
    "originalPrice": 6300
  },
  {
    "id": "11",
    "name": "Baewatch Baby Tee",
    "brand": "BLUORNG",
    "price": 3700,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/ersgfvaszx.jpg?v=1749632122",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/ersgfvaszx.jpg?v=1749632122",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/sdcsdcz_0ac80c60-70d9-46c8-a900-62e976fb4788.jpg?v=1749891327",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/sfvcsZ.jpg?v=1749891327"
    ],
    "rating": 4.5,
    "reviews": 220,
    "description": "Baewatch Baby Tee oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4"
    ],
    "sizes": [
      "XXS",
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock": 16,
    "isFavorite": false,
    "originalPrice": 3700,
    "badge": "limited"
  },
  {
    "id": "12",
    "name": "Bamboozled T-Shirt",
    "brand": "BLUORNG",
    "price": 5200,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/ewcew.jpg?v=1759241401",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/ewcew.jpg?v=1759241401",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/efcrefc.jpg?v=1759241401",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/mnklml.jpg?v=1759241401"
    ],
    "rating": 4.6,
    "reviews": 237,
    "description": "Bamboozled oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4",
      "#1e3a8a"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 19,
    "isFavorite": false,
    "originalPrice": 5200
  },
  {
    "id": "13",
    "name": "Basic Black Office T-Shirt",
    "brand": "BLUORNG",
    "price": 4200,
    "category": "oversized-tees",
    "subcategory": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/WEFDWEAD.jpg?v=1742804463",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/WEFDWEAD.jpg?v=1742804463",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/WEDCXSWDC.jpg?v=1742804463",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/WEDCXWSADC.jpg?v=1742804463"
    ],
    "rating": 4.7,
    "reviews": 254,
    "description": "Basic Black Office oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 22,
    "isFavorite": true,
    "originalPrice": 4200
  },
  {
    "id": "14",
    "name": "Basic Dark full sleeve T-Shirt",
    "brand": "BLUORNG",
    "price": 5800,
    "category": "oversized-tees",
    "subcategory": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/refvceds.jpg?v=1772182576",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/refvceds.jpg?v=1772182576",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/rtevdfrwsfd.jpg?v=1772182580",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/rtgvfcews.jpg?v=1772187102"
    ],
    "rating": 4.8,
    "reviews": 271,
    "description": "Basic Dark full sleeve oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 25,
    "isFavorite": false
  },
  {
    "id": "15",
    "name": "Basic Grape Royale T-Shirt",
    "brand": "BLUORNG",
    "price": 3700,
    "category": "oversized-tees",
    "subcategory": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165177.jpg?v=1694434283",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165177.jpg?v=1694434283",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165178.jpg?v=1694434284",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165179.jpg?v=1694434283"
    ],
    "rating": 4.9,
    "reviews": 288,
    "description": "Basic Grape Royale oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4",
      "#1e3a8a"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 28,
    "isFavorite": false,
    "originalPrice": 3700
  },
  {
    "id": "16",
    "name": "Basic Greige T-Shirt",
    "brand": "BLUORNG",
    "price": 3995,
    "category": "oversized-tees",
    "subcategory": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165181.jpg?v=1694434428",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165181.jpg?v=1694434428",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165183.jpg?v=1694434434",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165184.jpg?v=1694434434"
    ],
    "rating": 4.5,
    "reviews": 305,
    "description": "Basic Greige oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 31,
    "isFavorite": false
  },
  {
    "id": "17",
    "name": "Basic Ice Water T-Shirt",
    "brand": "BLUORNG",
    "price": 4200,
    "category": "oversized-tees",
    "subcategory": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165188.jpg?v=1694434470",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165188.jpg?v=1694434470",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165189.jpg?v=1694434470",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165190.jpg?v=1694434470"
    ],
    "rating": 4.6,
    "reviews": 322,
    "description": "Basic Ice Water oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 10,
    "isFavorite": true,
    "originalPrice": 4200
  },
  {
    "id": "18",
    "name": "Basic Strawberry Cream T-Shirt",
    "brand": "BLUORNG",
    "price": 3995,
    "category": "oversized-tees",
    "subcategory": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165185.jpg?v=1694434333",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165185.jpg?v=1694434333",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165186.jpg?v=1694434334",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/DSC05165187.jpg?v=1694434333"
    ],
    "rating": 4.7,
    "reviews": 339,
    "description": "Basic Strawberry Cream oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4",
      "#1e3a8a"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 13,
    "isFavorite": false
  },
  {
    "id": "19",
    "name": "Basic White Office T-Shirt",
    "brand": "BLUORNG",
    "price": 4200,
    "category": "oversized-tees",
    "subcategory": "basics",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/EAFDCSDCSD.jpg?v=1742804434",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/EAFDCSDCSD.jpg?v=1742804434",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/WEDWEAD.jpg?v=1742804434",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/edwEADAED.jpg?v=1742804432"
    ],
    "rating": 4.8,
    "reviews": 356,
    "description": "Basic White Office oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 16,
    "isFavorite": false,
    "originalPrice": 4200
  },
  {
    "id": "20",
    "name": "Beige Wild Flower T-Shirt",
    "brand": "BLUORNG",
    "price": 4200,
    "category": "oversized-tees",
    "subcategory": "graphic",
    "image": "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork_269101.jpg?v=1745572336",
    "images": [
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork_269101.jpg?v=1745572336",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/wfsdcasZx.jpg?v=1745572336",
      "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork_269102.jpg?v=1745572336"
    ],
    "rating": 4.9,
    "reviews": 373,
    "description": "Beige Wild Flower oversized tee. 100% cotton, 260 GSM, screen print. Reverse wash only. Free delivery pan-India.",
    "features": [
      "100% Cotton",
      "260 GSM",
      "Screen Print",
      "Oversized Fit",
      "Reverse Wash Only"
    ],
    "colors": [
      "#1c1917",
      "#f5f5f4"
    ],
    "sizes": [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL"
    ],
    "stock": 19,
    "isFavorite": false,
    "originalPrice": 4200
  }
];

export const heroSlides = [
  {
    id: 1,
    title: "Wear Your",
    subtitle: "Story",
    description: "Premium oversized tees curated for those who dress with intention.",
    cta: "Shop Now",
    image: "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/Untitled_Artwork795_b2427b70-468f-42e8-9ace-3c2e8ce54a00.jpg?v=1705136125",
    gradient: "from-blue-900/30 via-transparent to-slate-900/20",
  },
  {
    id: 2,
    title: "Oversized",
    subtitle: "Collection",
    description: "Fresh fits designed for the way you move.",
    cta: "Explore",
    image: "https://cdn.shopify.com/s/files/1/0514/9494/4962/files/3C.jpg?v=1712464614",
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
