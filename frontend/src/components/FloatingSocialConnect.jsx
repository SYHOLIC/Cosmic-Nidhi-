import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingSocialConnect() {
  const location = useLocation();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Hide on admin panel to keep admin workspace clean
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // Pre-configured WhatsApp details
  const whatsappNumber = "919560437360";
  const whatsappMessage = encodeURIComponent(
    "Hello Cosmic Nidhi! 🙏 I would like to know more about your astrology consultations and guidance."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Pre-configured social URLs
  const instagramUrl = "https://www.instagram.com/cosmicnidhi.astrology/";
  const youtubeUrl = "https://www.youtube.com/@nidhiasthana3699";

  return (
    <aside
      aria-label="Social Connect Floating Actions"
      className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end gap-3 pointer-events-auto select-none"
    >
      {/* 1. YOUTUBE FLOATING BUTTON */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
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
              className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#E9A534]/30 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse"></span>
              Watch on YouTube
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

      {/* 2. INSTAGRAM FLOATING BUTTON */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="relative flex items-center group"
        onMouseEnter={() => setHoveredIcon("instagram")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIcon === "instagram" && (
            <motion.span
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="hidden sm:inline-flex items-center gap-1.5 absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1A0307]/95 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#FFF8EC] border border-[#E9A534]/30 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FD1D1D] animate-pulse"></span>
              Follow on Instagram
            </motion.span>
          )}
        </AnimatePresence>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Cosmic Nidhi on Instagram"
          className="relative flex h-12 w-12 sm:h-[50px] sm:w-[50px] items-center justify-center rounded-full text-white shadow-[0_6px_22px_rgba(220,39,67,0.38)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(220,39,67,0.55)] focus:outline-none focus:ring-2 focus:ring-[#FD1D1D] focus:ring-offset-2 focus:ring-offset-[#1A0307]"
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
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            />
          </svg>
        </a>
      </motion.div>

      {/* 2. WHATSAPP FLOATING BUTTON */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
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
              Chat with Astrologer
            </motion.span>
          )}
        </AnimatePresence>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Cosmic Nidhi on WhatsApp"
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
    </aside>
  );
}
