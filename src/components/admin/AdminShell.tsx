"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="admin-shell min-h-screen">
      <div className="flex min-h-screen">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <AdminSidebar
          mobileOpen={mobileOpen}
          onNavigate={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 lg:hidden">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="admin-icon-button shrink-0"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--label-accent)]">
                AURAGAZE
              </p>
              <p className="truncate font-heading text-lg font-black tracking-tight">
                Admin
              </p>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
