import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Shield,
  Phone,
  ChevronDown,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import BookingModal from "./BookingModal";

import logo from "../assets/logo.jpeg";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobileZodiacOpen, setMobileZodiacOpen] = useState(false);
  const [desktopZodiacOpen, setDesktopZodiacOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  /* =========================================================
     PAGE TYPE
  ========================================================= */

  const isHome =
    location.pathname === "/" || location.pathname === "/home";

  const isAuthPage = location.pathname === "/auth";

  const isLightPage = !isHome && !isAuthPage;

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setDesktopServicesOpen(false);
    setMobileZodiacOpen(false);
    setDesktopZodiacOpen(false);
  }, [location.pathname]);

  /* =========================================================
     AUTH — re-read on route change so Dashboard appears after login
  ========================================================= */

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      let user = {};
      try {
        user = JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        user = {};
      }
      setIsLoggedIn(Boolean(token));
      setUserRole(user?.role || "user");
    };

    syncAuth();
    window.addEventListener("auth-state-changed", syncAuth);
    return () => {
      window.removeEventListener("auth-state-changed", syncAuth);
    };
  }, [location.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart_guest");
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new CustomEvent("auth-state-changed", {
      detail: { action: "logout" }
    }));

    setIsLoggedIn(false);
    setUserRole("user");
    setMobileMenuOpen(false);

    window.location.href = "/";
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================= */

  const SERVICES_DROPDOWN_ITEMS = [
    { label: "Birth Chart / Janam Kundli", href: "/services#birth-chart", desc: "Detailed planetary life map & remedies" },
    { label: "Numerology Consultation", href: "/services#numerology", desc: "Destiny, name & lifepath guidance" },
    { label: "Applied Vastu Consultation", href: "/services#vastu", desc: "Harmonize energy flows for home & work" },
    { label: "Kundli Matching / Guidance", href: "/services#kundli-matching", desc: "Guna Milan & compatibility analysis" },
    { label: "View All Services", href: "/services", desc: "Explore all consultation offerings" },
  ];

  const ZODIAC_DROPDOWN_SIGNS = [
    { name: "Aries", hindi: "मेष", slug: "aries", element: "Fire" },
    { name: "Taurus", hindi: "वृषभ", slug: "taurus", element: "Earth" },
    { name: "Gemini", hindi: "मिथुन", slug: "gemini", element: "Air" },
    { name: "Cancer", hindi: "कर्क", slug: "cancer", element: "Water" },
    { name: "Leo", hindi: "सिंह", slug: "leo", element: "Fire" },
    { name: "Virgo", hindi: "कन्या", slug: "virgo", element: "Earth" },
    { name: "Libra", hindi: "तुला", slug: "libra", element: "Air" },
    { name: "Scorpio", hindi: "वृश्चिक", slug: "scorpio", element: "Water" },
    { name: "Sagittarius", hindi: "धनु", slug: "sagittarius", element: "Fire" },
    { name: "Capricorn", hindi: "मकर", slug: "capricorn", element: "Earth" },
    { name: "Aquarius", hindi: "कुंभ", slug: "aquarius", element: "Air" },
    { name: "Pisces", hindi: "मीन", slug: "pisces", element: "Water" },
  ];

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services", dropdown: "services" },
    { label: "Zodiac", href: "/zodiac", dropdown: "zodiac" },
    { label: "Store", href: "/products" },
    { label: "Forecast", href: "/services" },
    { label: "Pricing", href: "/services#pricing" },
    { label: "Contact", href: "/contact" },
  ];

  /* =========================================================
     SMART SCROLL — works from any page
  ========================================================= */

  const handleNavClick = (e, item) => {
    if (!item.isHash) return; // normal Link handles it
    e.preventDefault();
    const sectionId = item.href.replace("#", "");
    if (location.pathname === "/" || location.pathname === "/home") {
      // Already on home — just scroll
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate home, then scroll after paint
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
    setMobileMenuOpen(false);
  };

  /* =========================================================
     NAVBAR THEME — always dark
  ========================================================= */

  const navbarClass = scrolled
    ? `
      border-b
      border-[#E9A534]/15
      bg-[#30070B]/96
      shadow-[0_10px_35px_rgba(0,0,0,0.25)]
      backdrop-blur-xl
    `
    : isHome
      ? `
        border-b
        border-white/[0.05]
        bg-gradient-to-b
        from-[#190004]/88
        via-[#260005]/55
        to-transparent
        backdrop-blur-[3px]
      `
      : `
        border-b
        border-[#E9A534]/12
        bg-[#260005]/96
        backdrop-blur-xl
        shadow-[0_8px_28px_rgba(0,0,0,0.20)]
      `;

  /* All nav text is dark-theme now */
  const navTextClass = "text-[#FFF4E4]/90 hover:text-[#E9C76D]";

  const logoTextClass = "text-[#FFF7EA]";
  const logoSubTextClass = "text-[#E9C76D]/75";

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`
          fixed inset-x-0 top-0 z-[100] w-full
          transition-all duration-500
          ${navbarClass}
        `}
      >
        {/* Top gold accent */}
        <span
          className="
            pointer-events-none absolute left-0 right-0 top-0 h-px
            bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent
          "
        />

        <nav
          className="
            mx-auto flex h-[74px] w-full max-w-[1500px]
            items-center justify-between gap-2 sm:gap-4 lg:gap-3 xl:gap-4 2xl:gap-6
            px-4 sm:px-6 lg:h-[78px] lg:px-5 xl:px-7 2xl:px-10
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <a href="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
            <img
              src={logo}
              alt="Cosmic Nidhi"
              className="
                h-[40px] w-auto max-w-[170px] object-contain
                transition-transform duration-300
                group-hover:scale-[1.03]
                sm:h-[44px] lg:h-[46px] xl:h-[48px]
              "
            />

            <div className="hidden sm:block">
              <div
                className={`
                  font-display text-[17px] font-medium tracking-[0.055em]
                  transition-colors duration-300
                  group-hover:text-[#E9A534]
                  lg:text-[18px] xl:text-[20px]
                  ${logoTextClass}
                `}
              >
                COSMIC NIDHI
              </div>

              <div
                className={`
                  mt-[2px] font-sans text-[6.5px] font-medium uppercase
                  tracking-[0.3em] transition-colors duration-300
                  lg:text-[7px]
                  ${logoSubTextClass}
                `}
              >
                Astrology & Guidance
              </div>
            </div>
          </a>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div className="hidden items-center justify-center gap-0.5 lg:flex xl:gap-1.5 2xl:gap-2">
            {navItems.map((item) =>
              item.dropdown === "services" ? (
                <div
                  key={item.label}
                  className="relative group/svc py-3"
                  onMouseEnter={() => setDesktopServicesOpen(true)}
                  onMouseLeave={() => setDesktopServicesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setDesktopServicesOpen(!desktopServicesOpen)}
                    className={`
                      group relative flex items-center gap-1 whitespace-nowrap
                      px-2 py-1 font-sans text-[12px] font-medium tracking-[0.01em]
                      transition-all duration-300
                      lg:px-2.5 lg:text-[12.5px]
                      xl:px-3 xl:text-[13.5px]
                      2xl:px-3.5 2xl:text-[14px]
                      ${navTextClass}
                    `}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={11}
                      strokeWidth={1.5}
                      className={`
                        text-[#E9A534]/70
                        transition-transform duration-300
                        group-hover/svc:rotate-180
                        ${desktopServicesOpen ? "rotate-180" : ""}
                      `}
                    />
                    <span
                      className="
                        absolute bottom-0 left-3 right-3 h-px
                        origin-right scale-x-0 bg-[#E9A534]
                        transition-transform duration-300
                        group-hover/svc:origin-left group-hover/svc:scale-x-100
                        xl:left-3.5 xl:right-3.5
                      "
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`
                      absolute left-0 top-full z-50 min-w-[270px]
                      translate-y-2 rounded-[10px] border border-[#E9A534]/30
                      bg-[#240307]/98 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.5)]
                      backdrop-blur-xl transition-all duration-300
                      group-hover/svc:pointer-events-auto group-hover/svc:translate-y-0 group-hover/svc:opacity-100
                      ${
                        desktopServicesOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none opacity-0"
                      }
                    `}
                  >
                    <div className="py-1">
                      {SERVICES_DROPDOWN_ITEMS.map((svc) => (
                        <Link
                          key={svc.label}
                          to={svc.href}
                          onClick={() => setDesktopServicesOpen(false)}
                          className="
                            group/sub block rounded-[7px] px-3.5 py-2 transition-colors
                            hover:bg-white/[0.08]
                          "
                        >
                          <p className="font-sans text-[13px] font-medium text-[#FFF4E4] transition-colors group-hover/sub:text-[#E9C76D]">
                            {svc.label}
                          </p>
                          <p className="font-sans text-[11px] text-[#E9C76D]/60 line-clamp-1">
                            {svc.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.dropdown === "zodiac" ? (
                <div
                  key={item.label}
                  className="relative group/zodiac py-3"
                  onMouseLeave={() => setDesktopZodiacOpen(false)}
                >
                  <Link
                    to="/zodiac"
                    onClick={() => setDesktopZodiacOpen(false)}
                    className={`
                      group relative flex items-center gap-1 whitespace-nowrap
                      px-2 py-1 font-sans text-[12px] font-medium tracking-[0.01em]
                      transition-all duration-300
                      lg:px-2.5 lg:text-[12.5px]
                      xl:px-3 xl:text-[13.5px]
                      2xl:px-3.5 2xl:text-[14px]
                      ${navTextClass}
                    `}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={11}
                      strokeWidth={1.5}
                      className="text-[#E9A534]/70 transition-transform duration-300 group-hover/zodiac:rotate-180"
                    />
                    <span
                      className="
                        absolute bottom-0 left-3 right-3 h-px
                        origin-right scale-x-0 bg-[#E9A534]
                        transition-transform duration-300
                        group-hover/zodiac:origin-left group-hover/zodiac:scale-x-100
                        xl:left-3.5 xl:right-3.5
                      "
                    />
                  </Link>

                  {/* Zodiac 12 Signs Mega-Dropdown Menu */}
                  <div
                    className="
                      absolute left-1/2 -translate-x-1/2 top-full z-50 w-[420px]
                      translate-y-2 rounded-[12px] border border-[#E9A534]/30
                      bg-[#240307]/98 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.6)]
                      backdrop-blur-xl transition-all duration-300
                      pointer-events-none opacity-0
                      group-hover/zodiac:pointer-events-auto group-hover/zodiac:translate-y-0 group-hover/zodiac:opacity-100
                    "
                  >
                    <div className="mb-2.5 flex items-center justify-between border-b border-[#E9A534]/15 pb-2">
                      <span className="font-serif text-[12px] font-bold uppercase tracking-wider text-[#E9C76D]">
                        The 12 Rashis / Zodiac Signs
                      </span>
                      <Link
                        to="/zodiac"
                        className="text-[11px] font-medium text-[#E9A534] hover:underline"
                      >
                        All Signs &rarr;
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {ZODIAC_DROPDOWN_SIGNS.map((sign) => (
                        <Link
                          key={sign.slug}
                          to={`/zodiac/${sign.slug}`}
                          className="
                            group/sign flex items-center justify-between rounded-[7px] px-2.5 py-1.5 transition-colors
                            hover:bg-white/[0.08]
                          "
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-medium text-[#FFF4E4] group-hover/sign:text-[#E9C76D]">
                              {sign.name}
                            </span>
                            <span className="text-[10px] text-[#E9C76D]/60 font-sans">
                              ({sign.hindi})
                            </span>
                          </div>
                          <span className="text-[9.5px] uppercase tracking-wider text-white/40">
                            {sign.element}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-[#E9A534]/15 pt-2 text-center">
                      <Link
                        to="/zodiac"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E9C76D] hover:text-[#FFF4E4] transition-colors"
                      >
                        <span>Explore Comprehensive Vedic Zodiac Hub</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : item.isHash ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`
                    group relative flex items-center gap-1 whitespace-nowrap
                    px-2 py-3 font-sans text-[12px] font-medium tracking-[0.01em]
                    transition-all duration-300 cursor-pointer
                    lg:px-2.5 lg:text-[12.5px]
                    xl:px-3 xl:text-[13.5px]
                    2xl:px-3.5 2xl:text-[14px]
                    ${navTextClass}
                  `}
                >
                  <span>{item.label}</span>
                  <span
                    className="
                      absolute bottom-[7px] left-2 right-2 h-px
                      origin-right scale-x-0 bg-[#E9A534]
                      transition-transform duration-300
                      group-hover:origin-left group-hover:scale-x-100
                      xl:left-3 xl:right-3
                    "
                  />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`
                    group relative flex items-center gap-1 whitespace-nowrap
                    px-2 py-3 font-sans text-[12px] font-medium tracking-[0.01em]
                    transition-all duration-300
                    lg:px-2.5 lg:text-[12.5px]
                    xl:px-3 xl:text-[13.5px]
                    2xl:px-3.5 2xl:text-[14px]
                    ${navTextClass}
                  `}
                >
                  <span>{item.label}</span>

                  {item.dropdown && (
                    <ChevronDown
                      size={11}
                      strokeWidth={1.5}
                      className="
                        text-[#E9A534]/70
                        transition-transform duration-300
                        group-hover:rotate-180
                      "
                    />
                  )}

                  <span
                    className="
                      absolute bottom-[7px] left-2 right-2 h-px
                      origin-right scale-x-0 bg-[#E9A534]
                      transition-transform duration-300
                      group-hover:origin-left group-hover:scale-x-100
                      xl:left-3 xl:right-3
                    "
                  />
                </Link>
              )
            )}

            {/* Admin / Dashboard */}
            {isLoggedIn && (
              <Link
                to={userRole === "admin" ? "/admin" : "/dashboard"}
                className="
                  ml-1 xl:ml-2 whitespace-nowrap font-sans text-[12px] font-semibold
                  text-[#E9C76D] transition-colors duration-300
                  hover:text-[#FFF4E4]
                  lg:text-[12.5px] xl:text-[13.5px]
                "
              >
                {userRole === "admin" ? "Admin" : "Dashboard"}
              </Link>
            )}
          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 xl:gap-3">
            {/* Cart */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  navigate("/auth?redirect=/cart");
                } else {
                  navigate("/cart");
                }
              }}
              aria-label="Shopping Cart"
              className="
                relative flex h-8 w-8 xl:h-9 xl:w-9 items-center justify-center rounded-full
                text-[#FFF4E4]/80 transition-all duration-300
                hover:bg-white/[0.05] hover:text-[#E9C76D] cursor-pointer
              "
            >
              <ShoppingCart size={17} strokeWidth={1.45} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C1272D] font-sans text-[10px] font-bold text-white shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* =================================================
                PITRA DOSH CALCULATOR (NEW) + USER
            ================================================= */}

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/pitra-dosh-calculator"
                className="
                  group flex items-center gap-1.5 rounded-[8px]
                  border border-white/85 bg-transparent
                  px-2.5 py-1 font-sans
                  text-white transition-all duration-300
                  hover:bg-white/10 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
                  sm:px-3 sm:py-1.5 xl:px-3.5
                "
              >
                <span className="text-[11.5px] sm:text-[12.5px] xl:text-[13px] font-semibold text-white tracking-wide whitespace-nowrap">
                  Pitra Dosh Calculator
                </span>
                <span className="rounded-[4px] bg-[#7EA326] px-1 py-0.5 text-[8.5px] sm:text-[9px] xl:text-[9.5px] font-bold uppercase tracking-wider text-white shadow-sm leading-none">
                  NEW
                </span>
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    to={userRole === "admin" ? "/admin" : "/dashboard"}
                    aria-label="Dashboard"
                    className="
                      flex h-8 w-8 xl:h-9 xl:w-9 items-center justify-center rounded-full
                      text-white/90 transition-all duration-300
                      hover:bg-white/10 hover:text-white
                    "
                  >
                    {userRole === "admin" ? (
                      <Shield size={18} strokeWidth={1.75} />
                    ) : (
                      <User size={18} strokeWidth={1.75} />
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      hidden 2xl:inline font-sans text-[12px] font-medium text-white/70
                      transition-colors duration-300
                      hover:text-[#E9C76D]
                    "
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  aria-label="Account Login"
                  className="
                    flex items-center gap-1.5 rounded-[7px] border border-[#E9A534]/50 bg-white/5
                    px-2.5 py-1 text-white/90 transition-all duration-300
                    hover:border-[#E9A534] hover:bg-[#E9A534]/15 hover:text-white
                  "
                >
                  <User size={15} strokeWidth={1.8} />
                  <span className="font-sans text-[12px] font-semibold tracking-wide">Login</span>
                </Link>
              )}
            </div>

            {/* =================================================
                BOOK A READING (desktop)
            ================================================= */}

            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="
                group hidden h-[38px] lg:inline-flex xl:h-[42px] items-center gap-1.5 xl:gap-2.5 rounded-[8px]
                border border-[#D8A948]/75
                bg-gradient-to-r from-[#EBCB88] via-[#F3D99D] to-[#E4BD6D]
                px-2.5 xl:px-4 font-sans text-[11px] xl:text-[12px] font-bold text-[#3C080D]
                shadow-[0_8px_24px_rgba(0,0,0,0.15)]
                transition-all duration-300
                hover:-translate-y-[1px]
                hover:shadow-[0_12px_30px_rgba(233,165,52,0.22)]
                shrink-0 whitespace-nowrap cursor-pointer
              "
            >
              <span className="whitespace-nowrap">Book a Reading</span>

              <span
                className="
                  flex h-5 w-5 xl:h-6 xl:w-6 items-center justify-center rounded-full
                  border border-[#5A0E14]/25 transition-all duration-300
                  group-hover:bg-[#5A0E14]/5
                "
              >
                <ArrowRight
                  size={12}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </button>

            {/* =================================================
                MOBILE BOOK
            ================================================= */}

            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="
                flex h-[39px] items-center gap-1.5 rounded-[7px]
                border border-[#D8A948]/70
                bg-gradient-to-r from-[#EBCB88] to-[#DDB56D]
                px-3 font-sans text-[10px] font-bold text-[#3C080D]
                shadow-[0_5px_18px_rgba(0,0,0,0.16)]
                sm:px-3.5 sm:text-[11px]
                lg:hidden cursor-pointer
              "
            >
              <Phone size={12} />
              <span>Book</span>
            </button>

            {/* =================================================
                MOBILE MENU
            ================================================= */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="
                flex h-[39px] w-[39px] items-center justify-center rounded-full
                border border-white/10 bg-white/[0.04] text-[#FFF4E4]
                transition-all duration-300
                hover:border-[#E9A534]/40
                hover:text-[#E9C76D]
                lg:hidden
              "
            >
              {mobileMenuOpen ? (
                <X size={19} strokeWidth={1.5} />
              ) : (
                <Menu size={19} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>

        {/* =====================================================
            MOBILE MENU (dark theme)
        ===================================================== */}

        <div
          className={`
            absolute left-0 right-0 top-full overflow-hidden
            border-t border-[#E9A534]/15
            bg-[#260005]/98
            shadow-[0_20px_50px_rgba(0,0,0,0.32)]
            backdrop-blur-2xl
            transition-all duration-300
            lg:hidden
            ${
              mobileMenuOpen
                ? "pointer-events-auto max-h-[760px] opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            }
          `}
        >
          <div className="mx-auto max-w-[1450px] px-5 pb-6 pt-2 sm:px-7">
            <div className="flex flex-col">
              {navItems.map((item, index) =>
                item.dropdown === "services" ? (
                  <div key={item.label} className="border-b border-[#E9A534]/[0.08] py-2">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="
                        group flex w-full items-center justify-between
                        py-[10px] font-sans text-[14px] font-medium
                        text-[#F5E5C7]/95 transition-colors duration-300
                        hover:text-[#E9C76D]
                      "
                    >
                      <span className="flex items-center">
                        <span className="mr-3 w-5 text-[8px] tracking-[0.12em] text-[#E9A534]/45">
                          0{index + 1}
                        </span>
                        {item.label}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`text-[#E9A534]/70 transition-transform duration-300 ${
                          mobileServicesOpen ? "rotate-180 text-[#E9C76D]" : ""
                        }`}
                      />
                    </button>

                    {mobileServicesOpen && (
                      <div className="ml-8 mb-2 flex flex-col gap-1 border-l border-[#E9A534]/20 pl-4 py-1">
                        {SERVICES_DROPDOWN_ITEMS.map((svc) => (
                          <Link
                            key={svc.label}
                            to={svc.href}
                            onClick={closeMobileMenu}
                            className="py-2 font-sans text-[13px] text-[#F5E5C7]/80 hover:text-[#E9C76D] transition-colors"
                          >
                            <p className="font-medium text-[#FFF4E4]">{svc.label}</p>
                            <p className="text-[11px] text-[#E9C76D]/60">{svc.desc}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.dropdown === "zodiac" ? (
                  <div key={item.label} className="border-b border-[#E9A534]/[0.08] py-2">
                    <button
                      type="button"
                      onClick={() => setMobileZodiacOpen(!mobileZodiacOpen)}
                      className="
                        group flex w-full items-center justify-between
                        py-[10px] font-sans text-[14px] font-medium
                        text-[#F5E5C7]/95 transition-colors duration-300
                        hover:text-[#E9C76D]
                      "
                    >
                      <span className="flex items-center">
                        <span className="mr-3 w-5 text-[8px] tracking-[0.12em] text-[#E9A534]/45">
                          0{index + 1}
                        </span>
                        {item.label}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`text-[#E9A534]/70 transition-transform duration-300 ${
                          mobileZodiacOpen ? "rotate-180 text-[#E9C76D]" : ""
                        }`}
                      />
                    </button>

                    {mobileZodiacOpen && (
                      <div className="ml-8 mb-2 border-l border-[#E9A534]/20 pl-4 py-1">
                        <Link
                          to="/zodiac"
                          onClick={closeMobileMenu}
                          className="block py-1.5 font-sans text-[12px] font-bold uppercase tracking-wider text-[#E9A534] hover:underline"
                        >
                          Explore Zodiac Hub &rarr;
                        </Link>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          {ZODIAC_DROPDOWN_SIGNS.map((sign) => (
                            <Link
                              key={sign.slug}
                              to={`/zodiac/${sign.slug}`}
                              onClick={closeMobileMenu}
                              className="py-1 text-[12.5px] text-[#F5E5C7]/80 hover:text-[#E9C76D] transition-colors"
                            >
                              {sign.name} <span className="text-[10px] text-[#E9C76D]/60">({sign.hindi})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : item.isHash ? (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="
                      group flex items-center justify-between
                      border-b border-[#E9A534]/[0.08]
                      py-[16px] font-sans text-[14px] font-medium
                      text-[#F5E5C7]/95 transition-colors duration-300
                      hover:text-[#E9C76D] cursor-pointer
                    "
                  >
                    <span className="flex items-center">
                      <span className="mr-3 w-5 text-[8px] tracking-[0.12em] text-[#E9A534]/45">
                        0{index + 1}
                      </span>
                      {item.label}
                    </span>
                    <ArrowRight
                      size={15}
                      strokeWidth={1.5}
                      className="
                        opacity-30 transition-all duration-300
                        group-hover:translate-x-1 group-hover:opacity-100
                      "
                    />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className="
                      group flex items-center justify-between
                      border-b border-[#E9A534]/[0.08]
                      py-[16px] font-sans text-[14px] font-medium
                      text-[#F5E5C7]/95 transition-colors duration-300
                      hover:text-[#E9C76D]
                    "
                  >
                    <span className="flex items-center">
                      <span className="mr-3 w-5 text-[8px] tracking-[0.12em] text-[#E9A534]/45">
                        0{index + 1}
                      </span>
                      {item.label}
                    </span>

                    <ArrowRight
                      size={15}
                      strokeWidth={1.5}
                      className="
                        opacity-30 transition-all duration-300
                        group-hover:translate-x-1 group-hover:opacity-100
                      "
                    />
                  </Link>
                )
              )}

              {/* Pitra Dosh Calculator Mobile Link */}
              <Link
                to="/pitra-dosh-calculator"
                onClick={closeMobileMenu}
                className="
                  my-2 flex items-center justify-between rounded-[9px]
                  border border-white/85 bg-white/[0.05]
                  px-3.5 py-2.5 text-white transition-all
                  hover:bg-white/10
                "
              >
                <span className="font-sans text-[13.5px] font-semibold text-white">
                  Pitra Dosh Calculator
                </span>
                <span className="rounded-[4px] bg-[#7EA326] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm leading-none">
                  NEW
                </span>
              </Link>

              {/* Auth */}
              {isLoggedIn ? (
                <>
                  <Link
                    to={userRole === "admin" ? "/admin" : "/dashboard"}
                    onClick={closeMobileMenu}
                    className="
                      flex items-center gap-2 border-b border-[#E9A534]/[0.08]
                      py-[16px] font-sans text-[14px] font-semibold
                      text-[#E9C76D]
                    "
                  >
                    {userRole === "admin" ? (
                      <>
                        <Shield size={16} />
                        Admin Panel
                      </>
                    ) : (
                      <>
                        <User size={16} />
                        Dashboard
                      </>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      border-b border-[#E9A534]/[0.08] py-[16px] text-left
                      font-sans text-[14px] font-medium
                      text-[#F5E5C7]/70
                    "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMobileMenu}
                  className="
                    border-b border-[#E9A534]/[0.08] py-[16px]
                    font-sans text-[14px] font-medium
                    text-[#F5E5C7]/90
                  "
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile phone */}
            <a
              href="tel:9560437360"
              onClick={closeMobileMenu}
              className="
                group mt-5 flex items-center justify-between
                rounded-[10px] border border-[#E9A534]/25
                bg-[#E9A534]/[0.07] px-4 py-4
              "
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A0E14] text-[#E9A534]">
                  <Phone size={16} />
                </span>

                <div>
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E9A534]">
                    Call / WhatsApp
                  </p>
                  <p className="mt-1 font-sans text-[13px] font-semibold text-[#FFF8EC]">
                    95604 37360 / 8826 044 955
                  </p>
                </div>
              </div>

              <ArrowRight size={17} className="text-[#E9A534]" />
            </a>

            {/* Mobile CTA */}
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                setIsBookingOpen(true);
              }}
              className="
                mt-3 flex h-[50px] w-full items-center justify-center gap-2.5
                rounded-[8px] border border-[#E9A534]
                bg-gradient-to-r from-[#E9A534] to-[#DDB56D]
                font-sans text-[12px] font-bold text-[#3C080D]
                shadow-[0_8px_25px_rgba(0,0,0,0.18)]
                cursor-pointer
              "
            >
              Book a Reading
              <ArrowRight size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          INNER PAGE OFFSET — light pages only
      ===================================================== */}

      {isLightPage && (
        <div aria-hidden="true" className="h-[74px] lg:h-[78px]" />
      )}

      {/* =====================================================
          REDUCED MOTION
      ===================================================== */}

      <style>{`
        header {
          max-width: 100vw;
        }

        @media (max-width: 1023px) {
          header nav {
            height: 74px;
          }
        }

        @media (max-width: 480px) {
          header nav {
            height: 68px;
            padding-left: 16px;
            padding-right: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          header *,
          header::before,
          header::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={{
          title: "Personal Astrology Consultation",
          type: "consultancy",
        }}
      />
    </>
  );
}

export default Nav;