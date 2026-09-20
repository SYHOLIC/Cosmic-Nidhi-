import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import ServicesPage from "./pages/Services";
import ProductsPage from "./pages/Products";
import CalculatorsPage from "./pages/Calculators";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/Admin";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ZodiacProfilePage from "./pages/ZodiacProfilePage";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import StaticPage from "./pages/StaticPage";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import PitraDoshCalculator from "./pages/PitraDoshCalculator";
import FloatingSocialConnect from "./components/FloatingSocialConnect";
import { CartProvider } from "./context/CartContext";

// Inner component so we can use useLocation
function AppRoutes() {
  const location = useLocation();

  /* =========================================================
     SCROLL TO TOP ON ROUTE CHANGE
  ========================================================= */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  /* =========================================================
     HIDE FOOTER ON ADMIN & DASHBOARD
  ========================================================= */
  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard");

  return (
    <>
      <Nav />
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