import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingWhatsApp() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Hide on admin routes to keep admin workspace clean
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const whatsappNumber = "919560437360";
  const whatsappMessage = encodeURIComponent(
    "Hello Cosmic Nidhi! 🙏 I would like to know more about your astrology consultations and guidance."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center select-none">
      {/* Tooltip on hover (desktop) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-1.5 mr-3 rounded-full border border-emerald-500/30 bg-[#160305]/95 px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-sans text-[12px] font-semibold text-[#FFF4E4] whitespace-nowrap">
              Chat on WhatsApp
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Cosmic Nidhi on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative group flex h-[52px] w-[52px] sm:h-[56px] sm:w-[56px] items-center justify-center rounded-full bg-gradient-to-tr from-[#20ba59] via-[#25D366] to-[#2de572] text-white shadow-[0_8px_28px_rgba(37,211,102,0.42)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(37,211,102,0.6)] cursor-pointer"
      >
        {/* Subtle breathing ripple */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/25 animate-ping pointer-events-none" />

        {/* Official WhatsApp SVG Vector Icon */}
        <svg
          className="relative z-10 h-7 w-7 sm:h-8 sm:w-8 fill-current drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.07 16.29C4.24 14.97 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.56 14.37C16.31 14.25 15.09 13.65 14.86 13.56C14.64 13.48 14.47 13.44 14.31 13.69C14.14 13.94 13.66 14.5 13.51 14.67C13.37 14.84 13.22 14.86 12.97 14.74C12.72 14.61 11.92 14.35 10.97 13.5C10.23 12.84 9.73 12.03 9.58 11.78C9.44 11.53 9.57 11.39 9.69 11.27C9.8 11.16 9.94 10.98 10.06 10.84C10.19 10.7 10.23 10.6 10.31 10.43C10.39 10.27 10.35 10.12 10.29 10C10.23 9.88 9.73 8.66 9.53 8.16C9.32 7.67 9.12 7.74 8.96 7.73C8.82 7.72 8.65 7.72 8.48 7.72C8.31 7.72 8.04 7.78 7.81 8.03C7.58 8.28 6.94 8.88 6.94 10.1C6.94 11.32 7.83 12.49 7.95 12.66C8.08 12.83 9.68 15.28 12.14 16.34C12.72 16.59 13.18 16.74 13.53 16.85C14.12 17.04 14.66 17.01 15.08 16.95C15.56 16.88 16.56 16.35 16.76 15.77C16.97 15.2 16.97 14.71 16.91 14.61C16.84 14.5 16.69 14.43 16.56 14.37Z" />
        </svg>
      </motion.a>
    </div>
  );
}
