"use client";

import { motion, PanInfo, type Transition } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { carouselCategories as fallbackCategories, type CarouselCategory } from "@/lib/data";
import { useCatalog } from "@/context/CatalogContext";
import { getLiveCarouselCategories } from "@/lib/category-utils";
import { cn } from "@/lib/utils";
import { pageShellClass } from "./PageShell";

const MOBILE_CARD_W = 248;
const MOBILE_CARD_H = 372;
const DESKTOP_CARD_W = 320;
const DESKTOP_CARD_H = 480;
const DRAG_THRESHOLD = 48;
const WHEEL_COOLDOWN_MS = 520;

const SPRING: Transition = {
  type: "spring",
  stiffness: 340,
  damping: 34,
  mass: 0.85,
};

let carouselCategoriesCache: CarouselCategory[] | null = null;

function wrapOffset(index: number, active: number, total: number): number {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function getCardStyle(offset: number, cardW: number) {
  const s = cardW / MOBILE_CARD_W;
  if (offset === 0) {
    return { x: 0, scale: 1, opacity: 1, zIndex: 30 };
  }
  if (offset === -1) {
    return { x: -cardW * 0.54, scale: 0.895, opacity: 0.9, zIndex: 18 };
  }
  if (offset === 1) {
    return { x: 44 * s, scale: 0.958, opacity: 0.97, zIndex: 26 };
  }
  if (offset === 2) {
    return { x: 82 * s, scale: 0.918, opacity: 0.91, zIndex: 24 };
  }
  if (offset === 3) {
    return { x: 118 * s, scale: 0.878, opacity: 0.84, zIndex: 22 };
  }
  if (offset < -1) {
    return { x: -cardW * 0.9, scale: 0.82, opacity: 0, zIndex: 10 };
  }
  return { x: (154 + (offset - 4) * 38) * s, scale: 0.84, opacity: 0, zIndex: 20 };
}

interface CarouselCardProps {
  category: CarouselCategory;
  offset: number;
  isActive: boolean;
  onSelect: () => void;
  didDragRef: RefObject<boolean>;
  cardW: number;
  cardH: number;
}

function CarouselCard({
  category,
  offset,
  isActive,
  onSelect,
  didDragRef,
  cardW,
  cardH,
}: CarouselCardProps) {
  const style = getCardStyle(offset, cardW);
  const visible = Math.abs(offset) <= 3;

  const cardInner = (
    <div className="group relative h-full w-full overflow-hidden rounded-[28px] bg-white">
      <Image
        src={category.image}
        alt={category.name}
        fill
        priority={isActive}
        className={cn(
          "object-cover transition-transform duration-700 ease-out",
          isActive && "group-hover:scale-[1.06]"
        )}
        sizes="(max-width: 1023px) 248px, 320px"
        draggable={false}
      />
      <p className="absolute bottom-5 left-0 right-0 text-center text-[13px] lg:text-base font-semibold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
        {category.name}
      </p>
      {isActive ? (
        <Link
          href={`/shop?category=${category.slug}`}
          prefetch={false}
          className="absolute inset-0 z-10"
          aria-label={`Shop ${category.name}`}
          onClick={(e) => {
            if (didDragRef.current) {
              e.preventDefault();
              didDragRef.current = false;
            }
          }}
        />
      ) : null}
    </div>
  );

  return (
    <motion.div
      animate={{
        x: style.x,
        scale: style.scale,
        opacity: visible ? style.opacity : 0,
      }}
      transition={SPRING}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-grab active:cursor-grabbing",
        !visible && "pointer-events-none"
      )}
      style={{
        width: cardW,
        height: cardH,
        marginLeft: -cardW / 2,
        marginTop: -cardH / 2,
        zIndex: style.zIndex,
      }}
      onClick={() => {
        if (!isActive) onSelect();
      }}
    >
      {cardInner}
    </motion.div>
  );
}

export default function CategoryCarousel() {
  const { products } = useCatalog();
  const [categories, setCategories] = useState<CarouselCategory[]>(
    () => carouselCategoriesCache ?? [],
  );
  const [categoriesReady, setCategoriesReady] = useState(
    () => carouselCategoriesCache !== null,
  );
  const liveCategories = getLiveCarouselCategories(categories, products);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLocked = useRef(false);
  const didDrag = useRef(false);

  const total = liveCategories.length;
  const cardW = isDesktop ? DESKTOP_CARD_W : MOBILE_CARD_W;
  const cardH = isDesktop ? DESKTOP_CARD_H : MOBILE_CARD_H;
  const stageH = isDesktop ? 540 : 408;

  const paginate = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((prev) => (prev + direction + total) % total);
    },
    [total]
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD || info.velocity.x < -400) {
      didDrag.current = true;
      paginate(1);
    } else if (info.offset.x > DRAG_THRESHOLD || info.velocity.x > 400) {
      didDrag.current = true;
      paginate(-1);
    }
  };

  useEffect(() => {
    if (carouselCategoriesCache) {
      setCategoriesReady(true);
      return;
    }

    let active = true;
    (async () => {
      try {
        const response = await fetch("/api/carousel-categories");
        if (!response.ok || !active) return;
        const data = (await response.json()) as CarouselCategory[];
        if (Array.isArray(data) && data.length > 0) {
          carouselCategoriesCache = data;
          setCategories(data);
          return;
        }
        if (!carouselCategoriesCache) {
          carouselCategoriesCache = fallbackCategories;
          setCategories(fallbackCategories);
        }
      } catch {
        if (active && !carouselCategoriesCache) {
          setCategories(fallbackCategories);
        }
      } finally {
        if (active) setCategoriesReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) => prev % total);
  }, [total]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || total === 0) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLocked.current) return;
      if (Math.abs(e.deltaY) < 8) return;

      wheelLocked.current = true;
      if (e.deltaY > 0) paginate(1);
      else paginate(-1);

      window.setTimeout(() => {
        wheelLocked.current = false;
      }, WHEEL_COOLDOWN_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [paginate, total]);

  const sortedCards = liveCategories
    .map((category, index) => ({
      category,
      index,
      offset: wrapOffset(index, activeIndex, total),
    }))
    .sort((a, b) => getCardStyle(a.offset, cardW).zIndex - getCardStyle(b.offset, cardW).zIndex);

  if (!categoriesReady) {
    return null;
  }

  if (total === 0) {
    return null;
  }

  return (
    <section className={cn(pageShellClass, "relative pt-6 pb-1 px-1 lg:pt-10")}>
      <motion.div
        ref={containerRef}
        className="relative mx-auto w-full touch-pan-y select-none overflow-visible"
        style={{ height: stageH }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        onDragStart={() => {
          didDrag.current = false;
        }}
        onDragEnd={handleDragEnd}
      >
        {sortedCards.map(({ category, index, offset }) => (
          <CarouselCard
            key={category.id}
            category={category}
            offset={offset}
            isActive={offset === 0}
            onSelect={() => setActiveIndex(index)}
            didDragRef={didDrag}
            cardW={cardW}
            cardH={cardH}
          />
        ))}
      </motion.div>
    </section>
  );
}
