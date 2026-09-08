/* ------------------------------------------------------------------
   Everything the site reads from or writes to Firestore.

   Two collections take public writes — `enquiries` and `orders` — and the
   rules in firestore.rules let the world create documents there and do
   nothing else. That means the shape written here and the shape allowed
   there have to agree; if you add a field, add it in both places or the
   write is rejected.

   `pricing` is the one collection the site reads. The 367 products ship
   inside the bundle, so the catalogue costs nothing to serve, but a
   bundled price can only be changed by a redeploy — and the prices in
   this build are still placeholders. A single `pricing/overrides`
   document lets the client correct them from the admin panel: one read
   per visit instead of 367, and the bundle stays the source of truth for
   everything that is not a number.
   ------------------------------------------------------------------ */
import { getDb, isConfigured, NotConfigured } from "./firebase";
export { NotConfigured };
import type { Overrides } from "./pricing";
import type { BasketLine, Product } from "@/types";
import { bySlug, unitPrice } from "@/data/catalog";

/* ---------- shapes ---------- */

export interface Contact {
  name: string;
  company: string;
  email: string;
  phone?: string;
  qty?: string;
  occasion?: string;
  budget?: string;
  needBy?: string;
  message?: string;
}

export interface LineItem {
  slug: string;
  code: string;
  name: string;
  qty: number;
  colour: string;
  brand: string;
  unit: number;      // the price quoted at the time, so a later price change
  total: number;     // cannot silently rewrite what the buyer was shown
}

export type Kind = "enquiry" | "order";

export interface Submission {
  kind: Kind;
  source: string;            // which form or page it came from
  contact: Contact;
  lines: LineItem[];
  indicativeTotal: number;
  status: "new";
  createdAt: unknown;
  userAgent: string;
  ref: string;               // human-quotable reference
}

/** A short reference a buyer can read out on the phone. */
export function makeRef(kind: Kind): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${kind === "order" ? "MO" : "ME"}-${stamp}-${rand}`;
}

export function toLineItems(lines: BasketLine[]): LineItem[] {
  return lines.flatMap((l) => {
    const p: Product | undefined = bySlug(l.slug);
    if (!p) return [];
    const unit = unitPrice(p, l.qty, l.brand);
    return [{
      slug: p.slug, code: p.code, name: p.name,
      qty: l.qty, colour: l.colour, brand: l.brand,
      unit, total: unit * l.qty,
    }];
  });
}

/**
 * Write an enquiry or an order. Returns the reference to quote back.
 * Throws NotConfigured when there is no project, so the caller can decide
 * whether to fall back rather than showing the buyer a false confirmation.
 */
export async function submit(
  kind: Kind, source: string, contact: Contact, lines: BasketLine[],
): Promise<string> {
  if (!isConfigured) throw new NotConfigured();

  // Pull the SDK in now — this is the first moment the site genuinely
  // needs it, and it is behind a click rather than a page load.
  const [{ addDoc, collection, serverTimestamp }, db] = await Promise.all([
    import("firebase/firestore"), getDb(),
  ]);

  const items = toLineItems(lines);
  const ref = makeRef(kind);
  const payload: Submission = {
    kind,
    source,
    contact: {
      name: contact.name.trim(),
      company: contact.company.trim(),
      email: contact.email.trim().toLowerCase(),
      phone: contact.phone?.trim() || "",
      qty: contact.qty || "",
      occasion: contact.occasion || "",
      budget: contact.budget || "",
      needBy: contact.needBy || "",
      message: contact.message?.trim().slice(0, 4000) || "",
    },
    lines: items,
    indicativeTotal: items.reduce((s, i) => s + i.total, 0),
    status: "new",
    createdAt: serverTimestamp(),
    userAgent: navigator.userAgent.slice(0, 300),
    ref,
  };

  await addDoc(collection(db, kind === "order" ? "orders" : "enquiries"), payload);
  return ref;
}

/* ---------- price overrides ---------- */

export type { Overrides };
export { fetchOverrides } from "./pricing";

/** Admin only — the rules reject this for everyone else. */
export async function saveOverrides(mrp: Overrides): Promise<void> {
  if (!isConfigured) throw new NotConfigured();
  const [{ doc, setDoc, serverTimestamp }, db] = await Promise.all([
    import("firebase/firestore"), getDb(),
  ]);
  await setDoc(doc(db, "pricing", "overrides"), { mrp, updatedAt: serverTimestamp() });
}
