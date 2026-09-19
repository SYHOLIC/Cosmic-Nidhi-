import { useState } from "react";
import Reveal from "./Reveal";
import Starfield from "./Starfield";
import heroZodiac from "../assets/hero-zodiac2.png";

// FAQ Data
const FAQS = [
  {
    q: "What do I need for a birth-chart reading?",
    a: "Please provide your full name, date of birth, exact birth time if available, place of birth and the questions you would like to explore. The more accurate the time and place, the more specific the chart calculation can be; if you are uncertain, tell us before the session.",
  },
  {
    q: "Will you predict exactly what will happen?",
    a: "Cosmic Nidhi presents astrology, numerology and Vastu as reflective guidance. We do not promise fixed outcomes or use fear-based predictions. Personal choices and circumstances remain important.",
  },
  {
    q: "Is my information confidential?",
    a: "We use personal details to provide the requested service and manage your order. Please review our Privacy Policy for retention, sharing and deletion details.",
  },
  {
    q: "Are crystals medical treatments?",
    a: "No. Product descriptions refer to traditional or symbolic associations only. Crystals and spiritual products are not substitutes for medical care or professional advice.",
  },
  {
    q: "Do natural stones look exactly like the product photograph?",
    a: "Natural stones vary in colour, pattern, shape and inclusions. Product pages should show representative images and state whether the image is of the exact item or a sample.",
  },
  {
    q: "Can I reschedule a consultation?",
    a: "Rescheduling is subject to the booking policy shown at checkout. Please contact us as soon as possible using the booking email or WhatsApp.",
  },
  {
    q: "How long does delivery take?",
    a: "Dispatch and delivery times vary by product, address and courier. The product page and shipping policy will show the current estimate.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#5A0E14]/8 last:border-0">
      <button
        onClick={onToggle}
        className="
          group
          flex
          w-full
          items-center
          justify-between
          py-3
          text-left
          transition-colors
          duration-300
          hover:text-[#E9A534]

          md:py-4
        "
      >
        <span
          className="
            pr-4
            font-display
            text-base
            text-[#3C080D]
            transition-colors
            duration-300
            group-hover:text-[#8E1B24]

            md:text-lg

            lg:text-xl
          "
        >
          {faq.q}
        </span>

        <span
          className={`
            ml-4
            flex-shrink-0
            font-sans
            text-xl
            text-[#E9A534]
            transition-transform
            duration-300

            md:text-2xl

            ${isOpen ? "rotate-45" : ""}
          `}
        >
          +
        </span>
      </button>

      <div
        className={`
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
          ${
            isOpen
              ? "max-h-[500px] pb-4 opacity-100 md:pb-5"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <p
          className="
            pr-4
            font-sans
            text-sm
            leading-relaxed
            text-[#2C1210]/70

            md:pr-8
            md:text-base
          "
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}

function CTA() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* =====================================================
          CTA SECTION
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          bg-[#FFF7E9]
          py-20
          text-center

          md:py-28

          lg:py-16
        "
      >
        {/* =========================================
            DECORATIVE CELESTIAL GLOWS
        ========================================= */}

        {/* Burgundy — subtle */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#5A0E14]/[0.035]
            blur-3xl
          "
        />

        {/* Gold — premium accent */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            right-0
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#E9A534]/[0.045]
            blur-3xl
          "
        />

        {/* Burgundy corner */}
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            h-[300px]
            w-[300px]
            rounded-full
            bg-[#5A0E14]/[0.025]
            blur-3xl
          "
        />

        {/* Soft gradient */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-[#5A0E14]/[0.025]
            via-transparent
            to-transparent
          "
        />

        {/* =========================================
            STARFIELD
        ========================================= */}
        <Starfield
          count={50}
          starColor="#5A0E14"
        />

        {/* =========================================
            ROTATING ZODIAC
        ========================================= */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            w-[720px]
            -translate-x-1/2
            -translate-y-1/2
            opacity-[0.055]
          "
        >
          <img
            src={heroZodiac}
            alt=""
            loading="lazy"
            width={1200}
            height={1200}
            className="animate-spin-slower"
          />
        </div>

        {/* =========================================
            CONTENT
        ========================================= */}
        <div
          className="
            relative
            z-10
            mx-auto
            max-w-4xl
            px-6
          "
        >
          {/* Heading */}
          <Reveal>
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#E9A534]/50" />

              <span
                className="
                  font-sans
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#8E1B24]/65
                "
              >
                Begin Your Journey
              </span>

              <span className="h-px w-10 bg-[#E9A534]/50" />
            </div>

            <h2
              className="
                font-display
                text-4xl
                leading-tight
                text-[#3C080D]

                md:text-5xl

                lg:text-6xl
              "
            >
              The stars have been{" "}
              <span
                className="
                  italic
                  text-[#8E1B24]
                "
              >
                waiting
              </span>
            </h2>
          </Reveal>

          {/* Description */}
          <Reveal delay={140}>
            <p
              className="
                mx-auto
                mt-5
                max-w-lg
                font-sans
                text-sm
                leading-relaxed
                text-[#5A0E14]/60

                md:text-base
              "
            >
              Share your date, time and place of birth.
              The rest is a conversation.
            </p>
          </Reveal>

          {/* =========================================
              CTA BUTTONS
          ========================================= */}
          <Reveal delay={260}>
            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                justify-center
                gap-4
              "
            >
              {/* =====================================
                  PRIMARY CTA
              ===================================== */}
              <a
                href="tel:8826044955"
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-full
                  border
                  border-[#E9A534]/45
                  bg-gradient-to-r
                  from-[#5A0E14]
                  via-[#76151D]
                  to-[#8E1B24]
                  px-8
                  py-3.5
                  font-sans
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#FFF7E9]
                  shadow-[0_10px_30px_rgba(90,14,20,0.18)]
                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:shadow-[0_14px_35px_rgba(90,14,20,0.26)]

                  md:px-10
                  md:py-4
                "
              >
                {/* Gold shine */}
                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    -left-[80px]
                    w-[55px]
                    rotate-[18deg]
                    bg-white/15
                    blur-md
                    transition-all
                    duration-700
                    group-hover:left-[120%]
                  "
                />

                <span className="relative z-10">
                  Book your reading
                </span>

                <span
                  className="
                    relative
                    z-10
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E9A534]/55
                    text-[#E9A534]
                    transition-all
                    duration-300
                    group-hover:bg-[#E9A534]/10

                    md:h-8
                    md:w-8
                  "
                >
                  →
                </span>
              </a>

              {/* =====================================
                  SECONDARY CTA
              ===================================== */}
              <a
                href="#services"
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-full
                  border
                  border-[#E9A534]/70
                  px-8
                  py-3.5
                  font-sans
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#8E1B24]
                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:text-[#FFF7E9]
                  hover:shadow-[0_10px_25px_rgba(233,165,52,0.15)]

                  md:px-10
                  md:py-4
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    -translate-x-full
                    bg-[#E9A534]
                    transition-transform
                    duration-500
                    group-hover:translate-x-0
                  "
                />

                <span className="relative z-10">
                  Explore Services
                </span>

                <span
                  className="
                    relative
                    z-10
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </a>
            </div>
          </Reveal>

          {/* Trust line */}
          <Reveal delay={360}>
            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-2
                font-sans
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-[#5A0E14]/40
              "
            >
              <span className="text-[#E9A534]">
                ✦
              </span>

              Thoughtful guidance, grounded in tradition

              <span className="text-[#E9A534]">
                ✦
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          FAQ SECTION
      ===================================================== */}
      <section
        className="
          bg-[#FFF7E9]
          pb-20

          md:pb-28
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
          "
        >
          {/* =========================================
              FAQ HEADING
          ========================================= */}
          <div
            className="
              mb-8
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                h-px
                flex-1
                bg-gradient-to-r
                from-transparent
                to-[#E9A534]
              "
            />

            <span
              className="
                whitespace-nowrap
                font-sans
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-[#8E1B24]

                sm:text-xs
              "
            >
              Frequently Asked Questions
            </span>

            <div
              className="
                h-px
                flex-1
                bg-gradient-to-l
                from-transparent
                to-[#E9A534]
              "
            />
          </div>

          {/* =========================================
              FAQ GRID
          ========================================= */}
          <div
            className="
              grid
              gap-6

              md:grid-cols-2
            "
          >
            {/* LEFT */}
            <div
              className="
                rounded-2xl
                border
                border-[#5A0E14]/8
                bg-[#FDECC8]/25
                p-6

                md:p-8
              "
            >
              {FAQS.slice(0, 4).map(
                (faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    isOpen={
                      openIndex === index
                    }
                    onToggle={() =>
                      toggleFAQ(index)
                    }
                  />
                )
              )}
            </div>

            {/* RIGHT */}
            <div
              className="
                rounded-2xl
                border
                border-[#5A0E14]/8
                bg-[#FDECC8]/25
                p-6

                md:p-8
              "
            >
              {FAQS.slice(4, 7).map(
                (faq, index) => (
                  <FAQItem
                    key={index + 4}
                    faq={faq}
                    isOpen={
                      openIndex ===
                      index + 4
                    }
                    onToggle={() =>
                      toggleFAQ(
                        index + 4
                      )
                    }
                  />
                )
              )}
            </div>
          </div>

          {/* =========================================
              CONTACT NOTE
          ========================================= */}
          <div className="mt-8 text-center">
            <p
              className="
                font-sans
                text-[0.6rem]
                uppercase
                tracking-[0.15em]
                text-[#5A0E14]/40
              "
            >
              <span className="text-[#E9A534]">
                ✦
              </span>{" "}
              Still have questions?{" "}

              <a
                href="tel:8826044955"
                className="
                  text-[#8E1B24]
                  transition-colors
                  hover:text-[#E9A534]
                "
              >
                Call us at 8826 044 955
              </a>

              {" "}or{" "}

              <a
                href="mailto:info@cosmicnidhi.in"
                className="
                  text-[#8E1B24]
                  transition-colors
                  hover:text-[#E9A534]
                "
              >
                email us
              </a>

              <span className="text-[#E9A534]">
                {" "}✦
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default CTA;