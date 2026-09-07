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
  mrp: number;
  tags: string[];
  contents: string[];
  spec: string;
  img: string;
}

export interface Tier { min: number; max: number; off: number; label: string }
export interface BrandingMethod { id: string; name: string; add: number; lead: string; note: string }
export interface BasketLine { slug: string; qty: number; colour: string; brand: string }
export type BasketKind = "cart" | "enquiry";
