"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StorefrontProduct } from "@/types/product";

interface CatalogContextValue {
  products: StorefrontProduct[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getProduct: (idOrSlug: string) => StorefrontProduct | undefined;
  getSimilarProducts: (
    product: StorefrontProduct,
    limit?: number,
  ) => StorefrontProduct[];
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

let catalogProductsCache: StorefrontProduct[] | null = null;

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<StorefrontProduct[]>(
    () => catalogProductsCache ?? [],
  );
  const [loading, setLoading] = useState(() => catalogProductsCache === null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (signal?: AbortSignal) => {
    const hasCachedProducts = catalogProductsCache !== null;
    if (!hasCachedProducts) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch("/api/products?sort=featured", { signal });
      if (!response.ok) throw new Error("Product request failed");
      const result = (await response.json()) as StorefrontProduct[];
      catalogProductsCache = result;
      setProducts(result);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") {
        return;
      }
      if (!hasCachedProducts) {
        setError("Unable to load the catalog. Please try again.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (catalogProductsCache) return;

    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        void loadProducts(controller.signal);
      }
    });
    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  const getProduct = useCallback(
    (idOrSlug: string) =>
      products.find(
        (product) => product.id === idOrSlug || product.slug === idOrSlug,
      ),
    [products],
  );

  const getSimilarProducts = useCallback(
    (product: StorefrontProduct, limit = 6) =>
      products
        .filter(
          (candidate) =>
            candidate.id !== product.id &&
            (candidate.category === product.category ||
              candidate.subcategory === product.subcategory),
        )
        .slice(0, limit),
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refresh: () => loadProducts(),
      getProduct,
      getSimilarProducts,
    }),
    [error, getProduct, getSimilarProducts, loadProducts, loading, products],
  );

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return context;
}
