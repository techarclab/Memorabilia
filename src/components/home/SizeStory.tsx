import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Arw } from "@/lib/icons";
import { families, giftSets, piecesMeta } from "@/data/catalog";
import { useScrollScene } from "@/hooks/useMotion";

/**
 * The range's whole proposition, told by scrolling.
 *
 * Every cover design is made as a two, three, four and five piece set. It
 * is the single most useful thing for a buyer to understand — pick the
 * look once, then pick the budget per head — and a paragraph never quite
 * lands it. Scrolling through the same design growing a piece at a time
 * does, because the photograph changes and the cover does not.
 *
 * The motion is the argument, not decoration. With reduced motion on, and
 * on narrow screens where nothing is pinned, the steps are buttons and the
 * section reads as a normal split feature that you tap through — the same
 * story, told at the reader's pace instead of the scroll's.
 */

/* One design that genuinely runs across every size. Picked from the data
   rather than typed, so a catalogue change cannot leave this pointing at
   a set that no longer exists. */
const STORY = (() => {
  const named = Object.entries(families).find(([, list]) => {
    const sizes = new Set(list.map((p) => p.pieces));
    return [2, 3, 4, 5].every((n) => sizes.has(n));
  });
  const list = named?.[1] ?? giftSets;
  return {
    name: named?.[0] ?? giftSets[0].name,
    steps: [2, 3, 4, 5].map((n) => {
      const p = list.find((x) => x.pieces === n && x.flask) ||
                list.find((x) => x.pieces === n) || giftSets[0];
      return { n, p };
    }),
  };
})();

const ADDS = [
  "A ruled A5 notebook and a weighted metal pen. A thoughtful choice for guests and everyday milestones.",
  "A metal keychain joins it — the piece that stays in a pocket long after the notebook is full.",
  "A card holder makes it four — a generous gift for an event, family celebration or special thank-you.",
  "The vacuum flask completes it. The five-piece makes a memorable gesture for the biggest occasions.",
];

export default function SizeStory() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const step = useCallback((n: number) => setI(n), []);
  useScrollScene(ref, STORY.steps.length, step);

  const cur = STORY.steps[i];
  const label = useMemo(() => piecesMeta[cur.n]?.label ?? `${cur.n}-in-1`, [cur.n]);

  return (
    <section className="story" ref={ref} data-tone="Tan">
      <div className="story__pin">
        <div className="wrap story__in">
          <div className="story__copy">
            <span className="eyebrow">One design, every size</span>
            <h2 className="h1">
              Choose the look first.<br />
              <span className="accent">Then the budget.</span>
            </h2>
            <p className="lede">
              {STORY.name} is made as a two, three, four and five piece set. The cover does not
              change — only what sits beside it. So one design can suit every guest list, at four
              different budgets.
            </p>

            <ol className="story__steps">
              {STORY.steps.map((s, k) => (
                <li key={s.n} className={k === i ? "on" : k < i ? "done" : undefined}>
                  <button type="button" onClick={() => setI(k)} aria-current={k === i}>
                    <span className="story__no">{s.n}</span>
                    <span>
                      <b>{piecesMeta[s.n]?.label ?? `${s.n}-in-1`}</b>
                      <em>{piecesMeta[s.n]?.items}</em>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <p className="story__note">{ADDS[i]}</p>

            <Link to={`/collections?design=${encodeURIComponent(STORY.name)}`} className="btn btn--solid">
              See {STORY.name} in every size <Arw />
            </Link>
          </div>

          <div className="story__art">
            <span className="story__glow" aria-hidden="true" />
            <div className="story__frame">
              {STORY.steps.map((s, k) => (
                <img key={s.n} src={s.p.img} alt={`${STORY.name} as a ${s.n}-piece set`}
                  className={k === i ? "on" : undefined}
                  loading={k === 0 ? "eager" : "lazy"} decoding="async" />
              ))}
              <span className="story__tag">
                <b>{label}</b>
                <span className="mono">{cur.p.code}</span>
              </span>
            </div>
            <div className="story__rail" aria-hidden="true">
              {STORY.steps.map((s, k) => (
                <i key={s.n} className={k <= i ? "on" : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
