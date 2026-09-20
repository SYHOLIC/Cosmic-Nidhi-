import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollY } from "../hooks/useReveal";
import Reveal from "./Reveal";
import aboutChart from "../assets/about-img.webp";
import nidhi1 from "../assets/image.png";

export default function About() {
  const y = useScrollY();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Counter for years
  const [years, setYears] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const target = 10;
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setYears(target);
              clearInterval(timer);
            } else {
              setYears(Math.floor(current));
            }
          }, 25);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Features data
  const features = [
    {
      icon: "✦",
      title: "Numerology",
      desc: "Understanding your life path, destiny, and personal year cycles",
    },
    {
      icon: "✦",
      title: "Astrology",
      desc: "Birth chart analysis, planetary effects, and timing of life events",
    },
    {
      icon: "✦",
      title: "Vastu",
      desc: "Space alignment and energy flow for harmony in living & work spaces",
    },
  ];

  // Stats data
  const stats = [
    { number: "10+", label: "Years of Practice" },
    { number: "4,200+", label: "Charts Read" },
    { number: "36", label: "Guna Points" },
    { number: "27", label: "Nakshatras" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-28 md:py-40 bg-[#FFF7E9]"
    >
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#C1272D]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E9A534]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5A0E14]/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <Reveal>
            <p className="text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] uppercase text-[#C1272D] font-sans">
              About Cosmic Nidhi
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-[#3C080D]">
              Know Your Energy.{" "}
              <span className="inline-block bg-gradient-to-r from-[#5A0E14] via-[#C1272D] to-[#E9A534] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                Understand Your Journey.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E9A534]" />
              <span className="text-[#E9A534] text-sm">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E9A534]" />
            </div>
          </Reveal>
        </div>

        {/* Main Content - Image & Text */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left - Main Image Only */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#5A0E14]/10"
            >
              <img
                src={nidhi1}
                alt="Nidhi Asthana - Cosmic Nidhi Founder"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 border-2 border-[#E9A534]/30 rounded-2xl pointer-events-none" />
            </motion.div>

            {/* Years badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute -top-4 -left-4 bg-[#FFF7E9] border-2 border-[#E9A534] rounded-xl px-6 py-4 shadow-xl"
            >
              <p className="font-display text-4xl bg-gradient-to-r from-[#5A0E14] via-[#C1272D] to-[#E9A534] bg-clip-text text-transparent">
                {years}+
              </p>
              <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#5A0E14] font-sans">
                Years of Wisdom
              </p>
            </motion.div>
          </div>

          {/* Right - Content */}
          <div>
            <Reveal>
              <p className="font-display italic text-[#C1272D] text-lg md:text-xl font-semibold mb-4">
                Numerology · Astrology · Vastu
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="prose prose-lg max-w-none">
                <p className="text-[#2C1210]/80 leading-relaxed font-sans text-base md:text-lg text-justify">
                  At <span className="text-[#C1272D] font-semibold">Cosmic Nidhi</span>, Make believe in Spiritual Growth first, then trusted guidance, then Accurate Readings. Our work brings together astrology, numerology and Vastu-inspired perspectives to help people reflect on their patterns, choices, relationships, spaces and next steps.
                </p>
                <p className="mt-4 text-[#2C1210]/70 leading-relaxed font-sans text-base md:text-lg text-justify">
                  Every consultation is approached with care, context and confidentiality. Rather than using fear-based predictions or one-size-fits-all answers, Cosmic Nidhi aims to translate traditional systems into clear observations and practical questions for modern life.
                </p>
              </div>
            </Reveal>

            {/* Features Grid */}
            <Reveal delay={240}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                    className="bg-[#FDECC8]/40 rounded-xl p-4 text-center border border-[#5A0E14]/8 hover:border-[#C1272D]/20 transition-all duration-300 hover:shadow-md"
                  >
                    <span className="text-[#E9A534] text-xl block mb-1">{feature.icon}</span>
                    <h4 className="font-display text-[#3C080D] text-lg">{feature.title}</h4>
                    <p className="text-[#2C1210]/60 text-xs font-sans mt-1">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={320}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#5A0E14]/10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <p className="font-display text-2xl text-[#C1272D]">{stat.number}</p>
                    <p className="text-[0.55rem] tracking-[0.15em] uppercase text-[#5A0E14]/60 font-sans">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* CTA Button */}
            <Reveal delay={400}>
              <div className="mt-8">
                <a
                  href="#services"
                  className="group relative inline-flex items-center gap-3 bg-[#C1272D] text-[#FFF7E9] px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#9C1C22] transition-all duration-300 shadow-lg shadow-[#C1272D]/30 hover:shadow-[#C1272D]/50 hover:-translate-y-0.5 font-sans"
                >
                  Book a Consultation
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </Reveal>

            {/* Confidentiality note */}
            <Reveal delay={480}>
              <p className="mt-6 text-[0.6rem] tracking-[0.1em] uppercase text-[#5A0E14]/40 font-sans">
                ✦ Confidential · Compassionate · Clear ✦
              </p>
            </Reveal>
          </div>
        </div>

        {/* Bottom Section - Store & Philosophy */}
        <Reveal delay={350}>
          <div className="mt-20 pt-12 border-t border-[#5A0E14]/10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-2xl text-[#3C080D] mb-3">
                  Our <span className="text-[#C1272D]">Store</span>
                </h3>
                <p className="text-[#2C1210]/70 leading-relaxed font-sans text-sm">
                  Alongside consultations and reports, our store offers selected crystals and spiritual products with transparent descriptions, care guidance and responsible use information.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl text-[#3C080D] mb-3">
                  Our <span className="text-[#E9A534]">Philosophy</span>
                </h3>
                <p className="text-[#2C1210]/70 leading-relaxed font-sans text-sm">
                  Cosmic Nidhi is a space for reflection and informed personal choice. The guidance shared is spiritual and educational in nature; outcomes depend on many personal, social and practical factors.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}