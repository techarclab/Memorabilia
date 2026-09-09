import { Link } from "react-router-dom";
import { giftSets } from "@/data/catalog";

/**
 * Two rows of the catalogue, drifting past in opposite directions.
 *
 * The point is scale. "872 products" is a number a visitor skims; sixty
 * photographs sliding past is the same fact arriving through the eyes.
 * Each row is duplicated once and translated by exactly half its width,
 * which is what makes the loop seamless without any JavaScript.
 *
 * It pauses on hover, so it never fights someone trying to click a set,
 * and it stops entirely under prefers-reduced-motion.
 *
 * The tiles use their own small stills rather than the full product
 * photographs — 32 of those is about 3 MB of decoration. They are also
 * loaded eagerly on purpose: lazy loading does not work inside a
 * transformed, animating track, because the browser cannot tell when a
 * tile will come on screen, and the strip renders as empty boxes.
 */

/* Spread the picks across the catalogue rather than taking the first N,
   so the strip shows the range's variety instead of one shelf of it. */
const pick = (offset: number, n: number) => {
  const step = Math.max(1, Math.floor(giftSets.length / n));
  return Array.from({ length: n }, (_, i) => giftSets[(offset + i * step) % giftSets.length]);
};

const ROWS = [pick(0, 16), pick(7, 16)];

export default function Marquee() {
  return (
    <section className="mq" aria-label="A sample of the catalogue">
      {ROWS.map((row, r) => (
        <div className={`mq__row${r ? " mq__row--rev" : ""}`} key={r}>
          <div className="mq__track">
            {[...row, ...row].map((p, i) => (
              <Link key={`${p.slug}-${i}`} to={`/product/${p.slug}`} className="mq__i"
                aria-hidden={i >= row.length} tabIndex={i >= row.length ? -1 : undefined}>
                <img src={`/assets/img/thumb/${p.slug}.webp`}
                  alt={i < row.length ? `${p.name} — ${p.code}` : ""}
                  width={210} height={164} decoding="async" />
                <span className="mq__c mono">{p.code}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
