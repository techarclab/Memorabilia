import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Arw, Box, ItemIcon } from "@/lib/icons";
import {
  brandingMethods, bySlug, colourHex, families, giftSets, lineLabel, piecesMeta, products,
} from "@/data/catalog";
import { giftSetItem } from "@/lib/items";
import { setTone, usePageMotion } from "@/hooks/useMotion";
import { MOQ, useStore } from "@/store/StoreContext";
import NotFound from "./NotFound";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const p = bySlug(slug);
  const { add } = useStore();

  const [colour, setColour] = useState(p?.colours[0] ?? "");
  const [brand, setBrand] = useState("emboss");
  const [qty, setQty] = useState(100);
  const [zoom, setZoom] = useState(false);
  const [shot, setShot] = useState(p?.img ?? "");

  /* Moving between two products does not remount this route, so without
     this the previous set's photo and colourway stay on screen — which is
     why clicking a swatch looked broken: the ring was on a colour the new
     product does not even offer. */
  useEffect(() => {
    if (!p) return;
    setColour(p.colours[0]);
    setShot(p.img);
    setZoom(false);
    setQty(100);
  }, [p]);

  /* Choosing a colourway retints the page around it. The catalogue shot
     shows every colourway at once, so this is the honest way to make the
     choice visible rather than pretending the photo changed. */
  useEffect(() => { if (colour) setTone(colour); }, [colour]);

  /* The same cover design in every other size — this is the range's whole
     proposition, so it leads the gallery and the strip below. */
  const fam = useMemo(() => (p ? (families[p.name] || []).filter((x) => x.slug !== p.slug) : []), [p]);
  const related = useMemo(() => (p ? products.filter(
    (x) => x.slug !== p.slug && x.pieces === p.pieces && x.series === p.series && x.flask === p.flask,
  ).slice(0, 4) : []), [p]);

  usePageMotion(slug);

  if (!p) return <NotFound />;

  const b = brandingMethods.find((x) => x.id === brand)!;
  const thumbs = [p, ...(fam.length ? fam.slice(0, 3) : giftSets.filter((x) => x.slug !== p.slug).slice(0, 3))];
  const stepQ = (dir: 1 | -1) =>
    setQty((q) => Math.max(1, dir > 0 ? (q >= 25 ? q + 25 : q + 1) : (q > 25 ? q - 25 : q - 1)));

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/collections">Catalogue</Link><span>/</span>
          <span className="gold">{p.code}</span>
        </div>

        <div className="pdp">
          <div className="pdp__media">
            <div className={`pdp__main${zoom ? " zoom" : ""}`} onClick={() => setZoom((z) => !z)}>
              <img src={shot} alt={p.name} />
            </div>
            <div className="pdp__thumbs">
              {thumbs.map((x) => (
                <button key={x.slug} className={shot === x.img ? "on" : undefined}
                  onClick={() => setShot(x.img)} aria-label={`View ${x.code}`}>
                  <img src={x.img} alt="" />
                </button>
              ))}
            </div>
            <p className="small" style={{ marginTop: 6 }}>
              Click the image to zoom. Thumbnails show the same cover design in other sizes.
            </p>
          </div>

          <div className="stack">
            <span className="card__line">{lineLabel(p)} · {p.code}</span>
            <h1 className="h1">{p.name}</h1>
            <p className="lede">{p.blurb}</p>

            {p.contents.length > 0 && (
              <div>
                <p className="small" style={{ marginBottom: 12 }}>What is inside</p>
                <ul className="incl">
                  {p.contents.map((c) => <li key={c}><ItemIcon name={c} />{c}</li>)}
                  {!p.segment && <li><Box />Signature rigid presentation box</li>}
                </ul>
              </div>
            )}

            <div>
              <p className="small" style={{ marginBottom: 12 }}>
                Colourway — <span className="gold">{colour}</span>
              </p>
              <div className="swatches">
                {p.colours.map((c) => (
                  <button key={c} type="button" className={`swb${c === colour ? " on" : ""}`}
                    style={{ background: colourHex[c] || "#666" }}
                    aria-label={c} aria-pressed={c === colour} title={c}
                    onClick={() => setColour(c)} />
                ))}
              </div>
              <p className="note" style={{ marginTop: 10 }}>
                {p.colours.length > 1
                  ? `Ordered in ${colour}. The photograph shows all ${p.colours.length} colourways — the set is supplied in whichever you pick here.`
                  : `Supplied in ${colour}.`}
              </p>
            </div>

            <div>
              <p className="small" style={{ marginBottom: 12 }}>Branding method</p>
              <select className="sel" style={{ width: "100%" }} value={brand}
                onChange={(e) => setBrand(e.target.value)} aria-label="Branding method">
                {brandingMethods.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} · {m.lead}</option>
                ))}
              </select>
              <p className="note" style={{ marginTop: 10 }}>{b.note} Lead time {b.lead}.</p>
            </div>

            <div>
              <p className="small" style={{ marginBottom: 12 }}>
                Quantity — <span className="gold">{qty.toLocaleString("en-IN")} pieces</span>
              </p>
              <span className="qty">
                <button onClick={() => stepQ(-1)} aria-label="Decrease">−</button>
                <input type="number" value={qty} min={1} aria-label="Quantity"
                  onChange={(e) => setQty(Math.max(1, Math.min(100000, parseInt(e.target.value, 10) || 1)))} />
                <button onClick={() => stepQ(1)} aria-label="Increase">+</button>
              </span>
              <div className="qpick">
                {[100, 250, 500, 1000].map((n) => (
                  <button key={n} type="button" className={`chip${qty === n ? " on" : ""}`}
                    onClick={() => setQty(n)}>{n.toLocaleString("en-IN")}</button>
                ))}
              </div>
              {qty < MOQ && (
                <p className="note" style={{ marginTop: 10 }}>
                  Branded orders start at {MOQ} pieces per set.
                </p>
              )}
            </div>

            {/* Where a price used to sit. A published figure would be wrong
                more often than right — it moves with volume, branding method
                and how the order splits across colourways — so this states
                what is actually fixed and leaves the number to the quote. */}
            <div className="quoteblk">
              <div className="quoteblk__row">
                <span>What you are asking for</span>
                <b>{qty.toLocaleString("en-IN")} × {p.pieces ? piecesMeta[p.pieces]?.label ?? `${p.pieces}-in-1` : "piece"}</b>
              </div>
              <div className="quoteblk__row"><span>Colourway</span><b>{colour}</b></div>
              <div className="quoteblk__row"><span>Branding</span><b>{b.name}</b></div>
              <div className="quoteblk__row"><span>Lead time</span><b>{b.lead}</b></div>
              <p className="quoteblk__note">
                Bulk only — we quote rather than list, and come back with trade pricing at your
                volume within one working day.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn--solid" style={{ flex: 1, minWidth: 180 }}
                onClick={() => add(giftSetItem(p), Math.max(MOQ, qty), colour, brand)}>
                Add to quote list
              </button>
              <Link to="/contact" className="btn" style={{ flex: 1, minWidth: 180 }}>
                Request a sample
              </Link>
            </div>
            <p className="note">
              MOQ is {MOQ} pieces per SKU for branded work, and it applies per SKU rather than per
              colour — so one order can be split across every colourway this set is made in.
            </p>

            <table className="spec">
              <tbody>
                <tr><th>Set code</th><td>{p.code}</td></tr>
                <tr><th>Range</th><td>{lineLabel(p)}</td></tr>
                {p.contents.length > 0 && (
                  <tr><th>Pieces</th>
                    <td>{p.segment ? p.contents.length : `${p.pieces} + presentation box`}</td></tr>
                )}
                <tr><th>Cover design</th><td>{p.name}</td></tr>
                {p.spec && <tr><th>Detail</th><td>{p.spec}</td></tr>}
                {!p.segment && (
                  <>
                    <tr><th>Notebook</th><td>A5, ~192 ruled pages, 70 gsm ivory paper, ribbon marker</td></tr>
                    {p.flask && (
                      <tr><th>Flask</th>
                        <td>{p.series === "prestige" ? "500 ml / 750 ml" : "500 ml"} double-wall 304
                          stainless steel, vacuum insulated</td></tr>
                    )}
                    <tr><th>Pen</th><td>Weighted metal barrel, blue refill, twist mechanism</td></tr>
                    <tr><th>Presentation box</th>
                      <td>Rigid black board, magnetic lid
                        {(p.series === "premium" || p.series === "luxury") && ", tan leather carry handle"}</td></tr>
                  </>
                )}
                <tr><th>Colourways</th><td>{p.colours.join(" · ")}</td></tr>
                <tr><th>Lead time</th><td>5–7 days unbranded · 8–14 days branded</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {fam.length > 0 && (
          <section className="section section--tight">
            <div className="shead shead--split rv">
              <div className="stack">
                <span className="eyebrow">Same design, different size</span>
                <h2 className="h2">{p.name} across the range</h2>
                <p className="lede">
                  This cover is made in {fam.length + 1} variants. Pick the piece count your budget
                  carries — the look does not change.
                </p>
              </div>
              <Link className="lnk" to={`/collections?design=${encodeURIComponent(p.name)}`}>
                See all {fam.length + 1} <Arw />
              </Link>
            </div>
            <div className="pgrid">
              {fam.slice(0, 4).map((x, i) => <ProductCard key={x.slug} p={x} i={i} />)}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="section section--tight">
            <div className="shead shead--split rv">
              <div className="stack">
                <span className="eyebrow">You may also consider</span>
                <h2 className="h2">Similar sets</h2>
              </div>
              <Link className="lnk" to="/collections">All sets <Arw /></Link>
            </div>
            <div className="pgrid">
              {related.map((x, i) => <ProductCard key={x.slug} p={x} i={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
