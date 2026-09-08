import { Link } from "react-router-dom";
import QuoteForm from "@/components/QuoteForm";
import { Arw, Check, Clock, Layers, Pencil, Shield, Sparkle, Tag2 } from "@/lib/icons";
import { brandingMethods, bySlug, giftSets } from "@/data/catalog";
import { usePageMotion } from "@/hooks/useMotion";

const STEPS: [string, string, string][] = [
  ["Brief", "Tell us the occasion, the headcount, the budget per head and the date it must land. One email is enough to start.", "Same day"],
  ["Shortlist", "Three sets that fit, quoted at your actual volume — not a catalogue dump with a rate card attached.", "Within 24 hours"],
  ["Sample", "A physical sample, branded with your logo where you want it. Nothing is committed until you have held it.", "3–4 days"],
  ["Mock-up", "A digital proof on the actual product for each branding position. Production starts on your written approval.", "Same day as artwork"],
  ["Production", "Branding is applied in-house, so quality control never leaves the building. Every piece is checked before it is boxed.", "8–14 days"],
  ["Despatch", "One address or four hundred. We pick, pack, label and track, and send you the manifest.", "2–5 days in transit"],
];

const METHOD_ICON = [Pencil, Sparkle, Tag2, Layers];

const ARTWORK: [string, string][] = [
  ["Artwork we need", "Vector only — AI, EPS, PDF or SVG, with type converted to outlines. A raster logo can be redrawn for you — quoted once, with the order."],
  ["Colour matching", "Pantone references honoured on UV print. Foil and engraving are metallic by nature and cannot match a process colour."],
  ["Individual names", "Per-piece name engraving on the flask and pen, available from 50 pieces. Quoted with the rest of the order."],
  ["Sign-off", "Nothing is marked without written approval of a digital proof, showing the mark on the actual product at actual size."],
];

const KPI: [string, string, string][] = [
  ["367", "", "SKUs to choose from"],
  ["25", "", "Piece minimum"],
  ["4", "", "Branding methods"],
  ["14", "", "Days, worst case"],
];

/* Why there is no rate card on this site. Every one of these genuinely
   moves the per-piece figure, which is exactly why publishing one number
   would mislead more buyers than it helped. */
const QUOTE: [string, string][] = [
  ["Quantity", "The single biggest lever. The step from 100 pieces to 1,000 changes the cost base, not just the margin."],
  ["Branding method", "Deboss, foil, laser and UV each carry different setup and run costs, and each suits a different surface."],
  ["Colourway split", "The minimum applies per SKU, not per colour — so splitting one order across four colourways costs nothing extra."],
  ["Timeline", "A standard eight-to-fourteen day run is priced differently from a compressed one. Tell us the date up front."],
];

export default function BulkGifting() {
  usePageMotion("bulk");
  const hero = bySlug("JPP-B4001") || giftSets[0];

  return (
    <>
      <section className="phero">
        <div className="phero__in">
          <div className="phero__copy">
            <div className="crumb" style={{ marginBottom: 6 }}>
              <Link to="/">Home</Link><span>/</span><span className="gold">Bulk &amp; Branding</span>
            </div>
            <span className="eyebrow">For procurement, HR &amp; marketing teams</span>
            <h1>Gifting at scale, without the coordination.</h1>
            <p className="lede">
              Twenty-five pieces or five thousand — the process is the same either way. Because the
              thing that goes wrong in corporate gifting is never the product. It is the coordination.
            </p>
            <div className="hero__cta" style={{ marginTop: 24 }}>
              <span className="mag"><a href="#brief" className="btn btn--solid btn--lg">Start a brief <Arw /></a></span>
              <Link to="/collections" className="btn btn--white btn--lg">Browse the range</Link>
            </div>
            <div className="trust">
              <span className="trust__i"><Shield /><span>Branded in-house</span></span>
              <span className="trust__i"><Clock /><span>8–14 day turnaround</span></span>
              <span className="trust__i"><Check /><span>No proof, no production</span></span>
            </div>
          </div>
          <div className="phero__art rv" data-para-img>
            <img src={hero.img} alt="A Memorabilia gift set prepared for a bulk order" />
          </div>
        </div>
      </section>

      <div className="wrap" style={{ marginTop: "clamp(-52px,-4.4vw,-38px)", position: "relative", zIndex: 3 }}>
        <div className="kpi rv">
          {KPI.map(([n, suffix, label]) => (
            <div className="kpi__i" key={label}>
              <b><span className="count" data-count={n}>0</span>{suffix}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section band band--mint" data-tone="Tan">
        <div className="wrap">
          <div className="shead rv" style={{ marginBottom: "clamp(24px,3vw,38px)" }}>
            <span className="eyebrow">How it runs</span>
            <h2 className="h1 split">Six steps, no surprises</h2>
            <p className="lede">
              Every order goes through the same six. Nothing is charged, marked or shipped until the
              step before it is signed off.
            </p>
          </div>
          <div className="flow">
            {STEPS.map(([t, d, meta], i) => (
              <article className={`flow__i rv rv-d${(i % 3) + 1}`} key={t}>
                <span className="flow__n">{String(i + 1).padStart(2, "0")}</span>
                <h4>{t}</h4>
                <p>{d}</p>
                <span className="flow__meta">{meta}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="shead shead--split rv" style={{ marginBottom: "clamp(20px,2.6vw,32px)" }}>
            <div className="stack">
              <span className="eyebrow">Pricing</span>
              <h2 className="h2">Why you will not find a price on this site</h2>
            </div>
            <p className="lede" style={{ maxWidth: "44ch" }}>
              We only take bulk orders, and four things move the per-piece figure. A number printed
              on a product card would be wrong for almost everyone reading it.
            </p>
          </div>

          <div className="why">
            {QUOTE.map(([t, d], i) => (
              <article className={`why__i rv rv-d${(i % 4) + 1}`} key={t}>
                <span className="why__n">{String(i + 1).padStart(2, "0")}</span>
                <h4>{t}</h4>
                <p>{d}</p>
              </article>
            ))}
          </div>
          <p className="note rv" style={{ marginTop: 16 }}>
            Send the brief and you have real trade pricing, at your volume, within one working day.
          </p>
        </div>
      </section>

      <section className="section band band--sky" data-tone="Green">
        <div className="wrap">
          <div className="shead rv" style={{ marginBottom: "clamp(22px,2.8vw,34px)" }}>
            <span className="eyebrow">Branding</span>
            <h2 className="h2 split">Four methods, four surfaces</h2>
            <p className="lede">
              All four are applied under our own roof. Nothing is sent out, so nothing comes back wrong.
            </p>
          </div>
          <div className="meth">
            {brandingMethods.filter((b) => b.id !== "none").map((b, i) => {
              const Icon = METHOD_ICON[i % METHOD_ICON.length];
              return (
                <article className={`meth__i rv rv-d${(i % 4) + 1}`} key={b.id}>
                  <span className="meth__ic"><Icon /></span>
                  <h4>{b.name}</h4>
                  <p>{b.note}</p>
                  <div className="meth__tags">
                    <span className="badge-soft">{b.lead}</span>
                    <span className="badge-soft">In-house</span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="grid rv" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", marginTop: "clamp(20px,2.6vw,32px)" }}>
            {ARTWORK.map(([t, d]) => (
              <div key={t} style={{
                border: "1px solid var(--line-2)", borderRadius: "var(--r-lg)",
                padding: "clamp(18px,2vw,26px)", background: "rgba(255,255,255,.6)",
              }}>
                <h4 style={{ color: "var(--t-1)", marginBottom: 10 }}>{t}</h4>
                <p style={{ color: "var(--t-2)", fontSize: ".88rem", lineHeight: 1.7 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="brief" style={{ scrollMarginTop: "calc(var(--nav-h) + 20px)" }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="shead rv">
            <span className="eyebrow">Start here</span>
            <h2 className="h1">Tell us the brief</h2>
            <p className="lede">
              The more of this you fill in, the better the first response will be. Nothing here is
              binding, and we answer within one working day.
            </p>
          </div>
          <QuoteForm id="bulkForm" source="bulk-gifting" />
        </div>
      </section>
    </>
  );
}
