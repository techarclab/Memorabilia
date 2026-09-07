import { Link } from "react-router-dom";
import { giftSets, piecesMeta } from "@/data/catalog";

/**
 * The one table that explains the whole range: four lines down the side,
 * four piece counts across, and every cell a live count that filters the
 * catalogue. It is the fastest way for a buyer to see what exists.
 */
const ROWS: [string, string, boolean][] = [
  ["Standard", "standard", false],
  ["Standard + flask", "standard", true],
  ["Premium", "premium", false],
  ["Premium + flask", "premium", true],
];
const COLS = [2, 3, 4, 5];

export default function RangeMatrix() {
  return (
    <div className="mtx rv" style={{ marginBottom: "clamp(28px,3.4vw,44px)" }}>
      <div className="mtx__scroll">
        <table className="mtx__t">
          <thead>
            <tr>
              <th />
              {COLS.map((c) => (
                <th key={c}><b>{c}-in-1</b><span>{piecesMeta[c].items}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, series, flask]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {COLS.map((c) => {
                  const n = giftSets.filter(
                    (p) => p.pieces === c && p.series === series && p.flask === flask).length;
                  if (!n) return <td className="mtx__x" key={c}>—</td>;
                  return (
                    <td key={c}>
                      <Link className="mtx__c"
                        to={`/collections?pieces=${c}&series=${series}&flask=${flask ? 1 : 0}`}>
                        <b>{n}</b><span>sets</span>
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
