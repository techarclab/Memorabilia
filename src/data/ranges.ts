/* ------------------------------------------------------------------
   The ranges: fourteen supplier catalogues, 505 products and 16 grid
   sheets, read off 514 catalogue pages.

   These sit apart from the 367 gift sets on purpose. A gift set is
   chosen by piece count and series; a bag is chosen by capacity and a
   bottle by millilitres, and putting them in one grid would leave every
   filter in the sidebar meaningless for half the results.

   Nothing here has a price, for the same reason nothing else does:
   Memorabilia quotes bulk orders against a brief.

   On the codes. The catalogues are flat images with no text layer, so
   every code was read by OCR. `codeSource` records how each one was
   arrived at — read from the page, inferred from an unambiguous gap in
   the numbering, taken from a page-numbering rule confirmed across the
   whole book, or checked by eye. Anything not simply `read` is listed in
   RANGE_REVIEW for the client to confirm against the printed line sheet
   before launch, because a wrong SKU on a quote is a real problem.
   ------------------------------------------------------------------ */
import data from "./rangeRows.json";

export type CodeSource = "read" | "inferred" | "sequence" | "verified" | "unknown";

export interface RangeItem {
  slug: string;
  cat: string;
  code: string;
  name: string;
  desc: string;
  specs: [string, string][];
  img: string;
  codeSource: CodeSource;
  /** false when the name is a fallback of type + code rather than read copy. */
  named: boolean;
  /** Third-party brand words the OCR saw — a review flag, not a claim. */
  brands: string[];
}

export interface RangeSheet { slug: string; cat: string; name: string; img: string }

export interface RangeCat {
  id: string; name: string; blurb: string;
  count: number; img: string; kind: "products" | "sheets";
}

type Row = [string, string, string, string, string, [string, string][], string, CodeSource, number, string[]];
type SheetRow = [string, string, string, string];

export const rangeItems: RangeItem[] = (data.rows as Row[]).map((r) => ({
  slug: r[0], cat: r[1], code: r[2], name: r[3], desc: r[4],
  specs: r[5], img: r[6], codeSource: r[7], named: Boolean(r[8]), brands: r[9],
}));

export const rangeSheets: RangeSheet[] = (data.sheets as SheetRow[]).map((r) => ({
  slug: r[0], cat: r[1], name: r[2], img: r[3],
}));

export const rangeCats: RangeCat[] = (data.cats as [string, string, string][]).map(([id, name, blurb]) => {
  const items = rangeItems.filter((p) => p.cat === id);
  const sheets = rangeSheets.filter((p) => p.cat === id);
  return {
    id, name, blurb,
    count: items.length || sheets.length,
    img: (items[0] || sheets[0])?.img || "",
    kind: (items.length ? "products" : "sheets") as RangeCat["kind"],
  };
}).filter((c) => c.count > 0);

const byId = new Map(rangeCats.map((c) => [c.id, c]));
export const rangeCat = (id: string) => byId.get(id);

const bySlugMap = new Map<string, RangeItem>(rangeItems.map((p) => [p.slug, p]));
export const rangeBySlug = (slug: string) => bySlugMap.get(slug);

export const itemsIn  = (cat: string) => rangeItems.filter((p) => p.cat === cat);
export const sheetsIn = (cat: string) => rangeSheets.filter((p) => p.cat === cat);

export const rangeTotal = rangeItems.length + rangeSheets.length;

/** Every code that was not read straight off the page, for pre-launch checking. */
export const RANGE_REVIEW = rangeItems.filter((p) => p.codeSource !== "read");

/** Pages where the OCR saw another company's brand name. Text only — a logo
 *  drawn as artwork will not appear here, so this is a starting point for a
 *  visual review rather than the whole answer. */
export const RANGE_BRANDS = rangeItems.filter((p) => p.brands.length > 0);

/* ---------- facets ---------- */

/** Spec keys worth filtering on, in the order they should be offered. */
const FACET_KEYS = ["Material", "Capacity", "Pages", "Paper Quality", "Page Type",
                    "Cover Material", "No. Of Pockets", "No. Of Compartments", "Weight"];

/* The OCR gives back what the page printed — "POLYESTER", "Polyester",
   "304 Stainless", "304 double wall". As raw filter values those split one
   real choice across four checkboxes, so they are folded to the thing a
   buyer is actually choosing between. */
const MATERIAL_FOLD: [RegExp, string][] = [
  [/stainless|304|steel/i, "Stainless steel"],
  [/bamboo/i, "Bamboo"],
  [/borosilicate|glass/i, "Glass"],
  [/tritan|copolyester/i, "Tritan"],
  [/alumin/i, "Aluminium"],
  [/jute/i, "Jute"],
  [/canvas/i, "Canvas"],
  [/leatherette|vegan leather|pu leather/i, "Vegan leather"],
  [/genuine leather|leather/i, "Leather"],
  [/polyester|nylon|poly/i, "Polyester"],
  [/ceramic/i, "Ceramic"],
  [/wood|beech|mdf/i, "Wood"],
  [/plastic|abs|pp\b|ps\b/i, "Plastic"],
  [/silicon/i, "Silicone"],
  [/fabric|cloth/i, "Fabric"],
  [/cork/i, "Cork"],
];

/** Tidy a spec value into something a filter can group on. */
export function facetValue(key: string, raw: string): string {
  const v = raw.replace(/\s+/g, " ").trim();

  if (/capacity/i.test(key)) {
    const m = v.match(/(\d[\d.,]*)\s*(ml|l\b|ltr|litre|liter)?/i);
    if (!m) return "";
    const n = parseFloat(m[1].replace(/,/g, ""));
    if (!Number.isFinite(n) || n <= 0) return "";
    const unit = (m[2] || "").toLowerCase();
    // A bag is measured in litres and a bottle in millilitres. A bare
    // number is read as whichever its size makes sensible, because "15"
    // on a bag page is 15 litres and "500" on a bottle page is 500 ml.
    const litres = unit.startsWith("l") || (!unit && n <= 60);
    if (litres) {
      if (n <= 15) return "Up to 15 L";
      if (n <= 25) return "16 – 25 L";
      return "Over 25 L";
    }
    if (n <= 350) return "Up to 350 ml";
    if (n <= 550) return "351 – 550 ml";
    if (n <= 800) return "551 – 800 ml";
    return "Over 800 ml";
  }

  if (/material/i.test(key)) {
    for (const [re, label] of MATERIAL_FOLD) if (re.test(v)) return label;
    return "";   // not actually a material — usually a caption the OCR caught
  }

  if (/pages|gsm|quality/i.test(key)) {
    const m = v.match(/\d[\d,]*/);
    return m ? `${m[0]} ${/gsm|quality/i.test(key) ? "gsm" : "pages"}` : "";
  }

  const words = v.split(/[,(]/)[0].split(" ").slice(0, 3).join(" ");
  return words.replace(/[^A-Za-z0-9 .%/-]/g, "").trim();
}

export interface Facet { key: string; values: [string, number][] }

/** The spec filters worth showing for one category, built from its own data. */
export function facetsFor(cat: string): Facet[] {
  const items = itemsIn(cat);
  const out: Facet[] = [];
  for (const key of FACET_KEYS) {
    const counts = new Map<string, number>();
    for (const p of items) {
      const hit = p.specs.find(([k]) => k.toLowerCase() === key.toLowerCase());
      if (!hit) continue;
      const v = facetValue(key, hit[1]);
      if (v.length < 2 || v.length > 26) continue;
      counts.set(v, (counts.get(v) || 0) + 1);
    }
    // A facet earns its place only if it actually divides the category.
    const values = [...counts.entries()].filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (values.length >= 2) out.push({ key, values });
  }
  return out.slice(0, 4);
}

export function itemHasFacet(p: RangeItem, key: string, value: string): boolean {
  const hit = p.specs.find(([k]) => k.toLowerCase() === key.toLowerCase());
  return Boolean(hit && facetValue(key, hit[1]) === value);
}
