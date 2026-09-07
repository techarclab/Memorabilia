import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { StoreProvider } from "@/store/StoreContext";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import ProductPage from "@/pages/Product";
import Accessories from "@/pages/Accessories";
import BulkGifting from "@/pages/BulkGifting";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Enquiry from "@/pages/Enquiry";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/bulk-gifting" element={<BulkGifting />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </QueryClientProvider>
  );
}
