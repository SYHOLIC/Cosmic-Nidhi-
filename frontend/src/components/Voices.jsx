import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useReveal } from "../hooks/useReveal";
import Reveal from "./Reveal";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";

import starsTexture from "../assets/about.webp";

/* ============================================================
   MARQUEE ITEMS
============================================================ */

const MARQUEE_ITEMS = [
  "Kundli Reading",
  "Guna Milan",
  "Vastu",
  "Gemstone Remedies",
  "Dasha Timing",
  "Nakshatra Study",
  "Muhurat",
  "Birth Chart",
  "Planetary Alignment",
  "Mangal Dosha",
  "Rahu Ketu",
  "Sade Sati",
];

/* ============================================================
   TESTIMONIALS
============================================================ */

const QUOTES = [
  {
    q: "She read my chart and named a year that had quietly changed everything. I hadn't told her a thing.",
    a: "Ritika S., Delhi",
    initials: "RS",
    location: "Delhi",
    service: "Birth Chart Reading",
  },
  {
    q: "The matching session was the most level-headed conversation our families had all year.",
    a: "Aman & Pooja, Gurugram",
    initials: "AP",
    location: "Gurugram",
    service: "Guna Milan",
  },
  {
    q: "Practical remedies, no fear-selling. That's rare in this field.",
    a: "Vikram N., Mumbai",
    initials: "VN",
    location: "Mumbai",
    service: "Astrology Consultation",
  },
  {
    q: "I finally understood why certain patterns kept repeating. The reading gave me a roadmap.",
    a: "Priya M., Bangalore",
    initials: "PM",
    location: "Bangalore",
    service: "Birth Chart Reading",
  },
  {
    q: "The gemstone recommendation worked wonders. I feel more grounded and focused.",
    a: "Rahul S., Pune",
    initials: "RS",
    location: "Pune",
    service: "Gemstone Consultation",
  },
];

/* ============================================================
   MARQUEE
============================================================ */

function Marquee() {
  const marqueeItems = [
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
  ];

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#E9A534]/10
        bg-[#5A0E14]/10
        py-[12px]
        sm:py-[14px]
        lg:py-[15px]
      "
    >
      <motion.div
        className="
          flex
          w-max
          items-center
          whitespace-nowrap
        "
        animate={{
          x: ["0%", "-33.3333%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {marqueeItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="
              flex
              shrink-0
              items-center
            "
          >
            <span
              className="
                px-6
                font-display
                text-[15px]
                italic
                text-[#DDBB78]/75
                sm:px-8
                sm:text-[17px]
                lg:px-10
                lg:text-[18px]
              "
            >
              {item}
            </span>

            <span
              className="
                text-[12px]
                text-[#E9A534]
                sm:text-[14px]
              "
            >
              ✦
            </span>
          </div>
        ))}
      </motion.div>

      {/* Side fades */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-10
          w-16
          bg-gradient-to-r
          from-[#180205]
          to-transparent
          sm:w-24
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-10
          w-16
          bg-gradient-to-l
          from-[#180205]
          to-transparent
          sm:w-24
        "
      />
    </div>
  );
}

/* ============================================================
   STAR RATING
============================================================ */

function Stars() {
  return (
    <div className="flex items-center gap-[4px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className="
            font-serif
            text-[13px]
            leading-none
            text-[#E9A534]
            sm:text-[14px]
          "
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ============================================================
   SIDE REVIEW
============================================================ */

function SideReview({ item, side }) {
  return (
    <motion.article
      key={`${side}-${item.a}`}
      initial={{
        opacity: 0,
        x: side === "left" ? -25 : 25,
      }}
      animate={{
        opacity: 0.30,
        x: 0,
      }}
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`
        pointer-events-none
        absolute
        top-1/2
        hidden
        -translate-y-1/2
        overflow-hidden
        rounded-[8px]
        border
        border-[#E9A534]/[0.08]
        bg-gradient-to-br
        from-[#460A12]/90
        via-[#36080E]/85
        to-[#240307]/90
        shadow-[0_20px_55px_rgba(0,0,0,0.20)]
        lg:block

        h-[175px]
        w-[275px]
        p-5

        xl:h-[195px]
        xl:w-[315px]
        xl:p-6

        ${
          side === "left"
            ? "left-[-45px] xl:left-[-75px]"
            : "right-[-45px] xl:right-[-75px]"
        }
      `}
    >
      {/* Fade overlay */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          ${
            side === "left"
              ? "bg-gradient-to-r from-[#180205]/70 to-transparent"
              : "bg-gradient-to-l from-[#180205]/70 to-transparent"
          }
        `}
      />

      <div className="relative z-10 flex items-center gap-3">
        <div
          className="
            flex
            h-[42px]
            w-[42px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#E9A534]/22
            bg-[#FFF8EC]/[0.035]
            font-display
            text-[12px]
            text-[#E9C76D]/75
          "
        >
          {item.initials}
        </div>

        <div className="min-w-0">
          <p
            className="
              truncate
              font-display
              text-[14px]
              text-[#F2E1C6]/80
            "
          >
            {item.a}
          </p>

          <p
            className="
              mt-[3px]
              font-sans
              text-[8px]
              uppercase
              tracking-[0.16em]
              text-[#D8C8A8]/40
            "
          >
            {item.location}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <Stars />
      </div>

      <p
        className="
          relative
          z-10
          mt-4
          line-clamp-3
          font-sans
          text-[9px]
          leading-[1.65]
          text-[#E9DDC8]/40
          xl:text-[10px]
        "
      >
        {item.q}
      </p>
    </motion.article>
  );
}

/* ============================================================
   TESTIMONIAL CAROUSEL
============================================================ */

function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const total = QUOTES.length;

  /* ==========================================================
     AUTOMATIC CHANGE
  ========================================================== */

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setDirection(1);

      setActiveIndex((current) => {
        return (current + 1) % total;
      });
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, total]);

  /* ==========================================================
     NEXT / PREVIOUS
  ========================================================== */

  const goNext = () => {
    setDirection(1);

    setActiveIndex(
      (current) => (current + 1) % total
    );
  };

  const goPrevious = () => {
    setDirection(-1);

    setActiveIndex(
      (current) =>
        current === 0
          ? total - 1
          : current - 1
    );
  };

  const goTo = (index) => {
    if (index === activeIndex) return;

    setDirection(
      index > activeIndex ? 1 : -1
    );

    setActiveIndex(index);
  };

  /* ==========================================================
     ITEMS
  ========================================================== */

  const previousIndex =
    activeIndex === 0
      ? total - 1
      : activeIndex - 1;

  const nextIndex =
    (activeIndex + 1) % total;

  const previousItem =
    QUOTES[previousIndex];

  const currentItem =
    QUOTES[activeIndex];

  const nextItem =
    QUOTES[nextIndex];

  return (
    <div
      className="
        relative
        mx-auto
        w-full
        max-w-[1280px]
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ======================================================
          STAGE
      ====================================================== */}

      <div
        className="
          relative
          flex
          min-h-[370px]
          items-center
          justify-center
          overflow-visible
          sm:min-h-[410px]
          md:min-h-[430px]
          lg:min-h-[450px]
        "
      >
        {/* ====================================================
            CELESTIAL ORBITS
        ==================================================== */}

        <motion.div
          aria-hidden
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[300px]
            w-[720px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[50%]
            border
            border-[#E9A534]/[0.045]
          "
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 75,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          aria-hidden
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[250px]
            w-[600px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[50%]
            border
            border-[#E9A534]/[0.035]
          "
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* ====================================================
            LEFT SIDE
        ==================================================== */}

        <SideReview
          item={previousItem}
          side="left"
        />

        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <SideReview
          item={nextItem}
          side="right"
        />

        {/* ====================================================
            LEFT BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={goPrevious}
          aria-label="Previous testimonial"
          className="
            absolute
            left-[8px]
            top-1/2
            z-50
            flex
            h-[40px]
            w-[40px]
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[#E9A534]/40
            bg-[#210306]/95
            text-[#E9C76D]
            shadow-[0_10px_25px_rgba(0,0,0,0.28)]
            transition-all
            duration-300
            hover:border-[#E9A534]/75
            hover:bg-[#5A0E14]
            sm:left-[18px]
            sm:h-[43px]
            sm:w-[43px]
            lg:left-[calc(50%-345px)]
            xl:left-[calc(50%-365px)]
          "
        >
          <ChevronLeft
            size={19}
            strokeWidth={1.35}
          />
        </button>

        {/* ====================================================
            MAIN CARD
        ==================================================== */}

        <div
          className="
            relative
            z-30
            w-full
            max-w-[610px]
            sm:max-w-[650px]
            lg:max-w-[690px]
          "
        >
          {/* glow */}

          <div
            aria-hidden
            className="
              pointer-events-none
              absolute
              inset-[-40px]
              rounded-[40px]
              bg-[#E9A534]/[0.035]
              blur-[60px]
            "
          />

          <AnimatePresence
            mode="wait"
            custom={direction}
          >
            <motion.article
              key={activeIndex}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction * 55,
                scale: 0.975,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: direction * -55,
                scale: 0.975,
              }}
              transition={{
                duration: 0.52,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                relative
                overflow-hidden
                rounded-[9px]
                border
                border-[#E9A534]/[0.17]
                bg-gradient-to-br
                from-[#4B0B14]
                via-[#3A080F]
                to-[#270307]
                px-7
                py-6
                shadow-[0_30px_90px_rgba(0,0,0,0.34)]
                sm:px-9
                sm:py-7
                lg:px-10
                lg:py-8
              "
            >
              {/* Top gold line */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-[28px]
                  right-[28px]
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-[#E9A534]/42
                  to-transparent
                "
              />

              {/* Decorative quote */}

              <Quote
                aria-hidden
                size={110}
                strokeWidth={0.7}
                className="
                  pointer-events-none
                  absolute
                  right-[10px]
                  top-[10px]
                  text-[#E9A534]/[0.045]
                "
              />

              {/* =================================================
                  RATING
              ================================================= */}

              <div className="relative z-10 flex items-center justify-between">
                <Stars />

                <span
                  className="
                    font-sans
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-[#D8C8A8]/40
                    sm:text-[9px]
                  "
                >
                  Verified Client
                </span>
              </div>

              {/* =================================================
                  QUOTE
              ================================================= */}

              <blockquote
                className="
                  relative
                  z-10
                  mt-5
                  font-display
                  text-[20px]
                  font-medium
                  leading-[1.48]
                  tracking-[-0.01em]
                  text-[#FFF1D8]
                  sm:text-[22px]
                  lg:text-[24px]
                  lg:leading-[1.50]
                "
              >
                “{currentItem.q}”
              </blockquote>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div
                className="
                  my-6
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-[#E9A534]/22
                  via-[#E9A534]/9
                  to-transparent
                "
              />

              {/* =================================================
                  CLIENT
              ================================================= */}

              <div
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div className="flex items-center gap-3">

                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-[48px]
                      w-[48px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E9A534]/45
                      bg-gradient-to-br
                      from-[#711A24]
                      to-[#2A0509]
                      font-display
                      text-[13px]
                      font-medium
                      text-[#F0CF82]
                      shadow-[0_0_22px_rgba(233,165,52,0.08)]
                      sm:h-[52px]
                      sm:w-[52px]
                      sm:text-[14px]
                    "
                  >
                    {currentItem.initials}
                  </div>

                  <div>
                    <p
                      className="
                        font-display
                        text-[15px]
                        font-medium
                        text-[#FFF1D6]
                        sm:text-[17px]
                      "
                    >
                      {currentItem.a}
                    </p>

                    <p
                      className="
                        mt-[3px]
                        font-sans
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.17em]
                        text-[#D8C8A8]/48
                        sm:text-[9px]
                      "
                    >
                      {currentItem.service}
                    </p>
                  </div>
                </div>

                {/* Location */}

                <div className="hidden text-right sm:block">
                  <p
                    className="
                      font-sans
                      text-[8px]
                      uppercase
                      tracking-[0.17em]
                      text-[#D8C8A8]/35
                    "
                  >
                    Based in
                  </p>

                  <p
                    className="
                      mt-1
                      font-sans
                      text-[10px]
                      text-[#E9A534]/70
                    "
                  >
                    {currentItem.location}
                  </p>
                </div>
              </div>

              {/* Bottom accent */}

              <div
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-[2px]
                  w-[95px]
                  -translate-x-1/2
                  bg-[#E9A534]/70
                  shadow-[0_0_12px_rgba(233,165,52,0.20)]
                "
              />
            </motion.article>
          </AnimatePresence>
        </div>

        {/* ====================================================
            RIGHT BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={goNext}
          aria-label="Next testimonial"
          className="
            absolute
            right-[8px]
            top-1/2
            z-50
            flex
            h-[40px]
            w-[40px]
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[#E9A534]/40
            bg-[#210306]/95
            text-[#E9C76D]
            shadow-[0_10px_25px_rgba(0,0,0,0.28)]
            transition-all
            duration-300
            hover:border-[#E9A534]/75
            hover:bg-[#5A0E14]
            sm:right-[18px]
            sm:h-[43px]
            sm:w-[43px]
            lg:right-[calc(50%-345px)]
            xl:right-[calc(50%-365px)]
          "
        >
          <ChevronRight
            size={19}
            strokeWidth={1.35}
          />
        </button>
      </div>

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      <div className="mt-2 flex items-center justify-center gap-[6px]">
        {QUOTES.map((item, index) => (
          <button
            key={item.a}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show review from ${item.a}`}
            className="
              relative
              h-[6px]
              transition-all
              duration-300
            "
            style={{
              width:
                activeIndex === index
                  ? "22px"
                  : "6px",
            }}
          >
            <span
              className={`
                absolute
                inset-0
                rounded-full
                transition-all
                duration-300
                ${
                  activeIndex === index
                    ? "bg-[#E9A534] shadow-[0_0_10px_rgba(233,165,52,0.35)]"
                    : "bg-[#E9A534]/25 hover:bg-[#E9A534]/55"
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* ======================================================
          SMALL COUNTER
      ====================================================== */}

      <div className="mt-3 text-center">
        <span
          className="
            font-sans
            text-[8px]
            uppercase
            tracking-[0.28em]
            text-[#D8C8A8]/30
          "
        >
          {String(activeIndex + 1).padStart(2, "0")}
          {" / "}
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN VOICES SECTION
============================================================ */

function Voices() {
  const {
    ref: sectionRef,
  } = useReveal(0.2);

  return (
    <section
      id="voices"
      className="
        voices-section
        relative
        min-h-[calc(100svh-88px)]
        overflow-hidden
        border-t
        border-[#E9A534]/[0.07]
        bg-[#180205]
        text-[#FFF8EC]
      "
    >
      {/* ======================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.075]
        "
        style={{
          backgroundImage: `url(${starsTexture})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          mixBlendMode: "screen",
        }}
      />

      {/* ======================================================
          BACKGROUND GRADIENT
      ====================================================== */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_48%,rgba(91,14,22,0.24),transparent_48%),linear-gradient(180deg,rgba(24,2,5,0.45),rgba(24,2,5,0.78))]
        "
      />

      {/* ======================================================
          CENTRAL GLOW
      ====================================================== */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[50%]
          h-[620px]
          w-[1000px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#650F18]/20
          blur-[150px]
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[50%]
          h-[260px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#E9A534]/[0.025]
          blur-[90px]
        "
      />

      {/* ======================================================
          DECORATIVE STARS
      ====================================================== */}

      <span
        aria-hidden
        className="
          absolute
          left-[10%]
          top-[23%]
          h-[3px]
          w-[3px]
          rounded-full
          bg-[#E9A534]/60
          shadow-[0_0_12px_rgba(233,165,52,0.55)]
        "
      />

      <span
        aria-hidden
        className="
          absolute
          left-[17%]
          top-[51%]
          h-[2px]
          w-[2px]
          rounded-full
          bg-[#E9A534]/40
        "
      />

      <span
        aria-hidden
        className="
          absolute
          left-[22%]
          bottom-[18%]
          h-[3px]
          w-[3px]
          rounded-full
          bg-[#E9A534]/50
        "
      />

      <span
        aria-hidden
        className="
          absolute
          right-[10%]
          top-[22%]
          h-[3px]
          w-[3px]
          rounded-full
          bg-[#E9A534]/60
          shadow-[0_0_12px_rgba(233,165,52,0.50)]
        "
      />

      <span
        aria-hidden
        className="
          absolute
          right-[18%]
          top-[50%]
          h-[2px]
          w-[2px]
          rounded-full
          bg-[#E9A534]/40
        "
      />

      <span
        aria-hidden
        className="
          absolute
          right-[13%]
          bottom-[19%]
          h-[3px]
          w-[3px]
          rounded-full
          bg-[#E9A534]/50
        "
      />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        ref={sectionRef}
        className="
          relative
          z-10
          flex
          min-h-[calc(100svh-88px)]
          flex-col
        "
      >
        {/* ====================================================
            MARQUEE
        ==================================================== */}

        <Reveal>
          <Marquee />
        </Reveal>

        {/* ====================================================
            MAIN AREA

            This deliberately fills remaining viewport height.
        ==================================================== */}

        <div
          className="
            mx-auto
            flex
            w-full
            flex-1
            max-w-[1500px]
            flex-col
            justify-center
            px-5
            py-8
            sm:px-7
            sm:py-10
            lg:px-10
            lg:py-12
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mx-auto w-full max-w-[820px] text-center">

            <Reveal>
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-9 bg-[#E9A534]/40" />

                <span
                  className="
                    font-sans
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.38em]
                    text-[#DDBB78]
                    sm:text-[10px]
                  "
                >
                  Kind Words
                </span>

                <span className="h-px w-9 bg-[#E9A534]/40" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2
                className="
                  mt-3
                  font-display
                  text-[36px]
                  font-medium
                  leading-[0.95]
                  tracking-[-0.025em]
                  text-[#FFF7E8]
                  sm:text-[44px]
                  md:text-[48px]
                  lg:text-[54px]
                "
              >
                What Our{" "}
                <span className="text-[#E9B957]">
                  Clients Say
                </span>
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p
                className="
                  mx-auto
                  mt-4
                  max-w-[560px]
                  font-sans
                  text-[12px]
                  leading-[1.7]
                  text-[#D8C8A8]/55
                  sm:text-[13px]
                  lg:text-[14px]
                "
              >
                Real stories from people who found
                clarity, perspective and confidence
                through personalised guidance.
              </p>
            </Reveal>

            {/* Header ornament */}

            
          </div>

          {/* ==================================================
              TESTIMONIAL CAROUSEL
          ================================================== */}

          <Reveal delay={280}>
            <TestimonialCarousel />
          </Reveal>
        </div>

        {/* Small bottom breathing room */}

        <div className="h-[8px] shrink-0 sm:h-[10px]" />
      </div>

      {/* ======================================================
          BOTTOM BORDER
      ====================================================== */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-px
          w-[72%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[#E9A534]/15
          to-transparent
        "
      />

      {/* ======================================================
          REDUCED MOTION
      ====================================================== */}

      <style>{`
        @media (max-width: 767px) {
          .testimonial-side {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track,
          .voices-section *,
          .voices-section *::before,
          .voices-section *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Voices;