import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Doc, X } from "@/lib/icons";
import { brandingMethods, bySlug, piecesMeta } from "@/data/catalog";
import { MOQ, useStore } from "@/store/StoreContext";

/**
 * The quote list, slid out from the side.
 *
 * No subtotal, because there is no price to total. What a buyer needs to
 * see before sending is the shape of the order: which sets, in what
 * colour, with which branding, and how many of each.
 */
export default function QuoteDrawer() {
  const { lines, open, setOpen, remove, setQty } = useStore();

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [open, setOpen]);

  const pieces = lines.reduce((s, l) => s + l.qty, 0);
  /* Below the minimum we step one at a time; above it, in cases of 25. */
  const step = (q: number, dir: 1 | -1) =>
    (dir > 0 ? (q >= MOQ ? q + MOQ : q + 1) : (q > MOQ ? q - MOQ : q - 1));

  return (
    <>
      <div className={`scrim${open ? " on" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer${open ? " on" : ""}`} aria-label="Quote list" aria-hidden={!open}>
        <div className="drawer__h">
          <div>
            <span className="mono gold">Your quote list</span>
            <p className="small">
              {lines.length
                ? `${lines.length} ${lines.length === 1 ? "set" : "sets"} · ${pieces.toLocaleString("en-IN")} pieces`
                : "Empty"}
            </p>
          </div>
          <button className="icobtn" onClick={() => setOpen(false)} aria-label="Close"><X /></button>
        </div>

        <div className="drawer__b">
          {!lines.length ? (
            <div className="empty">
              <Doc />
              <p>Nothing on your list yet.</p>
              <p className="small">
                Add the sets you are considering, then send them across in one go. We come back
                with trade pricing at your volume.
              </p>
              <Link to="/collections" className="btn btn--sm" onClick={() => setOpen(false)}>
                Browse the catalogue
              </Link>
            </div>
          ) : lines.map((it, i) => {
            const p = bySlug(it.slug);
            if (!p) return null;
            const b = brandingMethods.find((x) => x.id === it.brand);
            return (
              <div className="ci" key={`${it.slug}-${it.colour}-${it.brand}`}>
                <img src={p.img} alt="" />
                <div>
                  <div className="ci__n">{p.name}</div>
                  <div className="ci__m">
                    {p.code} · {it.colour} · {b?.name}
                    {p.pieces ? ` · ${piecesMeta[p.pieces]?.label ?? `${p.pieces}-in-1`}` : ""}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="qty">
                      <button onClick={() => setQty(i, step(it.qty, -1))} aria-label="Decrease">−</button>
                      <input type="number" value={it.qty} aria-label="Quantity"
                        onChange={(e) => setQty(i, parseInt(e.target.value, 10))} />
                      <button onClick={() => setQty(i, step(it.qty, 1))} aria-label="Increase">+</button>
                    </span>
                    <button className="ci__x" onClick={() => remove(i)}>Remove</button>
                  </div>
                  {it.qty < MOQ && (
                    <p className="note" style={{ marginTop: 8 }}>
                      Branded orders start at {MOQ} pieces per set.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {lines.length > 0 && (
          <div className="drawer__f">
            <p className="small" style={{ marginBottom: 14 }}>
              Pricing depends on quantity, branding method and how the order splits across
              colourways — so we quote it rather than list it. You will have figures within
              one working day.
            </p>
            <Link to="/enquiry" className="btn btn--solid btn--block" onClick={() => setOpen(false)}>
              Request a quote
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
