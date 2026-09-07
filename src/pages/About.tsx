import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import SectionCta from "@/components/SectionCta";
import { Arw } from "@/lib/icons";
import { bySlug, giftSets } from "@/data/catalog";
import { usePageMotion } from "@/hooks/useMotion";

const RULES: [string, string][] = [
  ["The box is the product", "Every set ships in its signature case. We do not have a cheaper box for cheaper orders."],
  ["One design, every budget", "A cover design is made across the whole range. You never have to abandon a look because the headcount grew."],
  ["Branding stays in-house", "Debossing, foiling, engraving and UV printing all happen under our own roof. Nothing is sent out, so nothing comes back wrong."],
  ["No proof, no production", "Every branded order gets a digital mock-up on the real product. We do not start until someone has written “approved”."],
];

const NUMBERS: [string, string][] = [
  ["367", "SKUs in the range"], ["52", "Cover designs"], ["15", "Product lines"],
  ["4", "Branding methods"], ["25", "Piece minimum"],
];

const FLAGSHIPS = ["JPP-PREMIUM-5", "JPP-B5059", "JPP-B0350", "JPP-B4027"]
  .map((s) => bySlug(s)).filter(Boolean);

export default function About() {
  usePageMotion("about");
  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Our Story</span></div>
        <div className="shead" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Memorabilia · Premium Gifting Solutions</span>
          <h1 className="display" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>
            A gift is judged<br />before it is opened.
          </h1>
        </div>
        <div className="grid rv" style={{
          gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,5vw,70px)",
          alignItems: "center", marginBottom: "clamp(50px,7vw,100px)",
        }}>
          <div className="stack">
            <p className="lede">
              Most corporate gifting fails quietly. The product is fine, the logo is fine — and then
              it arrives in a crushed carton with a courier label across the front, and the whole
              gesture is spent before anyone has opened it.
            </p>
            <p className="lede">
              We started from the packaging and worked inward. A rigid magnetic case, a stitched
              leather handle, a cut foam tray that holds every piece exactly where it was placed.
              Then we built one library of cover designs and made every one of them in two, three,
              four and five piece versions — so a brand can choose a look once and buy it at
              whatever budget each audience deserves.
            </p>
            <p className="lede">
              Fifty-two designs and three hundred and sixty-seven SKUs later, that is still the only
              idea we are working on.
            </p>
          </div>
          <div className="aboutpic" data-para-img>
            <img src={(bySlug("JPP-B4047") || giftSets[0]).img} alt="Memorabilia presentation box" />
          </div>
        </div>
      </div>

      <section className="section" style={{ background: "var(--shell)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="shead rv">
            <span className="eyebrow">What we hold to</span>
            <h2 className="h1">Four rules</h2>
          </div>
          <div className="proc">
            {RULES.map(([t, d], i) => (
              <div className={`proc__i rv rv-d${i + 1}`} key={t}>
                <div className="proc__n">0{i + 1}</div>
                <div className="proc__c"><h4>{t}</h4><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="hero__stats rv" style={{ border: 0, justifyContent: "space-between", flexWrap: "wrap" }}>
            {NUMBERS.map(([n, label]) => (
              <div className="hero__stat" key={label}>
                <b><span className="count" data-count={n}>0</span></b><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="shead shead--split rv">
            <div className="stack">
              <span className="eyebrow">The flagship sets</span>
              <h2 className="h2">Where we would start</h2>
            </div>
            <Link className="lnk" to="/collections">All sets <Arw /></Link>
          </div>
          <div className="pgrid">
            {FLAGSHIPS.map((p, i) => p && <ProductCard key={p.slug} p={p} i={i} />)}
          </div>
        </div>
      </section>

      <SectionCta
        title="Let us send you one."
        body="A single sample, branded with your logo, so the decision is made with the product in your hands rather than on a screen."
      />
    </div>
  );
}
