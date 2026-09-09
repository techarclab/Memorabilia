import { Link } from "react-router-dom";
import QuoteForm from "@/components/QuoteForm";
import { Doc } from "@/lib/icons";
import { brandingMethods } from "@/data/catalog";
import { usePageMotion } from "@/hooks/useMotion";
import { MOQ, useStore } from "@/store/StoreContext";

export default function Enquiry() {
  const { lines, clear } = useStore();
  usePageMotion("enquiry");

  /* What a bulk buyer is totalling here is pieces, not rupees. The rupees
     come back from us, priced at exactly this volume. */
  const pieces = lines.reduce((sum, it) => sum + it.qty, 0);

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Request a Quote</span></div>
        <div className="shead">
          <span className="eyebrow">Step 2 of 2</span>
          <h1 className="h1">Review and send</h1>
          <p className="lede">
            Check the sets, colours, quantities and branding below. Everything remains adjustable
            after we respond — this is a brief, not an order.
          </p>
        </div>

        <div className="qgrid">
          <div>
            {!lines.length ? (
              <div className="empty" style={{ border: "1px solid var(--line-2)", borderRadius: "var(--r-lg)" }}>
                <Doc />
                <p>Your quote list is empty.</p>
                <p className="small">
                  Add sets from the catalogue, then come back here to send them across in one go.
                </p>
                <Link to="/collections" className="btn btn--sm">Browse the Catalogue</Link>
              </div>
            ) : (
              <>
                {lines.map((it) => {
                  const b = brandingMethods.find((x) => x.id === it.brand);
                  return (
                    <div className="ci" style={{ gridTemplateColumns: "110px 1fr auto" }}
                      key={`${it.slug}-${it.colour}-${it.brand}`}>
                      <img src={it.img} alt="" style={{ width: 110, height: 74 }} />
                      <div>
                        <div className="ci__n" style={{ fontSize: "1.06rem" }}>{it.name}</div>
                        <div className="ci__m">{it.code} · {it.colour} · {b?.name} · {it.line}</div>
                        {it.qty < MOQ && (
                          <p className="note" style={{ marginTop: 6 }}>
                            Branded orders start at {MOQ} pieces per set.
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <b style={{ fontSize: "1.3rem", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                          {it.qty.toLocaleString("en-IN")}
                        </b>
                        <div className="small">pieces</div>
                      </div>
                    </div>
                  );
                })}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  paddingTop: 22, marginTop: 8, borderTop: "1px solid var(--line)",
                }}>
                  <span className="small">
                    {lines.length} {lines.length === 1 ? "set" : "sets"} on this brief
                  </span>
                  <b className="gold" style={{ fontSize: "2rem", fontWeight: 800 }}>
                    {pieces.toLocaleString("en-IN")} pieces
                  </b>
                </div>
                <p className="note" style={{ marginTop: 10 }}>
                  We price against this brief rather than publishing a rate card, because the number
                  moves with quantity, branding method and how the order splits across colourways.
                  You will have figures within one working day.
                </p>
              </>
            )}
          </div>

          <div className="qside">
            <h3 className="h3" style={{ marginBottom: 20 }}>Your details</h3>
            <QuoteForm id="eForm" source="enquiry-page" lines={lines} onSent={() => clear()} />
          </div>
        </div>
      </div>
      <div style={{ height: "clamp(60px,8vw,110px)" }} />
    </div>
  );
}
