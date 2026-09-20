import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Calendar,
  Shield,
  Moon,
  ArrowRight,
  Clock,
  FileText,
  Phone,
  CheckCircle,
  Compass,
  Gem,
} from "lucide-react";
import Reveal from "../components/Reveal";
import BookingModal from "../components/BookingModal";
import Pricing from "../components/Pricing";

/* Zodiac chakra backdrop */
import heroZodiac from "../assets/hero-zodiac3.png";

/* ================================================================
   SERVICES DATA
================================================================ */

const SERVICES = [
  {
    id: "01",
    slug: "numerology",
    title: "Numerology Consultation",
    subtitle: "Decode Your Numbers. Understand Your Patterns. Discover Your Possibilities.",
    desc: "Numbers are more than just digits. In traditional numerology, numbers associated with your name and date of birth are interpreted to understand recurring patterns, tendencies and life themes.\n\nAt Cosmic Nidhi, we bring a modern and personalized approach to Vedic Numerology, combining traditional principles with detailed analysis and practical interpretation.\n\nBeyond Traditional Number Reading:\nOur approach goes beyond simply calculating numbers. We study the relationship between different numerical influences, look for recurring patterns and place them in the context of your individual circumstances. The objective is not simply to predict events, but to help you understand patterns, explore possibilities and gain a different perspective on your journey.\n\nYour Numbers. Your Patterns. Your Journey:\nEvery individual has a unique numerical profile. Discover what your numbers traditionally represent and explore your journey with a personalized Numerology consultation.",
    image:
      "https://cosmicnidhi.in/wp-content/uploads/2024/04/img_5-700x800.jpg",
    accent: "#E9A534",
    type: "Numerology",
    deliverables: "Numerology report, video/phone call, name-analysis notes",
    duration: "30–40 minutes",
    fee: "₹2,100",
    cta: "Explore Your Numbers",
    icon: Calendar,
    whatTitle: "What We Explore",
    whatToExpect: [
      "Birth & Life Path Numbers — Understand the traditional significance of your core numbers.",
      "Name Analysis — Explore the numerological relationship between your name and birth details.",
      "Name Correction — Traditional numerological guidance for selecting or modifying names.",
      "Business & Brand Name Analysis — Evaluate names from a numerological perspective.",
      "Mobile Number Analysis — Understand the traditional interpretation of your mobile number.",
      "Corporate Numerology",
      "Bank Account Number analysis.",
      "Signature Analysis — Explore the numerological perspective of your signature.",
      "Personal Year & Cycles — Understand recurring numerical cycles and their traditional interpretations.",
      "Compatibility Analysis — Explore relationship dynamics through numerological patterns.",
    ],
    whoItsFor:
      "Anyone curious about the symbolic relationship between their name, birth date, and personal themes.",
  },
  {
    id: "02",
    slug: "birth-chart",
    title: "Birth Chart / Janam Kundli Reading",
    subtitle: "Understand your life patterns & timing",
    desc: "A personalised birth-chart consultation uses your date, exact time and place of birth to explore selected themes such as personality patterns, relationships, work, strengths, challenges and upcoming periods. The session is tailored to your questions and does not present life as fixed or predetermined.",
    image:
      "https://cosmicnidhi.in/wp-content/uploads/2019/05/img_2-700x800.jpg",
    accent: "#C1272D",
    type: "Vedic & Western",
    deliverables:
      "Chart PDF, consultation call, written summary, recording, follow-up questions",
    duration: "30 minutes",
    fee: "₹2,100",
    cta: "Book Your Birth Chart Reading",
    icon: Star,
    whatToExpect: [
      "Personalised chart analysis",
      "Discussion of life patterns and timing",
      "Tailored to your specific questions",
      "No fixed or predetermined predictions",
    ],
    whoItsFor:
      "Anyone seeking clarity about their life path, relationships, career, and personal growth through the lens of their birth chart.",
  },
  {
    id: "03",
    slug: "vastu",
    title: "Applied Vastu Consultation",
    subtitle: "Align Your Space. Transform Your Experience.",
    desc: "Every space has its own character, layout and flow. Our Advanced Vastu Consultation brings together traditional Vastu principles with a structured and practical approach to understanding your home, office or commercial environment.\n\nWe study directions, zones, entrances, room placement, spatial relationships and elemental balance to identify areas that may benefit from thoughtful changes or traditional Vastu remedies.\n\nUnderstand your space. Create greater harmony. Make your environment work for you.",
    image: "https://www.grahai.com/images/doshas/mangal-dosha.png",
    accent: "#5A0E14",
    type: "Vastu",
    deliverables: "Annotated plan, recommendations, call · Location Visit: ₹5,100 · Map Gridding: ₹12/sq.ft",
    duration: "50–60 minutes",
    fee: "₹3,100",
    cta: "Review Your Space",
    icon: Shield,
    whatToExpect: [
      "Review of space orientation and layout",
      "Practical observations and suggestions",
      "Consideration of safety and regulations",
      "Follow-up recommendations",
    ],
    whoItsFor:
      "Homeowners, business owners, and anyone looking to harmonize their living or working space.",
  },
  {
    id: "04",
    slug: "kundli-matching",
    title: "Kundli Matching / Relationship Guidance",
    subtitle: "Understand the Connection. Explore the Compatibility. Strengthen the Journey.",
    desc: "Every relationship has its own unique dynamics. Through a comparative reading of two birth charts, we explore planetary influences, compatibility indicators, communication patterns, strengths and areas that may require greater understanding.\n\nOur approach goes beyond simply looking at traditional matching scores. It brings together relevant astrological perspectives to help you understand the patterns, possibilities and dynamics within a relationship.\n\nThe consultation is designed to encourage awareness, meaningful conversation and thoughtful reflection, helping you approach your relationship journey with greater clarity and understanding.",
    image:
      "https://www.hiastro.in/_next/image?url=https:%2F%2Fsteadfast-cows-9445c3a50f.media.strapiapp.com%2FUnlock_Zodiac_Love_Compatibility_Your_Cosmic_Guide_2bfc1451f0.jpg&w=1920&q=75",
    accent: "#C1272D",
    type: "Compatibility",
    deliverables: "Compatibility report and/or consultation · Both Bride & Groom DOB and Name required",
    duration: "30 minutes",
    fee: "₹2,100",
    cta: "Check Compatibility",
    icon: Moon,
    whatToExpect: [
      "Both Bride & Groom Full Name and Date of Birth required for chart matching",
      "Side-by-side birth chart comparison",
      "Communication pattern insights",
      "Relationship reflection and conversation",
      "Support for major life decisions",
    ],
    whoItsFor:
      "Couples, engaged partners, and anyone seeking to understand relationship dynamics.",
  },
];

/* ================================================================
   SERVICE CARD
================================================================ */

function ServiceCard({ service, index, onBook }) {
  const Icon = service.icon;

  return (
    <motion.article
      id={service.slug}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-[9px]
        border border-[#5A0E14]/12
        bg-[#FFFDF9]
        shadow-[0_10px_30px_rgba(60,8,13,0.06)]
        transition-all duration-500
        hover:-translate-y-1.5
        hover:border-[#E9A534]/50
        hover:shadow-[0_24px_55px_rgba(60,8,13,0.14)]
        scroll-mt-28
      "
    >
      {/* Gold top line */}
      <span
        className="
          pointer-events-none absolute left-0 right-0 top-0 z-10 h-px
          bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent
          opacity-0 transition-opacity duration-500 group-hover:opacity-100
        "
      />

      {/* ============================================
          IMAGE
      ============================================ */}
      <div className="relative h-60 overflow-hidden bg-[#F4E4C8]/40 sm:h-64">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3C080D]/70 via-[#3C080D]/10 to-transparent" />

        {/* Number badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#E9A534]/40 bg-[#FFF8EC]/92 px-3 py-1.5 backdrop-blur-sm">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
            {service.id}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute right-4 top-4 rounded-full border border-[#E9A534]/40 bg-[#FFF8EC]/92 px-3 py-1.5 backdrop-blur-sm">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
            {service.type}
          </span>
        </div>

        {/* Icon */}
        <div
          className="
            absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center
            rounded-full border border-[#E9A534]/45
            bg-[#FFF8EC]/92 backdrop-blur-sm
          "
        >
          <Icon
            className="h-5 w-5"
            style={{ color: service.accent }}
            strokeWidth={1.7}
          />
        </div>
      </div>

      {/* ============================================
          CONTENT
      ============================================ */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {service.fee && (
            <span className="rounded-full bg-[#C1272D]/10 px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#C1272D]">
              Fee: {service.fee}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A5A1F]">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.7} />
            {service.duration}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#E9A534]" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5A0E14]/55">
            {service.deliverables.split(",").length} Deliverables
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#3C080D] transition-colors duration-300 group-hover:text-[#8B2F2B]">
          {service.title}
        </h3>

        {/* Subtitle */}
        <p className="mt-1.5 font-sans text-[13px] font-medium text-[#C1272D]">
          {service.subtitle}
        </p>

        {/* Desc */}
        <p className="mt-3 font-sans text-[13.5px] leading-[1.7] text-[#2C1210]/75 text-justify whitespace-pre-line">
          {service.desc}
        </p>

        {/* What to expect */}
        <div className="mt-5 border-t border-[#5A0E14]/10 pt-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-6 bg-[#E9A534]" />
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
              {service.whatTitle || "What to Expect"}
            </p>
          </div>

          <ul className="space-y-2">
            {service.whatToExpect.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 font-sans text-[13px] leading-[1.6] text-[#2C1210]/75"
              >
                <CheckCircle
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color: service.accent }}
                  strokeWidth={1.8}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Who it's for */}
        <div className="mt-4 rounded-[7px] border border-[#E9A534]/20 bg-[#FDECC8]/30 p-4">
          <p className="mb-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
            Who It's For
          </p>
          <p className="font-sans text-[13px] leading-[1.7] text-[#2C1210]/75 text-justify">
            {service.whoItsFor}
          </p>
        </div>

        {/* Deliverables */}
        <div className="mt-4 flex items-start gap-3 rounded-[7px] border border-[#5A0E14]/10 bg-[#FFF7E9]/60 p-4">
          <FileText
            className="mt-0.5 h-4 w-4 shrink-0 text-[#C1272D]"
            strokeWidth={1.7}
          />
          <div className="min-w-0">
            <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
              Deliverables
            </p>
            <p className="font-sans text-[12.5px] leading-[1.6] text-[#2C1210]/70">
              {service.deliverables}
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => onBook?.(service)}
          className="
            group/btn mt-5 inline-flex w-full items-center justify-center gap-2.5
            rounded-full
            border border-[#F2C66D]
            bg-gradient-to-r from-[#F3D49B] to-[#DDB56D]
            px-6 py-3.5
            font-sans text-[12px] font-bold uppercase tracking-[0.16em]
            text-[#3C080D]
            shadow-[0_10px_26px_rgba(0,0,0,0.12)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_15px_34px_rgba(0,0,0,0.20)]
          "
        >
          {service.cta}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
            strokeWidth={2}
          />
        </button>
      </div>
    </motion.article>
  );
}

/* ================================================================
   PAGE
================================================================ */

export default function ServicesPage() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [bookingService, setBookingService] = useState(null);

  return (
    <main className="relative">

      {/* ============================================================
          DARK HERO BAND
      ============================================================ */}
      <section className="relative overflow-hidden border-b border-[#E9A534]/15 bg-[#180205] pb-16 pt-32 text-[#FFF8EC] md:pt-40 md:pb-20">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 right-[8%] h-[400px] w-[400px] rounded-full bg-[#650F18]/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[5%] h-[350px] w-[350px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        {/* Rotating chakra — right */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute top-1/2 -translate-y-1/2
            h-[440px] w-[440px] right-[-200px]
            opacity-[0.10] mix-blend-screen
            sm:right-[-160px] sm:h-[520px] sm:w-[520px]
            lg:right-[-120px] lg:h-[580px] lg:w-[580px] lg:opacity-[0.14]
            xl:right-[-60px] xl:h-[660px] xl:w-[660px] xl:opacity-[0.16]
          "
        >
          <img
            src={heroZodiac}
            alt=""
            className="h-full w-full object-contain"
            style={{ animation: "zodiacRotate 90s linear infinite" }}
          />
        </div>

        {/* Floating stars */}
        <span className="pointer-events-none absolute left-[12%] top-[28%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/70 shadow-[0_0_12px_rgba(233,165,52,0.6)]" />
        <span className="pointer-events-none absolute right-[14%] top-[22%] h-[2px] w-[2px] rounded-full bg-[#E9A534]/60" />
        <span className="pointer-events-none absolute right-[22%] bottom-[24%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/50" />

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#E9A534]/60" />
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                Our Services
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-5 max-w-[760px] font-display text-[42px] leading-[1.0] tracking-[-0.025em] text-[#FFF7E8] sm:text-[50px] md:text-[58px] lg:text-[66px]">
              Let's make some{" "}
              <span className="text-[#E9B957]">magic</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-5 max-w-[680px] font-sans text-[15px] leading-[1.7] text-[#F5E5C7]/85 sm:text-[16px] text-justify">
              Every consultation is thoughtfully personalized, combining the timeless wisdom of Vedic Numerology, Advanced Vastu and Ancient Vedic Astrology with a modern, analytical approach. Our approach is designed to help you understand, reflect and make informed personal choices, while always respecting your privacy, individuality and personal journey.
            </p>
          </Reveal>

          {/* Quick trust markers */}
          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[#E9A534]/15 pt-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                  <Compass className="h-3.5 w-3.5" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#E9C76D]">
                    Vedic & Western
                  </p>
                </div>
              </div>

              <span className="hidden h-4 w-px bg-[#E9A534]/20 sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                  <Star className="h-3.5 w-3.5" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#E9C76D]">
                    10+ Years Experience
                  </p>
                </div>
              </div>

              <span className="hidden h-4 w-px bg-[#E9A534]/20 sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                  <Shield className="h-3.5 w-3.5" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#E9C76D]">
                    Confidential
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E9A534]/30 to-transparent" />
      </section>

      {/* ============================================================
          LIGHT BODY — Service cards
      ============================================================ */}
      <section
        id="services"
        ref={sectionRef}
        className="relative overflow-hidden bg-[#FFF7E9] py-16 md:py-20"
      >
        <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#C1272D]/[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
          {/* Section eyebrow */}
          <Reveal>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-9 bg-[#C89846]" />
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.30em] text-[#8B612F]">
                Choose Your Reading
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="max-w-[760px] font-display text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-[#3C080D] sm:text-[40px] md:text-[46px]">
              Four ways to work with us —{" "}
              <span className="text-[#8B2F2B]">every session unique</span>
            </h2>
          </Reveal>

          {/* Grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {SERVICES.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} onBook={setBookingService} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING PLANS (accessible via #pricing)
      ============================================================ */}
      <Pricing />

      {/* ============================================================
          DARK CTA BAND
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#180205] py-20 text-[#FFF8EC] md:py-24">
        <div className="pointer-events-none absolute -top-40 right-[5%] h-[450px] w-[450px] rounded-full bg-[#650F18]/30 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[5%] h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.05] blur-[120px]" />

        {/* Small floating stars */}
        <span className="pointer-events-none absolute left-[10%] top-[30%] h-[2px] w-[2px] rounded-full bg-[#E9A534]/60" />
        <span className="pointer-events-none absolute right-[15%] bottom-[25%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/50" />

        <div className="relative z-10 mx-auto max-w-[900px] px-5 text-center sm:px-7 lg:px-10">
          <Reveal>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-[#E9A534]/60" />
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-[#E9C76D]">
                Ready to Begin?
              </p>
              <span className="h-px w-9 bg-[#E9A534]/60" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-5 font-display text-[36px] font-medium leading-[1.05] tracking-[-0.025em] text-[#FFF8EC] sm:text-[44px] md:text-[52px]">
              Start your <span className="text-[#E9B957]">journey</span> today
            </h2>
          </Reveal>

          <Reveal delay={180}>
            <p className="mx-auto mt-5 max-w-[520px] font-sans text-[14px] leading-[1.75] text-[#F5E5C7]/75 sm:text-[15px]">
              Book a consultation and take the first step toward clarity,
              confidence, and intentional living.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setBookingService(SERVICES[0])}
                className="
                  group inline-flex items-center justify-center gap-2.5
                  rounded-full border border-[#F2C66D]
                  bg-gradient-to-r from-[#F3D49B] to-[#DDB56D]
                  px-8 py-4
                  font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                  text-[#3C080D]
                  shadow-[0_10px_26px_rgba(0,0,0,0.30)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_15px_34px_rgba(0,0,0,0.40)]
                "
              >
                Book a Consultation
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </button>

              <a
                href="tel:9560437360"
                className="
                  group inline-flex items-center justify-center gap-2.5
                  rounded-full border border-[#E9A534]/50
                  bg-transparent
                  px-8 py-4
                  font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                  text-[#E9C76D]
                  transition-all duration-300
                  hover:border-[#E9A534]/85
                  hover:bg-[#E9A534]/[0.10]
                "
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
                Call Us Now
              </a>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-[#E9A534]/40" />
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D8C8A8]/55">
                Confidential · Compassionate · Clear
              </p>
              <span className="h-px w-6 bg-[#E9A534]/40" />
            </div>
          </Reveal>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E9A534]/25 to-transparent" />
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={Boolean(bookingService)}
        onClose={() => setBookingService(null)}
        initialService={bookingService}
      />

      {/* Chakra rotation */}
      <style>{`
        @keyframes zodiacRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes zodiacRotate { from, to { transform: none; } }
        }
      `}</style>
    </main>
  );
}