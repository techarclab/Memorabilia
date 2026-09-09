import { Link } from "react-router-dom";
import QuoteForm from "@/components/QuoteForm";
import { usePageMotion } from "@/hooks/useMotion";

const CHANNELS: [string, string, string, string][] = [
  ["Call", "+91 90000 00000", "Mon–Sat · 10am – 7pm IST", "tel:+919000000000"],
  ["Email", "hello@memorabiliagifting.com", "Briefs, artwork and quote requests", "mailto:hello@memorabiliagifting.com"],
  ["Samples", "samples@memorabiliagifting.com", "Branded sample sets, despatched in 3–4 days", "mailto:samples@memorabiliagifting.com"],
];

export default function Contact() {
  usePageMotion("contact");
  return (
    <div className="pgh">
      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link><span>/</span><span className="gold">Contact</span></div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>
          <div className="stack rv rv-l">
            <span className="eyebrow">Talk to us</span>
            <h1 className="h1">Start a<br />conversation</h1>
            <p className="lede">
              Tell us about your celebration, event or gifting idea. We can help with one special gift
              or hundreds of return gifts, and answer within a working day.
            </p>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 0, marginTop: 14 }}>
              {CHANNELS.map(([label, value, note, href]) => (
                <a href={href} key={label}
                  style={{ display: "block", padding: "22px 0", borderBottom: "1px solid var(--line-2)" }}>
                  <span className="small" style={{ letterSpacing: ".2em", textTransform: "uppercase" }}>{label}</span>
                  <p className="h3 gold" style={{ margin: "6px 0 4px" }}>{value}</p>
                  <span className="small">{note}</span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: 26, border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 26 }}>
              <h4 style={{ color: "var(--t-1)", marginBottom: 8 }}>Gifts for Every Occasion</h4>
              <p style={{ color: "var(--t-2)", fontSize: ".9rem", lineHeight: 1.8 }}>
                Memorabilia — Premium Gifting Solutions<br />Pan-India despatch · GST invoicing<br />
                Personal, event and bulk gifting support
              </p>
            </div>
          </div>

          <div className="rv rv-r">
            <div style={{
              border: "1px solid var(--line)", borderRadius: "var(--r-lg)",
              padding: "clamp(24px,3.4vw,42px)", background: "var(--shell)",
            }}>
              <h2 className="h3" style={{ marginBottom: 22 }}>Send an enquiry</h2>
              <QuoteForm id="cForm" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "clamp(60px,8vw,110px)" }} />
    </div>
  );
}
