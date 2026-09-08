import { Link } from "react-router-dom";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";
import { Arw, Check, Clock, Info, Layers, Pencil, Play, Users } from "@/lib/icons";
import { bySlug, giftSets } from "@/data/catalog";
import { occasions } from "@/data/categories";
import { usePageMotion } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

const img = (slug: string) => (bySlug(slug) || giftSets[0]).img;

export default function Home() {
  const { say } = useStore();
  usePageMotion("home");

  return (
    <>
      <Hero />

      <Categories />

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
              <h2 className="h2 split">Curated for every occasion</h2>
              <p className="lede">
                Occasion is a judgement rather than a field in the catalogue, so each of these is a
                starting filter we would suggest across a desk — open one and widen it as you like.
              </p>
            </div>
            <Link to="/collections" className="lnk">Browse everything <Arw /></Link>
          </div>
          <div className="occ">
            {occasions.map((o, i) => (
              <Link className={`occ__i rv rv-d${(i % 4) + 1}`} to={o.href} key={o.label}>
                <span className="occ__img"><img src={o.img} alt="" loading="lazy" /></span>
                <span className="occ__b"><b>{o.label}</b><span>{o.note}</span></span>
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
              Send the occasion, the headcount and the date. You get three options, mock-ups on
              your own logo, and trade pricing at your volume — within one working day.
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
