import { Link } from "react-router-dom";
import QuoteForm from "@/components/QuoteForm";
import { Doc } from "@/lib/icons";
import { brandingMethods, bySlug, tierFor, unitPrice } from "@/data/catalog";
import { money } from "@/lib/utils";
import { usePageMotion } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

export default function Enquiry() {
  const { enquiry } = useStore();
  usePageMotion("enquiry");

  const total = enquiry.reduce((sum, it) => {
    const p = bySlug(it.slug);
    return p ? sum + unitPrice(p, it.qty, it.brand) * it.qty : sum;
  }, 0);

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Bulk Enquiry</span></div>
        <div className="shead">
          <span className="eyebrow">Step 2 of 2</span>
          <h1 className="h1">Review and send</h1>
          <p className="lede">
            Check the sets, colours, quantities and branding below. Everything remains adjustable
            after we respond.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1.25fr .75fr", gap: "clamp(28px,4vw,56px)", alignItems: "start" }}>
          <div>
            {!enquiry.length ? (
              <div className="empty" style={{ border: "1px solid var(--line-2)", borderRadius: "var(--r-lg)" }}>
                <Doc />
                <p>Your enquiry list is empty.</p>
                <p className="small">
                  Add sets from the catalogue, then come back here to send them across in one go.
                </p>
                <Link to="/collections" className="btn btn--sm">Browse the Catalogue</Link>
              </div>
            ) : (
              <>
                {enquiry.map((it) => {
                  const p = bySlug(it.slug);
                  if (!p) return null;
                  const u = unitPrice(p, it.qty, it.brand);
                  const b = brandingMethods.find((x) => x.id === it.brand);
                  return (
                    <div className="ci" style={{ gridTemplateColumns: "110px 1fr auto" }}
                      key={`${it.slug}-${it.colour}-${it.brand}`}>
                      <img src={p.img} alt="" style={{ width: 110, height: 74 }} />
                      <div>
                        <div className="ci__n" style={{ fontSize: "1.06rem" }}>{p.name}</div>
                        <div className="ci__m">{p.code} · {it.colour} · {b?.name} · {it.qty} sets</div>
                        <div className="ci__p">{money(u)} per set · {tierFor(it.qty).label}</div>
                      </div>
                      <div style={{ textAlign: "right", color: "var(--t-1)", fontSize: "1.2rem", fontWeight: 800 }}>
                        {money(u * it.qty)}
                      </div>
                    </div>
                  );
                })}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  paddingTop: 22, marginTop: 8, borderTop: "1px solid var(--line)",
                }}>
                  <span className="small">Indicative total, excl. GST</span>
                  <b className="gold" style={{ fontSize: "2rem", fontWeight: 800 }}>{money(total)}</b>
                </div>
                <p className="note" style={{ marginTop: 10 }}>
                  Trade pricing is confirmed on quote and is usually better than the figure shown here.
                </p>
              </>
            )}
          </div>

          <div style={{
            border: "1px solid var(--line)", borderRadius: "var(--r-lg)",
            padding: "clamp(22px,3vw,34px)", background: "var(--shell)",
            position: "sticky", top: "calc(var(--nav-h) + 22px)",
          }}>
            <h3 className="h3" style={{ marginBottom: 20 }}>Your details</h3>
            <QuoteForm id="eForm" />
          </div>
        </div>
      </div>
      <div style={{ height: "clamp(60px,8vw,110px)" }} />
    </div>
  );
}
