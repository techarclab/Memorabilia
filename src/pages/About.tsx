import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import SectionCta from "@/components/SectionCta";
import { Arw, Check, Gift, Layers, Shield } from "@/lib/icons";
import { bySlug, giftSets } from "@/data/catalog";
import { rangeItems } from "@/data/ranges";
import { usePageMotion } from "@/hooks/useMotion";

const RULES: [string, string][] = [
  ["The box is the product", "Every set ships in its signature case. We do not have a cheaper box for cheaper orders."],
  ["One design, every budget", "A cover design is made across the whole range. You never have to abandon a look because the guest list grew."],
  ["Branding stays in-house", "Debossing, foiling, engraving and UV printing all happen under our own roof. Nothing is sent out, so nothing comes back wrong."],
  ["No proof, no production", "Every branded order gets a digital mock-up on the real product. We do not start until someone has written “approved”."],
];

const RULE_ICONS = [Gift, Layers, Shield, Check];

const NUMBERS: [string, string][] = [
  ["367", "SKUs in the range"], ["52", "Cover designs"], ["15", "Product lines"],
  ["4", "Branding methods"], ["25", "Piece minimum"],
];

const FLAGSHIPS = ["JPP-PREMIUM-5", "JPP-B5059", "JPP-B0350", "JPP-B4027"]
  .map((s) => bySlug(s)).filter(Boolean);

const PRODUCT_HIGHLIGHTS = ["bags", "bottles", "diaries", "electronics"]
  .map((cat) => rangeItems.find((item) => item.cat === cat))
  .filter(Boolean);

export default function About() {
  usePageMotion("about");
  const [ruleIndex, setRuleIndex] = useState(0);
  const [ruleTitle, ruleBody] = RULES[ruleIndex];
  const RuleIcon = RULE_ICONS[ruleIndex];
  return (
    <div className="pgh">
      <div className="wrap about-hero">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Our Story</span></div>
        <div className="about-hero__in">
          <div className="about-hero__copy rv">
            <span className="eyebrow">Memorabilia · Gifts for every occasion</span>
            <h1 className="display split">
              A gift is judged<br />before it is opened.
            </h1>
            <div className="stack">
            <p className="lede">
              Too many gifts fail quietly. The product is fine, the message is fine — and then
              it arrives in a crushed carton with a courier label across the front, and the whole
              gesture is spent before anyone has opened it.
            </p>
            <p className="lede">
              We started from the packaging and worked inward. A rigid magnetic case, a stitched
              leather handle, a cut foam tray that holds every piece exactly where it was placed.
              Then we built one library of cover designs and made every one of them in two, three,
              four and five piece versions — so every host, family or organiser can choose a look once
              and find the right fit for their guests.
            </p>
            <p className="lede">
              Fifty-two designs and three hundred and sixty-seven SKUs later, that is still the only
              idea we are working on.
            </p>
            </div>
            <Link className="btn btn--solid mag" to="/collections">See the collection <Arw /></Link>
          </div>
          <div className="about-hero__art rv rv-d2">
            <span className="about-hero__note">Made to be remembered</span>
            <img src={(bySlug("JPP-B4047") || giftSets[0]).img} alt="Memorabilia presentation box" />
            <div className="about-hero__stamp"><Gift /><span>Every detail<br />has a purpose</span></div>
          </div>
        </div>
      </div>

      <section className="section about-rules" data-tone="Gold">
        <div className="wrap">
          <div className="shead about-rules__head rv">
            <span className="eyebrow">What we hold to</span>
            <h2 className="h1">Four promises,<br />kept in every gift.</h2>
            <p>Not marketing language. These are the checks every order goes through before it reaches your hands.</p>
          </div>
          <div className="about-rules__in rv">
            <div className="about-rules__tabs" role="tablist" aria-label="Our promises">
            {RULES.map(([t], i) => (
              <button className={i === ruleIndex ? "on" : ""} key={t} role="tab" aria-selected={i === ruleIndex}
                onClick={() => setRuleIndex(i)}>
                <span>0{i + 1}</span><b>{t}</b><Arw />
              </button>
            ))}
            </div>
            <div className="about-rules__detail spot" key={ruleTitle}>
              <div className="about-rules__icon"><RuleIcon /></div>
              <span className="eyebrow">Our promise 0{ruleIndex + 1}</span>
              <h3>{ruleTitle}</h3>
              <p>{ruleBody}</p>
              <Link className="lnk" to="/bulk-gifting">Plan your gifts <Arw /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-numbers" data-tone="Forest">
        <div className="wrap">
          <span className="eyebrow rv">The collection, in numbers</span>
          <div className="kpi rv">
            {NUMBERS.map(([n, label]) => (
              <div className="kpi__i" key={label}>
                <b><span className="count" data-count={n}>0</span></b><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-products" data-tone="Blue">
        <div className="wrap">
          <div className="shead shead--split rv">
            <div className="stack">
              <span className="eyebrow">More than gift sets</span>
              <h2 className="h2">Everyday pieces,<br />ready to personalise.</h2>
            </div>
            <Link className="lnk" to="/ranges">Browse all products <Arw /></Link>
          </div>
          <div className="rgrid about-products__grid">
            {PRODUCT_HIGHLIGHTS.map((product, i) => product && (
              <Link key={product.slug} to={`/ranges/${product.cat}/${product.slug}`} className={`rcard rv rv-d${i + 1}`}>
                <span className="rcard__img"><img src={product.img} alt={product.name} loading="lazy" decoding="async" /></span>
                <span className="rcard__b">
                  <span className="rcard__code mono">{product.code || "Code on request"}</span>
                  <b>{product.name}</b>
                  <span className="rcard__spec">{product.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="shead shead--split rv">
            <div className="stack">
              <span className="eyebrow">Gift sets</span>
              <h2 className="h2">A memorable place to start</h2>
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
        body="A single sample, personalised for your occasion, so the decision is made with the product in your hands rather than on a screen."
      />
    </div>
  );
}
