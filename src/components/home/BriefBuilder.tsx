import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Arw } from "@/lib/icons";
import { giftSets, piecesMeta, seriesMeta } from "@/data/catalog";
import type { Product, Series } from "@/types";

/**
 * Four questions, and a real answer.
 *
 * A procurement lead arrives already knowing roughly how many people, what
 * should be in the box, how it should feel, and whether a flask is wanted.
 * This asks exactly those and answers from the catalogue itself: the count is a live filter
 * over the 355 sets, and the three thumbnails are the sets it found. The
 * button then opens the catalogue already filtered, so nothing has to be
 * chosen twice.
 *
 * The headcount does not filter anything, because it does not change which
 * sets exist — it changes what we can quote. So it is used honestly: to
 * say whether the run clears the 25-piece minimum, and to carry the number
 * into the enquiry form.
 */

const HEADS: [string, number][] = [
  ["1 – 25", 25], ["25 – 100", 100], ["100 – 500", 500], ["500+", 1000],
];

const BOXES: [string, number][] = [
  ["Notebook + pen", 2],
  ["Add a keychain", 3],
  ["Add a card holder", 4],
  ["The full kit", 5],
];

const FEELS: [string, Series | "any"][] = [
  ["Any", "any"], ["Everyday", "standard"], ["Premium", "premium"], ["Flagship", "luxury"],
];

export default function BriefBuilder() {
  const [head, setHead] = useState(1);
  const [box, setBox] = useState(2);
  const [feel, setFeel] = useState(0);
  const [flask, setFlask] = useState<boolean | null>(null);

  const pieces = BOXES[box][1];
  const series = FEELS[feel][1];
  const qty = HEADS[head][1];

  const matches = useMemo(() => giftSets.filter((p: Product) => {
    if (p.pieces !== pieces) return false;
    if (series !== "any" && p.series !== series) return false;
    if (flask !== null && p.flask !== flask) return false;
    return true;
  }), [pieces, series, flask]);

  const shots = useMemo(
    () => matches.slice().sort((a, b) => b.tags.length - a.tags.length).slice(0, 3),
    [matches]);

  const href = useMemo(() => {
    const q = new URLSearchParams({ pieces: String(pieces) });
    if (series !== "any") q.set("series", series);
    if (flask !== null) q.set("flask", flask ? "1" : "0");
    return `/collections?${q}`;
  }, [pieces, series, flask]);

  return (
    <section className="section brief" data-tone="Green">
      <div className="wrap">
        <div className="shead rv" style={{ marginBottom: "clamp(22px,2.8vw,34px)" }}>
          <span className="eyebrow">Start here</span>
          <h2 className="h2 split">Four questions, then the catalogue</h2>
          <p className="lede">
            Answer the way you would across a desk. The number updates as you go — it is a live
            count of the sets that actually fit, not a promise.
          </p>
        </div>

        <div className="brief__in rv">
          <div className="brief__qs">
            <div className="brief__q">
              <span className="brief__lab">How many gifts do you need?</span>
              <div className="brief__opts">
                {HEADS.map(([label], k) => (
                  <button key={label} className={`bpick${k === head ? " on" : ""}`}
                    onClick={() => setHead(k)} aria-pressed={k === head}>{label}</button>
                ))}
              </div>
            </div>

            <div className="brief__q">
              <span className="brief__lab">What is in the box?</span>
              <div className="brief__opts">
                {BOXES.map(([label], k) => (
                  <button key={label} className={`bpick${k === box ? " on" : ""}`}
                    onClick={() => setBox(k)} aria-pressed={k === box}>{label}</button>
                ))}
              </div>
            </div>

            <div className="brief__q">
              <span className="brief__lab">How should it feel?</span>
              <div className="brief__opts">
                {FEELS.map(([label], k) => (
                  <button key={label} className={`bpick${k === feel ? " on" : ""}`}
                    onClick={() => setFeel(k)} aria-pressed={k === feel}>{label}</button>
                ))}
              </div>
            </div>

            <div className="brief__q">
              <span className="brief__lab">Include a flask or bottle?</span>
              <div className="brief__opts">
                {([[null, "Either"], [true, "Yes"], [false, "No"]] as [boolean | null, string][])
                  .map(([v, label]) => (
                    <button key={label} className={`bpick${v === flask ? " on" : ""}`}
                      onClick={() => setFlask(v)} aria-pressed={v === flask}>{label}</button>
                  ))}
              </div>
            </div>
          </div>

          <aside className="brief__out">
            <span className="brief__n" key={matches.length}>{matches.length}</span>
            <b>
              {matches.length === 1 ? "set fits that brief" : "sets fit that brief"}
            </b>
            <p className="small">
              {piecesMeta[pieces]?.label} ·{" "}
              {series === "any" ? "any range" : seriesMeta[series as Series].name} ·{" "}
              {flask === null ? "flask optional" : flask ? "with a flask" : "no flask"}
            </p>

            {shots.length > 0 && (
              <div className="brief__shots">
                {shots.map((p) => (
                  <Link key={p.slug} to={`/product/${p.slug}`} title={`${p.name} · ${p.code}`}>
                    <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
                  </Link>
                ))}
              </div>
            )}

            <p className="brief__moq">
              {qty >= 25
                ? `At ${qty.toLocaleString("en-IN")} gifts, personalisation and event quantities are both open to you.`
                : `At ${qty.toLocaleString("en-IN")} gifts, tell us the occasion and we will suggest the best options.`}
            </p>

            <Link to={href} className="btn btn--solid btn--block">
              Show me the {matches.length} <Arw />
            </Link>
            <Link to={`/bulk-gifting?qty=${qty}`} className="btn btn--block" style={{ marginTop: 10 }}>
              Or send the brief and let us pick
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
