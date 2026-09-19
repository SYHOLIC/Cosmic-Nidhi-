import { Link } from "react-router-dom";
import { ZODIAC } from "../data/constants";
import Reveal from "./Reveal";
import Starfield from "./Starfield";
import { Moon, Sparkles } from "lucide-react";

import aries from "../assets/aries.png";
import taurus from "../assets/taurus.png";
import gemini from "../assets/gemini.png";
import cancer from "../assets/cancer.png";
import leo from "../assets/leo.png";
import virgo from "../assets/virgo.png";
import libra from "../assets/libra.png";
import scorpio from "../assets/scorpio.png";
import sagittarius from "../assets/sagittarius.png";
import capricorn from "../assets/capricorn.png";
import aquarius from "../assets/aquarius.png";
import pisces from "../assets/pisces.png";

/* ============================================================
   ZODIAC ICONS
============================================================ */

const ICONS = {
  Aries: aries,
  Taurus: taurus,
  Gemini: gemini,
  Cancer: cancer,
  Leo: leo,
  Virgo: virgo,
  Libra: libra,
  Scorpio: scorpio,
  Sagittarius: sagittarius,
  Capricorn: capricorn,
  Aquarius: aquarius,
  Pisces: pisces,
};

/* ============================================================
   ELEMENT STYLES
============================================================ */

const ELEMENT_STYLES = {
  Fire: {
    color: "#8C3028",
    background: "rgba(140,48,40,0.055)",
    border: "rgba(140,48,40,0.20)",
  },
  Earth: {
    color: "#76551F",
    background: "rgba(118,85,31,0.055)",
    border: "rgba(118,85,31,0.20)",
  },
  Air: {
    color: "#5B4A42",
    background: "rgba(91,74,66,0.055)",
    border: "rgba(91,74,66,0.19)",
  },
  Water: {
    color: "#713842",
    background: "rgba(113,56,66,0.055)",
    border: "rgba(113,56,66,0.19)",
  },
};

const getElementStyle = (element) =>
  ELEMENT_STYLES[element] || {
    color: "#6A413D",
    background: "rgba(90,14,20,0.045)",
    border: "rgba(90,14,20,0.17)",
  };

/* ============================================================
   ZODIAC CARD
============================================================ */

function SignCard({ sign, index }) {
  const icon = ICONS[sign.name];
  const elementStyle = getElementStyle(sign.element);

  /* "Aries" → "aries" */
  const slug = sign.name.toLowerCase();

  return (
    <Reveal delay={index * 25}>
      <Link
        to={`/zodiac/${slug}`}
        aria-label={`View ${sign.name} zodiac profile`}
        className="
          zodiac-card
          group
          relative
          flex
          h-full
          w-full
          min-h-[145px]
          flex-col
          items-center
          justify-center
          overflow-hidden
          rounded-[11px]
          border
          border-[#5A0E14]/[0.14]
          bg-[#FFFDF9]
          px-4
          py-5
          text-center
          shadow-[0_8px_24px_rgba(60,8,13,0.05)]
          transition-all
          duration-300
          hover:-translate-y-[3px]
          hover:border-[#C89846]/50
          hover:bg-[#FFFEFC]
          hover:shadow-[0_16px_36px_rgba(60,8,13,0.11)]
          focus:outline-none
          focus-visible:border-[#C89846]
          focus-visible:ring-2
          focus-visible:ring-[#C89846]/30
          sm:min-h-[155px]
          lg:min-h-[150px]
          xl:min-h-[158px]
        "
      >
        {/* HOVER BACKGROUND */}
        <span
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_0%,rgba(233,165,52,0.11),transparent_58%)]
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {/* CORNER SPARKLE */}
        <Sparkles
          aria-hidden
          size={13}
          strokeWidth={1.3}
          className="
            absolute
            right-[8px]
            top-[8px]
            text-[#C89846]/0
            transition-colors
            duration-300
            group-hover:text-[#C89846]/80
          "
        />

        {/* ICON */}
        <div
          className="
            relative
            z-10
            flex
            h-[56px]
            w-[56px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-300
            group-hover:-translate-y-1
            group-hover:scale-[1.06]
          "
          style={{
            borderColor: elementStyle.border,
            backgroundColor: elementStyle.background,
          }}
        >
          <img
            src={icon}
            alt={`${sign.name} zodiac sign`}
            loading="lazy"
            width={612}
            height={612}
            className="
              h-[42px]
              w-[42px]
              object-contain
              brightness-[0.62]
              contrast-[1.35]
              opacity-100
              transition-all
              duration-300
              group-hover:brightness-[0.52]
              group-hover:contrast-[1.45]
              group-hover:scale-110
            "
          />
        </div>

        {/* NAME */}
        <span
          className="
            relative
            z-10
            mt-[10px]
            font-display
            text-[20px]
            font-medium
            leading-none
            tracking-[-0.005em]
            text-[#481117]
            transition-colors
            duration-300
            group-hover:text-[#8B2F2B]
            sm:text-[21px]
            lg:text-[22px]
          "
        >
          {sign.name}
        </span>

        {/* DATES */}
        <span
          className="
            relative
            z-10
            mt-[7px]
            font-sans
            text-[10px]
            font-medium
            leading-none
            tracking-[0.025em]
            text-[#604A43]/90
            sm:text-[10.5px]
          "
        >
          {sign.dates}
        </span>

        {/* ELEMENT */}
        <span
          className="
            relative
            z-10
            mt-[6px]
            font-sans
            text-[8px]
            font-bold
            uppercase
            tracking-[0.22em]
            opacity-80
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
          style={{ color: elementStyle.color }}
        >
          {sign.element}
        </span>

        {/* BOTTOM ACCENT */}
        <span
          aria-hidden
          className="
            absolute
            bottom-0
            left-1/2
            h-[2px]
            w-0
            -translate-x-1/2
            bg-[#C89846]
            transition-all
            duration-300
            group-hover:w-[58%]
          "
        />
      </Link>
    </Reveal>
  );
}

/* ============================================================
   CELESTIAL PANEL (unchanged)
============================================================ */

function CelestialPanel() {
  return (
    <Reveal delay={160}>
      <div
        className="
          celestial-visual
          relative
          mx-auto
          flex
          h-[390px]
          w-full
          max-w-[370px]
          items-center
          justify-center
          lg:h-[470px]
          lg:max-w-[365px]
          xl:h-[500px]
          xl:max-w-[390px]
        "
      >
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E9A534]/[0.07] blur-[90px]" />
        <div className="absolute left-1/2 top-1/2 h-[345px] w-[345px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C89846]/20" />
        <div className="absolute left-1/2 top-1/2 h-[305px] w-[305px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#C89846]/20" />
        <div className="absolute left-1/2 top-1/2 h-[258px] w-[258px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8D342D]/10" />

        <div aria-hidden className="absolute left-[11%] top-[15%]">
          <div className="relative h-9 w-9">
            <span className="absolute left-1/2 top-0 h-9 w-px -translate-x-1/2 bg-[#C89846]/40" />
            <span className="absolute left-0 top-1/2 h-px w-9 -translate-y-1/2 bg-[#C89846]/40" />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C89846]" />
          </div>
        </div>

        <div aria-hidden className="absolute right-[10%] top-[11%]">
          <div className="relative h-8 w-8">
            <span className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-[#C89846]/35" />
            <span className="absolute left-0 top-1/2 h-px w-8 -translate-y-1/2 bg-[#C89846]/35" />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C89846]" />
          </div>
        </div>

        <div aria-hidden className="absolute bottom-[15%] left-[13%]">
          <div className="relative h-7 w-7">
            <span className="absolute left-1/2 top-0 h-7 w-px -translate-x-1/2 bg-[#C89846]/30" />
            <span className="absolute left-0 top-1/2 h-px w-7 -translate-y-1/2 bg-[#C89846]/30" />
          </div>
        </div>

        {/* EDITORIAL CARD */}
        <div
          className="
            relative z-10 h-[320px] w-[218px] overflow-hidden
            rounded-[15px] border border-[#C89846]/35
            bg-gradient-to-br from-[#FFFDF8] via-[#F8ECD8] to-[#F0D7B0]
            shadow-[0_28px_65px_rgba(90,14,20,0.12)]
            lg:h-[355px] lg:w-[238px] xl:h-[370px] xl:w-[248px]
          "
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.23]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 20%, rgba(233,165,52,0.20) 1px, transparent 1px),
                radial-gradient(circle at 75% 70%, rgba(90,14,20,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px, 42px 42px",
            }}
          />

          <div aria-hidden className="absolute inset-[10px] rounded-[11px] border border-[#C89846]/20" />

          <div className="absolute left-1/2 top-[20px] -translate-x-1/2">
            <Sparkles size={18} strokeWidth={1.1} className="text-[#A97C3D]" />
          </div>

          <div
            className="
              absolute left-1/2 top-[68px] flex h-[158px] w-[158px]
              -translate-x-1/2 items-center justify-center
              rounded-full border border-[#C89846]/35 bg-[#FDF8EE]
              lg:h-[170px] lg:w-[170px]
            "
          >
            <div aria-hidden className="absolute inset-[17px] rounded-full border border-[#C89846]/20" />

            <div className="relative h-[82px] w-[82px] rounded-full bg-[#B98B4A] shadow-[0_10px_25px_rgba(180,137,72,0.16)]">
              <div className="absolute right-[-12px] top-[-3px] h-[82px] w-[82px] rounded-full bg-[#FDF8EE]" />
              <Moon
                size={32}
                strokeWidth={1}
                className="absolute left-[20px] top-[28px] rotate-[-18deg] text-[#B98B4A]"
              />
            </div>
          </div>

          <div className="absolute bottom-[27px] left-0 right-0 text-center">
            <p className="font-sans text-[7px] font-semibold uppercase tracking-[0.28em] text-[#967042]">
              Your sign
            </p>
            <p className="mx-auto mt-2 max-w-[165px] font-display text-[19px] font-medium leading-[1.04] text-[#5A0E14] lg:text-[20px]">
              holds the key
              <br />
              to your cosmic
              <br />
              journey.
            </p>
          </div>
        </div>

        <span className="absolute left-[5%] top-[49%] h-[6px] w-[6px] rounded-full bg-[#C89846] shadow-[0_0_14px_rgba(200,152,70,0.45)]" />
        <span className="absolute bottom-[27%] right-[7%] h-[7px] w-[7px] rounded-full bg-[#C89846]/75 shadow-[0_0_14px_rgba(200,152,70,0.35)]" />
      </div>
    </Reveal>
  );
}

/* ============================================================
   MAIN SIGNS SECTION
============================================================ */

function Signs() {
  return (
    <section
      id="signs"
      className="
        signs-section
        relative
        overflow-hidden
        border-y
        border-[#5A0E14]/[0.08]
        bg-[#FFF8EC]
        text-[#3C080D]
        lg:min-h-[calc(100svh-88px)]
        lg:h-[calc(100svh-88px)]
      "
    >
      {/* BACKGROUND */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_77%_43%,rgba(233,165,52,0.09),transparent_24%),radial-gradient(circle_at_16%_25%,rgba(90,14,20,0.045),transparent_30%),linear-gradient(135deg,#FFF8EC_0%,#FCF0DD_54%,#FFF8EC_100%)]
        "
      />

      <div className="pointer-events-none absolute right-[-130px] top-[3%] h-[520px] w-[520px] rounded-full bg-[#E9A534]/[0.065] blur-[125px]" />
      <div className="pointer-events-none absolute bottom-[-150px] left-[-130px] h-[430px] w-[430px] rounded-full bg-[#5A0E14]/[0.03] blur-[115px]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(90,14,20,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(90,14,20,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      />

      <Starfield count={22} starColor="#8B6336" />

      {/* MAIN CONTENT */}
      <div
        className="
          relative z-10 mx-auto flex h-full w-full max-w-[1500px]
          items-start px-5 pt-[38px] pb-[30px]
          sm:px-7 sm:pt-[44px] sm:pb-[32px]
          lg:px-10 lg:pt-[38px] lg:pb-[28px]
          xl:pt-[44px]
        "
      >
        <div className="grid w-full items-start gap-8 lg:grid-cols-[1.9fr_0.85fr] lg:gap-10 xl:grid-cols-[1.95fr_0.8fr] xl:gap-12">
          {/* LEFT CONTENT */}
          <div className="w-full">
            {/* EYEBROW */}
            <Reveal>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-9 bg-[#C89846]" />
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.30em] text-[#8B612F]">
                  Sun Signs
                </p>
              </div>
            </Reveal>

            {/* HEADING */}
            <Reveal delay={80}>
              <h2
                className="
                  max-w-[760px] font-display text-[42px] font-medium
                  leading-[0.96] tracking-[-0.028em] text-[#3C080D]
                  sm:text-[50px] md:text-[56px] lg:text-[60px] xl:text-[64px]
                "
              >
                Choose your{" "}
                <span className="text-[#8B2F2B]">Zodiac Sign</span>
              </h2>
            </Reveal>

            {/* DESCRIPTION */}
            <Reveal delay={140}>
              <p
                className="
                  mt-4 max-w-[560px] font-sans text-[14px]
                  leading-[1.65] text-[#624740]/80
                  sm:text-[15px] lg:text-[16px]
                "
              >
                Tap your sign for a personalised reading rooted in
                its element, ruling planet and distinctive traits.
              </p>
            </Reveal>

            {/* ZODIAC GRID */}
            <div
              className="
                mt-7 grid grid-cols-2 gap-[11px]
                sm:grid-cols-3 sm:gap-[12px]
                md:grid-cols-4
                lg:mt-8 lg:grid-cols-6 lg:gap-[12px]
                xl:gap-[13px]
              "
            >
              {ZODIAC.map((sign, index) => (
                <SignCard
                  key={sign.name}
                  sign={sign}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="hidden lg:block">
            <CelestialPanel />
          </div>
        </div>
      </div>

      {/* MOBILE CELESTIAL PANEL */}
      <div className="px-5 pb-10 sm:px-7 lg:hidden">
        <CelestialPanel />
      </div>

      {/* BOTTOM LINE */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%]
          -translate-x-1/2
          bg-gradient-to-r from-transparent via-[#C89846]/25 to-transparent
        "
      />

      <style>{`
        @media (max-width: 1023px) {
          .signs-section { min-height: auto; height: auto; }
        }
        @media (max-width: 767px) {
          .zodiac-card { min-height: 125px; }
        }
        @media (max-width: 480px) {
          .zodiac-card { min-height: 120px; }
          .zodiac-card img { height: 36px; width: 36px; }
        }
        @media (prefers-reduced-motion: reduce) {
          #signs *, #signs *::before, #signs *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Signs;