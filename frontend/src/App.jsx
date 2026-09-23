import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { Component, useEffect, lazy, Suspense } from "react";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF7E9] px-6 text-center">
          <div className="max-w-md rounded-2xl border border-[#E9A534]/20 bg-white/60 p-8 shadow-xl backdrop-blur-sm">
            <span className="text-4xl">✨</span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#3C080D]">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-[#6B3A2A]/80">
              An unexpected display issue occurred. Please refresh or return to the homepage.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="cursor-pointer rounded-full bg-[#E9A534] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#3C080D] shadow transition hover:bg-[#DDA520]"
              >
                Return to Home
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="cursor-pointer rounded-full border border-[#3C080D]/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#3C080D] transition hover:bg-black/5"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-loaded secondary pages for instant landing page load & lightweight bundle
const About = lazy(() => import("./pages/About"));
const ServicesPage = lazy(() => import("./pages/Services"));
const ProductsPage = lazy(() => import("./pages/Products"));
const CalculatorsPage = lazy(() => import("./pages/Calculators"));
const AuthPage = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminPage = lazy(() => import("./pages/Admin"));
const ZodiacIndexPage = lazy(() => import("./pages/ZodiacIndexPage"));
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
      <ErrorBoundary>
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
          <Route path="/zodiac" element={<ZodiacIndexPage />} />
          <Route path="/zodiac/:sign" element={<ZodiacProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/page/:slug" element={<StaticPage />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;