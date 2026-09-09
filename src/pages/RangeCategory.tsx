import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import SectionCta from "@/components/SectionCta";
import { Arw, Doc, X } from "@/lib/icons";
import {
  facetsFor, itemHasFacet, itemsIn, rangeCat, rangeCats, sheetsIn,
} from "@/data/ranges";
import { usePageMotion, useReveal } from "@/hooks/useMotion";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

const PAGE = 24;

export default function RangeCategory() {
  const { cat = "" } = useParams();
  const c = rangeCat(cat);
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState("");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [picked, setPicked] = useState<Record<string, string[]>>({});

  const items = useMemo(() => (c ? itemsIn(cat) : []), [c, cat]);
  const sheets = useMemo(() => (c ? sheetsIn(cat) : []), [c, cat]);
  const facets = useMemo(() => (c ? facetsFor(cat) : []), [c, cat]);

  /* A new category is a fresh start — carrying the last one's filters over
     would silently hide most of what the visitor just clicked into. */
  useEffect(() => { setPicked({}); setTerm(""); setQ(""); setShown(PAGE); }, [cat]);

  useEffect(() => {
    const t = window.setTimeout(() => { setQ(term.trim().toLowerCase()); setShown(PAGE); }, 200);
    return () => window.clearTimeout(t);
  }, [term]);

  /* Deep links from search or the home page can preselect one facet. */
  useEffect(() => {
    const k = params.get("spec"), v = params.get("is");
    if (k && v) setPicked({ [k]: [v] });
  }, [params]);

  const list = useMemo(() => items.filter((p) => {
    for (const [k, vs] of Object.entries(picked)) {
      if (vs.length && !vs.some((v) => itemHasFacet(p, k, v))) return false;
    }
    if (!q) return true;
    const hay = `${p.code} ${p.name} ${p.desc} ${p.specs.map((s) => s.join(" ")).join(" ")}`;
    return hay.toLowerCase().includes(q);
  }), [items, picked, q]);

  usePageMotion(cat);
  useReveal(list.slice(0, shown).map((p) => p.slug).join(",") + sheets.length);

  if (!c) return <NotFound />;

  const active = Object.values(picked).flat().length;
  const toggle = (k: string, v: string) => {
    setPicked((prev) => {
      const cur = prev[k] || [];
      return { ...prev, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
    setShown(PAGE);
    if (params.toString()) setParams({}, { replace: true });
  };

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/ranges">Products</Link><span>/</span>
          <span className="gold">{c.name}</span>
        </div>

        <div className="shead shead--split">
          <div className="stack">
            <span className="eyebrow">
              {c.count} {c.kind === "sheets" ? (c.count === 1 ? "sheet" : "sheets") : "products"}
            </span>
            <h1 className="h1">{c.name}</h1>
          </div>
          <p className="lede" style={{ maxWidth: "44ch" }}>{c.blurb}</p>
        </div>

        {/* Jump straight to a sibling range without going back up a level. */}
        <div className="pillbar" style={{ marginBottom: 24 }}>
          {rangeCats.map((x) => (
            <Link key={x.id} to={`/ranges/${x.id}`}
              className={cn("pill", x.id === cat && "on")}>{x.name}</Link>
          ))}
        </div>

        {c.kind === "sheets" ? (
          <>
            <p className="note rv" style={{ marginBottom: 18 }}>
              This book lays several SKUs out on each page, so it is browsed by the sheet. Quote the
              code printed beside the item you want.
            </p>
            <div className="sheets">
              {sheets.map((s, i) => (
                <figure className={`sheet rv rv-d${(i % 4) + 1}`} key={s.slug}>
                  <img src={s.img} alt={s.name} loading="lazy" decoding="async" />
                  <figcaption>{s.name}</figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : (
          <div className="shop">
            <aside className="filters filters--open">
              <div className="fgrp">
                <span className="fgrp__t">Search</span>
                <input className="fsearch" id="fSearch" type="search" value={term}
                  placeholder="Code, name or spec…" aria-label="Search this range"
                  onChange={(e) => setTerm(e.target.value)} />
              </div>

              {facets.map((f) => (
                <div className="fgrp" key={f.key}>
                  <span className="fgrp__t">{f.key}</span>
                  {f.values.map(([v, n]) => (
                    <label className="chk" key={v}>
                      <input type="checkbox" checked={(picked[f.key] || []).includes(v)}
                        onChange={() => toggle(f.key, v)} />
                      <span className="chk__b" />
                      {v}
                      <span className="chk__n">{n}</span>
                    </label>
                  ))}
                </div>
              ))}

              {(active > 0 || q) && (
                <button className="btn btn--ghost btn--sm btn--block"
                  onClick={() => { setPicked({}); setTerm(""); }}>Clear filters</button>
              )}
            </aside>

            <div>
              <div className="sbar">
                <span className="small">{list.length} {list.length === 1 ? "product" : "products"}</span>
                <Link className="lnk" to="/ranges">All products <Arw /></Link>
              </div>

              <div className="chiprow">
                {Object.entries(picked).flatMap(([k, vs]) => vs.map((v) => (
                  <button className="chip" key={`${k}:${v}`} onClick={() => toggle(k, v)}>
                    {v} <X />
                  </button>
                )))}
              </div>

              <div className="rgrid">
                {list.slice(0, shown).map((p, i) => (
                  <Link key={p.slug} to={`/ranges/${cat}/${p.slug}`}
                    className={`rcard rv rv-d${(i % 4) + 1}`}>
                    <span className="rcard__img">
                      <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
                    </span>
                    <span className="rcard__b">
                      <span className="rcard__code mono">{p.code || "Code on request"}</span>
                      <b>{p.name}</b>
                      {p.specs.length > 0 && (
                        <span className="rcard__spec">
                          {p.specs.slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>

              {list.length > shown && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                  <button className="btn" onClick={() => setShown((s) => s + PAGE)}>
                    Load more ({list.length - shown} left)
                  </button>
                </div>
              )}

              {!list.length && (
                <div className="empty">
                  <Doc />
                  <p>Nothing in this range matches that.</p>
                  <button className="btn btn--sm"
                    onClick={() => { setPicked({}); setTerm(""); }}>Clear filters</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ height: "clamp(50px,7vw,90px)" }} />
      <SectionCta
        title={`Ordering ${c.name.toLowerCase()} in volume?`}
        body="Send the codes you like, the quantity and the branding you want. We come back with trade pricing at your volume within one working day."
      />
    </div>
  );
}
