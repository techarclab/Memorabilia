import type { Product, Series, Tier, BrandingMethod } from "@/types";
import rows from "./rows.json";

/* ------------------------------------------------------------------
   NOTE FOR CLIENT: prices below are indicative placeholders derived
   from piece count and series. Replace `mrp` with real trade pricing
   before launch. Everything else — codes, colourways, contents — is
   taken from the seventeen line sheets. Product codes keep the "JPP"
   prefix because that is what is printed on the sheets and on the boxes —
   only the brand name shown to visitors is Memorabilia.
   ------------------------------------------------------------------ */

type Row = [
  string, string, string, string, number, string,
  number, number, string, string[], number, string[], string[], string
];

export const products: Product[] = (rows as Row[]).map((r) => ({
  code: r[0],
  slug: r[1],
  name: r[2],
  blurb: r[3],
  pieces: r[4],
  series: r[5] as Series,
  flask: Boolean(r[6]),
  segment: Boolean(r[7]),
  cat: r[8],
  colours: r[9],
  mrp: r[10],
  tags: r[11],
  contents: r[12],
  spec: r[13],
  img: `/assets/img/${r[1]}.webp`,
}));

export const giftSets = products.filter((p) => !p.segment);
export const accessories = products.filter((p) => p.segment);

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

/** Every cover design, grouped by name — the same look across 2–5 pieces. */
export const families: Record<string, Product[]> = giftSets.reduce((acc, p) => {
  (acc[p.name] ||= []).push(p);
  return acc;
}, {} as Record<string, Product[]>);

export const seriesMeta: Record<Series, { name: string; short: string; desc: string }> = {
  standard: { name: "Gift Set", short: "Standard", desc: "The core range. Everyday-premium covers, the signature box, the best price per head." },
  premium:  { name: "Premium Gift Set", short: "Premium", desc: "Upgraded covers and the deep presentation case with a stitched leather carry handle." },
  prestige: { name: "Platinum Prestige", short: "Prestige", desc: "The 500 ml and 750 ml bottle line, shot on dark marble." },
  compact:  { name: "Tiny & Prince", short: "Compact", desc: "Pocket-size two and three piece sets — card holders, pens and keyfobs." },
  luxury:   { name: "Luxury Corporate", short: "Luxury", desc: "The flagship five-piece sets, including the wireless-charging edition." },
};

export const piecesMeta: Record<number, { label: string; items: string }> = {
  2: { label: "2-in-1", items: "Notebook + Pen" },
  3: { label: "3-in-1", items: "Notebook + Pen + Keychain or Flask" },
  4: { label: "4-in-1", items: "Notebook + Pen + Keychain + Card Holder or Flask" },
  5: { label: "5-in-1", items: "Notebook + Pen + Keychain + Card Holder + Flask" },
};

export const tiers: Tier[] = [
  { min: 1,   max: 24,  off: 0,    label: "Sample / 1-24" },
  { min: 25,  max: 99,  off: 0.08, label: "25-99 pcs" },
  { min: 100, max: 249, off: 0.15, label: "100-249 pcs" },
  { min: 250, max: 499, off: 0.22, label: "250-499 pcs" },
  { min: 500, max: 1e9, off: 0.3,  label: "500+ pcs" },
];

export const brandingMethods: BrandingMethod[] = [
  { id: "emboss", name: "Blind Deboss",       add: 45, lead: "10-12 days", note: "Tone-on-tone pressed logo. The quietest, most premium finish on PU and leatherette covers." },
  { id: "foil",   name: "Gold / Silver Foil", add: 65, lead: "10-12 days", note: "Metallic hot-foil stamp. Highest contrast on black, navy and tan covers." },
  { id: "laser",  name: "Laser Engraving",    add: 55, lead: "8-10 days",  note: "Permanent mark on the steel bottle, pen barrel and keychain. Never fades." },
  { id: "uv",     name: "UV Colour Print",    add: 70, lead: "12-14 days", note: "Full-colour logo reproduction. Best when brand colours must be exact." },
  { id: "none",   name: "Unbranded",          add: 0,  lead: "5-7 days",   note: "Shipped as-is in the signature presentation box." },
];

/** Swatch hexes for every colourway name that appears in the line sheets. */
export const colourHex: Record<string, string> = {
  Blue: "#1b3a6b", "N Blue": "#16305c", "L Blue": "#7ba3cc", Black: "#171717",
  Red: "#b8232f", White: "#f2f0eb", Cream: "#e5d9c3", Tan: "#c0682e",
  Brown: "#6b3f2a", Grey: "#8a8d91", Gray: "#8a8d91", Green: "#3d5c46",
  "Light Green": "#9ab68c", MDF: "#d8b98a", Silver: "#b9bcc0",
};

/** Page tint per colourway — [accent, wash]. Drives the hero colour switching. */
export const colourTone: Record<string, [string, string]> = {
  Blue: ["#1b3a6b", "#dbe4f3"], "N Blue": ["#16305c", "#dae2f0"], "L Blue": ["#5b86b8", "#e2ecf7"],
  Red: ["#b8232f", "#f7dcdb"], Tan: ["#c0682e", "#fae2d0"], Brown: ["#6b3f2a", "#efe0d6"],
  Green: ["#3d5c46", "#dcebdf"], "Light Green": ["#7f9a72", "#e6efdf"],
  Cream: ["#c4a875", "#f6ecda"], MDF: ["#c99a5b", "#f8ecd8"],
  Grey: ["#6f7275", "#e8e9ea"], Gray: ["#6f7275", "#e8e9ea"],
  White: ["#8d8d89", "#eeeeec"], Black: ["#1c1c1b", "#e6e6e4"], Silver: ["#8b8e92", "#eaebec"],
};

export const faq = [
  { q: "What is the minimum order quantity?", a: "Twenty-five pieces per SKU for any branded order. Unbranded sets can be bought from a single piece, and we send single samples on request so you can approve the product in hand before committing." },
  { q: "What is the difference between a Gift Set and a Combo Gift Set?", a: "A Combo set includes a vacuum flask or bottle; a Gift Set does not. Both are offered in Standard and Premium, where Premium means upgraded covers and the deeper presentation case with the leather carry handle." },
  { q: "Can I get the same cover design in a different number of pieces?", a: "Yes, and this is the most useful thing to know about our range. Each cover design runs across every line, so the same look can be bought as a two, three, four or five piece set. Pick the design your brand likes, then choose the budget per head." },
  { q: "How long does a branded order take?", a: "Five to seven working days for unbranded stock. Branded orders run eight to fourteen working days from artwork approval, depending on the method — laser engraving is quickest, UV colour printing is longest." },
  { q: "What artwork do you need from us?", a: "A vector file — AI, EPS, PDF or SVG — with the logo converted to outlines. We return a digital mock-up on the actual product for your written sign-off before anything is marked." },
  { q: "Can we mix colours within one order?", a: "Yes. The MOQ applies per SKU, not per colour, so a 200-piece order of the same set can be split across every colourway that SKU is offered in." },
  { q: "Do you ship to multiple addresses?", a: "We do. Send us a despatch sheet and we will pick, pack and label individually — including a personalised card in each box where you need one." },
  { q: "Is the presentation box included?", a: "Always. Every set ships in its signature rigid box. It is part of the product, not an extra." },
];

export function tierFor(qty: number): Tier {
  for (let i = tiers.length - 1; i >= 0; i--) if (qty >= tiers[i].min) return tiers[i];
  return tiers[0];
}

export function unitPrice(p: Product, qty: number, brandId: string): number {
  const b = brandingMethods.find((x) => x.id === brandId) ?? brandingMethods[4];
  return Math.round(p.mrp * (1 - tierFor(qty).off)) + b.add;
}

/** "Premium 4-in-1 Combo", "Platinum Prestige", "Keychains" … */
export function lineLabel(p: Product): string {
  if (p.segment) return p.cat || "Accessory";
  if (p.series === "prestige") return "Platinum Prestige";
  if (p.series === "compact") return "Compact Set";
  if (p.series === "luxury") return "Luxury Corporate";
  let t = `${p.pieces}-in-1`;
  if (p.flask) t += " Combo";
  if (p.series === "premium") t = `Premium ${t}`;
  return t;
}

export function tagLabel(p: Product): string {
  if (p.series === "luxury") return "Flagship";
  if (p.tags.includes("bestseller")) return "Bestseller";
  if (p.tags.includes("new")) return "New";
  if (p.tags.includes("sustainable")) return "Bamboo";
  return "";
}

/* ------------------------------------------------------------------
   Price overrides.

   `mrp` in rows.json is a placeholder derived from piece count and
   series — it is not JPP's trade pricing. Rather than move all 367 rows
   into Firestore just to make numbers editable, the admin panel writes a
   single map of slug -> price and this applies it over the bundle.

   It is applied once, before React mounts (see main.tsx), so a price is
   never rendered and then corrected under the reader.
   ------------------------------------------------------------------ */
export function applyPriceOverrides(mrp: Record<string, number>): number {
  let n = 0;
  for (const p of products) {
    const v = mrp[p.slug];
    if (typeof v === "number" && Number.isFinite(v) && v > 0 && v !== p.mrp) {
      p.mrp = v;
      n++;
    }
  }
  return n;
}
