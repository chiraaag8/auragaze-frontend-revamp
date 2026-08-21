"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Boxes,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Package,
  Percent,
  ShoppingBag,
  Store,
  Truck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/promos", label: "Promos", icon: Percent },
  { href: "/admin/homepage", label: "Homepage", icon: LayoutGrid },
  { href: "/admin/shipping", label: "Shipping", icon: Truck },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export default function AdminSidebar({
  mobileOpen = false,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-[min(18rem,88vw)] flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] shadow-xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-screen lg:w-56 lg:translate-x-0 lg:shadow-none xl:w-64",
        mobileOpen
          ? "translate-x-0"
          : "-translate-x-full max-lg:pointer-events-none lg:translate-x-0",
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-6">
        <Link href="/admin" className="block min-w-0" onClick={onNavigate}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--label-accent)]">
            AURAGAZE
          </p>
          <h1 className="font-heading text-xl font-black tracking-tight">Admin</h1>
        </Link>
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onNavigate}
          className="admin-icon-button shrink-0 lg:hidden"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-[var(--primary-muted)] text-[var(--label-accent)]"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)]",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[var(--border)] p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--muted-strong)] transition-colors hover:bg-[var(--surface-hover)]"
        >
          <Store size={18} />
          View Storefront
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--muted-strong)] transition-colors hover:bg-[var(--surface-hover)]"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
