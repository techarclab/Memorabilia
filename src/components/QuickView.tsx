import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Arw, ItemIcon, X } from "@/lib/icons";
import { bySlug, lineLabel, piecesMeta } from "@/data/catalog";
import { useStore } from "@/store/StoreContext";
import { Swatches } from "./ProductCard";

export default function QuickView() {
  const { quickView, setQuickView, add } = useStore();
  const p = quickView ? bySlug(quickView) : undefined;

  useEffect(() => {
    if (!p) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [p, setQuickView]);

  return (
    <div className={`modal${p ? " on" : ""}`} role="dialog" aria-modal="true" aria-label="Quick view">
      <div className="modal__c">
        {p && (
          <>
            <button className="modal__x" onClick={() => setQuickView(null)} aria-label="Close"><X /></button>
            <div className="modal__img"><img src={p.img} alt={p.name} /></div>
            <div className="modal__b">
              <span className="card__line">{lineLabel(p)} · {p.code}</span>
              <h3 className="h2">{p.name}</h3>
              <p style={{ color: "var(--t-2)", lineHeight: 1.7, fontSize: ".92rem" }}>{p.blurb}</p>
              <ul className="incl">
                {p.contents.map((c) => <li key={c}><ItemIcon name={c} />{c}</li>)}
              </ul>
              <div>
                <p className="small" style={{ marginBottom: 9 }}>Colourways</p>
                <Swatches p={p} />
              </div>
              <div className="card__foot" style={{ border: 0, padding: 0 }}>
                <div className="card__meta">
                  <b>{p.pieces ? piecesMeta[p.pieces]?.label ?? `${p.pieces}-in-1` : "Single item"}</b>
                  <span>Branded from 25 pieces · quoted per order</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn--solid" onClick={() => { add(p.slug, 100); setQuickView(null); }}>
                  Add to quote list
                </button>
              </div>
              <Link to={`/product/${p.slug}`} className="lnk" onClick={() => setQuickView(null)}>
                Full details <Arw />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
