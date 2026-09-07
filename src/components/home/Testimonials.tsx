import { useCallback, useEffect, useRef, useState } from "react";
import { Arw, ArwL } from "@/lib/icons";

/* Sample copy. Roles and industries only — nothing here is attributed to a
   real company, and it must be replaced with quotes Memorabilia has permission
   to publish before this site goes live. */
const QUOTES = [
  ["We sent 640 sets across eleven cities for Diwali. Every box arrived on the same day, every logo was identical, and nothing was damaged. That is the whole job, done properly.",
    "Head of Employee Experience", "IT services · Bengaluru", "640 sets · Diwali"],
  ["We picked one cover design and bought it as a two-piece for the wider team and a five-piece for the leadership. Same look, three budgets, one purchase order.",
    "Procurement Manager", "Pharma · Hyderabad", "1,200 sets · Annual"],
  ["The mock-up came back the same afternoon and the foil sat exactly where we asked. Working with a supplier who reads the brief is rarer than it should be.",
    "Brand Manager", "Manufacturing · Pune", "250 sets · Conference"],
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(false);
  const timer = useRef<number>();

  const go = useCallback((n: number) => {
    setFade(true);
    window.setTimeout(() => { setI(((n % QUOTES.length) + QUOTES.length) % QUOTES.length); setFade(false); }, 160);
  }, []);

  const restart = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setI((n) => (n + 1) % QUOTES.length), 7000);
  }, []);

  useEffect(() => { restart(); return () => window.clearInterval(timer.current); }, [restart]);

  const q = QUOTES[i];

  return (
    <section className="section quotes">
      <div className="wrap">
        <div className="shead center rv">
          <span className="eyebrow center">What our clients say</span>
          <h2 className="h2 split">Partnerships That Matter</h2>
        </div>
        <div className="qcar">
          <button className="rbtn" onClick={() => { go(i - 1); restart(); }} aria-label="Previous testimonial">
            <ArwL />
          </button>
          <figure className="qcard" style={{ opacity: fade ? 0 : 1, transition: "opacity .3s var(--ease-soft)" }}>
            <span className="qcard__m">&ldquo;</span>
            <p>{q[0]}</p>
            <figcaption className="qcard__by">
              <span><b>{q[1]}</b><span>{q[2]}</span></span>
              <span className="qcard__co">{q[3]}</span>
            </figcaption>
          </figure>
          <button className="rbtn" onClick={() => { go(i + 1); restart(); }} aria-label="Next testimonial">
            <Arw />
          </button>
        </div>
        <div className="qdots">
          {QUOTES.map((_, k) => (
            <i key={k} className={k === i ? "on" : undefined} onClick={() => { go(k); restart(); }} />
          ))}
        </div>
        <p className="small center" style={{ marginTop: 16 }}>
          Sample copy — replace with real, attributable client quotes before launch.
        </p>
      </div>
    </section>
  );
}
