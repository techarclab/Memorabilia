import { Link } from "react-router-dom";
import QuoteForm from "@/components/QuoteForm";
import { Sparkle } from "@/lib/icons";
import { brandingMethods, tiers } from "@/data/catalog";
import { money } from "@/lib/utils";
import { usePageMotion } from "@/hooks/useMotion";

const STEPS: [string, string, string][] = [
  ["Brief", "Tell us the occasion, the headcount, the budget per head and the date it must land. One email is enough to start.", "Same day response"],
  ["Shortlist", "We come back with three sets that fit, with real per-unit pricing at your volume — not a catalogue dump.", "Within 24 hours"],
  ["Sample", "We send a physical sample, branded with your logo where you want it. Nothing is committed until you have held it.", "3–4 working days"],
  ["Mock-up & sign-off", "A digital proof on the actual product for each branding position. Production starts only on your written approval.", "Same day as artwork"],
  ["Production", "Branding is applied in-house so quality control never leaves the building. Every piece is checked before it is boxed.", "8–14 working days"],
  ["Despatch", "One address or four hundred. We pick, pack, label and track, and send you the manifest.", "2–5 days in transit"],
];

const ARTWORK: [string, string][] = [
  ["Artwork we need", "Vector only — AI, EPS, PDF or SVG, with type converted to outlines. Raster files can be redrawn for a one-time ₹750."],
  ["Colour matching", "Pantone references honoured on UV print. Foil and engraving are metallic by nature and cannot match a process colour."],
  ["Individual names", "Per-piece name engraving is available on the flask and pen from 50 pieces, at +₹40 per personalised item."],
  ["Sign-off", "Nothing is marked without written approval of a digital proof. That proof shows the mark on the actual product, at actual size."],
];

const HEADLINE: [string, string, string][] = [
  ["367", "", "SKUs to choose from"], ["25", "", "Piece MOQ"],
  ["30", "%", "Max volume saving"], ["14", "", "Days, worst case"],
];

export default function BulkGifting() {
  usePageMotion("bulk");
  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span><span className="gold">Bulk &amp; Branding</span>
        </div>
        <div className="shead" style={{ maxWidth: "none" }}>
          <span className="eyebrow">For procurement, HR &amp; marketing teams</span>
          <h1 className="display" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>
            Gifting at scale,<br />without the coordination.
          </h1>
          <p className="lede">
            Twenty-five pieces or five thousand. The process below is the same either way — because
            the thing that goes wrong in corporate gifting is never the product, it is the
            coordination.
          </p>
        </div>
        <div className="hero__stats rv" style={{ marginBottom: "clamp(50px,7vw,90px)" }}>
          {HEADLINE.map(([n, suffix, label]) => (
            <div className="hero__stat" key={label}>
              <b><span className="count" data-count={n}>0</span>{suffix}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section" data-tone="Tan">
        <div className="wash wash--soft" />
        <div className="wrap">
          <div className="shead rv">
            <span className="eyebrow">How it runs</span>
            <h2 className="h1 split">Six steps, no surprises</h2>
          </div>
          <div className="proc">
            {STEPS.map(([t, d, meta], i) => (
              <div className={`proc__i rv rv-d${(i % 3) + 1}`} key={t}>
                <div className="proc__n">0{i + 1}</div>
                <div className="proc__c">
                  <h4>{t}</h4><p>{d}</p><span className="proc__meta">{meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="shead rv">
            <span className="eyebrow">Volume tiers</span>
            <h2 className="h2">What the discount actually looks like</h2>
            <p className="lede">
              Applied per SKU, not per colour — so a single order can be split across every colourway
              a set is offered in without losing the tier.
            </p>
          </div>
          <div className="tiers rv" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
            {tiers.map((t, i) => (
              <div className={`tier${i === 2 ? " on" : ""}`} key={t.label}>
                <b>{t.label}</b>
                <span style={{ fontSize: "1.5rem", display: "block", marginTop: 8, fontWeight: 800 }}>
                  {t.off ? `−${Math.round(t.off * 100)}%` : "List"}
                </span>
              </div>
            ))}
          </div>
          <p className="small rv" style={{ marginTop: 18 }}>
            Indicative structure for this prototype. Live trade pricing is confirmed per enquiry.
          </p>
        </div>
      </section>

      <section className="section" data-tone="Green">
        <div className="wash wash--soft" />
        <div className="wrap">
          <div className="shead rv">
            <span className="eyebrow">Branding</span>
            <h2 className="h2 split">Four methods, four surfaces</h2>
          </div>
          <div className="occ rv">
            {brandingMethods.filter((b) => b.id !== "none").map((b) => (
              <div className="occ__i" key={b.id}>
                <div className="occ__ic"><Sparkle /></div>
                <h4>{b.name}</h4>
                <p>{b.note}</p>
                <p style={{ marginTop: 14 }}>
                  <span className="badge-soft">{b.add ? `+${money(b.add)} / set` : "Included"}</span>{" "}
                  <span className="badge-soft">{b.lead}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="grid rv" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", marginTop: 34 }}>
            {ARTWORK.map(([t, d]) => (
              <div key={t} style={{ border: "1px solid var(--line-2)", borderRadius: "var(--r-lg)", padding: 26 }}>
                <h4 style={{ color: "var(--t-1)", marginBottom: 10 }}>{t}</h4>
                <p style={{ color: "var(--t-2)", fontSize: ".9rem", lineHeight: 1.7 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="shead rv">
            <span className="eyebrow">Start here</span>
            <h2 className="h1">Tell us the brief</h2>
            <p className="lede">
              The more of this you fill in, the better the first response will be. Nothing here is
              binding.
            </p>
          </div>
          <QuoteForm id="bulkForm" />
        </div>
      </section>
    </div>
  );
}
