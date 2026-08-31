"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, LoaderCircle, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import TopBar from "@/components/TopBar";
import ProductCard from "@/components/ProductCard";
import PageShell, { productGridClass } from "@/components/PageShell";
import { shopFilters } from "@/lib/data";
import {
  filterLabelFromSlug,
  filterSlugFromLabel,
  matchesCategory,
} from "@/lib/category-utils";
import { useCatalog } from "@/context/CatalogContext";
import { cn } from "@/lib/utils";

const filters = shopFilters;
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

function resolveFilterFromSlug(slug: string | null) {
  if (!slug) return "All";
  const label = filterLabelFromSlug(slug);
  const known = filters.find(
    (filter) => filter !== "All" && filterSlugFromLabel(filter) === slug,
  );
  return known ?? label;
}

function ShopContent() {
  const { products, loading, error, refresh } = useCatalog();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState(() => resolveFilterFromSlug(categoryParam));
  const [activeSort, setActiveSort] = useState("Featured");
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveFilter(resolveFilterFromSlug(categoryParam));
  }, [categoryParam]);

  const selectFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "All") {
      router.replace("/shop", { scroll: false });
      return;
    }
    router.replace(`/shop?category=${filterSlugFromLabel(filter)}`, { scroll: false });
  };

  const filterSlug =
    activeFilter === "All" ? null : filterSlugFromLabel(activeFilter);

  const filtered =
    !filterSlug
      ? products
      : products.filter((p) => matchesCategory(p, filterSlug));

  const sorted = [...filtered].sort((a, b) => {
    switch (activeSort) {
      case "Price: Low to High": return a.price - b.price;
      case "Price: High to Low": return b.price - a.price;
    case "Newest": return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    default:
      return Number(b.isFeatured) - Number(a.isFeatured);
    }
  });

  const visibleFilters =
    activeFilter === "All" || filters.includes(activeFilter)
      ? filters
      : [...filters.slice(0, 1), activeFilter, ...filters.slice(1)];

  useEffect(() => {
    if (!showSortMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showSortMenu]);

  return (
    <div className="min-h-screen pb-6 lg:pb-12">
      <TopBar title="Shop" />

      <PageShell className="pt-16 lg:pt-24">
        <div className="flex gap-2 overflow-x-auto pb-1 pt-4 scrollbar-hide snap-x lg:flex-wrap lg:overflow-visible lg:snap-none">
          {visibleFilters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => selectFilter(filter)}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "filter-chip snap-start no-select",
                activeFilter === filter ? "filter-chip-active" : "filter-chip-inactive"
              )}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between py-3 lg:py-5">
          <p className="text-xs lg:text-sm" style={{ color: "var(--muted)" }}>
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>{sorted.length}</span> products
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSortSheet(true)}
            className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-full filter-chip-inactive text-xs font-semibold no-select"
          >
            <SlidersHorizontal size={12} />
            {activeSort}
          </motion.button>
          <div className="relative hidden lg:block" ref={sortMenuRef}>
            <button
              type="button"
              onClick={() => setShowSortMenu((open) => !open)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full filter-chip-inactive text-sm font-semibold no-select"
            >
              <SlidersHorizontal size={14} />
              {activeSort}
              <ChevronDown size={14} className={cn("transition-transform", showSortMenu && "rotate-180")} />
            </button>
            {showSortMenu && (
              <div
                className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl p-1.5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
              >
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setActiveSort(option);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      "w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      activeSort === option
                        ? "text-[var(--label-accent)]"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
                    )}
                    style={{
                      background: activeSort === option ? "var(--primary-muted)" : "transparent",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted">
            <LoaderCircle size={18} className="animate-spin" />
            Loading products…
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <p className="text-sm text-muted">{error}</p>
            <button
              onClick={() => void refresh()}
              className="filter-chip filter-chip-active inline-flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className={productGridClass}>
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: "var(--surface)" }}>
              <SlidersHorizontal size={24} style={{ color: "var(--muted)" }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>No products found</p>
            <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
              Try a different filter
            </p>
          </motion.div>
        )}
      </PageShell>

      <AnimatePresence>
        {showSortSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSortSheet(false)}
              className="fixed inset-0 z-[60] lg:hidden"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[61] rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden"
              style={{ background: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>Sort By</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSortSheet(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "var(--surface)" }}
                >
                  <X size={16} style={{ color: "var(--foreground)" }} />
                </motion.button>
              </div>
              <div className="flex flex-col gap-2">
                {sortOptions.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveSort(option);
                      setShowSortSheet(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 no-select border",
                      activeSort === option ? "text-[var(--label-accent)]" : "text-[var(--foreground)]"
                    )}
                    style={{
                      background: activeSort === option ? "var(--primary-muted)" : "var(--surface)",
                      borderColor: activeSort === option ? "var(--primary-border)" : "var(--border)",
                    }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
