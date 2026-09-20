import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Shield,
  Phone,
  Search,
  ChevronDown,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../context/CartContext";

import logo from "../assets/logo.jpeg";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");

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

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services", dropdown: true },
    { label: "Zodiac", href: "#signs", isHash: true, dropdown: true },
    { label: "Store", href: "/products" },
    { label: "Forecast", href: "/services" },
    { label: "Pricing", href: "#pricing", isHash: true },
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
            items-center justify-between gap-6
            px-5 sm:px-7 lg:h-[78px] lg:px-9 xl:px-10
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <a href="/" className="group flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt="Cosmic Nidhi"
              className="
                h-[43px] w-auto max-w-[180px] object-contain
                transition-transform duration-300
                group-hover:scale-[1.03]
                sm:h-[46px] lg:h-[48px]
              "
            />

            <div className="hidden sm:block">
              <div
                className={`
                  font-display text-[18px] font-medium tracking-[0.055em]
                  transition-colors duration-300
                  group-hover:text-[#E9A534]
                  lg:text-[20px]
                  ${logoTextClass}
                `}
              >
                COSMIC NIDHI
              </div>

              <div
                className={`
                  mt-[3px] font-sans text-[7px] font-medium uppercase
                  tracking-[0.32em] transition-colors duration-300
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

          <div className="hidden items-center justify-center gap-1 lg:flex xl:gap-2">
            {navItems.map((item) =>
              item.isHash ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`
                    group relative flex items-center gap-1.5 whitespace-nowrap
                    px-3 py-4 font-sans text-[13px] font-medium tracking-[0.01em]
                    transition-all duration-300 cursor-pointer
                    xl:px-3.5 xl:text-[14px]
                    ${navTextClass}
                  `}
                >
                  <span>{item.label}</span>
                  <span
                    className="
                      absolute bottom-[7px] left-3 right-3 h-px
                      origin-right scale-x-0 bg-[#E9A534]
                      transition-transform duration-300
                      group-hover:origin-left group-hover:scale-x-100
                      xl:left-3.5 xl:right-3.5
                    "
                  />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`
                    group relative flex items-center gap-1.5 whitespace-nowrap
                    px-3 py-4 font-sans text-[13px] font-medium tracking-[0.01em]
                    transition-all duration-300
                    xl:px-3.5 xl:text-[14px]
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
                      absolute bottom-[7px] left-3 right-3 h-px
                      origin-right scale-x-0 bg-[#E9A534]
                      transition-transform duration-300
                      group-hover:origin-left group-hover:scale-x-100
                      xl:left-3.5 xl:right-3.5
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
                  ml-2 whitespace-nowrap font-sans text-[13px] font-semibold
                  text-[#E9C76D] transition-colors duration-300
                  hover:text-[#FFF4E4]
                  xl:text-[14px]
                "
              >
                {userRole === "admin" ? "Admin" : "Dashboard"}
              </Link>
            )}
          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="
                hidden h-9 w-9 items-center justify-center rounded-full
                text-[#FFF4E4]/80 transition-all duration-300
                hover:bg-white/[0.05] hover:text-[#E9C76D]
                lg:flex
              "
            >
              <Search size={18} strokeWidth={1.45} />
            </button>
            
            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="
                relative flex h-9 w-9 items-center justify-center rounded-full
                text-[#FFF4E4]/80 transition-all duration-300
                hover:bg-white/[0.05] hover:text-[#E9C76D]
              "
            >
              <ShoppingCart size={18} strokeWidth={1.45} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C1272D] font-sans text-[10px] font-bold text-white shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* =================================================
                LOGIN / USER
            ================================================= */}

            <div className="hidden lg:flex">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={userRole === "admin" ? "/admin" : "/dashboard"}
                    aria-label="Dashboard"
                    className="
                      flex h-9 w-9 items-center justify-center rounded-full
                      border border-[#E9A534]/35 bg-[#E9A534]/[0.05]
                      text-[#FDECC8] transition-all duration-300
                      hover:border-[#E9A534]/65
                      hover:bg-[#E9A534]/[0.12]
                      hover:text-[#E9C76D]
                    "
                  >
                    {userRole === "admin" ? (
                      <Shield size={15} />
                    ) : (
                      <User size={15} />
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      font-sans text-[13px] font-medium text-[#FFF4E4]/75
                      transition-colors duration-300
                      hover:text-[#E9C76D]
                      xl:text-[14px]
                    "
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/auth"
                  className="
                    whitespace-nowrap font-sans text-[13px] font-medium
                    text-[#FFF4E4]/90 transition-colors duration-300
                    hover:text-[#E9C76D]
                    xl:text-[14px]
                  "
                >
                  Login
                </a>
              )}
            </div>

            {/* =================================================
                BOOK A READING (desktop)
            ================================================= */}

            <a
              href="tel:9560437360"
              className="
                group hidden h-[45px] items-center gap-3 rounded-[8px]
                border border-[#D8A948]/75
                bg-gradient-to-r from-[#EBCB88] via-[#F3D99D] to-[#E4BD6D]
                px-[18px] font-sans text-[12px] font-bold text-[#3C080D]
                shadow-[0_8px_24px_rgba(0,0,0,0.15)]
                transition-all duration-300
                hover:-translate-y-[1px]
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)]
                lg:inline-flex xl:h-[46px] xl:px-5 xl:text-[13px]
              "
            >
              <span className="whitespace-nowrap">Book a Reading</span>

              <span
                className="
                  flex h-7 w-7 items-center justify-center rounded-full
                  border border-[#5A0E14]/25 transition-all duration-300
                  group-hover:bg-[#5A0E14]/5
                "
              >
                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </a>

            {/* =================================================
                MOBILE BOOK
            ================================================= */}

            <a
              href="tel:9560437360"
              className="
                flex h-[39px] items-center gap-1.5 rounded-[7px]
                border border-[#D8A948]/70
                bg-gradient-to-r from-[#EBCB88] to-[#DDB56D]
                px-3 font-sans text-[10px] font-bold text-[#3C080D]
                shadow-[0_5px_18px_rgba(0,0,0,0.16)]
                sm:px-3.5 sm:text-[11px]
                lg:hidden
              "
            >
              <Phone size={12} />
              <span>Book</span>
            </a>

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
                item.isHash ? (
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

                    <div className="flex items-center gap-2">
                      {item.dropdown && (
                        <ChevronDown
                          size={14}
                          className="text-[#E9A534]/70"
                        />
                      )}

                      <ArrowRight
                        size={15}
                        strokeWidth={1.5}
                        className="
                          opacity-30 transition-all duration-300
                          group-hover:translate-x-1 group-hover:opacity-100
                        "
                      />
                    </div>
                  </Link>
                )
              )}

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
            <a
              href="tel:9560437360"
              onClick={closeMobileMenu}
              className="
                mt-3 flex h-[50px] items-center justify-center gap-2.5
                rounded-[8px] border border-[#E9A534]
                bg-gradient-to-r from-[#E9A534] to-[#DDB56D]
                font-sans text-[12px] font-bold text-[#3C080D]
                shadow-[0_8px_25px_rgba(0,0,0,0.18)]
              "
            >
              Book a Reading
              <ArrowRight size={15} strokeWidth={1.8} />
            </a>
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
    </>
  );
}

export default Nav;