import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import QuoteDrawer from "@/components/QuoteDrawer";
import QuickView from "@/components/QuickView";
import Toast from "@/components/Toast";
import { useHeaderBehaviour } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

export default function Layout() {
  const loc = useLocation();
  const { open, quickView } = useStore();
  useHeaderBehaviour(open || quickView !== null);

  /* A new page starts at the top, the way a page load would — but only a new
     page. Filtering the catalogue rewrites the query string, and scrolling
     the reader back to the header every time they tick a box is maddening. */
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);

  return (
    <>
      <div className="prog" id="prog" />
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <QuoteDrawer />
      <QuickView />
      <Toast />
    </>
  );
}
