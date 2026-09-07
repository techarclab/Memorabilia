import { useState } from "react";
import type { FormEvent } from "react";
import { Check } from "@/lib/icons";
import { useStore } from "@/store/StoreContext";

const OCCASIONS = ["Diwali / Festive", "Employee onboarding", "Client appreciation",
  "Conference / event", "Milestone or award", "Dealer / channel", "Other"];
const BUDGETS = ["Under ₹800", "₹800 – ₹1,200", "₹1,200 – ₹1,600", "₹1,600 – ₹2,500",
  "Above ₹2,500", "Not decided"];

export default function QuoteForm({ id }: { id: string }) {
  const { say } = useStore();
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", co: "", em: "", ph: "", qty: "", occ: OCCASIONS[0],
    bud: BUDGETS[0], date: "", msg: "" });

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.co.trim() || !/\S+@\S+\.\S+/.test(f.em)) {
      say("Please complete name, company and a valid work email");
      return;
    }
    setSent(true);
  }

  return (
    <form className="stack rv" id={id} onSubmit={submit} noValidate>
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

      {sent && (
        <div className="ok">
          <Check />
          <div>
            <b style={{ color: "var(--t-1)", fontWeight: 700 }}>Enquiry received.</b>
            <p className="small" style={{ marginTop: 5 }}>
              A member of the gifting team will respond within one working day with pricing and three
              shortlisted sets.
            </p>
          </div>
        </div>
      )}

      <button className="btn btn--solid btn--lg" type="submit" disabled={sent}>
        {sent ? "Sent" : "Send Enquiry"}
      </button>
      <p className="note">This prototype does not transmit data. On the live site this posts to your CRM or inbox.</p>
    </form>
  );
}
