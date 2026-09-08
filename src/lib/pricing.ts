/* ------------------------------------------------------------------
   Read the price overrides without loading the Firebase SDK.

   The storefront needs exactly one public document before it paints:
   pricing/overrides. Pulling ~300 kB of Firestore SDK to fetch a single
   readable document, on every visit, for every visitor, is out of
   proportion — so this talks to the Firestore REST API with plain fetch
   instead. No dependency, no bundle cost, same document, same rules.

   Firestore returns values in a typed envelope, hence the unwrapping:
   { fields: { mrp: { mapValue: { fields: { "JPP-B5001": { integerValue: "1899" } } } } } }
   ------------------------------------------------------------------ */
import { cfg, isConfigured } from "./firebase";

export type Overrides = Record<string, number>;

function unwrap(v: unknown): number | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, string>;
  const raw = o.integerValue ?? o.doubleValue ?? o.stringValue;
  if (raw === undefined) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Per-SKU price corrections, keyed by slug. Empty means use the bundle. */
export async function fetchOverrides(signal?: AbortSignal): Promise<Overrides> {
  if (!isConfigured) return {};
  const url =
    `https://firestore.googleapis.com/v1/projects/${cfg.projectId}` +
    `/databases/(default)/documents/pricing/overrides?key=${cfg.apiKey}`;

  const res = await fetch(url, { signal });
  // A missing document is the normal state before anyone has set a price.
  if (res.status === 404) return {};
  if (!res.ok) throw new Error(`Firestore responded ${res.status}`);

  const body = await res.json() as {
    fields?: { mrp?: { mapValue?: { fields?: Record<string, unknown> } } };
  };
  const fields = body.fields?.mrp?.mapValue?.fields ?? {};

  const out: Overrides = {};
  for (const [slug, v] of Object.entries(fields)) {
    const n = unwrap(v);
    if (n !== undefined) out[slug] = n;
  }
  return out;
}
