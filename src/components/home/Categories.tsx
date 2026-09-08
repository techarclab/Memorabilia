import { useState } from "react";
import { Link } from "react-router-dom";
import { Arw } from "@/lib/icons";
import { useReveal } from "@/hooks/useMotion";
import { catGroups } from "@/data/categories";
import { giftSets } from "@/data/catalog";

/**
 * The category explorer.
 *
 * Four ways into the same 355 sets, because four different people arrive
 * with four different first questions — how big, which line, what is in
 * it, how does it read. Switching a tab is instant and changes nothing
 * else on the page, so it costs a visitor nothing to look.
 *
 * Every count is computed from the catalogue at build time, and every
 * tile links to the exact filter it names.
 */
export default function Categories() {
  const [tab, setTab] = useState(catGroups[0].id);
  const group = catGroups.find((g) => g.id === tab) || catGroups[0];

  /* The tiles are keyed on the group, so switching a tab remounts them
     hidden and this re-arms the observer — which lands them exactly the
     way they land on first scroll, staggered, rather than snapping in. */
  useReveal(tab);

  return (
    <section className="section">
      <div className="wrap">
        <div className="shead shead--split rv">
          <div className="stack">
            <span className="eyebrow">Explore</span>
            <h2 className="h2 split">Browse by category</h2>
          </div>
          <div className="shead__nav">
            <Link to="/collections" className="lnk">See all {giftSets.length} sets <Arw /></Link>
          </div>
        </div>

        <div className="catx">
          <div className="catx__tabs" role="tablist" aria-label="Category view">
            {catGroups.map((g) => (
              <button key={g.id} role="tab" aria-selected={g.id === tab}
                className={`catx__tab${g.id === tab ? " on" : ""}`}
                onClick={() => setTab(g.id)}>
                {g.label}
              </button>
            ))}
          </div>

          <p className="catx__note">{group.note}</p>

          <div className="cats" key={group.id}>
            {group.cats.map((c, i) => (
              <Link className={`cat rv rv-d${(i % 4) + 1}`} to={c.href} key={c.label}>
                <span className="cat__img">
                  <img src={c.img} alt="" loading="lazy" decoding="async" />
                  <em className="cat__n">{c.count}</em>
                </span>
                <span className="cat__b">
                  <span>
                    <b>{c.label}</b>
                    <span>{c.note}</span>
                  </span>
                  <span className="rbtn rbtn--sm"><Arw /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
