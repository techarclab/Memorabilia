import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import SectionCta from "@/components/SectionCta";
import { Check } from "@/lib/icons";
import { accessories } from "@/data/catalog";
import { usePageMotion } from "@/hooks/useMotion";

const byCat = accessories.reduce<Record<string, typeof accessories>>((acc, p) => {
  (acc[p.cat || "Other"] ||= []).push(p);
  return acc;
}, {});

export default function Accessories() {
  usePageMotion("accessories");
  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Accessories</span></div>
        <div className="shead" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Sold individually</span>
          <h1 className="h1">Single pieces, same standards</h1>
          <p className="lede">
            Not every gift needs a box. Keychains and pens are supplied loose or in small
            presentation sleeves, from 50 pieces, with the same branding options as the sets.
          </p>
        </div>

        {Object.keys(byCat).map((cat) => (
          <section className="section section--tight" style={{ paddingTop: 0 }} key={cat}>
            <div className="shead rv" style={{ marginBottom: 26 }}>
              <span className="eyebrow">{cat}</span>
              <h2 className="h2">{cat}</h2>
            </div>
            <div className="pgrid">
              {byCat[cat].map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}
            </div>
          </section>
        ))}

        <div className="ok rv" style={{ marginBottom: 40 }}>
          <Check />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>More segments on the way</b>
            <p className="small" style={{ marginTop: 5 }}>
              Drinkware (mugs, tumblers and bottles), metal pens, notebooks and organisers, card
              holders, felt bags and desk items are being added from the current line sheets. Ask us
              for those catalogues in the meantime.
            </p>
          </div>
        </div>
      </div>

      <SectionCta
        title="Need a single item at volume?"
        body="Pens and keyfobs ship from 50 pieces with laser engraving. Tell us the quantity and we will quote same day."
      />
    </div>
  );
}
