import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { colourHex, colourTone, families, lineLabel, tagLabel } from "@/data/catalog";
import { money } from "@/lib/utils";
import { useStore } from "@/store/StoreContext";

/** Up to six colourway dots, then a "+n" for the rest. */
export function Swatches({ p }: { p: Product }) {
  const shown = p.colours.slice(0, 6);
  const extra = p.colours.length - shown.length;
  return (
    <span className="sw">
      {shown.map((c) => <i key={c} style={{ background: colourHex[c] || "#666" }} title={c} />)}
      {extra > 0 && <em className="sw__n">+{extra}</em>}
    </span>
  );
}

/** The same cover design in a different size — revealed on hover. */
function altOf(p: Product): Product | undefined {
  return (families[p.name] || []).find((x) => x.slug !== p.slug);
}

export default function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  const { setQuickView } = useStore();
  const alt = altOf(p);
  const tag = tagLabel(p);
  const tone = (colourTone[p.colours[0]] || colourTone.Blue)[0];

  return (
    <article className={`card rv rv-d${(i % 4) + 1}`} data-slug={p.slug}>
      <div className="card__media">
        <img src={p.img} alt={`${p.name} — ${p.code}`} loading="lazy" decoding="async" />
        {alt && <img className="card__alt" src={alt.img} alt="" loading="lazy" decoding="async" />}
        <span className="card__tint" style={{ background: tone }} />
        <div className="card__quick">
          <button className="btn btn--sm btn--block"
            onClick={(e) => { e.preventDefault(); setQuickView(p.slug); }}>Quick view</button>
        </div>
      </div>

      <div className="card__body">
        <span className="card__line">
          {lineLabel(p)}<i className="card__dot" /><span className="card__sku">{p.code}</span>
          {tag && <em className="card__tag">{tag}</em>}
        </span>
        <h3 className="card__name">{p.name}</h3>
        <p className="card__cover">{p.blurb}</p>
        <div className="card__foot">
          <div className="card__price"><b>{money(p.mrp)}</b><span>per set · excl. GST</span></div>
          <Swatches p={p} />
        </div>
      </div>

      <Link to={`/product/${p.slug}`} className="card__link" aria-label={`View ${p.name}`}
        style={{ position: "absolute", inset: 0, zIndex: 1 }} />
    </article>
  );
}
