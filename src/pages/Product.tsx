import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Arw, Box, ItemIcon } from "@/lib/icons";
import {
  brandingMethods, bySlug, colourHex, families, giftSets, lineLabel, products, tierFor, unitPrice,
} from "@/data/catalog";
import { money } from "@/lib/utils";
import { usePageMotion } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";
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

  /* The same cover design in every other size — this is the range's whole
     proposition, so it leads the gallery and the strip below. */
  const fam = useMemo(() => (p ? (families[p.name] || []).filter((x) => x.slug !== p.slug) : []), [p]);
  const related = useMemo(() => (p ? products.filter(
    (x) => x.slug !== p.slug && x.pieces === p.pieces && x.series === p.series && x.flask === p.flask,
  ).slice(0, 4) : []), [p]);

  usePageMotion(slug);

  if (!p) return <NotFound />;

  const b = brandingMethods.find((x) => x.id === brand)!;
  const tier = tierFor(qty);
  const unit = unitPrice(p, qty, brand);
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
                  <button key={c} className={`swb${c === colour ? " on" : ""}`}
                    style={{ background: colourHex[c] || "#666" }} aria-label={c}
                    onClick={() => setColour(c)} />
                ))}
              </div>
            </div>

            <div>
              <p className="small" style={{ marginBottom: 12 }}>Branding method</p>
              <select className="sel" style={{ width: "100%" }} value={brand}
                onChange={(e) => setBrand(e.target.value)} aria-label="Branding method">
                {brandingMethods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} · {m.add ? `+${money(m.add)}` : "included"} · {m.lead}
                  </option>
                ))}
              </select>
              <p className="note" style={{ marginTop: 10 }}>{b.note} Lead time {b.lead}.</p>
            </div>

            <div>
              <p className="small" style={{ marginBottom: 12 }}>Quantity</p>
              <span className="qty">
                <button onClick={() => stepQ(-1)} aria-label="Decrease">−</button>
                <input type="number" value={qty} min={1} aria-label="Quantity"
                  onChange={(e) => setQty(Math.max(1, Math.min(100000, parseInt(e.target.value, 10) || 1)))} />
                <button onClick={() => stepQ(1)} aria-label="Increase">+</button>
              </span>
              <span className="small" style={{ marginLeft: 14 }}>
                {tier.label}{tier.off ? ` · saving ${money(p.mrp * tier.off * qty)}` : ""}
              </span>
            </div>

            <div className="priceblk">
              <div className="priceblk__row"><span>List price per set</span><span>{money(p.mrp)}</span></div>
              <div className="priceblk__row">
                <span>Volume tier</span>
                <span className="gold">{tier.off ? `${tier.label} · −${Math.round(tier.off * 100)}%` : "List price"}</span>
              </div>
              <div className="priceblk__row">
                <span>Branding</span><span>{b.add ? `+${money(b.add)}` : "Included"}</span>
              </div>
              <div className="priceblk__row total"><span>Your price per set</span><b>{money(unit)}</b></div>
              <div className="priceblk__row">
                <span>Order total (excl. GST)</span><span className="gold">{money(unit * qty)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn--solid" style={{ flex: 1, minWidth: 180 }}
                onClick={() => add("cart", p.slug, qty, colour, brand)}>Add to Cart</button>
              <button className="btn" style={{ flex: 1, minWidth: 180 }}
                onClick={() => add("enquiry", p.slug, Math.max(25, qty), colour, brand)}>Add to Bulk Enquiry</button>
            </div>
            <p className="note">
              MOQ for branded orders is 25 pieces per SKU. Single unbranded sets and samples can be
              bought from the cart.
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
