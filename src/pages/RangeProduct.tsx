import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionCta from "@/components/SectionCta";
import { Arw, Info } from "@/lib/icons";
import { brandingMethods } from "@/data/catalog";
import { itemsIn, rangeBySlug, rangeCat } from "@/data/ranges";
import { rangeItemLine } from "@/lib/items";
import { usePageMotion } from "@/hooks/useMotion";
import { MOQ, useStore } from "@/store/StoreContext";
import NotFound from "./NotFound";

export default function RangeProduct() {
  const { cat = "", slug = "" } = useParams();
  const p = rangeBySlug(slug);
  const c = rangeCat(cat);
  const { add } = useStore();

  const [qty, setQty] = useState(100);
  const [brand, setBrand] = useState("laser");
  const [zoom, setZoom] = useState(false);

  useEffect(() => { setQty(100); setZoom(false); }, [slug]);

  const siblings = useMemo(
    () => (p ? itemsIn(p.cat).filter((x) => x.slug !== p.slug).slice(0, 6) : []), [p]);

  usePageMotion(slug);

  if (!p || !c) return <NotFound />;

  const b = brandingMethods.find((x) => x.id === brand)!;
  const step = (d: 1 | -1) =>
    setQty((n) => Math.max(1, d > 0 ? (n >= MOQ ? n + MOQ : n + 1) : (n > MOQ ? n - MOQ : n - 1)));

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/ranges">Products</Link><span>/</span>
          <Link to={`/ranges/${cat}`}>{c.name}</Link><span>/</span>
          <span className="gold">{p.code || "Product"}</span>
        </div>

        <div className="pdp">
          <div className="pdp__media">
            {/* The supplier's own catalogue page, whole and unaltered — it
                carries the dimensions, the colourways and the feature call-outs
                that no summary of ours would capture faithfully. */}
            <div className={`pdp__main pdp__main--page${zoom ? " zoom" : ""}`} onClick={() => setZoom((z) => !z)}>
              <img src={p.img} alt={p.name} />
            </div>
            <p className="small" style={{ marginTop: 6 }}>
              The full catalogue page. Click to zoom.
            </p>
          </div>

          <div className="stack">
            <span className="card__line">{c.name} · {p.code || "code on request"}</span>
            <h1 className={p.name.length > 46 ? "h2" : "h1"}>{p.name}</h1>
            {p.desc && <p className="lede">{p.desc}</p>}
            {!p.named && (
              <p className="note">
                This product is listed by its code because the catalogue page carries its
                description as artwork rather than text. The page beside it has the full detail.
              </p>
            )}

            {p.specs.length > 0 && (
              <table className="spec">
                <tbody>
                  {p.code && <tr><th>Code</th><td>{p.code}</td></tr>}
                  {p.specs.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
                  <tr><th>Range</th><td>{c.name}</td></tr>
                </tbody>
              </table>
            )}

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
                <button onClick={() => step(-1)} aria-label="Decrease">−</button>
                <input type="number" value={qty} min={1} aria-label="Quantity"
                  onChange={(e) => setQty(Math.max(1, Math.min(100000, parseInt(e.target.value, 10) || 1)))} />
                <button onClick={() => step(1)} aria-label="Increase">+</button>
              </span>
              <div className="qpick">
                {[100, 250, 500, 1000].map((n) => (
                  <button key={n} type="button" className={`chip${qty === n ? " on" : ""}`}
                    onClick={() => setQty(n)}>{n.toLocaleString("en-IN")}</button>
                ))}
              </div>
            </div>

            <div className="quoteblk">
              <div className="quoteblk__row">
                <span>What you are asking for</span>
                <b>{qty.toLocaleString("en-IN")} × {p.code || p.name.slice(0, 20)}</b>
              </div>
              <div className="quoteblk__row"><span>Branding</span><b>{b.name}</b></div>
              <div className="quoteblk__row"><span>Lead time</span><b>{b.lead}</b></div>
              <p className="quoteblk__note">
                Bulk only — we quote rather than list, and come back with trade pricing at your
                volume within one working day.
              </p>
            </div>

            <button className="btn btn--solid btn--block"
              onClick={() => add(rangeItemLine(p, c.name), Math.max(MOQ, qty), "As shown", brand)}>
              Add to quote list
            </button>
            <p className="note">MOQ is {MOQ} pieces per SKU for branded work.</p>

            {p.brands.length > 0 && (
              <div className="ok">
                <Info />
                <div>
                  <b style={{ color: "var(--t-1)", fontWeight: 700 }}>Branding shown is the supplier&apos;s mock-up</b>
                  <p className="small" style={{ marginTop: 5 }}>
                    The logo printed on this page is an example of how branding sits on the product.
                    It is not a client of Memorabilia&apos;s and implies no relationship.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {siblings.length > 0 && (
          <section className="section section--tight">
            <div className="shead shead--split rv">
              <div className="stack">
                <span className="eyebrow">Same range</span>
                <h2 className="h2">More {c.name.toLowerCase()}</h2>
              </div>
              <Link className="lnk" to={`/ranges/${cat}`}>All {c.count} <Arw /></Link>
            </div>
            <div className="rgrid">
              {siblings.map((x, i) => (
                <Link key={x.slug} to={`/ranges/${cat}/${x.slug}`} className={`rcard rv rv-d${(i % 4) + 1}`}>
                  <span className="rcard__img"><img src={x.img} alt="" loading="lazy" /></span>
                  <span className="rcard__b">
                    <span className="rcard__code mono">{x.code || "Code on request"}</span>
                    <b>{x.name}</b>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <div style={{ height: "clamp(40px,6vw,80px)" }} />
      <SectionCta
        title="Send us the codes and the headcount"
        body="We come back with trade pricing at your volume, a mock-up on your own logo, and a delivery date — within one working day."
      />
    </div>
  );
}
