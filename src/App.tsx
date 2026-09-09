import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { StoreProvider } from "@/store/StoreContext";
import { AuthProvider } from "@/store/AuthContext";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import ProductPage from "@/pages/Product";
import Accessories from "@/pages/Accessories";
import BulkGifting from "@/pages/BulkGifting";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Enquiry from "@/pages/Enquiry";

// The team's pages, and the Firebase SDK they need, are a separate
// download that storefront visitors never make.
const Admin = lazy(() => import("@/pages/Admin"));

// The fourteen supplier catalogues carry 505 products' worth of codes and
// specs. That is real weight, and someone who only came for the gift sets
// should never pay for it — so the whole section loads on its first visit.
const Ranges = lazy(() => import("@/pages/Ranges"));
const RangeCategory = lazy(() => import("@/pages/RangeCategory"));
const RangeProduct = lazy(() => import("@/pages/RangeProduct"));
import NotFound from "@/pages/NotFound";

/** One fallback for every lazily-loaded route. */
const Loading = () => (
  <div className="pgh"><div className="wrap"><p className="lede">Loading…</p></div></div>
);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/ranges" element={<Suspense fallback={<Loading />}><Ranges /></Suspense>} />
              <Route path="/ranges/:cat" element={<Suspense fallback={<Loading />}><RangeCategory /></Suspense>} />
              <Route path="/ranges/:cat/:slug" element={<Suspense fallback={<Loading />}><RangeProduct /></Suspense>} />
              <Route path="/bulk-gifting" element={<BulkGifting />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/admin" element={<Suspense fallback={<Loading />}><Admin /></Suspense>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
