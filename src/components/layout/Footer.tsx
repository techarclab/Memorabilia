import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/lib/icons";
import { useStore } from "@/store/StoreContext";

export default function Footer() {
  const { say } = useStore();
  const [email, setEmail] = useState("");

  function subscribe() {
    if (/\S+@\S+\.\S+/.test(email)) { say(`Line sheet on its way to ${email}`); setEmail(""); }
    else say("Please enter a valid work email");
  }

  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__grid">
          <div>
            <Link className="logo" to="/">
              <Logo />
              <span className="logo__txt">
                <span className="logo__name">Memorabilia</span>
                <span className="logo__sub">Corporate Gifting</span>
              </span>
            </Link>
            <p className="lede" style={{ marginTop: 20, fontSize: ".9rem" }}>
              Corporate gift sets built around one idea — that the box a gift arrives in is part of the
              gift. Curated, branded and delivered across India.
            </p>
            <div className="subs">
              <input type="email" placeholder="Work email" aria-label="Work email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()} />
              <button className="btn btn--sm" onClick={subscribe}>Catalogue</button>
            </div>
            <p className="small" style={{ marginTop: 10 }}>Get the current line sheet with trade pricing.</p>
          </div>

          <div>
            <h5>Collections</h5>
            <ul>
              <li><Link to="/collections?pieces=3&flask=1">3-in-1 Combo Sets</Link></li>
              <li><Link to="/collections?pieces=4&flask=1">4-in-1 Combo Sets</Link></li>
              <li><Link to="/collections?tag=bestseller">Bestsellers</Link></li>
              <li><Link to="/collections?tag=new">New Arrivals</Link></li>
              <li><Link to="/collections?tag=sustainable">Bamboo &amp; Sustainable</Link></li>
            </ul>
          </div>

          <div>
            <h5>Services</h5>
            <ul>
              <li><Link to="/bulk-gifting">Bulk Ordering</Link></li>
              <li><Link to="/bulk-gifting">Logo Branding</Link></li>
              <li><Link to="/bulk-gifting">Lead Times</Link></li>
              <li><Link to="/bulk-gifting">Multi-address Despatch</Link></li>
              <li><Link to="/contact">Request a Sample</Link></li>
            </ul>
          </div>

          <div>
            <h5>Enquiries</h5>
            <p style={{ fontSize: ".9rem", color: "var(--t-2)", lineHeight: 1.9 }}>
              Mon–Sat, 10am – 7pm IST<br />
              <a href="tel:+919000000000" className="gold">+91 90000 00000</a><br />
              <a href="mailto:hello@memorabiliagifting.com" className="gold">hello@memorabiliagifting.com</a>
            </p>
            <p className="small" style={{ marginTop: 18, lineHeight: 1.8 }}>
              Corporate Gifting Division<br />India — pan-India despatch
            </p>
          </div>
        </div>

        <div className="ftr__bot">
          <span>© {new Date().getFullYear()} Memorabilia Premium Gifting Solutions. All rights reserved.</span>
          <span>Prototype build — pricing indicative</span>
        </div>
      </div>
    </footer>
  );
}
