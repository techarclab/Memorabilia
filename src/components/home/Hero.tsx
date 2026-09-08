import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Arw, Layers, Play, Shield, Tag2, Truck } from "@/lib/icons";
import { bySlug, colourHex, products } from "@/data/catalog";
import { money } from "@/lib/utils";
import { reduced, setTone } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

/* Six real SKUs, one per finish. The whole page tints to whichever is up. */
const PICKS: [string, string][] = [
  ["JPP-B5001", "Blue"], ["JPP-B4034", "Red"], ["JPP-4047", "Cream"],
  ["JPP-B5027", "MDF"], ["JPP-B5005", "Black"], ["JPP-3041", "Green"],
];

export const heroSlides = PICKS.map(([slug, colour]) => {
  const p = bySlug(slug) || products[0];
  return { slug: p.slug, img: p.img, code: p.code, name: p.name, price: money(p.mrp), colour };
});

const TRUST = [
  [Shield, "Premium Quality"], [Tag2, "Custom Branding"],
  [Layers, "Bulk Order Support"], [Truck, "Pan-India Delivery"],
] as const;

const DURATION = 4600;

export default function Hero() {
  const { say } = useStore();
  const [i, setI] = useState(0);
  const art = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const paused = useRef(false);
  const t0 = useRef(0);

  useEffect(() => { setTone(heroSlides[i].colour); }, [i]);

  /* One rAF loop drives both the progress bar and the auto-advance, so the
     bar can never drift out of step with the image. */
  useEffect(() => {
    if (reduced()) return;
    let id = 0;
    t0.current = performance.now();
    const loop = (ts: number) => {
      if (!paused.current) {
        const p = Math.min(1, (ts - t0.current) / DURATION);
        if (bar.current) bar.current.style.width = `${p * 100}%`;
        if (p >= 1) { t0.current = ts; setI((n) => (n + 1) % heroSlides.length); }
      } else {
        t0.current = ts;
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
      el.querySelectorAll("img").forEach((im) => {
        (im as HTMLImageElement).style.objectPosition = `50% ${(44 + p * 7).toFixed(1)}%`;
      });
    };
    const h = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; run(); }); } };
    addEventListener("scroll", h, { passive: true });
    run();
    return () => removeEventListener("scroll", h);
  }, []);

  const slide = heroSlides[i];

  return (
    <section className="hero">
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
        </div>

        <div className="hero__art" ref={art}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}>
          {/* The line-sheet page carries its own code badge and colour strip, so
              the caption and the swatch control sit under it rather than on top. */}
          <div className="hero__frame">
            {heroSlides.map((h, k) => (
              <img key={h.slug} src={h.img} alt={`${h.name} gift set in ${h.colour}`}
                className={k === i ? "on" : undefined} />
            ))}
          </div>
          <div className="hero__meta">
            <div className="hero__tag">
              <span className="mono">{slide.code}</span>
              <b>{slide.name}</b>
              <span className="small">{slide.colour} · from {slide.price}</span>
            </div>
            <div className="hswatch">
              {heroSlides.map((h, k) => (
                <button key={h.slug} className={k === i ? "on" : undefined}
                  style={{ background: colourHex[h.colour] || "#888" }} aria-label={h.colour}
                  onClick={() => { setI(k); t0.current = performance.now(); }} />
              ))}
              <span className="hswatch__bar"><i ref={bar} /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
