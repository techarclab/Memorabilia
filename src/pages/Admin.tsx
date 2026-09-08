/* ------------------------------------------------------------------
   The team's side of the site: what came in.

   One job, and it is the one the client cannot do without a developer
   otherwise — read the quote requests as they arrive, move them through
   a status, and export the lot as a CSV procurement can open.

   There is no price editor any more. Memorabilia quotes every order
   against the brief, so there is no published figure for an admin panel
   to correct.
   ------------------------------------------------------------------ */
import { useCallback, useEffect, useState } from "react";

import { Arw, Doc, Info } from "@/lib/icons";
import { getDb, isConfigured } from "@/lib/firebase";
import { useAuth } from "@/store/AuthContext";
import { useStore } from "@/store/StoreContext";

type Status = "new" | "quoted" | "won" | "lost";
const STATUSES: Status[] = ["new", "quoted", "won", "lost"];

interface Row {
  id: string;
  kind: string;
  ref: string;
  status: Status;
  source: string;
  pieces: number;
  createdAt?: { seconds: number };
  contact: Record<string, string>;
  lines: { code: string; name: string; qty: number; colour: string; brand: string }[];
}

/* ---------- sign in ---------- */

function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="pgh">
      <div className="wrap" style={{ maxWidth: 440 }}>
        <div className="shead">
          <span className="eyebrow">Memorabilia</span>
          <h1 className="h2">Team sign in</h1>
        </div>
        <form className="stack" onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true); setErr("");
          try { await signIn(email, pw); }
          catch { setErr("That email and password did not match an account."); }
          finally { setBusy(false); }
        }}>
          <div className="field">
            <label htmlFor="a-em">Email</label>
            <input id="a-em" type="email" value={email} autoComplete="username"
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="a-pw">Password</label>
            <input id="a-pw" type="password" value={pw} autoComplete="current-password"
              onChange={(e) => setPw(e.target.value)} required />
          </div>
          {err && <p className="note" style={{ color: "#b8232f" }}>{err}</p>}
          <button className="btn btn--solid" disabled={busy}>{busy ? "Checking…" : "Sign in"}</button>
          <p className="note">
            Accounts are created in the Firebase console. There is no public sign-up —
            customers never need an account.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ---------- submissions ---------- */

function Submissions() {
  const { say } = useStore();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("all");

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const [{ collection, getDocs, limit, orderBy, query }, db] = await Promise.all([
        import("firebase/firestore"), getDb(),
      ]);
      const grab = async (name: string) => {
        const snap = await getDocs(query(collection(db, name), orderBy("createdAt", "desc"), limit(200)));
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as Row));
      };
      const [e, o] = await Promise.all([grab("enquiries"), grab("orders")]);
      setRows([...e, ...o].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Could not load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  async function setStatus(r: Row, status: Status) {
    const before = r.status;
    // Move the pill immediately, put it back if the write is refused —
    // a status list that lags every click is miserable to work through.
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status } : x)));
    try {
      const [{ doc, updateDoc }, db] = await Promise.all([
        import("firebase/firestore"), getDb(),
      ]);
      await updateDoc(doc(db, r.kind === "order" ? "orders" : "enquiries", r.id), { status });
    } catch {
      setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: before } : x)));
      say("Could not save that status");
    }
  }

  /* A CSV the team can open in Excel — the format procurement actually wants. */
  function exportCsv() {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Reference", "Type", "Status", "Date", "Name", "Company", "Email",
      "Phone", "Occasion", "Budget", "Needed by", "Total pieces", "Items", "Message"];
    const body = shown.map((r) => [
      r.ref, r.kind, r.status,
      r.createdAt ? new Date(r.createdAt.seconds * 1000).toISOString().slice(0, 10) : "",
      r.contact?.name, r.contact?.company, r.contact?.email, r.contact?.phone,
      r.contact?.occasion, r.contact?.budget, r.contact?.needBy,
      r.pieces ?? (r.lines || []).reduce((s2, l) => s2 + l.qty, 0),
      (r.lines || []).map((l) => `${l.code} x${l.qty} (${l.colour})`).join(" | "),
      r.contact?.message,
    ].map(esc).join(","));
    const blob = new Blob(["﻿" + [head.map(esc).join(","), ...body].join("\r\n")],
      { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `memorabilia-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (loading) return <p className="lede">Loading…</p>;
  if (err) {
    return (
      <div className="ok">
        <Info />
        <div>
          <b style={{ color: "var(--t-1)", fontWeight: 700 }}>Could not read the submissions</b>
          <p className="small" style={{ marginTop: 5 }}>
            {err}. If this says permission denied, this account has no document at
            <code> admins/&lt;uid&gt;</code> in Firestore, or the rules have not been deployed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sbar">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {(["all", ...STATUSES] as const).map((s) => (
            <button key={s} className={`pill${filter === s ? " on" : ""}`} onClick={() => setFilter(s)}>
              {s === "all" ? `All ${rows.length}` : `${s} ${rows.filter((r) => r.status === s).length}`}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn--ghost btn--sm" onClick={() => void load()}>Refresh</button>
          <button className="btn btn--sm" onClick={exportCsv} disabled={!shown.length}>Export CSV</button>
        </div>
      </div>

      {!shown.length && (
        <div className="empty">
          <Doc />
          <p>Nothing here yet.</p>
          <p className="small">Enquiries and orders from the site will appear as they arrive.</p>
        </div>
      )}

      {shown.map((r) => (
        <div key={r.id} style={{ borderBottom: "1px solid var(--line-2)", padding: "16px 0" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "baseline", flexWrap: "wrap" }}>
            <span className="mono gold">{r.ref}</span>
            <b style={{ fontWeight: 800 }}>{r.contact?.company}</b>
            <span className="small">{r.contact?.name} · {r.contact?.email}</span>
            <span className="badge-soft">{r.kind}</span>
            <span className="small" style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>
              {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString("en-IN") : "—"}
              {r.pieces ? ` · ${r.pieces.toLocaleString("en-IN")} pieces` : ""}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
            <select className="sel" value={r.status} onChange={(e) => void setStatus(r, e.target.value as Status)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="lnk" onClick={() => setOpen(open === r.id ? null : r.id)}>
              {open === r.id ? "Hide" : "Details"} <Arw />
            </button>
          </div>

          {open === r.id && (
            <div style={{ marginTop: 14, background: "var(--shell)", padding: 18, borderRadius: "var(--r-lg)" }}>
              <table className="spec"><tbody>
                <tr><th>Phone</th><td>{r.contact?.phone || "—"}</td></tr>
                <tr><th>Occasion</th><td>{r.contact?.occasion || "—"}</td></tr>
                <tr><th>Budget</th><td>{r.contact?.budget || "—"}</td></tr>
                <tr><th>Needed by</th><td>{r.contact?.needBy || "—"}</td></tr>
                <tr><th>Came from</th><td>{r.source}</td></tr>
                <tr><th>Message</th><td>{r.contact?.message || "—"}</td></tr>
              </tbody></table>
              {!!r.lines?.length && (
                <ul className="incl" style={{ marginTop: 14 }}>
                  {r.lines.map((l, k) => (
                    <li key={k}>{l.code} · {l.name} · {l.colour} · {l.brand} · {l.qty.toLocaleString("en-IN")} pieces</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

/* ---------- shell ---------- */

export default function Admin() {
  const { user, isAdmin, ready, signOutNow } = useAuth();

  if (!isConfigured) {
    return (
      <div className="pgh"><div className="wrap">
        <div className="ok">
          <Info />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>No Firebase project connected</b>
            <p className="small" style={{ marginTop: 5 }}>
              Copy <code>.env.example</code> to <code>.env</code>, fill in the project's web
              config, and restart the dev server. Setup steps are in the README.
            </p>
          </div>
        </div>
      </div></div>
    );
  }

  if (!ready) return <div className="pgh"><div className="wrap"><p className="lede">Checking…</p></div></div>;
  if (!user) return <SignIn />;

  if (!isAdmin) {
    return (
      <div className="pgh"><div className="wrap">
        <div className="ok">
          <Info />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>This account is not an admin</b>
            <p className="small" style={{ marginTop: 5 }}>
              Signed in as {user.email}. Add a document at <code>admins/{user.uid}</code> in
              Firestore to grant access, then reload.
            </p>
          </div>
        </div>
        <button className="btn btn--sm" style={{ marginTop: 16 }} onClick={() => void signOutNow()}>
          Sign out
        </button>
      </div></div>
    );
  }

  return (
    <div className="pgh">
      <div className="wrap">
        <div className="shead shead--split">
          <div className="stack">
            <span className="eyebrow">Memorabilia</span>
            <h1 className="h2">Quote requests</h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="small">{user.email}</span>
            <button className="btn btn--ghost btn--sm" onClick={() => void signOutNow()}>Sign out</button>
          </div>
        </div>

        <Submissions />
      </div>
      <div style={{ height: "clamp(60px,8vw,110px)" }} />
    </div>
  );
}
