import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import RangeMatrix from "@/components/shop/RangeMatrix";
import DesignFamilies from "@/components/shop/DesignFamilies";
import SectionCta from "@/components/SectionCta";
import { Doc, X } from "@/lib/icons";
import { colourHex, giftSets, piecesMeta, seriesMeta } from "@/data/catalog";
import type { Product, Series } from "@/types";
import { usePageMotion, useReveal } from "@/hooks/useMotion";
import { cn } from "@/lib/utils";

type Key = "pieces" | "series" | "flask" | "colour" | "tag" | "price";
type Filters = Record<Key, string[]>;
const EMPTY: Filters = { pieces: [], series: [], flask: [], colour: [], tag: [], price: [] };

const PAGE = 24;

const count = (fn: (p: Product) => boolean) => giftSets.filter(fn).length;

const COLOURS = Object.keys(colourHex).filter(
  (c) => c !== "Gray" && giftSets.some((p) => p.colours.includes(c)));

const TAGS: [string, string][] = [
  ["bestseller", "Bestseller"], ["new", "New arrival"], ["value", "Best value"],
  ["sustainable", "Bamboo"], ["design", "Design-led"],
];

const PRICES: [string, string][] = [
  ["0-800", "Under ₹800"], ["800-1200", "₹800 – ₹1,200"],
  ["1200-1600", "₹1,200 – ₹1,600"], ["1600-99999", "Above ₹1,600"],
];

const QUICK: [string, string][] = [
  ["all", "All"], ["p2", "2-in-1"], ["p3", "3-in-1"], ["p4", "4-in-1"], ["p5", "5-in-1"],
  ["flask", "With flask"], ["premium", "Premium"], ["bestseller", "Bestsellers"],
  ["new", "New"], ["sustainable", "Bamboo"],
];

function Group({ title, rows, f, toggle }: {
  title: string;
  rows: [Key, string, string, number][];
  f: Filters;
  toggle: (k: Key, v: string) => void;
}) {
  return (
    <div className="fgrp">
      <span className="fgrp__t">{title}</span>
      {rows.map(([k, v, label, n]) => (
        <label className="chk" key={`${k}-${v}`}>
          <input type="checkbox" checked={f[k].includes(v)} onChange={() => toggle(k, v)} />
          <span className="chk__b" />
          {label}
          <span className="chk__n">{n}</span>
        </label>
      ))}
    </div>
  );
}

export default function Collections() {
  const [params, setParams] = useSearchParams();
  const [f, setF] = useState<Filters>(EMPTY);
  const [design, setDesign] = useState("");
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState("featured");
  const [shown, setShown] = useState(PAGE);
  const [openFilters, setOpenFilters] = useState(false);

  /* The URL is the entry point: /collections?pieces=4&flask=1 comes in from
     the range matrix, the footer and the home page categories. */
  useEffect(() => {
    const next = { ...EMPTY };
    (["pieces", "series", "flask", "tag"] as Key[]).forEach((k) => {
      const v = params.get(k);
      if (v) next[k] = [v];
    });
    setF(next);
    setDesign(params.get("design") || "");
    setShown(PAGE);
  }, [params]);

  /* Typing filters after a beat, so a long code does not re-render per key. */
  useEffect(() => {
    const t = window.setTimeout(() => { setQ(term.trim().toLowerCase()); setShown(PAGE); }, 220);
    return () => window.clearTimeout(t);
  }, [term]);

  const list = useMemo(() => {
    const out = giftSets.filter((p) => {
      if (design && p.name !== design) return false;
      if (f.pieces.length && !f.pieces.includes(String(p.pieces))) return false;
      if (f.series.length && !f.series.includes(p.series)) return false;
      if (f.flask.length && !f.flask.includes(p.flask ? "1" : "0")) return false;
      if (f.colour.length && !f.colour.some((c) => p.colours.includes(c))) return false;
      if (f.tag.length && !f.tag.every((t) => p.tags.includes(t))) return false;
      if (f.price.length && !f.price.some((b) => {
        const [lo, hi] = b.split("-").map(Number);
        return p.mrp >= lo && p.mrp < hi;
      })) return false;
      if (q && !`${p.code} ${p.name} ${p.blurb}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === "low") out.sort((a, b) => a.mrp - b.mrp);
    else if (sort === "high") out.sort((a, b) => b.mrp - a.mrp);
    else if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name) || a.pieces - b.pieces);
    else if (sort === "code") out.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
    else out.sort((a, b) => b.tags.length - a.tags.length || a.pieces - b.pieces);
    return out;
  }, [f, design, q, sort]);

  usePageMotion("collections");
  useReveal(list.slice(0, shown).map((p) => p.slug).join(","));

  function toggle(k: Key, v: string) {
    setF((prev) => ({
      ...prev,
      [k]: prev[k].includes(v) ? prev[k].filter((x) => x !== v) : [...prev[k], v],
    }));
    setShown(PAGE);
  }

  function clear() {
    setF(EMPTY); setDesign(""); setTerm(""); setQ(""); setShown(PAGE);
    if (params.toString()) setParams({}, { replace: true });
  }

  function quick(k: string) {
    const next = { ...EMPTY };
    if (k[0] === "p" && k.length === 2) next.pieces = [k[1]];
    else if (k === "flask") next.flask = ["1"];
    else if (k === "premium") next.series = ["premium"];
    else if (k !== "all") next.tag = [k];
    setF(next); setDesign(""); setShown(PAGE);
    if (params.toString()) setParams({}, { replace: true });
  }

  const chips: [string, string][] = [];
  if (design) chips.push(["design", `Design: ${design}`]);
  (Object.keys(f) as Key[]).forEach((k) => f[k].forEach((v) => {
    const label = k === "pieces" ? `${v}-in-1`
      : k === "series" ? (seriesMeta[v as Series]?.short ?? v)
      : k === "flask" ? (v === "1" ? "With flask" : "No flask")
      : k === "price" ? `₹${v.replace("-", "–")}`
      : v;
    chips.push([`${k}:${v}`, label]);
  }));

  const activePill = (k: string) => {
    if (k === "all") return !design && !(Object.keys(f) as Key[]).some((x) => f[x].length);
    if (k[0] === "p" && k.length === 2) return f.pieces.length === 1 && f.pieces[0] === k[1];
    if (k === "flask") return f.flask.length === 1 && f.flask[0] === "1";
    if (k === "premium") return f.series.length === 1 && f.series[0] === "premium";
    return f.tag.length === 1 && f.tag[0] === k;
  };

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Catalogue</span></div>
        <div className="shead shead--split">
          <div className="stack">
            <span className="eyebrow">The full catalogue</span>
            <h1 className="h1">{giftSets.length} sets, one system</h1>
          </div>
          <p className="lede" style={{ maxWidth: "46ch" }}>
            Every gift set in the range. Filter by pieces, series, colourway or budget, or search a
            code straight from the line sheet. Individually sold pens and keyfobs live under{" "}
            <Link to="/accessories" className="gold">Accessories</Link>.
          </p>
        </div>
      </div>

      <div className="wrap">
        <RangeMatrix />

        <div className="shead shead--split rv" style={{ marginBottom: 20 }}>
          <div className="stack">
            <span className="eyebrow">One design, every size</span>
            <h2 className="h3">Signature cover designs</h2>
          </div>
        </div>
        <DesignFamilies />

        <div className="pillbar" style={{ marginBottom: 26 }}>
          {QUICK.map(([k, label]) => (
            <button key={k} className={cn("pill", activePill(k) && "on")} onClick={() => quick(k)}>{label}</button>
          ))}
        </div>

        <div className="shop">
          <aside className={cn("filters", openFilters && "on")}>
            <div className="fgrp">
              <span className="fgrp__t">Search</span>
              <input className="fsearch" id="fSearch" type="search" placeholder="Code or design name…"
                aria-label="Search" value={term} onChange={(e) => setTerm(e.target.value)} />
            </div>

            <Group title="Pieces" f={f} toggle={toggle}
              rows={[2, 3, 4, 5].map((n) => ["pieces", String(n), piecesMeta[n].label,
                count((p) => p.pieces === n)] as [Key, string, string, number])} />

            <Group title="Series" f={f} toggle={toggle}
              rows={(Object.keys(seriesMeta) as Series[]).map((k) => ["series", k, seriesMeta[k].short,
                count((p) => p.series === k)] as [Key, string, string, number])} />

            <Group title="Contents" f={f} toggle={toggle} rows={[
              ["flask", "1", "Includes flask / bottle", count((p) => p.flask)],
              ["flask", "0", "No flask", count((p) => !p.flask)],
            ]} />

            <div className="fgrp">
              <span className="fgrp__t">Colourway</span>
              <div className="fscroll">
                {COLOURS.map((c) => (
                  <label className="chk" key={c}>
                    <input type="checkbox" checked={f.colour.includes(c)} onChange={() => toggle("colour", c)} />
                    <span className="chk__b" />
                    <span className="chk__c" style={{ background: colourHex[c] }} />
                    {c}
                    <span className="chk__n">{count((p) => p.colours.includes(c))}</span>
                  </label>
                ))}
              </div>
            </div>

            <Group title="Character" f={f} toggle={toggle}
              rows={TAGS.map(([v, label]) => ["tag", v, label,
                count((p) => p.tags.includes(v))] as [Key, string, string, number])} />

            <Group title="Budget per set" f={f} toggle={toggle}
              rows={PRICES.map(([v, label]) => {
                const [lo, hi] = v.split("-").map(Number);
                return ["price", v, label, count((p) => p.mrp >= lo && p.mrp < hi)] as [Key, string, string, number];
              })} />

            <button className="btn btn--ghost btn--sm btn--block" onClick={clear}>Clear all filters</button>
          </aside>

          <div>
            <div className="sbar">
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn--ghost btn--sm fdrawer-btn"
                  onClick={() => setOpenFilters((o) => !o)}>Filters</button>
                <span className="small">{list.length} {list.length === 1 ? "set" : "sets"}</span>
              </div>
              <select className="sel" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
                <option value="featured">Sort · Featured</option>
                <option value="low">Price · Low to high</option>
                <option value="high">Price · High to low</option>
                <option value="az">Design · A–Z</option>
                <option value="code">Code</option>
              </select>
            </div>

            <div className="chiprow">
              {chips.map(([id, label]) => (
                <button className="chip" key={id} onClick={() => {
                  if (id === "design") return setDesign("");
                  const [k, v] = id.split(":") as [Key, string];
                  toggle(k, v);
                }}>{label} <X /></button>
              ))}
              {chips.length > 0 && <button className="chip chip--clear" onClick={clear}>Clear all</button>}
            </div>

            <div className="pgrid">
              {list.slice(0, shown).map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}
            </div>

            {list.length > shown && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 44 }}>
                <button className="btn" onClick={() => setShown((s) => s + PAGE)}>
                  Load more ({list.length - shown} left)
                </button>
              </div>
            )}

            {!list.length && (
              <div className="empty">
                <Doc />
                <p>No sets match those filters.</p>
                <button className="btn btn--sm" onClick={clear}>Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: "clamp(60px,8vw,110px)" }} />
      <SectionCta
        title="Not sure which set fits the brief?"
        body="Send us the occasion, the headcount and the budget. We will come back with three options and mock-ups within a day."
      />
    </div>
  );
}
