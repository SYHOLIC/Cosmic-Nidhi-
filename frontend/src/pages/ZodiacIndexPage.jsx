import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sun,
  Star,
  CheckCircle2,
} from "lucide-react";
import Reveal from "../components/Reveal";
import SEOHead from "../components/SEOHead";

/* Zodiac icons */
import aries from "../assets/aries.webp";
import taurus from "../assets/taurus.webp";
import gemini from "../assets/gemini.webp";
import cancer from "../assets/cancer.webp";
import leo from "../assets/leo.webp";
import virgo from "../assets/virgo.webp";
import libra from "../assets/libra.webp";
import scorpio from "../assets/scorpio.webp";
import sagittarius from "../assets/sagittarius.webp";
import capricorn from "../assets/capricorn.webp";
import aquarius from "../assets/aquarius.webp";
import pisces from "../assets/pisces.webp";

const ZODIAC_SIGNS = [
  {
    name: "Aries",
    hindiName: "Mesh (मेष)",
    slug: "aries",
    element: "Fire",
    dates: "Mar 21 – Apr 19",
    rulingPlanet: "Mars (Mangal)",
    qualities: ["Bold", "Pioneering", "Courageous", "Dynamic"],
    icon: aries,
    color: "from-red-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-red-600",
  },
  {
    name: "Taurus",
    hindiName: "Vrishabh (वृषभ)",
    slug: "taurus",
    element: "Earth",
    dates: "Apr 20 – May 20",
    rulingPlanet: "Venus (Shukra)",
    qualities: ["Reliable", "Grounded", "Sensual", "Resilient"],
    icon: taurus,
    color: "from-emerald-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-emerald-600",
  },
  {
    name: "Gemini",
    hindiName: "Mithun (मिथुन)",
    slug: "gemini",
    element: "Air",
    dates: "May 21 – Jun 20",
    rulingPlanet: "Mercury (Budh)",
    qualities: ["Curious", "Adaptable", "Witty", "Intellectual"],
    icon: gemini,
    color: "from-amber-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-amber-500",
  },
  {
    name: "Cancer",
    hindiName: "Kark (कर्क)",
    slug: "cancer",
    element: "Water",
    dates: "Jun 21 – Jul 22",
    rulingPlanet: "Moon (Chandra)",
    qualities: ["Intuitive", "Nurturing", "Protective", "Empathetic"],
    icon: cancer,
    color: "from-blue-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-blue-500",
  },
  {
    name: "Leo",
    hindiName: "Simha (सिंह)",
    slug: "leo",
    element: "Fire",
    dates: "Jul 23 – Aug 22",
    rulingPlanet: "Sun (Surya)",
    qualities: ["Charismatic", "Generous", "Loyal", "Magnificent"],
    icon: leo,
    color: "from-yellow-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-yellow-500",
  },
  {
    name: "Virgo",
    hindiName: "Kanya (कन्या)",
    slug: "virgo",
    element: "Earth",
    dates: "Aug 23 – Sep 22",
    rulingPlanet: "Mercury (Budh)",
    qualities: ["Analytical", "Helpful", "Precise", "Devoted"],
    icon: virgo,
    color: "from-teal-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-teal-500",
  },
  {
    name: "Libra",
    hindiName: "Tula (तुला)",
    slug: "libra",
    element: "Air",
    dates: "Sep 23 – Oct 22",
    rulingPlanet: "Venus (Shukra)",
    qualities: ["Diplomatic", "Artistic", "Balanced", "Harmonious"],
    icon: libra,
    color: "from-pink-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-pink-500",
  },
  {
    name: "Scorpio",
    hindiName: "Vrishchik (वृश्चिक)",
    slug: "scorpio",
    element: "Water",
    dates: "Oct 23 – Nov 21",
    rulingPlanet: "Mars / Ketu",
    qualities: ["Passionate", "Transformational", "Profound", "Brave"],
    icon: scorpio,
    color: "from-purple-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-purple-500",
  },
  {
    name: "Sagittarius",
    hindiName: "Dhanu (धनु)",
    slug: "sagittarius",
    element: "Fire",
    dates: "Nov 22 – Dec 21",
    rulingPlanet: "Jupiter (Guru)",
    qualities: ["Philosophical", "Adventurous", "Optimistic", "Free-Spirited"],
    icon: sagittarius,
    color: "from-orange-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-orange-500",
  },
  {
    name: "Capricorn",
    hindiName: "Makar (मकर)",
    slug: "capricorn",
    element: "Earth",
    dates: "Dec 22 – Jan 19",
    rulingPlanet: "Saturn (Shani)",
    qualities: ["Disciplined", "Ambitious", "Strategic", "Patient"],
    icon: capricorn,
    color: "from-stone-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-stone-400",
  },
  {
    name: "Aquarius",
    hindiName: "Kumbh (कुंभ)",
    slug: "aquarius",
    element: "Air",
    dates: "Jan 20 – Feb 18",
    rulingPlanet: "Saturn / Rahu",
    qualities: ["Visionary", "Humanitarian", "Original", "Independent"],
    icon: aquarius,
    color: "from-cyan-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-cyan-400",
  },
  {
    name: "Pisces",
    hindiName: "Meen (मीन)",
    slug: "pisces",
    element: "Water",
    dates: "Feb 19 – Mar 20",
    rulingPlanet: "Jupiter (Guru)",
    qualities: ["Mystical", "Compassionate", "Creative", "Spiritual"],
    icon: pisces,
    color: "from-indigo-900/40 via-[#5A0E14]/40 to-transparent",
    accent: "text-indigo-400",
  },
];

const ELEMENTS = [
  { name: "All", icon: Compass },
  { name: "Fire", icon: Flame, color: "text-red-500" },
  { name: "Earth", icon: Mountain, color: "text-emerald-500" },
  { name: "Air", icon: Wind, color: "text-sky-400" },
  { name: "Water", icon: Droplets, color: "text-blue-500" },
];

export default function ZodiacIndexPage() {
  const [selectedElement, setSelectedElement] = useState("All");

  const filteredSigns = ZODIAC_SIGNS.filter(
    (s) => selectedElement === "All" || s.element === selectedElement
  );

  return (
    <>
      <SEOHead
        pageName="zodiac"
        fallbackTitle="12 Zodiac Signs (Rashi) Guide | Cosmic Nidhi"
        fallbackDescription="Explore in-depth Vedic & Western astrology profiles for all 12 Zodiac signs. Discover ruling planets, personality traits, lucky gemstones, and cosmic remedies."
        fallbackKeywords="12 zodiac signs, rashifal, astrology signs guide, lucky gemstones by zodiac, horoscope traits"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Zodiac Signs", url: "/zodiac" },
        ]}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-[#E9A534]/15 bg-[#170205] pt-32 pb-16 sm:pt-40 sm:pb-24">
        {/* Glows */}
        <div className="pointer-events-none absolute -top-40 right-10 h-[500px] w-[500px] rounded-full bg-[#E9A534]/[0.08] blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-[400px] w-[400px] rounded-full bg-[#C1272D]/[0.1] blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#E9A534]" />
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                Vedic Astrology & Solar Archetypes
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-4 max-w-[850px] font-display text-[38px] leading-[1.05] tracking-[-0.02em] text-[#FFF8EC] sm:text-[52px] md:text-[62px]">
              Explore The Twelve <span className="text-[#E9B957]">Zodiac Signs</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-5 max-w-[680px] font-sans text-[15px] leading-relaxed text-[#F5E5C7]/80 sm:text-[17px]">
              Every zodiac sign carries a sacred cosmic blueprint — shaping personality,
              destiny, emotional currents, and spiritual strengths. Click on any sign to
              read its comprehensive standalone profile and remedial gemstone guides.
            </p>
          </Reveal>

          {/* Element Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {ELEMENTS.map((el) => {
              const Icon = el.icon;
              const isActive = selectedElement === el.name;
              return (
                <button
                  key={el.name}
                  onClick={() => setSelectedElement(el.name)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "border border-[#E9A534] bg-[#E9A534] text-[#3C080D] shadow-[0_4px_20px_rgba(233,165,52,0.3)]"
                      : "border border-[#E9A534]/20 bg-white/[0.04] text-[#FFF8EC]/75 hover:border-[#E9A534]/50 hover:bg-white/[0.08]"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${el.color || ""}`} />
                  <span>{el.name} Elements</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="relative bg-[#FFF7E9] py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSigns.map((sign, idx) => (
              <motion.div
                key={sign.slug}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-6 shadow-[0_8px_30px_rgba(60,8,13,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E9A534]/60 hover:shadow-[0_20px_45px_rgba(60,8,13,0.12)]"
              >
                {/* Top gradient highlight */}
                <div
                  className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${sign.color} pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity`}
                />

                <div className="relative z-10">
                  {/* Top Bar with Icon & Element */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#E9A534]/30 bg-[#FFFDF9] p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                      <img
                        src={sign.icon}
                        alt={sign.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="rounded-full border border-[#5A0E14]/15 bg-[#FDECC8]/40 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-[#8A5A1F]">
                      {sign.element}
                    </span>
                  </div>

                  {/* Title & Dates */}
                  <div className="mt-5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-[24px] font-bold text-[#3C080D]">
                        {sign.name}
                      </h3>
                      <span className="font-sans text-[11px] font-semibold text-[#8A5A1F]">
                        {sign.hindiName}
                      </span>
                    </div>
                    <p className="mt-1 font-sans text-[12px] font-medium text-[#6B3A2A]/75">
                      {sign.dates}
                    </p>
                  </div>

                  {/* Ruling Planet */}
                  <div className="mt-3.5 flex items-center gap-1.5 font-sans text-xs text-[#6B3A2A]">
                    <Sun className="h-3.5 w-3.5 text-[#E9A534] shrink-0" />
                    <span>Ruler: <strong>{sign.rulingPlanet}</strong></span>
                  </div>

                  {/* Traits Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {sign.qualities.map((q) => (
                      <span
                        key={q}
                        className="rounded-md border border-[#5A0E14]/10 bg-white px-2 py-0.5 font-sans text-[10px] font-medium text-[#3C080D]"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Link to Dedicated Page */}
                <div className="relative z-10 mt-6 pt-4 border-t border-[#5A0E14]/10">
                  <Link
                    to={`/zodiac/${sign.slug}`}
                    className="inline-flex w-full items-center justify-between rounded-lg bg-[#5A0E14]/[0.06] px-4 py-2.5 font-sans text-[12px] font-bold text-[#5A0E14] transition-all hover:bg-[#5A0E14] hover:text-[#FFF8EC]"
                  >
                    <span>Read Full Profile</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
