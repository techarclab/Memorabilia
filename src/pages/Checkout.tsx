import { Link, Navigate } from "react-router-dom";
import QuoteForm from "@/components/QuoteForm";
import { Info } from "@/lib/icons";
import { brandingMethods, bySlug, unitPrice } from "@/data/catalog";
import { money } from "@/lib/utils";
import { usePageMotion } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

/**
 * Checkout without payment.
 *
 * The prices in this build are still placeholders, so taking money here
 * would be charging real cards against invented numbers. Instead an order
 * is recorded, the buyer gets a reference, and the team confirms and
 * invoices — which is how most of this trade already works. When real
 * pricing lands, a payment step drops in between the form and the write
 * without changing anything else on this page.
 */
export default function Checkout() {
  const { cart, clearBasket } = useStore();
  usePageMotion("checkout");

  if (!cart.length) return <Navigate to="/collections" replace />;

  const total = cart.reduce((sum, it) => {
    const p = bySlug(it.slug);
    return p ? sum + unitPrice(p, it.qty, it.brand) * it.qty : sum;
  }, 0);

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span><span className="gold">Checkout</span>
        </div>
        <div className="shead">
          <span className="eyebrow">Step 2 of 2</span>
          <h1 className="h1">Confirm your order</h1>
          <p className="lede">
            Send this through and we will confirm stock, lead time and the final invoice
            before anything is charged.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1.25fr .75fr", gap: "clamp(28px,4vw,56px)", alignItems: "start" }}>
          <div>
            {cart.map((it) => {
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
                    <div className="ci__m">{p.code} · {it.colour} · {b?.name} · {it.qty}</div>
                    <div className="ci__p">{money(u)} each</div>
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
              <span className="small">Total, excl. GST</span>
              <b className="gold" style={{ fontSize: "2rem", fontWeight: 800 }}>{money(total)}</b>
            </div>

            <div className="ok" style={{ marginTop: 22 }}>
              <Info />
              <div>
                <b style={{ color: "var(--t-1)", fontWeight: 700 }}>Nothing is charged here</b>
                <p className="small" style={{ marginTop: 5 }}>
                  We confirm stock and the final figure against your order, then invoice.
                  Prices shown in this build are indicative and exclude GST and branding.
                </p>
              </div>
            </div>
          </div>

          <div style={{
            border: "1px solid var(--line)", borderRadius: "var(--r-lg)",
            padding: "clamp(22px,3vw,34px)", background: "var(--shell)",
            position: "sticky", top: "calc(var(--nav-h) + 22px)",
          }}>
            <h3 className="h3" style={{ marginBottom: 20 }}>Where should it go?</h3>
            <QuoteForm id="oForm" kind="order" source="checkout" lines={cart}
              onSent={() => clearBasket("cart")} />
          </div>
        </div>
      </div>
      <div style={{ height: "clamp(60px,8vw,110px)" }} />
    </div>
  );
}
