import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickView from "@/components/QuickView";
import Toast from "@/components/Toast";
import { useHeaderBehaviour } from "@/hooks/useMotion";
import { useStore } from "@/store/StoreContext";

export default function Layout() {
  const loc = useLocation();
  const { drawer, quickView } = useStore();
  useHeaderBehaviour(drawer !== null || quickView !== null);

  /* Every route change starts at the top, the way a page load would. */
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname, loc.search]);

  return (
    <>
      <div className="prog" id="prog" />
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <CartDrawer />
      <QuickView />
      <Toast />
    </>
  );
}
