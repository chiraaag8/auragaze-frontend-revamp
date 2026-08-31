"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import RemoteImage from "@/components/RemoteImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  ShoppingCart,
  Package,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
  LoaderCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import TopBar from "@/components/TopBar";
import PageShell, { pageShellClass, productGridClass } from "@/components/PageShell";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";

export default function ProductPageClient({ id }: { id: string }) {
  const router = useRouter();
  const { addItem, itemCount, hydrated } = useCart();
  const { getProduct, getSimilarProducts, loading, error } = useCatalog();
  const product = getProduct(id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showCartBadge = mounted && hydrated && itemCount > 0;

  const imageCount = product?.images.length ?? 0;

  useEffect(() => {
    if (!lightboxOpen || imageCount === 0) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
        return;
      }
      if (event.key === "ArrowLeft") {
        setSelectedImage((current) =>
          current === 0 ? imageCount - 1 : current - 1,
        );
        return;
      }
      if (event.key === "ArrowRight") {
        setSelectedImage((current) =>
          current === imageCount - 1 ? 0 : current + 1,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, imageCount]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-muted">
        <LoaderCircle size={20} className="animate-spin" />
        Loading product…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted">{error}</p>
        <Link href="/shop">
          <button className="px-6 py-3 rounded-2xl text-white text-sm font-semibold btn-gradient">
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
          Product not found
        </p>
        <Link href="/shop">
          <button className="px-6 py-3 rounded-2xl text-white text-sm font-semibold btn-gradient">
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  const similarProducts = getSimilarProducts(product, 6);
  const requestedColor = product.colors[selectedColor] ?? product.colors[0];
  const requestedVariant = product.variants.find(
    (variant) =>
      variant.color === requestedColor &&
      variant.size === selectedSize &&
      variant.stock > 0,
  );
  const selectedVariant =
    requestedVariant ??
    product.variants.find((variant) => variant.stock > 0) ??
    product.variants[0];
  const selectedColorValue = selectedVariant?.color ?? requestedColor;
  const resolvedColorIndex = Math.max(
    0,
    product.colors.indexOf(selectedColorValue),
  );
  const resolvedSize = selectedVariant?.size ?? selectedSize;
  const selectedStock = selectedVariant?.stock ?? 0;
  const isSoldOut = selectedStock <= 0;

  const handleColorSelect = (colorIndex: number) => {
    const color = product.colors[colorIndex];
    const currentSizeStock =
      product.variants.find(
        (variant) =>
          variant.color === color && variant.size === resolvedSize,
      )?.stock ?? 0;
    setSelectedColor(colorIndex);
    if (currentSizeStock <= 0) {
      const firstAvailable = product.variants.find(
        (variant) => variant.color === color && variant.stock > 0,
      );
      if (firstAvailable) setSelectedSize(firstAvailable.size);
    }
    setQty(1);
  };

  const handleAddToCart = () => {
    if (isSoldOut || !selectedVariant) return;
    void addItem(selectedVariant.id, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const AddToCartButton = () => (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleAddToCart}
      disabled={isSoldOut}
      className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2.5 text-white font-bold no-select overflow-hidden relative btn-gradient disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background: addedToCart
          ? "linear-gradient(135deg, #10b981, #059669)"
          : undefined,
        boxShadow: addedToCart
          ? "0 4px 20px rgba(16,185,129,0.4)"
          : undefined,
        transition: "background 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <AnimatePresence mode="wait">
        {addedToCart ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Check size={18} />
            Added to Cart!
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            {isSoldOut
              ? "Selected variant unavailable"
              : `Add to Cart · ${formatPrice(product.price * qty)}`}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <div className="min-h-screen pb-44 lg:pb-16">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-[var(--glass-border)]">
        <div className={cn(pageShellClass, "h-14 flex items-center justify-between")}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full glass flex items-center justify-center no-select"
          >
            <ArrowLeft size={18} style={{ color: "var(--foreground)" }} />
          </motion.button>

          <span className="font-semibold text-sm truncate mx-3" style={{ color: "var(--foreground)" }}>
            {product.name}
          </span>

          <div className="flex items-center gap-2">
            <WishlistButton productId={product.id} />
            <Link href="/cart">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full glass flex items-center justify-center relative no-select"
                aria-label="Cart"
              >
                <ShoppingCart size={16} style={{ color: "var(--foreground)" }} />
                {showCartBadge && (
                  <span
                    suppressHydrationWarning
                    className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-0.5 bg-blue-600 rounded-full text-[9px] text-white font-bold flex items-center justify-center"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </motion.div>
            </Link>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center no-select"
            >
              <Share2 size={16} style={{ color: "var(--foreground)" }} />
            </motion.button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <TopBar />
      </div>

      <PageShell className="lg:pt-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          <div className="-mx-4 lg:mx-0">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="relative h-80 w-full pt-14 lg:pt-0 lg:h-auto lg:aspect-[3/4] lg:rounded-3xl lg:overflow-hidden text-left"
              aria-label="View full product image"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0"
                >
                  <RemoteImage
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    width={1200}
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent lg:hidden" />

              {product.badge && (
                <div className="absolute top-[72px] left-4 lg:top-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase"
                    style={{
                      background: product.badge === "sale" ? "#ef4444" : product.badge === "hot" ? "#f97316" : product.badge === "limited" ? "#f59e0b" : "#2563eb",
                    }}
                  >
                    {product.badge === "sale" && product.originalPrice
                      ? `${getDiscountPercent(product.price, product.originalPrice)}% Off`
                      : product.badge}
                  </span>
                </div>
              )}
            </button>

            {product.images.length > 1 && (
              <div className="flex gap-2 px-4 lg:px-0 mt-3 mb-2 lg:mt-4">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                      selectedImage === i ? "border-blue-500" : "border-transparent opacity-60"
                    )}
                  >
                    <RemoteImage src={img} alt={`${product.name} ${i + 1}`} fill width={160} className="object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <div className="px-0 pt-2 lg:sticky lg:top-24">
            <button
              type="button"
              onClick={() => router.back()}
              className="hidden lg:inline-flex items-center gap-2 mb-4 text-sm font-semibold text-muted hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <p className="text-[11px] lg:text-xs font-semibold label-accent uppercase tracking-widest mb-1">
              {product.brand}
            </p>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl lg:text-4xl font-black mb-2 leading-tight" style={{ color: "var(--foreground)" }}>
                {product.name}
              </h1>
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <WishlistButton productId={product.id} />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center no-select"
                >
                  <Share2 size={16} style={{ color: "var(--foreground)" }} />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl lg:text-4xl font-black" style={{ color: "var(--foreground)" }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg line-through" style={{ color: "var(--muted)" }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-rose-500">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
                Color — <span style={{ color: "var(--foreground)" }}>Option {resolvedColorIndex + 1}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => {
                  const colorInStock = product.variants.some(
                    (variant) => variant.color === color && variant.stock > 0,
                  );
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleColorSelect(i)}
                      disabled={!colorInStock}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30",
                        resolvedColorIndex === i
                          ? "border-blue-500 scale-110"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Color option ${i + 1}${colorInStock ? "" : " — out of stock"}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
                Size — <span style={{ color: "var(--foreground)" }}>{resolvedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const sizeStock =
                    product.variants.find(
                      (variant) =>
                        variant.color === selectedColorValue &&
                        variant.size === size,
                    )?.stock ?? 0;
                  return (
                    <motion.button
                      key={size}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        setSelectedSize(size);
                        setQty(1);
                      }}
                      disabled={sizeStock <= 0}
                      className={cn(
                        "min-w-10 px-3 h-9 rounded-xl text-xs font-bold transition-all duration-200 no-select disabled:cursor-not-allowed disabled:line-through disabled:opacity-35",
                        resolvedSize === size
                          ? "filter-chip-active"
                          : "filter-chip-inactive",
                      )}
                    >
                      {size}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1">
                <p className="text-xs mr-3" style={{ color: "var(--muted)" }}>Qty</p>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center no-select"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span style={{ color: "var(--foreground)" }} className="text-lg font-bold leading-none">−</span>
                </motion.button>
                <span className="w-8 text-center font-bold text-sm" style={{ color: "var(--foreground)" }}>
                  {qty}
                </span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQty(Math.min(selectedStock, qty + 1))}
                  disabled={isSoldOut || qty >= selectedStock}
                  className="w-8 h-8 rounded-full flex items-center justify-center no-select"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span style={{ color: "var(--foreground)" }} className="text-lg font-bold leading-none">+</span>
                </motion.button>
              </div>
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                  selectedStock === 0
                    ? "text-rose-600 bg-rose-100 dark:bg-rose-950"
                    : selectedStock <= 5
                      ? "text-orange-600 bg-orange-100 dark:bg-orange-950"
                      : "text-emerald-600 bg-emerald-100 dark:bg-emerald-950"
                )}
              >
                {selectedStock === 0
                  ? "Out of stock"
                  : selectedStock <= 5
                    ? `Only ${selectedStock} left!`
                    : `${selectedStock} in stock`}
              </span>
            </div>

            <div className="hidden lg:flex gap-3 mb-6">
              <WishlistButton
                productId={product.id}
                variant="plain"
                iconSize={20}
                className="flex-none h-14 w-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              />
              <AddToCartButton />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {product.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-none" style={{ background: "var(--primary-muted)" }}>
                    <Check size={10} className="label-accent" />
                  </div>
                  <span className="text-[11px] lg:text-xs font-medium leading-tight" style={{ color: "var(--foreground)" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mb-6 rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="w-full flex items-center justify-between px-4 py-3.5 no-select"
              >
                <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  Description
                </span>
                {descExpanded ? (
                  <ChevronUp size={16} style={{ color: "var(--muted)" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                )}
              </button>
              <AnimatePresence>
                {descExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {product.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!descExpanded && (
                <p className="px-4 pb-4 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>
                  {product.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { icon: Package, label: "Free Shipping", sub: "Within 10 km" },
                { icon: Zap, label: "Fast Delivery", sub: "2-3 days" },
                { icon: Shield, label: "1 Year Warranty", sub: "Guaranteed" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 p-3 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <Icon size={18} className="label-accent" />
                  <p className="text-[10px] lg:text-xs font-bold leading-tight" style={{ color: "var(--foreground)" }}>{label}</p>
                  <p className="text-[9px] lg:text-[11px]" style={{ color: "var(--muted)" }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mb-6 lg:mt-8">
            <div className="mb-4 lg:mb-6">
              <p className="text-[11px] lg:text-xs font-semibold label-accent uppercase tracking-widest mb-0.5">
                You May Also Like
              </p>
              <h2 className="text-xl lg:text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                Similar Products
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory lg:hidden">
              {similarProducts.map((p, i) => (
                <div key={p.id} className="flex-none w-44 snap-start">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
            <div className={cn("hidden lg:grid", productGridClass)}>
              {similarProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </PageShell>

      <div className="fixed bottom-[5.75rem] left-0 right-0 z-[45] px-4 lg:hidden">
        <div className="max-w-lg mx-auto flex gap-3">
          <WishlistButton
            productId={product.id}
            variant="plain"
            iconSize={20}
            className="flex-none h-14 w-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
          />
          <AddToCartButton />
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex flex-col bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label="Product image viewer"
          >
            <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
              <p className="truncate text-sm font-medium text-white/80">
                {selectedImage + 1} / {product.images.length}
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setLightboxOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                aria-label="Close image viewer"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
              onClick={() => setLightboxOpen(false)}
            >
              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedImage((current) =>
                      current === 0 ? product.images.length - 1 : current - 1,
                    );
                  }}
                  className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative h-full w-full max-w-3xl lg:max-w-5xl"
                onClick={(event) => event.stopPropagation()}
              >
                <RemoteImage
                  src={product.images[selectedImage]}
                  alt={`${product.name} full view`}
                  fill
                  width={1600}
                  className="object-contain"
                />
              </motion.div>

              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedImage((current) =>
                      current === product.images.length - 1 ? 0 : current + 1,
                    );
                  }}
                  className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
