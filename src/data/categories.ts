/* ------------------------------------------------------------------
   The category system.

   Every category here is computed from the catalogue rather than typed
   out by hand, for one reason: a category that promises "4-in-1 Sets"
   and lands on an empty grid is worse than no category at all. The count
   beside each tile is the real number of SKUs behind it, and the link is
   the exact filter the catalogue page will apply — so the two can never
   disagree.

   Occasions are the one place we are making an editorial judgement
   rather than reading the data. They are honest suggestions ("delegate
   kits are usually the smaller sets"), each mapped to a filter a buyer
   can then widen or narrow themselves — not a separate product line we
   have invented.
   ------------------------------------------------------------------ */
import type { Product, Series } from "@/types";
import { accessories, giftSets, piecesMeta, seriesMeta } from "./catalog";

export interface Cat {
  label: string;
  note: string;
  href: string;
  count: number;
  img: string;
}

export interface CatGroup {
  id: string;
  label: string;
  note: string;
  cats: Cat[];
}

/** The catalogue's own "featured" order, so a tile shows a good photograph. */
const featured = (list: Product[]) =>
  list.slice().sort((a, b) => b.tags.length - a.tags.length || a.pieces - b.pieces);

function cat(label: string, note: string, href: string, match: (p: Product) => boolean,
             pool: Product[] = giftSets): Cat | null {
  const hits = featured(pool.filter(match));
  if (!hits.length) return null;
  return { label, note, href, count: hits.length, img: hits[0].img };
}

const keep = (xs: (Cat | null)[]) => xs.filter((c): c is Cat => c !== null);

const SIZE_NOTE: Record<number, string> = {
  2: "Notebook and pen. The wide-team set.",
  3: "Adds a keychain or a flask.",
  4: "Adds a card holder. The safe default.",
  5: "The full kit, for the biggest celebrations.",
};

const RANGE_NOTE: Record<Series, string> = {
  standard: "Everyday-premium covers, signature box.",
  premium: "Upgraded covers and a leather carry handle.",
  prestige: "The 500 ml and 750 ml bottle line.",
  compact: "Pocket-size two and three piece sets.",
  luxury: "Flagship sets, wireless charging included.",
};

/* The fourteen supplier books, as a fifth view. These are named and counted
   by hand rather than read from src/data/ranges.ts on purpose: importing
   that module here would pull 505 products' worth of codes and specs into
   the home page's first download, for a strip of six tiles. The counts are
   asserted by a test instead, so they cannot drift unnoticed. */
const RANGE_TILES: [string, string, string, number][] = [
  ["Bags", "Laptop, office and jute carry bags.", "bags", 26],
  ["Bottles & Sippers", "Vacuum steel, aluminium and tritan.", "bottles", 81],
  ["Mugs & Tumblers", "Insulated steel, bamboo and ceramic.", "mugs", 58],
  ["Diaries", "A5 hardcovers in vegan leather and fabric.", "diaries", 64],
  ["Electronics", "Chargers, clocks, lamps and audio.", "electronics", 78],
  ["Metal Pens", "Ball pens with stylus and bamboo grips.", "metal-pens", 61],
];

export const catGroups: CatGroup[] = [
  {
    id: "size",
    label: "By set size",
    note: "Start with how much you would like to include in each box. Every cover design is made in every size, so this is a budget choice rather than a design one.",
    cats: keep([2, 3, 4, 5].map((n) =>
      cat(piecesMeta[n].label, SIZE_NOTE[n], `/collections?pieces=${n}`, (p) => p.pieces === n))),
  },
  {
    id: "range",
    label: "By range",
    note: "Five lines, distinguished by what the cover is made of and what the set arrives in.",
    cats: keep((Object.keys(seriesMeta) as Series[]).map((k) =>
      cat(seriesMeta[k].name, RANGE_NOTE[k], `/collections?series=${k}`, (p) => p.series === k))),
  },
  {
    id: "inside",
    label: "By what is inside",
    note: "Sort by what the recipient actually unboxes.",
    cats: keep([
      cat("With a flask or bottle", "Vacuum steel, 500 ml and 750 ml.",
        "/collections?flask=1", (p) => p.flask),
      cat("With a card holder", "A polished extra for a thoughtful gift.",
        "/collections?item=Card+Holder", (p) => p.contents.some((c) => c.includes("Card Holder"))),
      cat("With a keychain", "The small piece that gets used daily.",
        "/collections?item=Keychain", (p) => p.contents.some((c) => c.includes("Keychain"))),
      cat("Desk sets, no flask", "Lighter to ship, easier to post.",
        "/collections?flask=0", (p) => !p.flask),
    ]),
  },
  {
    id: "character",
    label: "By character",
    note: "How the set reads when it lands on someone's desk.",
    cats: keep([
      cat("Bestsellers", "What most briefs end up ordering.",
        "/collections?tag=bestseller", (p) => p.tags.includes("bestseller")),
      cat("New arrivals", "Added to the line sheet most recently.",
        "/collections?tag=new", (p) => p.tags.includes("new")),
      cat("Bamboo & eco", "Bamboo covers and steel, for a CSR brief.",
        "/collections?tag=sustainable", (p) => p.tags.includes("sustainable")),
      cat("Design-led", "The covers that carry a graphic of their own.",
        "/collections?tag=design", (p) => p.tags.includes("design")),
      cat("Accessories", "Pens and keyfobs sold on their own.",
        "/accessories", () => true, accessories),
    ]),
  },
  {
    id: "ranges",
    label: "Beyond the sets",
    note: "Fourteen supplier catalogues of single products — bags, bottles, mugs, diaries, pens, keychains, desk pieces and electronics. Browsed page by page, quoted the same way.",
    cats: RANGE_TILES.map(([label, note, id, count]) => ({
      label, note, href: `/ranges/${id}`, count,
      img: `/assets/img/ranges/${id}/${id === "metal-pens" ? "mp-002" : `${id}-001`}.webp`,
    })),
  },
];

/* Occasion is a merchandising view, not a data field. Each one is a
   starting filter we would suggest across a desk — say so, and let the
   buyer widen it. */
export interface Occasion { label: string; note: string; href: string; img: string }

const shot = (match: (p: Product) => boolean) =>
  (featured(giftSets.filter(match))[0] || giftSets[0]).img;

export const occasions: Occasion[] = [
  { label: "Weddings & return gifts", note: "Elegant sets your guests will keep",
    href: "/collections?pieces=3", img: shot((p) => p.pieces === 3) },
  { label: "Birthdays & anniversaries", note: "A thoughtful gift for a special day",
    href: "/collections?item=Card+Holder", img: shot((p) => p.contents.some((c) => c.includes("Card Holder"))) },
  { label: "Festive celebrations", note: "Design-led gifts for every gathering",
    href: "/collections?tag=design", img: shot((p) => p.tags.includes("design")) },
  { label: "Milestones & special moments", note: "A complete gift for a big occasion",
    href: "/collections?pieces=5", img: shot((p) => p.pieces === 5) },
  { label: "Events & party favours", note: "Beautiful sets for every guest",
    href: "/collections?pieces=2", img: shot((p) => p.pieces === 2) },
  { label: "Sustainable gifting", note: "Bamboo and steel, thoughtfully chosen",
    href: "/collections?tag=sustainable", img: shot((p) => p.tags.includes("sustainable")) },
];
