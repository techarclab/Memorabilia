import { Link } from "react-router-dom";
import { Arw } from "@/lib/icons";
import { families } from "@/data/catalog";

/** The eight cover designs made in the most sizes — the range's backbone. */
const NAMES = Object.keys(families).filter((n) => families[n].length >= 8).slice(0, 8);

export default function DesignFamilies() {
  return (
    <div className="fam rv" style={{ marginBottom: "clamp(30px,3.6vw,48px)" }}>
      {NAMES.map((n, i) => {
        const fam = families[n];
        const lead = fam[Math.floor(fam.length / 2)];
        const sizes = Array.from(new Set(fam.map((p) => p.pieces))).sort((a, b) => a - b);
        return (
          <article className={`fam__i rv rv-d${(i % 4) + 1}`} key={n}>
            <div className="fam__img"><img src={lead.img} alt={n} loading="lazy" /></div>
            <div className="fam__b">
              <h4>{n}</h4>
              <p>{lead.blurb}</p>
              <div className="fam__tags">
                {sizes.map((s) => <span key={s}>{s}-in-1</span>)}
                <span className="fam__n">{fam.length} SKUs</span>
              </div>
              <Link className="lnk" to={`/collections?design=${encodeURIComponent(n)}`}>
                See the family <Arw />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
