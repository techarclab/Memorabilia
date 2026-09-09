export type Series = "standard" | "premium" | "prestige" | "compact" | "luxury";

export interface Product {
  code: string;          // "JPP B5027" — as printed in the line sheet
  slug: string;          // "JPP-B5027" — also the image filename
  name: string;          // cover design name, shared across every piece count
  blurb: string;
  pieces: number;        // 2–5, or 0 for individually sold accessories
  series: Series;
  flask: boolean;        // "Combo" in the catalogue means a flask is included
  segment: boolean;      // true for accessories sold on their own
  cat: string;           // accessory category, empty for gift sets
  colours: string[];
  tags: string[];
  contents: string[];
  spec: string;
  img: string;
}

export interface BrandingMethod { id: string; name: string; lead: string; note: string }
/* A line on the quote list carries its own description.

   It used to look the product up in the catalogue at render time, which
   meant the drawer — on every page — had to import both catalogues, and
   the 505 range products landed in the first download for a visitor who
   only came for the gift sets. A line is a record of what someone chose,
   so it records it. */
export interface BasketLine {
  slug: string;
  qty: number;
  colour: string;
  brand: string;
  code: string;
  name: string;
  img: string;
  /** "Premium 4-in-1 Combo" or "Bags" — the range the item came from. */
  line: string;
  /** Where to send someone who clicks it. */
  href: string;
}

/** What a page hands the store when something is added. */
export type AddItem = Omit<BasketLine, "qty" | "colour" | "brand">;
