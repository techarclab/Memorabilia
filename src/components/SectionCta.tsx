import { Link } from "react-router-dom";

export default function SectionCta({ title, body }: { title: string; body: string }) {
  return (
    <section className="cta section spot">
      <div className="wrap cta__in stack rv" style={{ maxWidth: 760, textAlign: "center", justifyItems: "center" }}>
        <span className="eyebrow center">Next step</span>
        <h2 className="h1">{title}</h2>
        <p className="lede center" style={{ marginInline: "auto" }}>{body}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
          <span className="mag"><Link to="/contact" className="btn btn--solid btn--lg">Request a sample</Link></span>
          <span className="mag"><Link to="/bulk-gifting" className="btn btn--lg">Bulk enquiry</Link></span>
        </div>
      </div>
    </section>
  );
}
