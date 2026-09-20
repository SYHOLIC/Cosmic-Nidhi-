import { useState } from "react";
import Reveal from "./Reveal";
import BookingModal from "./BookingModal";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For a quick, focused answer",
    price: "₹1,500",
    features: [
      "1 question answered in depth",
      "30-minute reading",
      "Newborn / child reading",
      "Relationship reading",
      "Detailed written report",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For a fuller picture of what's ahead",
    price: "₹2,400",
    features: [
      "Up to 3 questions answered",
      "60-minute reading",
      "Newborn / child reading",
      "Relationship reading",
      "Job & career forecast",
      "Personalised insights",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    tagline: "For major decisions and new ventures",
    price: "₹5,100",
    features: [
      "10+ questions answered",
      "2-hour reading",
      "Relationship reading",
      "Job & career forecast",
      "Business guidance",
      "Crystal healing session",
    ],
  },
];

// ============================================================================
// DECORATIVE CORNERS
// ============================================================================

function BotanicalCorner({ side = "left" }) {
  return (
    <svg
      viewBox="0 0 180 280"
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        top-0
        hidden
        h-[220px]
        w-[145px]
        opacity-40
        lg:block
        xl:h-[270px]
        xl:w-[175px]
        ${
          side === "left"
            ? "left-0"
            : "right-0 scale-x-[-1]"
        }
      `}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 271C24 216 41 165 69 127C87 103 105 77 117 42"
        stroke="#B97820"
        strokeWidth="1"
      />

      <path
        d="M33 216C51 203 68 187 83 168"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M46 181C58 168 70 151 79 135"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M41 203C30 196 25 184 27 173C39 177 46 188 41 203Z"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M53 188C44 177 44 165 50 156C59 165 61 177 53 188Z"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M61 170C73 159 83 158 90 163C84 173 72 176 61 170Z"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M74 144C67 132 68 121 74 113C82 123 82 135 74 144Z"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M83 129C93 117 104 115 111 120C105 130 94 134 83 129Z"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M105 60V76M97 68H113"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <path
        d="M126 102V116M119 109H133"
        stroke="#B97820"
        strokeWidth="0.8"
      />

      <circle
        cx="136"
        cy="39"
        r="1.6"
        fill="#B97820"
      />
      <circle
        cx="145"
        cy="79"
        r="1.2"
        fill="#B97820"
      />
      <circle
        cx="116"
        cy="132"
        r="1.2"
        fill="#B97820"
      />
    </svg>
  );
}

// ============================================================================
// PLAN CARD
// ============================================================================
function PlanCard({ plan, index, onBookPlan }) {
  return (
    <Reveal delay={150 + index * 110} className="h-full">
      <article
        className={`
          group
          relative
          flex
          h-[500px]
          w-full
          flex-col
          rounded-[7px]
          border
          bg-[#FFFDF9]
          px-6
          py-6
          transition-all
          duration-300
          sm:h-[520px]
          sm:px-7
          sm:py-7
          lg:h-[530px]
          lg:px-8
          lg:py-8
          ${
            plan.popular
              ? `
                -translate-y-3
                border-[#D49A35]/75
                shadow-[0_16px_45px_rgba(90,14,20,0.10)]
              `
              : `
                border-[#5A0E14]/10
                shadow-[0_7px_25px_rgba(90,14,20,0.045)]
                hover:-translate-y-1
                hover:border-[#B97820]/35
                hover:shadow-[0_14px_35px_rgba(90,14,20,0.08)]
              `
          }
        `}
      >
        {/* Popular badge */}
        {plan.popular && (
          <div
            className="
              absolute
              -top-3.5
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              rounded-full
              bg-[#5A0E14]
              px-5
              py-1.5
              font-sans
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#FFF8EC]
            "
          >
            Most Popular
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h3
            className={`
              font-display
              text-[24px]
              leading-none
              sm:text-[27px]
              ${
                plan.popular
                  ? "text-[#A66F1B]"
                  : "text-[#3C080D] group-hover:text-[#8B2F2B]"
              }
            `}
          >
            {plan.name}
          </h3>

          <p className="mx-auto mt-2 min-h-[42px] max-w-[250px] font-sans text-[12px] leading-[1.5] text-[#6B443D]/65">
            {plan.tagline}
          </p>
        </div>

        {/* Price */}
        <div className="mt-5 text-center">
          <p
            className={`
              font-display
              text-[36px]
              font-semibold
              leading-none
              sm:text-[39px]
              ${
                plan.popular
                  ? "text-[#B97820]"
                  : "text-[#5A0E14]"
              }
            `}
          >
            {plan.price}
          </p>

          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.18em] text-[#6B443D]/45">
            Per session
          </p>
        </div>

        {/* Divider */}
        <div
          className={`
            mx-auto
            my-6
            h-px
            w-14
            ${
              plan.popular
                ? "bg-[#E9A534]/70"
                : "bg-[#B97820]/45"
            }
          `}
        />

        {/* Features */}
        <ul className="flex-1 space-y-3">
          {plan.features.map((feature, featureIndex) => (
            <li
              key={featureIndex}
              className="
                flex
                items-start
                gap-3
                font-sans
                text-[12px]
                leading-[1.45]
                text-[#3C080D]/75
                sm:text-[13px]
              "
            >
              <span
                className={`
                  mt-[2px]
                  shrink-0
                  text-[10px]
                  ${
                    plan.popular
                      ? "text-[#D49A35]"
                      : "text-[#B97820]"
                  }
                `}
              >
                ✦
              </span>

              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Button */}
        <div
          className={`
            mt-auto
            border-t
            pt-6
            ${
              plan.popular
                ? "border-[#E9A534]/20"
                : "border-[#5A0E14]/10"
            }
          `}
        >
          <button
            type="button"
            onClick={() => onBookPlan?.(plan)}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-[5px]
              bg-[#5A0E14]
              px-6
              py-3
              font-sans
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#FFF8EC]
              transition-all
              duration-300
              hover:bg-[#3C080D]
              hover:shadow-[0_9px_22px_rgba(90,14,20,0.16)]
            "
          >
            Book Now

            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M2 8h11" />
              <path d="M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </article>
    </Reveal>
  );
}
// ============================================================================
// MAIN
// ============================================================================

export default function Pricing({ onSelectPlan }) {
  const [bookingPlan, setBookingPlan] = useState(null);

  const handleBookPlan = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      setBookingPlan(plan);
    }
  };

  return (
    <section
      id="pricing"
      className="
        relative
        overflow-hidden
        border-t
        border-[#5A0E14]/[0.07]
        bg-[#FFF8EC]
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#E9A534]/[0.035]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-[-150px]
            right-[-100px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#B94A36]/[0.025]
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.16]
            [background-image:radial-gradient(rgba(90,14,20,0.12)_0.65px,transparent_0.65px)]
            [background-size:20px_20px]
          "
        />
      </div>

      <BotanicalCorner side="left" />
      <BotanicalCorner side="right" />

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1200px]
          px-5
          py-16
          sm:px-7
          sm:py-20
          lg:px-10
          lg:py-24
        "
      >
        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p
              className="
                font-sans
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#8B5E20]
              "
            >
              Pricing Plans
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="
                mt-3
                font-display
                text-[42px]
                leading-[0.98]
                tracking-[-0.02em]
                text-[#3C080D]
                sm:text-[48px]
                md:text-[52px]
              "
            >
              Choose Your{" "}
              <span className="text-[#8B2F2B]">
                Plan
              </span>
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p
              className="
                mx-auto
                mt-3
                max-w-xl
                font-sans
                text-[14px]
                leading-[1.6]
                text-[#6B443D]/65
                sm:text-[15px]
              "
            >
              Flexible plans for your unique journey.
              Choose the level of guidance that feels right
              for you.
            </p>
          </Reveal>
        </div>

        {/* ================================================================ */}
        {/* PLANS                                                            */}
        {/* ================================================================ */}

        <div
          className="
            mt-12
            grid
            grid-cols-1
            gap-5
            md:grid-cols-3
            md:items-start
            lg:mt-14
            lg:gap-6
          "
        >
          {PLANS.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onBookPlan={handleBookPlan}
            />
          ))}
        </div>

        {/* ================================================================ */}
        {/* BOTTOM NOTE                                                      */}
        {/* ================================================================ */}

        <Reveal delay={500}>
          <div className="mt-10 text-center">
            <p className="font-sans text-[12px] leading-[1.6] text-[#6B443D]/60">
              All plans include a detailed written report
              and a follow-up Q&A session.
            </p>

            <p
              className="
                mt-2
                font-sans
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-[#6B443D]/40
              "
            >
              <span className="text-[#D49A35]">✦</span>
              <span className="mx-2">
                No hidden fees
              </span>
              <span className="text-[#D49A35]/50">
                ·
              </span>
              <span className="mx-2">
                Secure booking
              </span>
              <span className="text-[#D49A35]/50">
                ·
              </span>
              <span className="mx-2">
                Personal guidance
              </span>
            </p>
          </div>
        </Reveal>
      </div>

      <BookingModal
        isOpen={Boolean(bookingPlan)}
        onClose={() => setBookingPlan(null)}
        initialService={{
          title: bookingPlan?.name ? `${bookingPlan.name} Plan (${bookingPlan.price})` : "Astrology Consultation",
          type: "birth-chart",
        }}
      />
    </section>
  );
}