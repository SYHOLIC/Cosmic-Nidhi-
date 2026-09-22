import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FloatingSocialConnect from "./components/FloatingSocialConnect";
import { CartProvider } from "./context/CartContext";

// Lazy-loaded secondary pages for instant landing page load & lightweight bundle
const About = lazy(() => import("./pages/About"));
const ServicesPage = lazy(() => import("./pages/Services"));
const ProductsPage = lazy(() => import("./pages/Products"));
const CalculatorsPage = lazy(() => import("./pages/Calculators"));
const AuthPage = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminPage = lazy(() => import("./pages/Admin"));
const ZodiacProfilePage = lazy(() => import("./pages/ZodiacProfilePage"));
const CartPage = lazy(() => import("./pages/Cart"));
const CheckoutPage = lazy(() => import("./pages/Checkout"));
const StaticPage = lazy(() => import("./pages/StaticPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const PitraDoshCalculator = lazy(() => import("./pages/PitraDoshCalculator"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#FFF7E9]">
      <div className="w-8 h-8 rounded-full border-2 border-[#E9A534] border-t-transparent animate-spin" />
    </div>
  );
}

// Inner component so we can use useLocation
function AppRoutes() {
  const location = useLocation();

  /* =========================================================
     SCROLL TO TOP ON ROUTE CHANGE OR SCROLL TO HASH
  ========================================================= */
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  /* =========================================================
     HIDE FOOTER ON ADMIN & DASHBOARD
  ========================================================= */
  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard");

  return (
    <>
      <Nav />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/pitra-dosh-calculator" element={<PitraDoshCalculator />} />
          <Route path="/calculators/pitra-dosh" element={<PitraDoshCalculator />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/zodiac/:sign" element={<ZodiacProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/page/:slug" element={<StaticPage />} />
        </Routes>
      </Suspense>
      {!hideFooter && <Footer />}
      <FloatingSocialConnect />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;