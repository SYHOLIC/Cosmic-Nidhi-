import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Globe, X, Sparkles, ExternalLink, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

export default function FloatingSocialConnect() {
  const location = useLocation();
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isContactCardOpen, setIsContactCardOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Hide on admin panel to keep admin workspace clean
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // Pre-configured official contact details
  const primaryPhones = [
    { display: "+91 95604 37360", tel: "9560437360" },
    { display: "+91 88260 44955", tel: "8826044955" },
  ];

  const whatsappNumber = "919560437360";
  const whatsappMessage = encodeURIComponent(
    "Hello Cosmic Nidhi! 🙏 I would like to know more about your astrology consultations and guidance."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const facebookUrl = "https://www.facebook.com/share/1GeMYtoBf1/";
  const instagramUrl = "https://www.instagram.com/cosmicnidhi.astrology/";
  const youtubeUrl = "https://youtube.com/@cosmicnidhi?si=eAu8TIl29r1V2tTO";
  const linkedinUrl =
    "https://www.linkedin.com/in/nidhi-asthana-2826b4389?utm_source=share_via&utm_content=profile&utm_medium=member_android";
  const emailAddress = "cosmicnidhi.astro@gmail.com";
  const websiteUrl = "https://www.cosmicnidhi.in";
  const officeAddress = "A-56/1, 4th Floor, A Block, Sector 50, Noida, Uttar Pradesh 201301";

  return (
    <>
      <aside
        aria-label="Social Connect Floating Actions"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 lg:right-6 xl:right-7 z-50 flex flex-col items-end gap-2 sm:gap-2.5 pointer-events-auto select-none"
      >
        {isCollapsed ? (
          /* COLLAPSED FLOATING LAUNCHER: Single elegant button with badge */
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="relative flex items-center group"
            onMouseEnter={() => setHoveredIcon("collapsed")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <AnimatePresence>
              {hoveredIcon === "collapsed" && (
                <motion.span
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#25D366]/40 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  Connect with Cosmic Nidhi
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              aria-label="Open Social Connect Options"
              className="relative flex h-11 w-11 sm:h-[48px] sm:w-[48px] items-center justify-center rounded-full text-white shadow-[0_8px_26px_rgba(37,211,102,0.42)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-2 focus:ring-[#25D366] cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #2fe673 0%, #25D366 40%, #128C7E 100%)",
              }}
            >
              <svg className="h-6 w-6 sm:h-[26px] sm:w-[26px] fill-current drop-shadow-sm" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#D88A36] text-[9px] sm:text-[10px] font-bold text-white shadow-md border border-[#1A0307]">
                6
              </span>
            </button>
          </motion.div>
        ) : (
          /* EXPANDED STACK with MINIMIZE BUTTON */
          <>
            {/* Minimize toggle button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              title="Minimize social panel"
              aria-label="Minimize social panel"
              className="flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#1A0307]/90 hover:bg-[#1A0307] text-[#E9A534] border border-[#E9A534]/30 shadow-md transition-all hover:scale-110 mb-0.5 cursor-pointer"
            >
              <ChevronDown size={13} strokeWidth={2.5} />
            </button>

            {/* ==============================================================
                1. QUICK CONTACT CARD TOGGLE (FULL CONTACT DETAILS POPUP)
            ============================================================== */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.02, ease: "easeOut" }}
              className="relative flex items-center group"
          onMouseEnter={() => setHoveredIcon("card")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <AnimatePresence>
            {hoveredIcon === "card" && !isContactCardOpen && (
              <motion.span
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#E9A534]/30 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
              >
                <Sparkles size={12} className="text-[#E9A534] animate-pulse" />
                View Full Contact Details
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsContactCardOpen(!isContactCardOpen)}
            aria-label="Toggle Cosmic Nidhi Contact Card"
            className="relative flex h-10 w-10 sm:h-[42px] sm:w-[42px] items-center justify-center rounded-full text-[#3C080D] shadow-[0_6px_20px_rgba(233,165,52,0.35)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(233,165,52,0.55)] focus:outline-none"
            style={{
              background: "linear-gradient(145deg, #F3D99D 0%, #E9A534 60%, #B87C1D 100%)",
            }}
          >
            {isContactCardOpen ? (
              <X size={18} className="text-[#3C080D]" strokeWidth={2.5} />
            ) : (
              <Phone size={17} className="text-[#3C080D]" strokeWidth={2.2} />
            )}
          </button>
        </motion.div>

        {/* ==============================================================
            2. FACEBOOK FLOATING BUTTON
        ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04, ease: "easeOut" }}
          className="relative flex items-center group"
          onMouseEnter={() => setHoveredIcon("facebook")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <AnimatePresence>
            {hoveredIcon === "facebook" && (
              <motion.span
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#1877F2]/40 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] animate-pulse"></span>
                Facebook: Cosmic Nidhi
              </motion.span>
            )}
          </AnimatePresence>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Cosmic Nidhi on Facebook"
            className="relative flex h-10 w-10 sm:h-[42px] sm:w-[42px] items-center justify-center rounded-full text-white shadow-[0_6px_20px_rgba(24,119,242,0.35)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(24,119,242,0.55)] focus:outline-none"
            style={{
              background: "linear-gradient(145deg, #1877F2 0%, #166FE5 60%, #0F52B5 100%)",
            }}
          >
            <svg className="h-4 w-4 fill-current drop-shadow-sm" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </motion.div>

        {/* ==============================================================
            3. LINKEDIN FLOATING BUTTON
        ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: "easeOut" }}
          className="relative flex items-center group"
          onMouseEnter={() => setHoveredIcon("linkedin")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <AnimatePresence>
            {hoveredIcon === "linkedin" && (
              <motion.span
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#0A66C2]/40 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] animate-pulse"></span>
                LinkedIn: Nidhi Asthana
              </motion.span>
            )}
          </AnimatePresence>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Nidhi Asthana on LinkedIn"
            className="relative flex h-10 w-10 sm:h-[42px] sm:w-[42px] items-center justify-center rounded-full text-white shadow-[0_6px_20px_rgba(10,102,194,0.35)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(10,102,194,0.55)] focus:outline-none"
            style={{
              background: "linear-gradient(145deg, #0077b5 0%, #0A66C2 60%, #004182 100%)",
            }}
          >
            <svg className="h-4 w-4 fill-current drop-shadow-sm" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </motion.div>

        {/* ==============================================================
            4. YOUTUBE FLOATING BUTTON
        ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
          className="relative flex items-center group"
          onMouseEnter={() => setHoveredIcon("youtube")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <AnimatePresence>
            {hoveredIcon === "youtube" && (
              <motion.span
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#FF0000]/40 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse"></span>
                YouTube: @cosmicnidhi
              </motion.span>
            )}
          </AnimatePresence>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Cosmic Nidhi on YouTube"
            className="relative flex h-11 w-11 sm:h-[45px] sm:w-[45px] items-center justify-center rounded-full text-white shadow-[0_6px_20px_rgba(255,0,0,0.35)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(255,0,0,0.55)] focus:outline-none"
            style={{
              background: "linear-gradient(145deg, #ff3d3d 0%, #FF0000 60%, #a80000 100%)",
            }}
          >
            <svg className="h-5 w-5 fill-current drop-shadow-sm" viewBox="0 0 24 24">
              <path d="M23.498 6.186a2.997 2.997 0 00-2.11-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.388.566a2.997 2.997 0 00-2.11 2.12C0 8.07 0 12 0 12s0 3.93.502 5.814a2.997 2.997 0 002.11 2.12c1.883.566 9.388.566 9.388.566s7.505 0 9.388-.566a2.997 2.997 0 002.11-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </motion.div>

        {/* ==============================================================
            4. INSTAGRAM FLOATING BUTTON (UPDATED: cosmicnidhi.astrology)
        ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
          className="relative flex items-center group"
          onMouseEnter={() => setHoveredIcon("instagram")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Enhanced Rich Tooltip showing official handle */}
          <AnimatePresence>
            {hoveredIcon === "instagram" && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:flex flex-col gap-0.5 absolute right-full mr-3 whitespace-nowrap rounded-[14px] bg-[#1A0307]/95 px-4 py-2 text-[#FFF8EC] border border-[#E9A534]/40 shadow-[0_12px_28px_rgba(0,0,0,0.55)] backdrop-blur-md"
              >
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#E9C76D]">
                  <span className="w-2 h-2 rounded-full bg-[#FD1D1D] animate-pulse"></span>
                  @cosmicnidhi.astrology
                </div>
                <span className="text-[10px] text-[#FFF8EC]/75">
                  Follow for daily astrology & horoscopes
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Cosmic Nidhi on Instagram: @cosmicnidhi.astrology"
            className="relative flex h-12 w-12 sm:h-[50px] sm:w-[50px] items-center justify-center rounded-full text-white shadow-[0_6px_22px_rgba(220,39,67,0.45)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(220,39,67,0.65)] focus:outline-none focus:ring-2 focus:ring-[#FD1D1D] focus:ring-offset-2 focus:ring-offset-[#1A0307]"
            style={{
              background:
                "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
            }}
          >
            {/* Instagram SVG Icon */}
            <svg
              className="h-6 w-6 sm:h-[25px] sm:w-[25px] fill-current drop-shadow-sm"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-3.584-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
              />
            </svg>
          </a>
        </motion.div>

        {/* ==============================================================
            5. WHATSAPP FLOATING BUTTON (PRIMARY INSTANT CHAT)
        ============================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
          className="relative flex items-center group"
          onMouseEnter={() => setHoveredIcon("whatsapp")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Glowing radar ping ring */}
          <span
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"
            style={{ animationDuration: "2.8s" }}
          ></span>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredIcon === "whatsapp" && (
              <motion.span
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#25D366]/40 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                WhatsApp: +91 95604 37360
              </motion.span>
            )}
          </AnimatePresence>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Cosmic Nidhi on WhatsApp: +91 95604 37360"
            className="relative flex h-13 w-13 sm:h-[54px] sm:w-[54px] items-center justify-center rounded-full text-white shadow-[0_8px_26px_rgba(37,211,102,0.42)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#1A0307]"
            style={{
              background: "linear-gradient(145deg, #2fe673 0%, #25D366 40%, #128C7E 100%)",
            }}
          >
            {/* WhatsApp SVG Icon */}
            <svg
              className="h-7 w-7 sm:h-[30px] sm:w-[30px] fill-current drop-shadow-sm"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </motion.div>
        </>
      )}
      </aside>

      {/* ==============================================================
          FULL FLOATING CONTACT DETAILS MODAL / POPOVER CARD
      ============================================================== */}
      <AnimatePresence>
        {isContactCardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsContactCardOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[24px] border border-[#E9A534]/30 bg-[#160205] text-[#FFF8EC] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Gold decorative header glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E9A534]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsContactCardOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#FFF8EC]/60 hover:text-[#E9A534] hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close contact card"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5 border-b border-[#E9A534]/15 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#5A0E14] to-[#8E1B24] border border-[#E9A534]/40 text-[#E9A534] shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#E9C76D]">
                    Cosmic Nidhi
                  </h3>
                  <p className="text-xs text-[#FFF8EC]/60">
                    Lead Astrologer: Nidhi Asthana
                  </p>
                </div>
              </div>

              {/* Contact list */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                {/* Primary Contacts */}
                <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 border border-white/5">
                  <Phone size={17} className="text-[#E9A534] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E9A534]/70 block">
                      Primary Contacts
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      {primaryPhones.map((p) => (
                        <a
                          key={p.tel}
                          href={`tel:${p.tel}`}
                          className="font-medium text-[#FFF8EC] hover:text-[#E9A534] transition-colors underline decoration-[#E9A534]/30 underline-offset-2"
                        >
                          {p.display}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Office Location */}
                <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 border border-white/5">
                  <MapPin size={17} className="text-[#E9A534] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E9A534]/70 block">
                      Designation / Address
                    </span>
                    <p className="font-normal text-[#FFF8EC]/80 leading-relaxed mt-0.5 text-xs">
                      {officeAddress}
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 border border-white/5">
                  <Mail size={17} className="text-[#E9A534] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E9A534]/70 block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="font-medium text-[#FFF8EC] hover:text-[#E9A534] transition-colors mt-0.5 block"
                    >
                      {emailAddress}
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 border border-white/5">
                  <Globe size={17} className="text-[#E9A534] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E9A534]/70 block">
                      Official Website
                    </span>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#E9C76D] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      www.cosmicnidhi.in <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Channels Row */}
              <div className="mt-5 pt-4 border-t border-[#E9A534]/15">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E9A534]/70 block mb-2.5 text-center">
                  Direct Social Profiles
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/25 p-2 text-center transition-all group"
                  >
                    <span className="text-xs font-semibold text-[#FFF8EC] group-hover:text-[#1877F2]">
                      Facebook
                    </span>
                    <span className="text-[10px] text-[#FFF8EC]/60 truncate w-full">
                      Cosmic Nidhi
                    </span>
                  </a>

                  {/* Instagram */}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#FD1D1D]/10 hover:bg-[#FD1D1D]/20 border border-[#FD1D1D]/25 p-2 text-center transition-all group"
                  >
                    <span className="text-xs font-semibold text-[#FFF8EC] group-hover:text-[#FD1D1D]">
                      Instagram
                    </span>
                    <span className="text-[10px] text-[#FFF8EC]/60 truncate w-full">
                      @cosmicnidhi.astrology
                    </span>
                  </a>

                  {/* YouTube */}
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/25 p-2 text-center transition-all group"
                  >
                    <span className="text-xs font-semibold text-[#FFF8EC] group-hover:text-[#FF0000]">
                      YouTube
                    </span>
                    <span className="text-[10px] text-[#FFF8EC]/60 truncate w-full">
                      @cosmicnidhi
                    </span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/25 p-2 text-center transition-all group"
                  >
                    <span className="text-xs font-semibold text-[#FFF8EC] group-hover:text-[#0A66C2]">
                      LinkedIn
                    </span>
                    <span className="text-[10px] text-[#FFF8EC]/60 truncate w-full">
                      Nidhi Asthana
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
