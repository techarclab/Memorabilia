/* ------------------------------------------------------------------
   Two baskets, one provider.

   `cart`    — single sets and samples, bought outright.
   `enquiry` — the bulk list, sent to the gifting team for trade pricing.

   Both persist to localStorage so a procurement lead can build a list
   over several visits without losing it.
   ------------------------------------------------------------------ */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { BasketKind, BasketLine } from "@/types";
import { bySlug } from "@/data/catalog";

const KEY = "jpp.baskets.v1";

interface StoreValue {
  cart: BasketLine[];
  enquiry: BasketLine[];
  drawer: BasketKind | null;
  quickView: string | null;
  toast: string;
  lines: (k: BasketKind) => BasketLine[];
  count: (k: BasketKind) => number;
  add: (k: BasketKind, slug: string, qty?: number, colour?: string, brand?: string) => void;
  remove: (k: BasketKind, i: number) => void;
  setQty: (k: BasketKind, i: number, q: number) => void;
  moveCartToEnquiry: () => void;
  openDrawer: (k: BasketKind) => void;
  closeDrawer: () => void;
  setQuickView: (slug: string | null) => void;
  say: (msg: string) => void;
}

const Ctx = createContext<StoreValue | null>(null);

function load(): { cart: BasketLine[]; enquiry: BasketLine[] } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p.cart) && Array.isArray(p.enquiry)) return p;
    }
  } catch { /* private mode, cleared storage — start empty */ }
  return { cart: [], enquiry: [] };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const first = useRef(load());
  const [cart, setCart] = useState<BasketLine[]>(first.current.cart);
  const [enquiry, setEnquiry] = useState<BasketLine[]>(first.current.enquiry);
  const [drawer, setDrawer] = useState<BasketKind | null>(null);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const timer = useRef<number>();

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ cart, enquiry })); } catch { /* ignore */ }
  }, [cart, enquiry]);

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  const setter = (k: BasketKind) => (k === "cart" ? setCart : setEnquiry);

  const add: StoreValue["add"] = useCallback((kind, slug, qty, colour, brand) => {
    const p = bySlug(slug);
    if (!p) return;
    const q = qty || (kind === "cart" ? 1 : 100);
    const c = colour || p.colours[0];
    const b = brand || (kind === "cart" ? "none" : "emboss");
    setter(kind)((prev) => {
      const i = prev.findIndex((l) => l.slug === slug && l.colour === c && l.brand === b);
      if (i > -1) {
        const next = prev.slice();
        next[i] = { ...next[i], qty: next[i].qty + q };
        return next;
      }
      return [...prev, { slug, qty: q, colour: c, brand: b }];
    });
    say(`${kind === "cart" ? "Added to cart" : "Added to enquiry"} — ${p.name}`);
    if (kind === "enquiry" || q > 1) setDrawer(kind);
  }, [say]);

  const remove: StoreValue["remove"] = useCallback((kind, i) => {
    setter(kind)((prev) => prev.filter((_, k) => k !== i));
  }, []);

  const setQty: StoreValue["setQty"] = useCallback((kind, i, q) => {
    setter(kind)((prev) => prev.map((l, k) => (k === i ? { ...l, qty: Math.max(1, Math.min(100000, q || 1)) } : l)));
  }, []);

  const moveCartToEnquiry = useCallback(() => {
    setEnquiry((prev) => [
      ...prev,
      ...cart.map((c) => ({ slug: c.slug, qty: Math.max(25, c.qty), colour: c.colour, brand: "emboss" })),
    ]);
    setCart([]);
    setDrawer("enquiry");
    say("Moved to bulk enquiry");
  }, [cart, say]);

  const value = useMemo<StoreValue>(() => ({
    cart, enquiry, drawer, quickView, toast,
    lines: (k) => (k === "cart" ? cart : enquiry),
    count: (k) => (k === "cart" ? cart.reduce((a, b) => a + b.qty, 0) : enquiry.length),
    add, remove, setQty, moveCartToEnquiry,
    openDrawer: setDrawer, closeDrawer: () => setDrawer(null),
    setQuickView, say,
  }), [cart, enquiry, drawer, quickView, toast, add, remove, setQty, moveCartToEnquiry, say]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
