import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Numerology Consultation", href: "/services#numerology" },
    { label: "Birth Chart / Janam Kundli", href: "/services#birth-chart" },
    { label: "Applied Vastu Consultation", href: "/services#vastu" },
    { label: "Kundli Matching / Guidance", href: "/services#kundli-matching" },
    { label: "Zodiac Signs", href: "/#signs" },
    { label: "Zodiac Store", href: "/products" },
    { label: "Pitra Dosh Calculator", href: "/pitra-dosh-calculator" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/page/faq" },
  ];

  const services = [
    { label: "Numerology Consultation", href: "/services#numerology" },
    { label: "Birth Chart / Janam Kundli", href: "/services#birth-chart" },
    { label: "Applied Vastu Consultation", href: "/services#vastu" },
    { label: "Kundli Matching / Guidance", href: "/services#kundli-matching" },
  ];

  const handleNavClick = (e, item) => {
    if (!item.href.includes("#")) return;
    const [path, hash] = item.href.split("#");
    const targetPath = path || "/";
    const isCurrentPage =
      location.pathname === targetPath ||
      (targetPath === "/" && (location.pathname === "/" || location.pathname === "/home"));

    if (isCurrentPage) {
      e.preventDefault();
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#E9A534]/20 bg-[#30070B]">
      {/* =========================================
          DECORATIVE BACKGROUND
      ========================================= */}
      <div
        className="
          pointer-events-none
          absolute
          -right-[180px]
          -top-[250px]
          h-[600px]
          w-[600px]
          rounded-full
          border
          border-[#E9A534]/[0.07]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-[130px]
          -top-[200px]
          h-[500px]
          w-[500px]
          rounded-full
          border
          border-[#E9A534]/[0.05]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[280px]
          -left-[220px]
          h-[550px]
          w-[550px]
          rounded-full
          border
          border-[#E9A534]/[0.05]
        "
      />

      {/* Soft gold glow */}
      <div
        className="
          pointer-events-none
          absolute
          right-[12%]
          top-[20%]
          h-[280px]
          w-[280px]
          rounded-full
          bg-[#E9A534]/[0.025]
          blur-[100px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-20">
        {/* =========================================
            MAIN FOOTER GRID
        ========================================= */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-14">
          {/* =======================================
              BRAND
          ======================================= */}
          <div className="space-y-5">
            <div>
              <span
                className="
                  font-display
                  text-2xl
                  tracking-wide
                  text-[#E9A534]

                  sm:text-3xl
                "
              >
                Cosmic Nidhi
              </span>

              {/* Gold underline */}
              <span className="mt-2 block h-[1px] w-10 bg-[#E9A534]" />
            </div>

            <p
              className="
                max-w-xs
                font-sans
                text-sm
                leading-relaxed
                text-[#FDECC8]/70
              "
            >
              Vedic &amp; Western Astrology — reading the
              sky so you can read your life.
            </p>

            {/* =====================================
                SOCIAL ICONS
            ===================================== */}
            <div className="flex items-center gap-3 pt-1">
              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E9A534]/15
                  text-[#FDECC8]/55
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#E9A534]/40
                  hover:bg-[#E9A534]/[0.08]
                  hover:text-[#E9A534]
                "
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/cosmicnidhi.astrology/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E9A534]/15
                  text-[#FDECC8]/55
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#E9A534]/40
                  hover:bg-[#E9A534]/[0.08]
                  hover:text-[#E9A534]
                "
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-3.584-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@nidhiasthana3699"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E9A534]/15
                  text-[#FDECC8]/55
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#E9A534]/40
                  hover:bg-[#E9A534]/[0.08]
                  hover:text-[#E9A534]
                "
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a2.997 2.997 0 00-2.11-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.388.566a2.997 2.997 0 00-2.11 2.12C0 8.07 0 12 0 12s0 3.93.502 5.814a2.997 2.997 0 002.11 2.12c1.883.566 9.388.566 9.388.566s7.505 0 9.388-.566a2.997 2.997 0 002.11-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/nidhi-asthana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E9A534]/15
                  text-[#FDECC8]/55
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#E9A534]/40
                  hover:bg-[#E9A534]/[0.08]
                  hover:text-[#E9A534]
                "
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* =======================================
              QUICK LINKS
          ======================================= */}
          <div>
            <h4
              className="
                mb-5
                font-display
                text-lg
                text-[#FFF8EC]
              "
            >
              Quick Links
            </h4>

            <ul className="space-y-3.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      font-sans
                      text-sm
                      text-[#FDECC8]/60
                      transition-colors
                      duration-300
                      hover:text-[#E9A534]
                      cursor-pointer
                    "
                  >
                    <span
                      className="
                        h-px
                        w-0
                        bg-[#E9A534]
                        transition-all
                        duration-300
                        group-hover:w-3
                      "
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =======================================
              SERVICES
          ======================================= */}
          <div>
            <h4
              className="
                mb-5
                font-display
                text-lg
                text-[#FFF8EC]
              "
            >
              Services
            </h4>

            <ul className="space-y-3.5">
              {services.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      font-sans
                      text-sm
                      text-[#FDECC8]/60
                      transition-colors
                      duration-300
                      hover:text-[#E9A534]
                      cursor-pointer
                    "
                  >
                    <span
                      className="
                        h-px
                        w-0
                        bg-[#E9A534]
                        transition-all
                        duration-300
                        group-hover:w-3
                      "
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =======================================
              CONTACT
          ======================================= */}
          <div>
            <h4
              className="
                mb-5
                font-display
                text-lg
                text-[#FFF8EC]
              "
            >
              Contact
            </h4>

            <ul className="space-y-4">
              {/* Phone */}
              <li>
                <div
                  className="
                    group
                    flex
                    items-start
                    gap-3
                    font-sans
                    text-sm
                    text-[#FDECC8]/65
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E9A534]/20
                      text-[#E9A534]
                      transition-all
                      duration-300
                      group-hover:border-[#E9A534]/50
                      group-hover:bg-[#E9A534]/[0.08]
                    "
                  >
                    ☎
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <a href="tel:9560437360" className="hover:text-[#E9A534] transition-colors">
                      +91 95604 37360
                    </a>
                    <a href="tel:8826044955" className="hover:text-[#E9A534] transition-colors">
                      +91 88260 44955
                    </a>
                  </div>
                </div>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:cosmicnidhi.astro@gmail.com"
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    font-sans
                    text-sm
                    text-[#FDECC8]/65
                    transition-colors
                    duration-300
                    hover:text-[#E9A534]
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E9A534]/20
                      text-[#E9A534]
                      transition-all
                      duration-300
                      group-hover:border-[#E9A534]/50
                      group-hover:bg-[#E9A534]/[0.08]
                    "
                  >
                    @
                  </span>

                  cosmicnidhi.astro@gmail.com
                </a>
              </li>

              {/* Location */}
              <li>
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    font-sans
                    text-sm
                    text-[#FDECC8]/65
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E9A534]/20
                      text-[#E9A534]
                      mt-0.5
                    "
                  >
                    ✦
                  </span>

                  <span className="leading-relaxed text-xs sm:text-sm">
                    A-56/1, 4th Floor, A Block, Sector 50, Noida, Uttar Pradesh 201301
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================
            BOTTOM DIVIDER
        ========================================= */}
        <div
          className="
            mt-12
            border-t
            border-[#E9A534]/15
            pt-7

            lg:mt-16
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-3
              gap-y-2
              text-center
              font-sans
              text-xs
              text-[#FDECC8]/60
            "
          >
            <span>
              © {new Date().getFullYear()} All rights reserved By: Cosmic Nidhi.
            </span>

            <span className="text-[#E9A534]/40 select-none">|</span>

            <a
              href="https://www.cosmicnidhi.in"
              className="
                transition-colors
                duration-300
                hover:text-[#E9A534]
              "
            >
              www.cosmicnidhi.in
            </a>

            <span className="text-[#E9A534]/40 select-none">|</span>

            <Link
              to="/page/privacy-policy"
              className="
                transition-colors
                duration-300
                hover:text-[#E9A534]
              "
            >
              Privacy Policy
            </Link>

            <span className="text-[#E9A534]/40 select-none">|</span>

            <Link
              to="/page/terms-and-conditions"
              className="
                transition-colors
                duration-300
                hover:text-[#E9A534]
              "
            >
              Terms &amp; Conditions
            </Link>

            <span className="text-[#E9A534]/40 select-none">|</span>

            <Link
              to="/page/return-policy"
              className="
                transition-colors
                duration-300
                hover:text-[#E9A534]
              "
            >
              Return Policy
            </Link>
          </div>
        </div>

        {/* =========================================
            SMALL CELESTIAL SIGNATURE
        ========================================= */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-[#E9A534]/20" />

          <span className="text-xs text-[#E9A534]/60">
            ✦
          </span>

          <span className="font-serif text-[11px] italic tracking-wider text-[#FDECC8]/35">
            Written in the Stars
          </span>

          <span className="text-xs text-[#E9A534]/60">
            ✦
          </span>

          <span className="h-px w-12 bg-[#E9A534]/20" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;