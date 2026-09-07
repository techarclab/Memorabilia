import { Link } from "react-router-dom";
import Hero from "@/components/home/Hero";
import Testimonials from "@/components/home/Testimonials";
import { Arw, Check, Clock, Gift, Info, Layers, Leaf, Pencil, Play, Star, Users } from "@/lib/icons";
import { bySlug, giftSets } from "@/data/catalog";
import { usePageMotion } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

const CATS: [string, string, string, string][] = [
  ["2-in-1 Sets", "Notebook + pen", "?pieces=2", "JPP-2034"],
  ["3-in-1 Sets", "Add a keychain", "?pieces=3", "JPP-3021"],
  ["4-in-1 Sets", "Add a card holder", "?pieces=4", "JPP-4047"],
  ["5-in-1 Sets", "The complete kit", "?pieces=5", "JPP-B5001"],
  ["Bamboo & Eco", "A greener choice", "?tag=sustainable", "JPP-B5027"],
  ["Pens & Keyfobs", "Sold individually", "", "JPP-559GM"],
];

const OCCS: [string, string, string][] = [
  ["Employee Appreciation", "Recognition gifting", "JPP-PREMIUM-1"],
  ["Client Onboarding", "Day-one welcome", "JPP-B4003"],
  ["Festive Gifting", "Diwali & seasonal", "JPP-B4034"],
  ["Work Anniversaries", "Long-service awards", "JPP-B5059"],
  ["Conferences & Events", "Delegate kits", "JPP-B4005"],
  ["CSR & Sustainable", "Bamboo range", "JPP-B4027"],
];

const STATS = [
  [Users, "367", "SKUs in Stock"], [Gift, "52", "Cover Designs"],
  [Star, "25", "Piece MOQ"], [Leaf, "12", "Bamboo Options"],
] as const;

const img = (slug: string) => (bySlug(slug) || giftSets[0]).img;

export default function Home() {
  const { say } = useStore();
  usePageMotion("home");

  return (
    <>
      <Hero />

      <section className="stats">
        <div className="wrap">
          <div className="stats__in">
            {STATS.map(([Icon, n, label]) => (
              <div className="stats__i" key={label}>
                <Icon />
                <div>
                  <b><span className="count" data-count={n}>0</span>+</b>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="shead shead--split rv">
            <div className="stack">
              <span className="eyebrow">Explore</span>
              <h2 className="h2 split">Shop by Category</h2>
            </div>
            <div className="shead__nav">
              <Link to="/collections" className="lnk">View All Categories <Arw /></Link>
            </div>
          </div>
          <div className="cats">
            {CATS.map(([title, sub, q, slug], i) => (
              <Link className={`cat rv rv-d${(i % 4) + 1}`} to={`/collections${q}`} key={title}>
                <span className="cat__img"><img src={img(slug)} alt={title} loading="lazy" /></span>
                <span className="cat__b">
                  <span><b>{title}</b><span>{sub}</span></span>
                  <span className="rbtn rbtn--sm"><Arw /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="feat">
        <div className="wrap">
          <div className="feat__in">
            <div className="feat__copy rv">
              <span className="eyebrow">Custom corporate gifting</span>
              <h2 className="h1 split" style={{ margin: "14px 0 16px" }}>
                Make a<br />Lasting Impression
              </h2>
              <p className="lede">
                Every cover design runs across the whole range, so you choose the look first and the
                budget second — the same set as a two-piece for the wider team and a five-piece for
                the leadership.
              </p>
              <div className="hero__cta" style={{ marginTop: 24 }}>
                <span className="mag"><Link to="/bulk-gifting" className="btn btn--solid">Get a Custom Quote</Link></span>
                <Link to="/bulk-gifting" className="btn btn--white">Explore Our Process</Link>
              </div>
              <div className="feat__pills">
                <span className="pill-i"><Pencil />Design Support</span>
                <span className="pill-i"><Layers />Flexible MOQs</span>
                <span className="pill-i"><Clock />Quick Turnaround</span>
              </div>
            </div>
            <div className="feat__art rv">
              <span className="feat__arch" />
              <div className="feat__pic" data-para-img>
                <img src={img("JPP-PREMIUM-5")} alt="Memorabilia flagship corporate gift set" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section occs">
        <div className="wrap">
          <div className="shead shead--split shead--top rv">
            <div className="stack">
              <h2 className="h2 split">Curated for Every Occasion</h2>
              <p className="lede">
                From client appreciation to employee milestones, there is a set that fits the moment.
              </p>
            </div>
            <Link to="/bulk-gifting" className="lnk">View All Occasions <Arw /></Link>
          </div>
          <div className="occ">
            {OCCS.map(([title, sub, slug], i) => (
              <Link className={`occ__i rv rv-d${(i % 4) + 1}`} to="/collections" key={title}>
                <span className="occ__img"><img src={img(slug)} alt={title} loading="lazy" /></span>
                <span className="occ__b"><b>{title}</b><span>{sub}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="proof">
        <div className="proof__bg"><img src={img("JPP-B4059")} alt="" /></div>
        <div className="wrap proof__in">
          <div className="proof__top">
            <div className="stack">
              <span className="eyebrow">Trusted by industry leaders</span>
              <h2 className="h1 split">Great Companies<br />Choose Great Gifts</h2>
            </div>
            <button className="proof__watch" onClick={() => say("Brand film slot — drop the video in when it is shot")}>
              <span className="rbtn rbtn--play"><Play /></span>Watch Our Story
            </button>
          </div>
          <div className="proof__rule" />
          <div className="logos">
            {["Client One", "Client Two", "Client Three", "Client Four", "Client Five", "Client Six"]
              .map((n, i) => <span className="logos__i" key={n}><i>{i + 1}</i>{n}</span>)}
          </div>
          <span className="placeholder-note">
            <Info />Placeholder slots — add Memorabilia&apos;s own client logos with written permission before launch
          </span>
        </div>
      </section>

      <Testimonials />

      <section className="fcta">
        <span className="blob blob--1" /><span className="blob blob--2" /><span className="blob blob--3" />
        <div className="wrap">
          <div className="fcta__in rv">
            <span className="eyebrow center">Ready to get started?</span>
            <h2 className="h1 split">Let&apos;s Create Something<br />Meaningful Together</h2>
            <p className="lede center" style={{ marginInline: "auto" }}>
              Get personalised recommendations, transparent pricing and expert support for your
              gifting brief.
            </p>
            <span className="mag" style={{ marginTop: 8 }}>
              <Link to="/bulk-gifting" className="btn btn--solid btn--lg">Get a Quote Now</Link>
            </span>
            <div className="fcta__pills">
              <span className="pill-i"><Check />No Obligation</span>
              <span className="pill-i"><Clock />Quick Response</span>
              <span className="pill-i"><Users />Dedicated Support</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
