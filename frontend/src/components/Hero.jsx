import Reveal from "./Reveal";
import {
  ArrowRight,
  Flower2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import heroZodiac from "../assets/hero-zodiac3.png";
import astrologerPortrait from "../assets/crystalss.png";

const STARS = [
  [8, 28, 2],
  [13, 67, 1],
  [19, 39, 1],
  [25, 75, 2],
  [31, 22, 1],
  [37, 54, 1],
  [40, 32, 2],
  [45, 18, 1],
  [48, 70, 1],
  [53, 26, 2],
  [57, 58, 1],
  [62, 17, 1],
  [67, 39, 2],
  [72, 72, 1],
  [77, 24, 1],
  [83, 53, 2],
  [88, 31, 1],
  [94, 66, 1],
];

const TRUST_ITEMS = [
  {
    icon: Flower2,
    title: "Spiritual Growth",
    subtitle: "Clarity for your journey",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Guidance",
    subtitle: "Personal & confidential",
  },
  {
    icon: Sparkles,
    title: "Accurate Readings",
    subtitle: "Chart-based insights",
  },
];

function Hero() {

  return (
    <section
      id="top"
      className="
        cosmic-hero
        relative
        h-[740px]
        min-h-[740px]
        overflow-hidden
        bg-[#170205]
        text-[#FFF7E8]
        lg:h-[calc(100svh-128px)]
        lg:min-h-[728px]
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-[#170205]" />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_67%_48%,rgba(91,14,22,0.32),transparent_35%),radial-gradient(circle_at_30%_52%,rgba(65,7,15,0.28),transparent_42%),linear-gradient(105deg,#100104_0%,#210409_50%,#170205_100%)]
        "
      />

      {/* Soft warm atmosphere */}
      <div
        className="
          pointer-events-none
          absolute
          right-[4%]
          top-[17%]
          h-[600px]
          w-[600px]
          rounded-full
          bg-[#7C1B23]/10
          blur-[120px]
          transform-gpu
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[-160px]
          bottom-[-180px]
          h-[460px]
          w-[460px]
          rounded-full
          bg-[#5A0E14]/20
          blur-[100px]
          transform-gpu
        "
      />

      {/* Subtle celestial texture */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
        "
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(233,165,52,0.55) 1px, transparent 1px),
            radial-gradient(circle at 70% 65%, rgba(233,165,52,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "90px 90px, 130px 130px",
        }}
      />

      {/* =====================================================
          STARS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[2]">
        {STARS.map(([x, y, size], index) => (
          <span
            key={index}
            className="
              absolute
              rounded-full
              bg-[#E9A534]
            "
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: index % 4 === 0 ? 0.78 : 0.32,
              boxShadow:
                "0 0 12px rgba(233,165,52,0.7)",
              animation: `starFloat ${
                5 + (index % 4)
              }s ease-in-out ${
                index * 0.25
              }s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Accent stars */}
      <span
        className="
          pointer-events-none
          absolute
          left-[39%]
          top-[29%]
          z-[3]
          h-[7px]
          w-[7px]
          rounded-full
          bg-[#F2C66D]
          shadow-[0_0_25px_5px_rgba(233,165,52,0.24)]
        "
      />

      <span
        className="
          pointer-events-none
          absolute
          left-[47%]
          top-[20%]
          z-[3]
          h-[4px]
          w-[4px]
          rounded-full
          bg-[#E9A534]
          shadow-[0_0_18px_4px_rgba(233,165,52,0.25)]
        "
      />

      <span
        className="
          pointer-events-none
          absolute
          left-[44%]
          top-[73%]
          z-[3]
          h-[5px]
          w-[5px]
          rounded-full
          bg-[#F2C66D]
          shadow-[0_0_18px_4px_rgba(233,165,52,0.22)]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          h-full
          max-w-[1770px]
          px-[6.4%]
        "
      >
        <div className="relative h-full">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
            className="
              absolute
              left-0
              top-1/2
              z-50
              w-full
              max-w-[560px]
              lg:max-w-[620px]
              xl:max-w-[700px]
              -translate-y-1/2
            "
          >
            {/* EYEBROW */}

            <Reveal>
              <div
                className="
                  mb-[26px]
                  flex
                  items-center
                  gap-[15px]
                "
              >
                <span
                  className="
                    h-px
                    w-[50px]
                    bg-[#E9A534]
                  "
                />

                <p
                  className="
                    font-sans
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.29em]
                    text-[#DDBB78]
                  "
                >
                  VEDIC
                  <span className="mx-[9px]">•</span>
                  WESTERN ASTROLOGY
                </p>
              </div>
            </Reveal>

            {/* HEADING */}

            <Reveal delay={100}>
              <h1
                className="
                  cosmic-heading
                  font-serif
                  font-medium
                  leading-[1.12]
                  tracking-[-0.03em]
                  text-[#FFF8EC]
                "
              >
                <span className="block">
                  Understand Your Past.
                </span>

                <span className="block text-[#FDF0D5]">
                  Navigate Your Present.
                </span>

                <span className="block">
                  Explore Your{" "}
                  <span className="relative inline-block">
                    Future.

                    <span
                      className="
                        absolute
                        bottom-[-8px]
                        left-0
                        h-[3px]
                        w-[92%]
                        bg-[#E9A534]
                      "
                    />
                  </span>
                </span>
              </h1>
            </Reveal>

            {/* DESCRIPTION */}

            <Reveal delay={200}>
              <p
                className="
                  mt-[24px]
                  max-w-[405px]
                  font-sans
                  text-[17px]
                  font-normal
                  leading-[1.55]
                  text-[#F5E5C7]/90
                "
              >
                Personalised astrology guidance
                <br />
                rooted in your birth chart.
              </p>
            </Reveal>

            {/* BUTTONS */}

            <Reveal delay={300}>
              <div
                className="
                  mt-[34px]
                  flex
                  items-center
                  gap-[28px]
                "
              >
                {/* PRIMARY */}

                <a
                  href="tel:9560437360"
                  className="
                    group
                    inline-flex
                    h-[58px]
                    items-center
                    gap-[18px]
                    rounded-[9px]
                    border
                    border-[#F2C66D]
                    bg-gradient-to-r
                    from-[#F3D49B]
                    to-[#DDB56D]
                    px-[30px]
                    font-sans
                    text-[13px]
                    font-semibold
                    text-[#3C080D]
                    shadow-[0_12px_32px_rgba(0,0,0,0.26)]
                    transition-all
                    duration-300
                    hover:-translate-y-[2px]
                    hover:shadow-[0_17px_42px_rgba(0,0,0,0.38)]
                  "
                >
                  <span>Book for Consultancy</span>

                  <ArrowRight
                    size={17}
                    strokeWidth={1.8}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </a>

                {/* SECONDARY */}

                <a
                  href="#services"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-[9px]
                    font-sans
                    text-[13px]
                    font-medium
                    text-[#EBD7B1]
                    transition-colors
                    duration-300
                    hover:text-[#E9A534]
                  "
                >
                  <span
                    className="
                      border-b
                      border-[#E9A534]/60
                      pb-[5px]
                      transition-colors
                      duration-300
                      group-hover:border-[#E9A534]
                    "
                  >
                    Services Offered
                  </span>

                  <ArrowRight
                    size={15}
                    strokeWidth={1.6}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </a>
              </div>
            </Reveal>

            {/* =================================================
                PREMIUM TRUST STRIP
            ================================================= */}

            <Reveal delay={400}>
              <div className="hero-trust mt-[48px] flex w-full max-w-[660px] items-stretch">

                {TRUST_ITEMS.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={`
                        trust-card
                        group
                        relative
                        flex
                        flex-1
                        items-center
                        gap-[13px]
                        py-[8px]
                        transition-all
                        duration-500

                        ${
                          index === 0
                            ? "pr-[30px]"
                            : index === TRUST_ITEMS.length - 1
                            ? "pl-[30px]"
                            : "px-[30px]"
                        }

                        ${
                          index !== 0
                            ? "border-l border-[#E9A534]/20"
                            : ""
                        }
                      `}
                    >
                      {/* ICON */}

                      <div className="relative shrink-0">
                        <div
                          className="
                            absolute
                            inset-[-6px]
                            rounded-full
                            bg-[#E9A534]/0
                            blur-[9px]
                            transition-all
                            duration-500
                            group-hover:bg-[#E9A534]/10
                          "
                        />

                        <div
                          className="
                            relative
                            flex
                            h-[44px]
                            w-[44px]
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#E9A534]/45
                            bg-gradient-to-br
                            from-[#E9A534]/[0.13]
                            to-transparent
                            text-[#E9B957]
                            transition-all
                            duration-500
                            group-hover:-translate-y-0.5
                            group-hover:border-[#E9A534]/80
                            group-hover:bg-[#E9A534]/[0.16]
                            group-hover:shadow-[0_9px_25px_rgba(233,165,52,0.13)]
                          "
                        >
                          <Icon
                            size={18}
                            strokeWidth={1.45}
                          />
                        </div>

                        
                      </div>

                      {/* TEXT */}

                      <div className="min-w-0">
                        <p
                          className="
                            whitespace-nowrap
                            font-serif
                            text-[14px]
                            font-medium
                            leading-[1.2]
                            tracking-[0.005em]
                            text-[#FFF2D8]
                            transition-colors
                            duration-300
                            group-hover:text-[#F3D48C]
                          "
                        >
                          {item.title}
                        </p>

                        <p
                          className="
                            mt-[5px]
                            whitespace-nowrap
                            font-sans
                            text-[9px]
                            font-normal
                            leading-[1.35]
                            tracking-[0.02em]
                            text-[#D8C8A8]/60
                            transition-colors
                            duration-300
                            group-hover:text-[#E5D7BC]/80
                          "
                        >
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Bottom hover accent */}

                      <span
                        className="
                          absolute
                          bottom-[-8px]
                          left-0
                          h-px
                          w-0
                          bg-gradient-to-r
                          from-[#E9A534]
                          to-transparent
                          transition-all
                          duration-500
                          group-hover:w-[76%]
                        "
                      />
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* =================================================
              ZODIAC CHART
          ================================================= */}

          <Reveal delay={150}>
            <div className="hero-zodiac pointer-events-none absolute z-20">
              <div
                className="
                  absolute
                  inset-[13%]
                  rounded-full
                  bg-[#E9A534]/[0.055]
                  blur-[60px]
                  transform-gpu
                "
              />

              {/* Outer soft ring */}
              <div
                className="
                  absolute
                  inset-[5%]
                  rounded-full
                  border
                  border-[#E9A534]/[0.08]
                "
              />

              <img
                src={heroZodiac}
                alt="Cosmic Nidhi zodiac chart"
                className="
                  relative
                  z-10
                  h-full
                  w-full
                  object-contain
                "
                style={{
                  filter:
                    "drop-shadow(0 22px 40px rgba(0,0,0,0.38))",
                  animation:
                    "chakraRotate 110s linear infinite",
                }}
              />
            </div>
          </Reveal>

          {/* =================================================
              MASSIVE CRYSTAL ART (Optimized)
          ================================================= */}

          <Reveal delay={250}>
            <div className="astrologer">

              {/* Expanded glowing highlights */}

              <div
                className="
                  absolute
                  bottom-[4%]
                  left-[-5%]
                  h-[650px]
                  w-[580px]
                  rounded-full
                  bg-[#7C1720]/30
                  blur-[135px]
                "
              />

              <img
                src={astrologerPortrait}
                alt="Glowing Astrology Crystals"
                className="
                  relative
                  z-30
                  h-full
                  w-full
                  object-contain
                  object-bottom
                "
                style={{
                  filter:
                    "drop-shadow(-20px -5px 45px rgba(0,0,0,0.55))",
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* =====================================================
          BOTTOM FADE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-40
          h-[90px]
          bg-gradient-to-t
          from-[#100104]
          via-[#100104]/60
          to-transparent
        "
      />

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <div
        className="
          absolute
          bottom-[14px]
          left-1/2
          z-50
          hidden
          -translate-x-1/2
          items-center
          gap-[18px]
          lg:flex
        "
      >
        <span className="h-px w-[34px] bg-[#E9A534]/40" />

        <span
          className="
            font-sans
            text-[8px]
            font-medium
            uppercase
            tracking-[0.36em]
            text-[#D8C8A8]/55
          "
        >
          Scroll to Explore
        </span>

        <span className="h-px w-[34px] bg-[#E9A534]/40" />
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      {/* =====================================================
          ANIMATIONS & RESPONSIVE STYLES
      ===================================================== */}

      <style>{`
        @keyframes chakraRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes starFloat {
          from {
            transform: translateY(0);
            opacity: 0.25;
          }
          to {
            transform: translateY(-7px);
            opacity: 0.9;
          }
        }

        /* --- BASE ANCHOR FOR CRYSTALS (Locks bottom-right everywhere) --- */
        .astrologer {
          position: absolute;
          bottom: -6%;
          right: 0;
          z-index: 30;
          pointer-events: none;
        }

        /* ===================================================
           LARGE DESKTOP (Your exact working layout - UNCHANGED)
        =================================================== */
        @media (min-width: 1440px) {
          .hero-zodiac {
            width: 705px;
            height: 705px;
            right: 3%;
            top: 0%;
          }

          .astrologer {
            right: -30%;
            bottom: -6%;
            width: 42%;
            max-width: 950px;
            height: 100%;
                        opacity: 0.85;

          }

          .astrologer img {
            transform: scale(1.85) translateY(1%) translateX(-1%);
            transform-origin: bottom right;
          }

          .cosmic-heading {
            font-size: 56px;
            line-height: 1.12;
          }

          .hero-trust {
            width: 660px;
          }
        }

        /* ===================================================
           STANDARD DESKTOP / LAPTOP (1024px - 1439px)
        =================================================== */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .hero-zodiac {
            width: 620px;
            height: 620px;
            right: 2%;
            top: 4%;
          }

          .astrologer {
            right: -14%;
            bottom: -6%;
            width: 42%;
            max-width: 820px;
            height: 100%;
          }

          .astrologer img {
            transform: scale(1.65) translateY(1%) translateX(-1%);
            transform-origin: bottom right;
          }

          .cosmic-heading {
            font-size: 46px;
            line-height: 1.14;
          }

          .hero-trust {
            width: 660px;
          }
        }

        /* ===================================================
           TABLET (768px - 1023px)
        =================================================== */
        @media (min-width: 768px) and (max-width: 1023px) {
          .cosmic-hero {
            height: 920px;
            min-height: 920px;
          }

          .hero-zodiac {
            width: 520px;
            height: 520px;
            right: -10%;
            top: 40%;
            opacity: 0.35;
          }

          .astrologer {
            right: -26%;
            bottom: -4%;
            width: 50%;
            height: 60%;
            opacity: 0.85;
          }

          .astrologer img {
            transform: scale(1.45) translateY(1%) translateX(-1%);
            transform-origin: bottom right;
          }

          .cosmic-heading {
            font-size: 38px;
            line-height: 1.16;
          }

          .hero-trust {
            width: 620px;
          }
        }

        /* ===================================================
           MOBILE (481px - 767px)
        =================================================== */
        @media (max-width: 767px) {
          .cosmic-hero {
            height: 850px;
            min-height: 850px;
          }

          .cosmic-hero > .relative.z-20 {
            padding-left: 0;
            padding-right: 0;
          }

          .hero-zodiac {
            width: 380px;
            height: 380px;
            right: -20%;
            top: 48%;
            opacity: 0.22;
          }

          .astrologer {
            right: -4%;
            bottom: -3%;
            width: 60%;
            height: 48%;
            opacity: 0.75;
          }

          .astrologer img {
            transform: scale(1.2) translateY(2%) translateX(-1%);
            transform-origin: bottom right;
          }

          .cosmic-heading {
            font-size: 30px;
            line-height: 1.18;
          }

          .hero-trust {
            width: 100%;
            max-width: 430px;
            flex-direction: column;
            gap: 0;
          }

          .trust-card {
            width: 100%;
            padding: 13px 0 !important;
            border-left: 0 !important;
            border-bottom: 1px solid rgba(233, 165, 52, 0.12);
          }

          .trust-card:last-child {
            border-bottom: 0;
          }

          .trust-card > div:first-child > div {
            height: 40px;
            width: 40px;
          }
        }

        /* ===================================================
           SMALL MOBILE (<= 480px)
        =================================================== */
        @media (max-width: 480px) {
          .cosmic-hero {
            height: 830px;
            min-height: 830px;
          }

          .cosmic-heading {
            font-size: 24px;
            line-height: 1.2;
          }

          .hero-zodiac {
            width: 320px;
            height: 320px;
            right: -22%;
            top: 52%;
            opacity: 0.18;
          }

          .astrologer {
            right: -28%;
            bottom: 1%;
            width: 62%;
            height: 44%;
            opacity: 0.70;
          }

          .astrologer img {
            transform: scale(1.45) translateY(3%) translateX(-1%);
            transform-origin: bottom right;
          }

          .hero-trust {
            margin-top: 32px;
          }

          .trust-card {
            padding: 10px 0 !important;
          }

          .trust-card p:first-child {
            font-size: 13px;
          }

          .trust-card p:last-child {
            font-size: 8px;
          }
        }

        /* ===================================================
           REDUCED MOTION
        =================================================== */
        @media (prefers-reduced-motion: reduce) {
          .hero-zodiac img,
          [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;