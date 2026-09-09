/* ------------------------------------------------------------------
   The quote list.

   Memorabilia takes bulk orders only, so there is no cart and no
   checkout — nothing on this site is bought, everything is quoted. A
   visitor collects the sets they are interested in, says how many of
   each they want, and sends the list across as one enquiry.

   It persists to localStorage because a procurement lead building a
   shortlist for two hundred people rarely does it in one sitting.
   ------------------------------------------------------------------ */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { AddItem, BasketLine } from "@/types";

const KEY = "memorabilia.quote.v2";

/** The smallest order the works will run for a branded job. */
export const MOQ = 25;

interface StoreValue {
  lines: BasketLine[];
  count: number;
  open: boolean;
  quickView: string | null;
  toast: string;
  has: (slug: string) => boolean;
  add: (item: AddItem, qty?: number, colour?: string, brand?: string) => void;
  remove: (i: number) => void;
  setQty: (i: number, q: number) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  setQuickView: (slug: string | null) => void;
  say: (msg: string) => void;
}

const Ctx = createContext<StoreValue | null>(null);

function load(): BasketLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p;
    }
  } catch { /* private mode, cleared storage — start empty */ }
  return [];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const first = useRef(load());
  const [lines, setLines] = useState<BasketLine[]>(first.current);
  const [open, setOpen] = useState(false);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const timer = useRef<number>();

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* ignore */ }
  }, [lines]);

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  const add: StoreValue["add"] = useCallback((item, qty, colour, brand) => {
    if (!item?.slug) return;
    const q = Math.max(MOQ, qty || MOQ);
    const c = colour || "As shown";
    const b = brand || "emboss";
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === item.slug && l.colour === c && l.brand === b);
      if (i > -1) {
        const next = prev.slice();
        next[i] = { ...next[i], qty: next[i].qty + q };
        return next;
      }
      return [...prev, { ...item, qty: q, colour: c, brand: b }];
    });
    say(`${item.name} added to your quote list`);
    setOpen(true);
  }, [say]);

  const value = useMemo<StoreValue>(() => ({
    lines,
    count: lines.length,
    open, quickView, toast,
    has: (slug) => lines.some((l) => l.slug === slug),
    add,
    remove: (i) => setLines((prev) => prev.filter((_, k) => k !== i)),
    setQty: (i, q) => setLines((prev) => prev.map((l, k) =>
      (k === i ? { ...l, qty: Math.max(1, Math.min(100000, q || 1)) } : l))),
    clear: () => setLines([]),
    setOpen, setQuickView, say,
  }), [lines, open, quickView, toast, add, say]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
