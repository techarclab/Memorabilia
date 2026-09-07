import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Cart, Doc, X } from "@/lib/icons";
import { brandingMethods, bySlug, unitPrice } from "@/data/catalog";
import { money } from "@/lib/utils";
import { useStore } from "@/store/StoreContext";

export default function CartDrawer() {
  const { drawer, closeDrawer, lines, remove, setQty, moveCartToEnquiry, say } = useStore();
  const kind = drawer ?? "cart";
  const list = lines(kind);
  const open = drawer !== null;

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [open, closeDrawer]);

  const total = list.reduce((sum, it) => {
    const p = bySlug(it.slug);
    return p ? sum + unitPrice(p, it.qty, it.brand) * it.qty : sum;
  }, 0);

  /* Below 25 pieces we step one at a time; above it, in cases of 25. */
  const step = (q: number, dir: 1 | -1) => (dir > 0 ? (q >= 25 ? q + 25 : q + 1) : (q > 25 ? q - 25 : q - 1));

  return (
    <>
      <div className={`scrim${open ? " on" : ""}`} onClick={closeDrawer} />
      <aside className={`drawer${open ? " on" : ""}`} aria-label="Basket" aria-hidden={!open}>
        <div className="drawer__h">
          <div>
            <span className="mono gold">{kind === "cart" ? "Your Cart" : "Bulk Enquiry List"}</span>
            <p className="small">{list.length ? `${list.length} ${list.length === 1 ? "line" : "lines"}` : "Empty"}</p>
          </div>
          <button className="icobtn" onClick={closeDrawer} aria-label="Close"><X /></button>
        </div>

        <div className="drawer__b">
          {!list.length ? (
            <div className="empty">
              {kind === "cart" ? <Cart /> : <Doc />}
              <p>{kind === "cart" ? "Your cart is empty." : "No sets on your enquiry yet."}</p>
              <p className="small">
                {kind === "cart"
                  ? "Buy single sets and samples here."
                  : "Build a list, then send it to us for trade pricing."}
              </p>
              <Link to="/collections" className="btn btn--sm" onClick={closeDrawer}>Browse Collections</Link>
            </div>
          ) : list.map((it, i) => {
            const p = bySlug(it.slug);
            if (!p) return null;
            const u = unitPrice(p, it.qty, it.brand);
            const b = brandingMethods.find((x) => x.id === it.brand);
            return (
              <div className="ci" key={`${it.slug}-${it.colour}-${it.brand}`}>
                <img src={p.img} alt="" />
                <div>
                  <div className="ci__n">{p.name}</div>
                  <div className="ci__m">{p.code} · {it.colour} · {b?.name}</div>
                  <div className="ci__p">{money(u)} <span className="small">/ set</span></div>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="qty">
                      <button onClick={() => setQty(kind, i, step(it.qty, -1))} aria-label="Decrease">−</button>
                      <input type="number" value={it.qty} aria-label="Quantity"
                        onChange={(e) => setQty(kind, i, parseInt(e.target.value, 10))} />
                      <button onClick={() => setQty(kind, i, step(it.qty, 1))} aria-label="Increase">+</button>
                    </span>
                    <button className="ci__x" onClick={() => remove(kind, i)}>Remove</button>
                  </div>
                </div>
                <div style={{ textAlign: "right", color: "var(--t-1)" }}>{money(u * it.qty)}</div>
              </div>
            );
          })}
        </div>

        {list.length > 0 && (
          <div className="drawer__f">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="small">{kind === "cart" ? "Subtotal" : "Indicative value"}</span>
              <b className="gold" style={{ fontSize: "1.4rem" }}>{money(total)}</b>
            </div>
            {kind === "cart" ? (
              <>
                <p className="small" style={{ marginBottom: 16 }}>Excl. GST · shipping calculated at checkout</p>
                <button className="btn btn--solid btn--block"
                  onClick={() => say("Checkout is not wired up in this prototype")}>Proceed to Checkout</button>
                <button className="btn btn--ghost btn--block btn--sm" style={{ marginTop: 10 }}
                  onClick={moveCartToEnquiry}>Move to bulk enquiry instead</button>
              </>
            ) : (
              <>
                <p className="small" style={{ marginBottom: 16 }}>
                  Final trade pricing confirmed on quote · MOQ 25 per SKU
                </p>
                <Link to="/enquiry" className="btn btn--solid btn--block" onClick={closeDrawer}>Request Quote</Link>
              </>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
