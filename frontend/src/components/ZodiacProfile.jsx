import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  ArrowRight,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { ZODIAC_PROFILES } from "../data/zodiacProfiles";
import heroZodiac from "../assets/hero-zodiac3.png";

/* ================================================================
   ZODIAC PROFILE MODAL
================================================================ */

export default function ZodiacProfile({ sign, onClose }) {
  /* Lock body scroll when open */
  useEffect(() => {
    if (sign) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [sign]);

  /* Close on ESC */
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const profile = sign ? ZODIAC_PROFILES[sign.name] : null;

  return (
    <AnimatePresence>
      {sign && profile && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="
            fixed inset-0 z-[200]
            flex items-start justify-center
            overflow-y-auto
            bg-[#170205]/85 backdrop-blur-md
            px-4 py-8
            sm:px-6 sm:py-12
          "
          onClick={onClose}
        >
          {/* Modal panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-[1000px]
              overflow-hidden
              rounded-[9px]
              border border-[#E9A534]/25
              bg-[#210307]
              shadow-[0_40px_120px_rgba(0,0,0,0.55)]
            "
          >
            {/* Gold top line */}
            <span
              className="
                pointer-events-none absolute left-0 right-0 top-0 z-30 h-px
                bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent
              "
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                absolute right-4 top-4 z-40
                flex h-9 w-9 items-center justify-center
                rounded-full
                border border-[#E9A534]/40
                bg-[#210307]/90 backdrop-blur-sm
                text-[#E9C76D]
                transition-all duration-300
                hover:border-[#E9A534]/80 hover:bg-[#5A0E14]
                sm:right-6 sm:top-6 sm:h-10 sm:w-10
              "
            >
              <X size={16} strokeWidth={1.8} />
            </button>

            {/* ============================================================
                HEADER — sign info + chakra backdrop
            ============================================================ */}
            <header
              className="
                relative overflow-hidden
                border-b border-[#E9A534]/15
                px-6 py-10
                sm:px-10 sm:py-12
                lg:px-14 lg:py-14
              "
            >
              {/* Radial glow */}
              <div
                className="
                  pointer-events-none absolute -top-40 right-[-15%]
                  h-[500px] w-[500px] rounded-full
                  bg-[#650F18]/35 blur-[130px]
                "
              />
              <div
                className="
                  pointer-events-none absolute -bottom-40 left-[-10%]
                  h-[400px] w-[400px] rounded-full
                  bg-[#E9A534]/[0.06] blur-[120px]
                "
              />

              {/* Rotating chakra backdrop */}
              <div
                aria-hidden
                className="
                  pointer-events-none absolute right-[-80px] top-1/2
                  h-[400px] w-[400px] -translate-y-1/2
                  opacity-[0.14]
                  sm:right-[-40px] sm:h-[460px] sm:w-[460px]
                  lg:right-[2%] lg:h-[500px] lg:w-[500px] lg:opacity-[0.20]
                "
              >
                <img
                  src={heroZodiac}
                  alt="Cosmic Nidhi Sacred Zodiac Chart"
                  className="h-full w-full object-contain mix-blend-screen"
                  style={{
                    animation: "zodiacRotate 90s linear infinite",
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
                <div>
                  {/* Symbol + sign name */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span
                      className="
                        flex h-16 w-16 shrink-0 items-center justify-center
                        rounded-full
                        border border-[#E9A534]/45
                        bg-[#E9A534]/[0.10]
                        font-display text-[34px]
                        text-[#E9C76D]
                        shadow-[0_0_30px_rgba(233,165,52,0.18)]
                        sm:h-20 sm:w-20 sm:text-[42px]
                      "
                    >
                      {profile.symbol}
                    </span>

                    <div>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-[#E9C76D]">
                        Zodiac Profile
                      </p>
                      <h2 className="mt-2 font-display text-[40px] leading-[0.95] tracking-[-0.02em] text-[#FFF8EC] sm:text-[52px] lg:text-[60px]">
                        {sign.name}
                      </h2>
                    </div>
                  </div>

                  {/* Dates */}
                  <p className="mt-5 font-sans text-[14px] font-medium text-[#F5E5C7]/80 sm:text-[15px]">
                    {profile.dates}
                  </p>

                  {/* Element + traits */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span
                      className="
                        inline-flex items-center gap-2
                        rounded-full
                        border border-[#E9A534]/40
                        bg-[#E9A534]/[0.10]
                        px-4 py-1.5
                        font-sans text-[11px] font-bold
                        uppercase tracking-[0.18em]
                        text-[#E9C76D]
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E9A534]" />
                      {profile.element}
                    </span>

                    {profile.traits.map((trait) => (
                      <span
                        key={trait}
                        className="
                          font-sans text-[13px] font-medium
                          text-[#F5E5C7]/70
                        "
                      >
                        {trait}
                        <span className="ml-3 text-[#E9A534]/40">·</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            {/* ============================================================
                BODY
            ============================================================ */}
            <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              {/* Strengths + Challenges */}
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div
                  className="
                    rounded-[7px]
                    border border-[#E9A534]/15
                    bg-[#E9A534]/[0.04]
                    p-6
                  "
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-7 bg-[#E9A534]" />
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                      Strengths
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {profile.strengths.map((s) => (
                      <span
                        key={s}
                        className="
                          rounded-full
                          border border-[#E9A534]/35
                          bg-[#E9A534]/[0.08]
                          px-4 py-2
                          font-sans text-[13px] font-semibold
                          text-[#FFF1D8]
                        "
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="
                    rounded-[7px]
                    border border-[#C1272D]/20
                    bg-[#5A0E14]/[0.25]
                    p-6
                  "
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-7 bg-[#C1272D]" />
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#E9A0A0]">
                      Common Challenges
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {profile.challenges.map((c) => (
                      <span
                        key={c}
                        className="
                          rounded-full
                          border border-[#C1272D]/30
                          bg-[#C1272D]/[0.08]
                          px-4 py-2
                          font-sans text-[13px] font-medium
                          text-[#F5C9C9]
                        "
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ============================================================
                  RECOMMENDED CRYSTALS
              ============================================================ */}
              <section className="mt-12">
                <div className="mb-7 flex items-center gap-3">
                  <span className="h-px w-7 bg-[#E9A534]" />
                  <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                    Recommended Crystals
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {profile.crystals.map((crystal, i) => (
                    <motion.div
                      key={crystal.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="
                        group relative overflow-hidden
                        rounded-[7px]
                        border border-[#E9A534]/20
                        bg-gradient-to-b from-[#3C080D] via-[#2A0509] to-[#1F0306]
                        transition-all duration-500
                        hover:-translate-y-1
                        hover:border-[#E9A534]/55
                        hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)]
                      "
                    >
                      {/* Gold top line */}
                      <span
                        className="
                          pointer-events-none absolute left-0 right-0 top-0 h-px
                          bg-gradient-to-r from-transparent via-[#E9A534]/50 to-transparent
                          opacity-60 transition-opacity duration-300 group-hover:opacity-100
                        "
                      />

                      {/* Crystal image */}
                      <div className="relative h-44 overflow-hidden bg-[#210307]">
                        <img
                          src={crystal.image}
                          alt={crystal.name}
                          loading="lazy"
                          className="
                            h-full w-full object-cover
                            transition-transform duration-700
                            group-hover:scale-110
                          "
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F0306] via-transparent to-transparent" />

                        {/* Price tag */}
                        <span
                          className="
                            absolute right-3 top-3
                            rounded-full
                            border border-[#E9A534]/50
                            bg-[#210307]/90 backdrop-blur-sm
                            px-3 py-1
                            font-display text-[13px] font-semibold
                            text-[#E9C76D]
                          "
                        >
                          {crystal.price}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-display text-[20px] font-semibold leading-tight text-[#FFF8EC]">
                          {crystal.name}
                        </h3>

                        <p className="mt-2 font-sans text-[12px] leading-[1.65] text-[#D8C8A8]/70">
                          {crystal.reason}
                        </p>

                        <a
                          href="/products"
                          className="
                            group/btn mt-4 inline-flex items-center gap-2
                            font-sans text-[11px] font-bold uppercase tracking-[0.18em]
                            text-[#E9C76D]
                            transition-colors duration-300
                            hover:text-[#FFF8EC]
                          "
                        >
                          Add to Cart
                          <ArrowRight
                            size={13}
                            strokeWidth={2}
                            className="
                              transition-transform duration-300
                              group-hover/btn:translate-x-1
                            "
                          />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ============================================================
                  CTAs
              ============================================================ */}
              <section className="mt-12 border-t border-[#E9A534]/15 pt-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  {/* Primary — Shop Your Sign */}
                  <a
                    href="/products"
                    className="
                      group inline-flex items-center justify-center gap-2.5
                      rounded-full
                      border border-[#F2C66D]
                      bg-gradient-to-r from-[#F3D49B] to-[#DDB56D]
                      px-7 py-3.5
                      font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                      text-[#3C080D]
                      shadow-[0_10px_26px_rgba(0,0,0,0.22)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_15px_34px_rgba(0,0,0,0.32)]
                    "
                  >
                    <ShoppingBag size={15} strokeWidth={2} />
                    Shop Your {sign.name} Crystals
                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>

                  {/* Secondary — Personalised Recommendation */}
                  <a
                    href="#services"
                    className="
                      group inline-flex items-center justify-center gap-2.5
                      rounded-full
                      border border-[#E9A534]/50
                      bg-transparent
                      px-7 py-3.5
                      font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                      text-[#E9C76D]
                      transition-all duration-300
                      hover:bg-[#E9A534]/[0.10]
                      hover:border-[#E9A534]/80
                    "
                  >
                    <Sparkles size={15} strokeWidth={1.8} />
                    Need a Personalised Recommendation?
                  </a>

                  {/* Ghost — Book a Consultation */}
                  <a
                    href="tel:9560437360"
                    className="
                      group inline-flex items-center justify-center gap-2.5
                      rounded-full
                      border border-transparent
                      px-5 py-3.5
                      font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                      text-[#D8C8A8]/70
                      transition-colors duration-300
                      hover:text-[#E9C76D]
                    "
                  >
                    <Phone size={14} strokeWidth={1.8} />
                    Book a Consultation
                  </a>
                </div>

                {/* Bottom microcopy */}
                <p className="mt-6 font-sans text-[11px] leading-[1.7] text-[#D8C8A8]/50">
                  Crystal suggestions are based on traditional associations and are
                  offered for spiritual and educational purposes. They are not a
                  substitute for professional medical, financial or psychological advice.
                </p>
              </section>
            </div>
          </motion.div>

          {/* Chakra animation */}
          <style>{`
            @keyframes zodiacRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              @keyframes zodiacRotate { from, to { transform: none; } }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}