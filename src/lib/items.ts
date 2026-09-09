/* ------------------------------------------------------------------
   Turning a catalogue product into a quote-list line.

   Both catalogues describe their products differently, and the quote list
   should not have to know about either. These two helpers flatten each one
   into the same small record, which the line then carries with it.
   ------------------------------------------------------------------ */
import type { AddItem, Product } from "@/types";
import { lineLabel, piecesMeta } from "@/data/catalog";
import type { RangeItem } from "@/data/ranges";

export function giftSetItem(p: Product): AddItem {
  return {
    slug: p.slug,
    code: p.code,
    name: p.name,
    img: p.img,
    line: `${lineLabel(p)}${p.pieces ? ` · ${piecesMeta[p.pieces]?.label ?? ""}` : ""}`,
    href: `/product/${p.slug}`,
  };
}

export function rangeItemLine(p: RangeItem, catName: string): AddItem {
  return {
    slug: p.slug,
    code: p.code || "Code on request",
    name: p.name,
    img: p.img,
    line: catName,
    href: `/ranges/${p.cat}/${p.slug}`,
  };
}
