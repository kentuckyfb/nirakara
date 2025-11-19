import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/common/CookieBanner";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Lookbook from "./pages/Lookbook";
import Campaigns from "./pages/Campaigns";
import Materials from "./pages/Materials";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Sizing from "./pages/Sizing";
import Faq from "./pages/Faq";
import Returns from "./pages/Returns";
import Account from "./pages/Account";
import CookiePolicy from "./pages/CookiePolicy";
import Cart from "./pages/Cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/about" element={<About />} />
            <Route path="/sizing" element={<Sizing />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <CookieBanner />
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
