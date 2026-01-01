import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/common/CookieBanner";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Lookbook = lazy(() => import("./pages/Lookbook"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Materials = lazy(() => import("./pages/Materials"));
const Journal = lazy(() => import("./pages/Journal"));
const About = lazy(() => import("./pages/About"));
const Sizing = lazy(() => import("./pages/Sizing"));
const Faq = lazy(() => import("./pages/Faq"));
const Returns = lazy(() => import("./pages/Returns"));
const Account = lazy(() => import("./pages/Account"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Cart = lazy(() => import("./pages/Cart"));
const Admin = lazy(() => import("./pages/Admin"));
const Products = lazy(() => import("./pages/Products"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const Loading = () => <div className="min-h-screen bg-[#f5f3ee]" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Admin Route */}
              <Route path="/admin" element={<Admin />} />

              {/* Product detail route - no header/footer */}
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/products" element={<Products />} />

              {/* All other routes - with header/footer */}
              <Route path="*" element={
                <div className="bg-[#f5f3ee] min-h-screen">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Shop />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/lookbook" element={<Lookbook />} />
                      <Route path="/campaigns" element={<Campaigns />} />
                      <Route path="/materials" element={<Materials />} />
                      <Route path="/journal" element={<Journal />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/sizing" element={<Sizing />} />
                      <Route path="/faq" element={<Faq />} />
                      <Route path="/returns" element={<Returns />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <CookieBanner />
                  <Footer />
                </div>
              } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);
export default App;
