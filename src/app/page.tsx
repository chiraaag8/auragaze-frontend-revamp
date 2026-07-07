"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import TopBar from "@/components/TopBar";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductCard from "@/components/ProductCard";
import HeroPreload from "@/components/HeroPreload";
import ScrollHero from "@/components/ScrollHero";
import { products, getFeaturedProducts } from "@/lib/data";

const HERO_POSTER_SRC = "/hero-poster.jpg";
const featured = getFeaturedProducts(4);
const newArrivals = products.filter((p) => p.badge === "new").slice(0, 4);

export default function HomePage() {
  return (
    <div className="min-h-screen pb-6">
      <HeroPreload />
      <TopBar />

      <ScrollHero posterSrc={HERO_POSTER_SRC}>
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-end pb-20 px-5 max-w-lg mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center"
          >
            <Link href="/shop">
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-bold no-select btn-gradient"
              >
                Shop Now
                <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </ScrollHero>

      <CategoryCarousel />

      {/* Featured Products */}
      <section className="px-4 pt-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-4"
        >
          <div>
            <p className="text-[11px] font-semibold label-accent uppercase tracking-widest mb-0.5">Handpicked</p>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              Featured
              <TrendingUp size={18} className="text-rose-500" />
            </h2>
          </div>
          <Link href="/shop">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-xs font-semibold label-accent no-select"
            >
              View all
              <ArrowRight size={12} />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* New Arrivals Banner */}
      {newArrivals.length > 0 && (
        <section className="px-4 pt-10 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-4"
          >
            <div>
              <p className="text-[11px] font-semibold label-accent uppercase tracking-widest mb-0.5">Just Dropped</p>
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                New Arrivals
              </h2>
            </div>
            <Link href="/shop?filter=new">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 text-xs font-semibold label-accent no-select"
              >
                View all
                <ArrowRight size={12} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Horizontal scroll on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {newArrivals.map((product, i) => (
              <div key={product.id} className="flex-none w-40 snap-start">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brand Story Banner */}
      <section className="px-4 pt-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden h-44"
        >
          <Image
            src={products[0].image}
            alt="Brand Story"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 512px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2">Our Story</p>
            <h3 className="text-white font-black text-2xl leading-tight mb-3">
              Styled for
              <br />
              Every Moment
            </h3>
            <Link href="/about">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-full w-fit no-select"
                style={{ background: "rgba(30,58,138,0.55)", border: "1px solid rgba(59,130,246,0.4)" }}
              >
                Discover More
                <ArrowRight size={12} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
