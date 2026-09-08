import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Info } from "@/lib/icons";
import { useStore } from "@/store/StoreContext";
import { NotConfigured, submit, type Kind } from "@/lib/db";
import type { BasketLine } from "@/types";

const OCCASIONS = ["Diwali / Festive", "Employee onboarding", "Client appreciation",
  "Conference / event", "Milestone or award", "Dealer / channel", "Other"];
const BUDGETS = ["Under ₹800", "₹800 – ₹1,200", "₹1,200 – ₹1,600", "₹1,600 – ₹2,500",
  "Above ₹2,500", "Not decided"];

type State =
  | { t: "idle" }
  | { t: "sending" }
  | { t: "sent"; ref: string }
  | { t: "unsaved" }                    // no backend configured yet
  | { t: "failed"; message: string };

export default function QuoteForm({
  id, kind = "enquiry", source, lines = [], onSent,
}: {
  id: string;
  kind?: Kind;
  source?: string;
  lines?: BasketLine[];
  onSent?: () => void;
}) {
  const { say } = useStore();
  const [state, setState] = useState<State>({ t: "idle" });
  const [f, setF] = useState({ name: "", co: "", em: "", ph: "", qty: "", occ: OCCASIONS[0],
    bud: BUDGETS[0], date: "", msg: "" });

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.co.trim() || !/\S+@\S+\.\S+/.test(f.em)) {
      say("Please complete name, company and a valid work email");
      return;
    }

    setState({ t: "sending" });
    const contact = {
      name: f.name, company: f.co, email: f.em, phone: f.ph, qty: f.qty,
      occasion: f.occ, budget: f.bud, needBy: f.date, message: f.msg,
    };

    try {
      const ref = await submit(kind, source || id, contact, lines);
      setState({ t: "sent", ref });
      onSent?.();
    } catch (err) {
      if (err instanceof NotConfigured) {
        // Say so plainly rather than showing a confirmation for something
        // that was never sent — a buyer who thinks they have enquired and
        // hears nothing back is worse off than one who knows to call.
        setState({ t: "unsaved" });
        return;
      }
      setState({
        t: "failed",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  const busy = state.t === "sending";
  const done = state.t === "sent" || state.t === "unsaved";

  return (
    <form className="stack rv" id={id} onSubmit={onSubmit} noValidate>
      <div className="frow">
        <div className="field">
          <label htmlFor={`${id}-name`}>Your name</label>
          <input id={`${id}-name`} value={f.name} onChange={set("name")} placeholder="Full name" required />
        </div>
        <div className="field">
          <label htmlFor={`${id}-co`}>Company</label>
          <input id={`${id}-co`} value={f.co} onChange={set("co")} placeholder="Organisation" required />
        </div>
      </div>
      <div className="frow">
        <div className="field">
          <label htmlFor={`${id}-em`}>Work email</label>
          <input id={`${id}-em`} type="email" value={f.em} onChange={set("em")} placeholder="name@company.com" required />
        </div>
        <div className="field">
          <label htmlFor={`${id}-ph`}>Phone</label>
          <input id={`${id}-ph`} value={f.ph} onChange={set("ph")} placeholder="+91" />
        </div>
      </div>
      <div className="frow">
        <div className="field">
          <label htmlFor={`${id}-qty`}>Quantity</label>
          <input id={`${id}-qty`} type="number" min={25} value={f.qty} onChange={set("qty")} placeholder="e.g. 250" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-occ`}>Occasion</label>
          <select id={`${id}-occ`} value={f.occ} onChange={set("occ")}>
            {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="frow">
        <div className="field">
          <label htmlFor={`${id}-bud`}>Budget per set</label>
          <select id={`${id}-bud`} value={f.bud} onChange={set("bud")}>
            {BUDGETS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-date`}>Needed by</label>
          <input id={`${id}-date`} type="date" value={f.date} onChange={set("date")} />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-msg`}>Anything else</label>
        <textarea id={`${id}-msg`} value={f.msg} onChange={set("msg")}
          placeholder="Sets you are considering, branding requirements, delivery locations…" />
      </div>

      {state.t === "sent" && (
        <div className="ok">
          <Check />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>
              {kind === "order" ? "Order received." : "Enquiry received."} Reference {state.ref}
            </b>
            <p className="small" style={{ marginTop: 5 }}>
              Quote that reference if you call. A member of the gifting team will respond
              within one working day{kind === "order" ? " to confirm stock and invoice you." : " with pricing and three shortlisted sets."}
            </p>
          </div>
        </div>
      )}

      {state.t === "unsaved" && (
        <div className="ok">
          <Info />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>Not sent — no backend connected yet</b>
            <p className="small" style={{ marginTop: 5 }}>
              This build has no Firebase project configured, so nothing was saved. Add the
              project's keys to <code>.env</code> and this form will start recording enquiries.
              In the meantime, email hello@memorabiliagifting.com.
            </p>
          </div>
        </div>
      )}

      {state.t === "failed" && (
        <div className="ok" style={{ borderColor: "rgba(184,35,47,.35)" }}>
          <Info />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>That did not send</b>
            <p className="small" style={{ marginTop: 5 }}>
              {state.message}. Please try again, or email hello@memorabiliagifting.com and
              we will pick it up from there.
            </p>
          </div>
        </div>
      )}

      <button className="btn btn--solid btn--lg" type="submit" disabled={busy || done}>
        {busy ? "Sending…" : done ? "Sent" : kind === "order" ? "Place Order Request" : "Send Enquiry"}
      </button>
    </form>
  );
}
