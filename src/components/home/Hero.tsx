import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Arw, ArwL, Layers, Play, Shield, Tag2, Truck } from "@/lib/icons";
import { bySlug, colourHex, lineLabel, products } from "@/data/catalog";
import { reduced, setTone } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

/* Six real SKUs, one per finish. The whole page tints to whichever is up. */
const PICKS: [string, string][] = [
  ["JPP-B5001", "Blue"], ["JPP-B4034", "Red"], ["JPP-4047", "Cream"],
  ["JPP-B5027", "MDF"], ["JPP-B5005", "Black"], ["JPP-3041", "Green"],
];

export const heroSlides = PICKS.map(([slug, colour]) => {
  const p = bySlug(slug) || products[0];
  return { slug: p.slug, img: p.img, code: p.code, name: p.name, line: lineLabel(p), colour };
});

const TRUST = [
  [Shield, "Premium Quality"], [Tag2, "Custom Branding"],
  [Layers, "Bulk Order Support"], [Truck, "Pan-India Delivery"],
] as const;

/* Figures the catalogue itself can back up. There is deliberately no
   "500+ happy clients" here — that is a number only JPP can stand behind,
   and inventing one on their behalf is the kind of claim that gets a
   supplier caught out in a procurement meeting. */
const BAR: [string, string, string][] = [
  ["367", "+", "Curated SKUs"],
  ["52", "", "Cover Designs"],
  ["25", "", "Piece Minimum"],
  ["4", "", "Branding Methods"],
];

const DURATION = 5200;

export default function Hero() {
  const { say } = useStore();
  const [i, setI] = useState(0);
  const art = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const paused = useRef(false);
  const t0 = useRef(0);

  useEffect(() => { setTone(heroSlides[i].colour); }, [i]);

  const go = useCallback((n: number) => {
    setI(((n % heroSlides.length) + heroSlides.length) % heroSlides.length);
    t0.current = performance.now();
  }, []);

  /* One rAF loop drives both the progress ring and the auto-advance, so the
     two can never drift apart. */
  useEffect(() => {
    if (reduced()) return;
    let id = 0;
    t0.current = performance.now();
    const loop = (ts: number) => {
      if (paused.current) t0.current = ts;
      else {
        const p = Math.min(1, (ts - t0.current) / DURATION);
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        if (p >= 1) { t0.current = ts; setI((n) => (n + 1) % heroSlides.length); }
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  /* The pack drifts a few percent against the scroll — enough to feel alive,
     not enough to read as a gimmick. */
  useEffect(() => {
    if (reduced()) return;
    let tick = false;
    const run = () => {
      const el = art.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.setProperty("--drift", `${(p * 14).toFixed(1)}px`);
    };
    const h = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; run(); }); } };
    addEventListener("scroll", h, { passive: true });
    run();
    return () => removeEventListener("scroll", h);
  }, []);

  const slide = heroSlides[i];

  return (
    <section className="hero">
      <span className="hero__glow" aria-hidden="true" />

      <div className="hero__in">
        <div className="hero__copy">
          <span className="eyebrow">Corporate gifting, reimagined</span>
          <h1 className="display hero__title">
            Gifts That<br />Build Stronger<br /><span className="accent">Businesses</span>
          </h1>
          <p className="lede">
            Premium, fully customisable corporate gift sets for your teams, clients and partners —
            367 SKUs, branded in-house, delivered across India.
          </p>
          <div className="hero__cta">
            <span className="mag">
              <Link to="/collections" className="btn btn--solid btn--lg">Explore Gift Sets <Arw /></Link>
            </span>
            <button className="watch" onClick={() => say("Brand film slot — drop the video in when it is shot")}>
              <span className="rbtn rbtn--play"><Play /></span>Watch Video
            </button>
          </div>

          <div className="trust">
            {TRUST.map(([Icon, label]) => (
              <span className="trust__i" key={label}><Icon /><span>{label}</span></span>
            ))}
          </div>

          {/* Placeholder slots. Real client marks go here only with written
              permission — a supplier showing a customer's logo without it is
              a legal problem, not a design decision. */}
          <div className="clients">
            <span className="clients__t">Trusted by leading businesses</span>
            <div className="clients__row">
              {["Client One", "Client Two", "Client Three", "Client Four", "Client Five", "Client Six"]
                .map((n) => <span className="clients__i" key={n}>{n}</span>)}
            </div>
            <span className="clients__note">
              Placeholder slots — add JPP&apos;s own client logos with written permission before launch
            </span>
          </div>
        </div>

        <div className="hero__art" ref={art}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}>
          <div className="hero__frame">
            {heroSlides.map((h, k) => (
              <img key={h.slug} src={h.img} alt={`${h.name} gift set in ${h.colour}`}
                className={k === i ? "on" : undefined}
                loading={k === 0 ? "eager" : "lazy"} />
            ))}
            <span className="hero__prog"><i ref={bar} /></span>
          </div>

          {/* The rail: every colourway at a glance, the way a shopper expects
              to find alternates on a product shot. */}
          <div className="hero__rail">
            {heroSlides.map((h, k) => (
              <button key={h.slug} className={`hero__th${k === i ? " on" : ""}`}
                onClick={() => go(k)} aria-label={`${h.name}, ${h.colour}`}
                aria-current={k === i}>
                <img src={h.img} alt="" loading="lazy" />
                <i style={{ background: colourHex[h.colour] || "#888" }} />
              </button>
            ))}
            <div className="hero__nav">
              <button className="rbtn" onClick={() => go(i - 1)} aria-label="Previous set"><ArwL /></button>
              <button className="rbtn" onClick={() => go(i + 1)} aria-label="Next set"><Arw /></button>
            </div>
          </div>

          <div className="hero__tag">
            <span className="mono">{slide.code}</span>
            <b>{slide.name}</b>
            <span className="small">{slide.colour} · {slide.line}</span>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="hero__bar">
          {BAR.map(([n, suffix, label]) => (
            <div className="hero__stat" key={label}>
              <b><span className="count" data-count={n}>0</span>{suffix}</b>
              <span>{label}</span>
            </div>
          ))}
          <Link to="/collections" className="hero__disc">
            <span className="rbtn"><Arw /></span>
            <span>Discover<br />Our Collection</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
