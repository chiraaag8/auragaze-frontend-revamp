"use client";

import { useEffect, useState } from "react";
import { History, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import type {
  InventoryRow,
  InventoryTransactionRow,
} from "@/types/admin-inventory";
import { cn, formatDateTime } from "@/lib/utils";

interface InventoryHistoryDrawerProps {
  row: InventoryRow;
  onClose: () => void;
}

export default function InventoryHistoryDrawer({
  row,
  onClose,
}: InventoryHistoryDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<InventoryTransactionRow[]>(
    [],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/inventory/${row.variantId}?limit=50`,
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error ?? "Unable to load history.");
          return;
        }
        if (!cancelled) {
          setTransactions(data.transactions ?? []);
        }
      } catch {
        if (!cancelled) toast.error("Unable to load history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [row.variantId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--label-accent)]">
              <History size={14} />
              Ledger
            </div>
            <h2 className="font-heading text-lg font-bold">{row.productName}</h2>
            <p className="text-sm text-[var(--muted)]">
              {row.color} / {row.size} · {row.sku}
            </p>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-button">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[var(--muted)]">
              <LoaderCircle size={16} className="animate-spin" />
              Loading history…
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-16 text-center text-sm text-[var(--muted)]">
              No transactions yet for this variant.
            </p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="rounded-xl border border-[var(--border)] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-bold",
                        tx.type === "IN" &&
                          "bg-emerald-500/15 text-emerald-600",
                        tx.type === "OUT" && "bg-rose-500/15 text-rose-600",
                        tx.type === "ADJUSTMENT" &&
                          "bg-amber-500/15 text-amber-700",
                      )}
                    >
                      {tx.type}
                    </span>
                    <span className="font-semibold">
                      {tx.type === "OUT" ? "−" : tx.type === "IN" ? "+" : "±"}
                      {tx.quantity}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {formatDateTime(tx.createdAt)}
                  </p>
                  {tx.note ? (
                    <p className="mt-1 text-sm text-[var(--muted-strong)]">
                      {tx.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
