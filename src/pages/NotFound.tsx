import { Link } from "react-router-dom";
import { Doc } from "@/lib/icons";

export default function NotFound() {
  return (
    <div className="pgh">
      <div className="wrap">
        <div className="empty" style={{ padding: "clamp(60px,12vw,140px) 10px" }}>
          <Doc />
          <h1 className="h1">That page is not in the catalogue.</h1>
          <p className="lede" style={{ maxWidth: "44ch", marginInline: "auto" }}>
            The link may be from an older line sheet. Everything currently in stock is on the
            catalogue page.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>
            <Link to="/collections" className="btn btn--solid">Browse the catalogue</Link>
            <Link to="/contact" className="btn">Ask us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
