import { Link } from "react-router-dom";
import SectionCta from "@/components/SectionCta";
import { Arw, Info } from "@/lib/icons";
import { rangeCats, rangeItems, rangeSheets } from "@/data/ranges";
import { usePageMotion } from "@/hooks/useMotion";

/**
 * The index of the fourteen supplier catalogues.
 *
 * Each tile carries its real SKU count, computed from the data, so a
 * category can never promise more than the grid behind it holds.
 */
export default function Ranges() {
  usePageMotion("ranges");
  const total = rangeItems.length + rangeSheets.length;

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Products</span></div>
        <div className="shead shead--split">
          <div className="stack">
            <span className="eyebrow">Beyond the gift sets</span>
            <h1 className="h1">{total} products to explore</h1>
          </div>
          <p className="lede" style={{ maxWidth: "46ch" }}>
            Bags, bottles, mugs, diaries, pens, keychains, desk pieces and electronics — each one a
            complete supplier catalogue, browsable page by page. The{" "}
            <Link to="/collections" className="gold">gift sets</Link> live separately, because a set
            is chosen by piece count and a bottle by millilitres.
          </p>
        </div>

        <div className="rcats">
          {rangeCats.map((c, i) => (
            <Link key={c.id} to={`/ranges/${c.id}`} className={`rcat rv rv-d${(i % 4) + 1}`}>
              <span className="rcat__img">
                <img src={c.img} alt="" loading="lazy" decoding="async" />
                <em className="cat__n">{c.count}</em>
              </span>
              <span className="rcat__b">
                <b>{c.name}</b>
                <span>{c.blurb}</span>
                <i className="rcat__go">Browse <Arw /></i>
              </span>
            </Link>
          ))}
        </div>

        <div className="ok rv" style={{ marginTop: "clamp(28px,3.4vw,44px)" }}>
          <Info />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>Codes were read from the catalogue pages</b>
            <p className="small" style={{ marginTop: 5 }}>
              These books arrived as flat images with no text behind them, so every SKU code here was
              read off the page. Check any code against the printed line sheet before it goes on a
              purchase order — the page image beside each product is the original, unaltered.
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: "clamp(50px,7vw,90px)" }} />
      <SectionCta
        title="Need something that is not in these books?"
        body="Tell us the brief and the budget per head. We source beyond the catalogue regularly, and will come back with options and mock-ups within a day."
      />
    </div>
  );
}
