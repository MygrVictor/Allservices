"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  localizeProduct,
  productsForAudience,
  type CatalogProduct,
} from "@/lib/catalog";
import { useLocale } from "@/components/locale-provider";

const STORAGE_KEY = "asm-cart";

type CartContextValue = {
  quantities: Record<string, number>;
  setQuantities: (next: Record<string, number>) => void;
  add: (code: string) => void;
  remove: (code: string) => void;
  items: (CatalogProduct & { quantity: number })[];
  dateArrivee: string;
  dateDepart: string;
  setDates: (dateArrivee: string, dateDepart: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Panier partagé entre les pages (vacanciers, location de ski, commande). */
export function CartProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [quantities, setQuantitiesState] = useState<Record<string, number>>({});
  const [dateArrivee, setDateArrivee] = useState("");
  const [dateDepart, setDateDepart] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setQuantitiesState(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const setQuantities = useCallback((next: Record<string, number>) => {
    const clean = Object.fromEntries(
      Object.entries(next).filter(([, q]) => q > 0),
    );
    setQuantitiesState(clean);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch {
      /* ignore */
    }
  }, []);

  const add = useCallback(
    (code: string) =>
      setQuantities({ ...quantities, [code]: (quantities[code] ?? 0) + 1 }),
    [quantities, setQuantities],
  );
  const remove = useCallback(
    (code: string) =>
      setQuantities({ ...quantities, [code]: (quantities[code] ?? 0) - 1 }),
    [quantities, setQuantities],
  );

  const items = useMemo(
    () =>
      productsForAudience("vacancier")
        .filter((p) => (quantities[p.code] ?? 0) > 0)
        .map((p) => ({
          ...localizeProduct(p, locale),
          quantity: quantities[p.code],
        })),
    [quantities, locale],
  );

  const setDates = useCallback((arrival: string, departure: string) => {
    setDateArrivee(arrival);
    setDateDepart(departure);
  }, []);

  return (
    <CartContext.Provider
      value={{
        quantities,
        setQuantities,
        add,
        remove,
        items,
        dateArrivee,
        dateDepart,
        setDates,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
