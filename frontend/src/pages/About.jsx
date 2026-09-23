import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollY } from "../hooks/useReveal";
import Reveal from "../components/Reveal";
import BookingModal from "../components/BookingModal";
import nidhi1 from "../assets/image.png";

export default function About() {
  const y = useScrollY();
  const counterRef = useRef(null);
  const isCounterInView = useInView(counterRef, { once: true, margin: "-20px" });

  // Counter state
  const [years, setYears] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Silky smooth 60fps counter animation
  useEffect(() => {
    if (!isCounterInView) return;
    let startTimestamp = null;
    const duration = 2000;
    const target = 10;
    let animId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setYears(Math.min(Math.floor(easeOut * (target + 0.99)), target));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setYears(target);
      }
    };
    animId = requestAnimationFrame(step);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isCounterInView]);

  // Fallback to guarantee count is never stuck at 0
  useEffect(() => {
    const timer = setTimeout(() => {
      setYears(10);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const coreValues = [
    {
      title: "Clarity over fear",
      desc: "Explain, do not alarm. We provide clear understanding without fear-based predictions."
    },
    {
      title: "Respect for tradition",
      desc: "Acknowledge the cultural roots and limits of each practice."
    },
    {
      title: "Personalisation",
      desc: "Consider the individual's details and context in every consultation."
    },
    {
      title: "Confidentiality",
      desc: "Protect personal birth data, relationship information and consultation notes."
    },
    {
      title: "Transparency",
      desc: "Show inclusions, pricing, timelines, shipping and refund rules clearly."
    },
    {
      title: "Empathy",
      desc: "Communicate with warmth and without judgment."
    },
    {
      title: "Responsible commerce",
      desc: "Avoid medical, financial or guaranteed-outcome claims."
    },
    {
      title: "Continuous learning",
      desc: "Improve through study, feedback and ethical practice."
    }
  ];

  const stats = [
    { number: "10+", label: "Years of Experience" },
    { number: "4,200+", label: "Charts Read" },
    { number: "36", label: "Guna Points" },
    { number: "27", label: "Nakshatras" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#FFF7E9] pt-32 pb-16 md:pt-30 md:pb-10">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#C1272D]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E9A534]/8 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg md:text-xl font-bold tracking-[0.25em] uppercase text-[#C1272D] font-sans">
                About Cosmic Nidhi
              </p>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 font-display text-4xl md:text-5xl lg:text-7xl text-[#3C080D]"
            >
              Your Destiny,{" "}
              <span className="inline-block bg-gradient-to-r from-[#5A0E14] via-[#C1272D] to-[#E9A534] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                Written in Stars
              </span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 flex items-center justify-center gap-4"
            >
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#E9A534]" />
              <span className="text-[#E9A534] text-lg">✦</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#E9A534]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section
        className="relative overflow-hidden bg-[#FFF7E9] pt-10 sm:pt-14 md:pt-16 pb-20 md:pb-28"
      >
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#C1272D]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E9A534]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Company Profile & Image */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left - Main Image Only */}
            <div ref={counterRef} className="relative pt-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#5A0E14]/15"
              >
                <img
                  src={nidhi1}
                  alt="Nidhi Asthana - Cosmic Nidhi Founder"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 border-2 border-[#E9A534]/40 rounded-2xl pointer-events-none" />
              </motion.div>

              {/* Years badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-3 left-0 sm:-top-4 sm:-left-4 z-20 bg-[#FFF7E9] border-2 border-[#E9A534] rounded-xl px-6 py-4 shadow-xl text-center flex flex-col items-center justify-center will-change-transform"
              >
                <p className="font-display text-4xl bg-gradient-to-r from-[#5A0E14] via-[#C1272D] to-[#E9A534] bg-clip-text text-transparent">
                  {years}+
                </p>
                <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#5A0E14] font-sans font-semibold">
                  Years of Wisdom
                </p>
              </motion.div>
            </div>

            {/* Right - Content */}
            <div>
              <Reveal>
                <p className="font-display italic text-[#C1272D] text-xl md:text-2xl font-semibold mb-5">
                  Numerology · Astrology · Vastu
                </p>
              </Reveal>

              <Reveal delay={120}>
                <div className="prose prose-lg max-w-none">
                  <p className="text-[#2C1210] leading-relaxed font-sans text-lg md:text-xl text-justify">
                    At <span className="text-[#C1272D] font-semibold">Cosmic Nidhi</span>, we believe in Spiritual Growth first, then trusted guidance, then Accurate Readings. Our work brings together astrology, numerology and Vastu-inspired perspectives to help people reflect on their patterns, choices, relationships, spaces and next steps.
                  </p>
                  <p className="mt-5 text-[#2C1210]/80 leading-relaxed font-sans text-lg md:text-xl text-justify">
                    Every consultation is approached with care, context and confidentiality. Rather than using fear-based predictions or one-size-fits-all answers, Cosmic Nidhi aims to translate traditional systems into clear observations and practical questions for modern life.
                  </p>
                </div>
              </Reveal>

              {/* Biography */}
              <Reveal delay={180}>
                <div className="mt-8 p-8 bg-[#FDECC8]/40 rounded-2xl border border-[#E9A534]/20 shadow-sm">
                  <h3 className="font-display text-2xl text-[#3C080D] mb-3">
                    Meet <span className="text-[#C1272D]">Nidhi Asthana</span>
                  </h3>
                  <p className="text-[#2C1210]/80 leading-relaxed font-sans text-base md:text-lg text-justify">
                    With over {years} years of experience in the fields of Astrology, Vastu Shastra, and Numerology, I have helped individuals gain clarity, confidence, and a deeper understanding of their life path. My approach combines traditional knowledge with practical guidance, focusing on areas such as career, relationships, finance, health, family, and personal growth.
                  </p>
                  <p className="mt-4 text-[#C1272D] leading-relaxed font-sans text-lg italic font-medium">
                    "Let the stars guide you, while you create your own destiny."
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Vision & Mission */}
          <Reveal delay={200}>
            <div className="mt-20 grid md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-[#FDECC8]/30 rounded-2xl border border-[#5A0E14]/10 p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <h3 className="font-display text-3xl text-[#3C080D] mb-4">
                  Our <span className="text-[#C1272D]">Vision</span>
                </h3>
                <p className="text-[#2C1210]/80 leading-relaxed font-sans text-lg text-justify flex-1">
                  To become a trusted, accessible and responsible digital destination for astrology, numerology, Vastu and spiritual products—helping people approach life decisions with more self-awareness, clarity and intention.
                </p>
              </div>
              <div className="bg-[#FDECC8]/30 rounded-2xl border border-[#5A0E14]/10 p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <h3 className="font-display text-3xl text-[#3C080D] mb-4">
                  Our <span className="text-[#E9A534]">Mission</span>
                </h3>
                <ul className="space-y-3 text-[#2C1210]/80 leading-relaxed font-sans text-lg flex-1">
                  <li className="flex items-start gap-3">
                    <span className="text-[#E9A534] text-xl mt-0.5">✦</span>
                    Make traditional guidance understandable and relevant
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E9A534] text-xl mt-0.5">✦</span>
                    Offer personalised consultations with confidentiality
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E9A534] text-xl mt-0.5">✦</span>
                    Curate spiritual products with clear descriptions
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E9A534] text-xl mt-0.5">✦</span>
                    Replace fear-based selling with informed choice
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E9A534] text-xl mt-0.5">✦</span>
                    Build a warm community around mindful living
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Core Values */}
          <Reveal delay={260}>
            <div className="mt-20">
              <h3 className="font-display text-3xl text-[#3C080D] text-center mb-10">
                Our <span className="text-[#C1272D]">Core Values</span>
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {coreValues.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-[#FDECC8]/20 rounded-xl p-5 border border-[#5A0E14]/8 hover:border-[#E9A534]/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  >
                    <h4 className="font-display text-[#3C080D] text-lg mb-2">
                      {value.title}
                    </h4>
                    <p className="text-[#2C1210]/70 text-sm font-sans leading-relaxed">
                      {value.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={320}>
            <div className="mt-20 pt-10 border-t border-[#5A0E14]/10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <p className="font-display text-4xl text-[#C1272D]">{stat.number}</p>
                    <p className="text-sm tracking-[0.15em] uppercase text-[#5A0E14]/60 font-sans font-medium mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Store & Philosophy */}
          <Reveal delay={360}>
            <div className="mt-20 pt-10 border-t border-[#5A0E14]/10">
              <div className="grid md:grid-cols-2 gap-10 items-stretch">
                <div className="bg-[#FDECC8]/20 rounded-2xl p-8 border border-[#5A0E14]/8 flex flex-col">
                  <h3 className="font-display text-2xl text-[#3C080D] mb-4">
                    Our <span className="text-[#C1272D]">Store</span>
                  </h3>
                  <p className="text-[#2C1210]/80 leading-relaxed font-sans text-base md:text-lg flex-1">
                    Alongside consultations and reports, our store offers selected crystals and spiritual products with transparent descriptions, care guidance and responsible use information.
                  </p>
                  <div className="mt-6">
                    <a
                      href="/products"
                      className="group inline-flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#C1272D] border border-[#C1272D]/40 rounded-full px-6 py-2.5 hover:bg-[#C1272D] hover:text-[#FFF7E9] transition-all duration-300"
                    >
                      Visit Store
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
                <div className="bg-[#FDECC8]/20 rounded-2xl p-8 border border-[#5A0E14]/8 flex flex-col">
                  <h3 className="font-display text-2xl text-[#3C080D] mb-4">
                    Our <span className="text-[#E9A534]">Philosophy</span>
                  </h3>
                  <p className="text-[#2C1210]/80 leading-relaxed font-sans text-base md:text-lg flex-1">
                    Cosmic Nidhi is a space for reflection and informed personal choice. The guidance shared is spiritual and educational in nature; outcomes depend on many personal, social and practical factors.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={400}>
            <div className="mt-16 text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E9A534]" />
                <span className="text-sm tracking-[0.2em] uppercase text-[#5A0E14]/50 font-sans font-medium">
                  ✦ Confidential · Compassionate · Clear ✦
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E9A534]" />
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="group inline-flex items-center gap-3 bg-[#C1272D] text-[#FFF7E9] px-12 py-5 rounded-full font-semibold text-lg hover:bg-[#9C1C22] transition-all duration-300 shadow-lg shadow-[#C1272D]/30 hover:shadow-[#C1272D]/50 hover:-translate-y-1 font-sans cursor-pointer"
              >
                Book a Consultation
                <span className="transition-transform duration-300 group-hover:translate-x-2 text-xl">→</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={{
          title: "Personal Astrology Consultation",
          type: "consultancy",
        }}
      />
    </>
  );
}