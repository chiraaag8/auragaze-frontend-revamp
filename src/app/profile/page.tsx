"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShoppingBag,
  LoaderCircle,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import PageShell from "@/components/PageShell";
import { useWishlist } from "@/context/WishlistContext";

const menuItems = [
  { icon: Package, label: "My Orders", sub: "Track your orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", sub: "Saved items", href: "/wishlist" },
  { icon: MapPin, label: "Addresses", sub: "Manage delivery addresses", href: "/profile/addresses" },
  { icon: CreditCard, label: "Payment Methods", sub: "Cards & wallets", href: "#" },
  { icon: Bell, label: "Notifications", sub: "Alerts & updates", href: "#" },
  { icon: HelpCircle, label: "Help & Support", sub: "FAQs and contact", href: "#" },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { count: wishlistCount, hydrated: wishlistHydrated } = useWishlist();
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok || !active) return;
        const data = (await res.json()) as { orders?: unknown[] };
        setOrderCount(data.orders?.length ?? 0);
      } catch {
        if (active) setOrderCount(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin label-accent" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Link href="/login?callbackUrl=/profile" className="btn-gradient rounded-xl px-5 py-3 text-sm font-bold">
          Sign in to view your profile
        </Link>
      </div>
    );
  }

  const displayName = session.user.name?.trim() || "AURAGAZE Member";
  const stats = [
    { icon: ShoppingBag, label: "Orders", value: orderCount === null ? "—" : String(orderCount) },
    {
      icon: Heart,
      label: "Wishlist",
      value: wishlistHydrated ? String(wishlistCount) : "—",
    },
  ];
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen pb-6">
      <TopBar title="Profile" />

      <PageShell className="pt-16 lg:pt-24">
        <div className="lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
        <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-6 pb-4 lg:pt-0"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div
                className="bg-gradient-primary flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-white"
                style={{ border: "2px solid var(--primary-border)" }}
                aria-label={`${displayName} avatar`}
              >
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center" style={{ border: "2px solid var(--background)" }}>
                <span className="text-white text-[10px] font-bold">✓</span>
              </div>
            </div>
            <div>
              <h2 className="font-black text-xl" style={{ color: "var(--foreground)" }}>
                {displayName}
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {session.user.email}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold label-accent" style={{ background: "var(--primary-muted)" }}>
                {session.user.role === "ADMIN" ? "✦ Administrator" : "✦ Member"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            {stats.map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                whileTap={{ scale: 0.96 }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <Icon size={18} className="label-accent" />
                <p className="font-black text-lg leading-none" style={{ color: "var(--foreground)" }}>
                  {value}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-5 rounded-2xl overflow-hidden relative h-24 lg:h-28"
          style={{
            background: "linear-gradient(135deg, rgba(30,58,138,0.85) 0%, rgba(37,99,235,0.85) 100%)",
          }}
        >
          <div className="absolute inset-0 p-4 flex flex-col justify-center">
            <p className="text-white/80 text-xs font-semibold">Exclusive for you</p>
            <p className="text-white font-black text-lg">Get 20% off your next order</p>
            <p className="text-white/70 text-xs">Use code: <strong>AURA20</strong></p>
          </div>
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 text-8xl font-black text-white pointer-events-none select-none"
          >
            AG
          </div>
        </motion.div>
        </div>

        <div>
        <div className="flex flex-col gap-2 mb-4">
          {menuItems.map(({ icon: Icon, label, sub, href }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
            >
              <Link href={href}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-none" style={{ background: "var(--primary-muted)" }}>
                    <Icon size={18} className="label-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                      {label}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {sub}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--muted)" }} className="flex-none" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-rose-500 font-semibold text-sm no-select"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <LogOut size={16} />
            Sign Out
          </motion.button>
        </div>
        </div>
        </div>
      </PageShell>
    </div>
  );
}
