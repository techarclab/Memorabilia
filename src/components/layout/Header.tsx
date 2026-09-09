import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Cart, Logo, Search, Shield } from "@/lib/icons";
import { useStore } from "@/store/StoreContext";
import { cn } from "@/lib/utils";

const NAV: [string, string][] = [
  ["/collections", "Gift Sets"],
  ["/ranges", "Products"],
  ["/bulk-gifting", "Events & Custom Gifts"],
  ["/about", "Our Story"],
  ["/contact", "Contact"],
];

function Badge({ n }: { n: number }) {
  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (!n) return;
    setPop(false);
    const t = window.setTimeout(() => setPop(true), 10);
    return () => window.clearTimeout(t);
  }, [n]);
  return <span className={cn("badge", n > 0 && "on", pop && "pop")}>{n > 99 ? "99+" : n}</span>;
}

export default function Header() {
  const { count, setOpen } = useStore();
  const [menu, setMenu] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  /* Three nav items point at /collections with different filters, so the
     current one is decided by path *and* query — not by path alone. */
  const here = loc.pathname + (loc.search || "");
  const current = NAV.map(([to]) => to).find(
    (to) => to === here || (to !== "/" && loc.pathname.startsWith(to + "/")));

  useEffect(() => { setMenu(false); }, [loc.pathname, loc.search]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  /* The search icon focuses the catalogue's own search field when we are
     already there, and otherwise takes you to the catalogue. */
  function search() {
    const box = document.getElementById("fSearch") as HTMLInputElement | null;
    if (box) { box.scrollIntoView({ block: "center", behavior: "smooth" }); box.focus(); }
    else nav("/collections");
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar__in">
          <span className="topbar__l"><Shield /><span>Thoughtful gifting for every occasion</span></span>
          <span className="topbar__r">
            <Link to="/bulk-gifting">Events &amp; Bulk Gifts</Link><i />
            <span>Pan-India Delivery</span><i />
            <Link to="/contact">Gifting Support</Link>
          </span>
        </div>
      </div>

      <header className="hdr" id="hdr">
        <div className="hdr__in">
          <Link className="logo" to="/" aria-label="Memorabilia home">
            <Logo />
            <span className="logo__txt">
              <span className="logo__name">Memorabilia</span>
              <span className="logo__sub">Gifts for Every Occasion</span>
            </span>
          </Link>

          <nav className="nav">
            {NAV.map(([to, label]) => (
              <Link key={label} to={to} aria-current={current === to ? "page" : undefined}>{label}</Link>
            ))}
          </nav>

          <div className="hdr__act">
            <button className="icobtn" onClick={search} aria-label="Search the catalogue"><Search /></button>
            {/* One list, not two. Nothing is bought here, so a cart and a
                separate enquiry list were the same thing wearing two icons. */}
            <button className="icobtn" onClick={() => setOpen(true)} aria-label="Open your quote list">
              <Cart /><Badge n={count} />
            </button>
            <Link to="/bulk-gifting" className="btn btn--solid btn--sm hdr__cta">Get a Quote</Link>
            <button className={cn("burger", menu && "on")} onClick={() => setMenu((m) => !m)}
              aria-label="Menu" aria-expanded={menu}><span /></button>
          </div>
        </div>
      </header>

      <nav className={cn("mmenu", menu && "on")}>
        {NAV.map(([to, label]) => <Link key={label} to={to}>{label}</Link>)}
        <Link to="/bulk-gifting" className="btn btn--solid">Get a Quote</Link>
      </nav>
    </>
  );
}
