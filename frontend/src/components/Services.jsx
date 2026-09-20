import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useScrollY } from '../hooks/useReveal';
import BookingModal from './BookingModal';

const SERVICES = [
  {
    id: '01',
    slug: 'numerology',
    title: 'Numerology Consultation',
    subtitle: 'Decode Your Numbers. Understand Your Patterns. Discover Your Possibilities.',
    desc: 'Numbers are more than just digits. In traditional numerology, numbers associated with your name and date of birth are interpreted to understand recurring patterns, tendencies and life themes.\n\nAt Cosmic Nidhi, we bring a modern and personalized approach to Vedic Numerology, combining traditional principles with detailed analysis and practical interpretation.',
    image: 'https://cosmicnidhi.in/wp-content/uploads/2024/04/img_5-700x800.jpg',
    accent: '#E9A534',
    type: 'Numerology',
    deliverables: 'Numerology report, video/phone call, name-analysis notes',
    duration: '30–40 minutes',
    fee: '₹2,100',
    cta: 'Explore Your Numbers',
    whatWeExplore: [
      { title: 'Birth & Life Path Numbers', desc: 'Understand the traditional significance of your core numbers.' },
      { title: 'Name Analysis', desc: 'Explore the numerological relationship between your name and birth details.' },
      { title: 'Name Correction', desc: 'Traditional numerological guidance for selecting or modifying names.' },
      { title: 'Business & Brand Name Analysis', desc: 'Evaluate names from a numerological perspective.' },
      { title: 'Mobile Number Analysis', desc: 'Understand the traditional interpretation of your mobile number.' },
      { title: 'Corporate Numerology', desc: 'Strategic numerical alignment for organizations.' },
      { title: 'Bank Account Number Analysis', desc: 'Traditional vibration analysis for financial accounts.' },
      { title: 'Signature Analysis', desc: 'Explore the numerological perspective of your signature.' },
      { title: 'Personal Year & Cycles', desc: 'Understand recurring numerical cycles and their traditional interpretations.' },
      { title: 'Compatibility Analysis', desc: 'Explore relationship dynamics through numerological patterns.' },
    ],
    sections: [
      {
        heading: 'Beyond Traditional Number Reading',
        text: 'Our approach goes beyond simply calculating numbers. We study the relationship between different numerical influences, look for recurring patterns and place them in the context of your individual circumstances.\n\nThe objective is not simply to predict events, but to help you understand patterns, explore possibilities and gain a different perspective on your journey.',
      },
      {
        heading: 'Your Numbers. Your Patterns. Your Journey.',
        text: 'Every individual has a unique numerical profile. Discover what your numbers traditionally represent and explore your journey with a personalized Numerology consultation.',
      },
    ],
  },
  {
    id: '02',
    slug: 'birth-chart',
    title: 'Birth Chart / Janam Kundli Reading',
    subtitle: 'Understand your life patterns & timing',
    desc: 'A personalised birth-chart consultation uses your date, exact time and place of birth to explore selected themes such as personality patterns, relationships, work, strengths, challenges and upcoming periods. The session is tailored to your questions and does not present life as fixed or predetermined.',
    image: 'https://cosmicnidhi.in/wp-content/uploads/2019/05/img_2-700x800.jpg',
    accent: '#C1272D',
    type: 'Vedic & Western',
    deliverables: 'Chart PDF, consultation call, written summary, recording, follow-up questions',
    duration: '30 minutes',
    fee: '₹2,100',
    cta: 'Book Your Birth Chart Reading',
  },
  {
    id: '03',
    slug: 'vastu',
    title: 'Applied Vastu Consultation',
    subtitle: 'Align Your Space. Transform Your Experience.',
    desc: 'Every space has its own character, layout and flow. Our Advanced Vastu Consultation brings together traditional Vastu principles with a structured and practical approach to understanding your home, office or commercial environment.\n\nWe study directions, zones, entrances, room placement, spatial relationships and elemental balance to identify areas that may benefit from thoughtful changes or traditional Vastu remedies.\n\nUnderstand your space. Create greater harmony. Make your environment work for you.',
    image: 'https://www.grahai.com/images/doshas/mangal-dosha.png',
    accent: '#5A0E14',
    type: 'Vastu',
    deliverables: 'Annotated plan, recommendations, call · Location Visit: ₹5,100 · Map Gridding: ₹12/sq.ft',
    duration: '50–60 minutes',
    fee: '₹3,100',
    cta: 'Review Your Space',
  },
  {
    id: '04',
    slug: 'kundli-matching',
    title: 'Kundli Matching / Relationship Guidance',
    subtitle: 'Understand the Connection. Explore the Compatibility. Strengthen the Journey.',
    desc: 'Every relationship has its own unique dynamics. Through a comparative reading of two birth charts, we explore planetary influences, compatibility indicators, communication patterns, strengths and areas that may require greater understanding.\n\nOur approach goes beyond simply looking at traditional matching scores. It brings together relevant astrological perspectives to help you understand the patterns, possibilities and dynamics within a relationship.\n\nThe consultation is designed to encourage awareness, meaningful conversation and thoughtful reflection, helping you approach your relationship journey with greater clarity and understanding.',
    image: 'https://www.hiastro.in/_next/image?url=https:%2F%2Fsteadfast-cows-9445c3a50f.media.strapiapp.com%2FUnlock_Zodiac_Love_Compatibility_Your_Cosmic_Guide_2bfc1451f0.jpg&w=1920&q=75',
    accent: '#C1272D',
    type: 'Compatibility',
    deliverables: 'Compatibility report and/or consultation · Both Bride & Groom DOB and Name required',
    duration: '30 minutes',
    fee: '₹2,100',
    cta: 'Check Compatibility',
  },
];

const silk = [0.16, 1, 0.3, 1];

/* ─── Vertical Ticker ─── */
function VerticalTicker({ text, color }) {
  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ writingMode: 'vertical-rl' }}
    >
      <motion.span
        animate={{ y: [0, -60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="text-[9px] tracking-[0.3em] uppercase whitespace-nowrap select-none"
        style={{ color, opacity: 0.3 }}
      >
        {text} · {text} · {text} · {text} · {text} ·
      </motion.span>
    </div>
  );
}

/* ─── Image Panel ─── */
function ImagePanel({ image, title, accent, side = 'left' }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.06 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: silk }}
        viewport={{ once: true }}
      />

      {/* Brand wipe reveal */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundColor: accent,
          transformOrigin: side === 'left' ? 'right' : 'left'
        }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
        viewport={{ once: true }}
      />

      {/* Gradient overlay - Dark Maroon */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#5A0E14]/80 via-[#5A0E14]/20 to-transparent" />
    </div>
  );
}

/* ─── Single Service Row ─── */
function ServiceRow({ item, index, onBook }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.article
      ref={ref}
      id={item.slug}
      className="relative w-full scroll-mt-24"
      style={{ minHeight: 480, borderBottom: '1px solid rgba(90,14,20,0.15)' }}
    >
      {/* Desktop: 2-column grid | Mobile: Single column */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[46%_54%]"
        style={{ minHeight: 480 }}
      >
        {/* ─ Image Side ─ */}
        <div
          className={`relative overflow-hidden ${
            isEven ? 'lg:order-1' : 'lg:order-2'
          } order-1 min-h-[280px] lg:min-h-full`}
        >
          <ImagePanel
            image={item.image}
            title={item.title}
            accent={item.accent}
            side={isEven ? 'right' : 'left'}
          />
        </div>

        {/* ─ Text Side ─ */}
        <div
          className={`relative flex flex-col justify-center order-2 ${
            isEven ? 'lg:order-2' : 'lg:order-1'
          } p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 pr-10 lg:pr-14`}
          style={{
            backgroundColor: '#FFF7E9',
          }}
        >
          {/* Vertical Ticker - Only on desktop */}
          <div className="hidden lg:block">
            <VerticalTicker
              text={item.title}
              color={item.accent}
            />
          </div>

          {/* Large Ghost Number - Only on desktop */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.1 }}
            className="absolute font-display select-none pointer-events-none hidden lg:block"
            style={{
              fontSize: 'clamp(6rem, 12vw, 10rem)',
              lineHeight: 1,
              color: isEven ? 'rgba(193,39,45,0.06)' : 'rgba(233,165,52,0.06)',
              top: '50%',
              left: isEven ? '2.5rem' : '1.5rem',
              transform: 'translateY(-50%)',
              fontWeight: 700,
            }}
          >
            {item.id}
          </motion.span>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: silk, delay: 0.15 }}
            className="flex items-center gap-3 mb-4"
          >
            <span
              className="font-sans text-[10px] tracking-[0.32em] uppercase font-bold"
              style={{ color: item.accent }}
            >
              {item.id}
            </span>
            <span
              className="inline-block h-px w-10"
              style={{ backgroundColor: item.accent, opacity: 0.4 }}
            />
            <span
              className="font-sans text-[10px] tracking-[0.28em] uppercase"
              style={{ color: '#5A0E14/60' }}
            >
              {item.type}
            </span>
          </motion.div>

          {/* Title */}
          <div className="overflow-hidden mb-3 max-w-3xl">
            <motion.h2
              initial={{ y: '105%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
              className="font-display"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 3rem)',
                lineHeight: 1.08,
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: '#3C080D',
              }}
            >
              {item.title}
            </motion.h2>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: silk, delay: 0.3 }}
            className="text-sm font-medium mb-3 max-w-3xl"
            style={{ color: item.accent }}
          >
            {item.subtitle}
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: silk, delay: 0.35 }}
            className="font-sans leading-relaxed mb-5 text-justify space-y-3 w-full max-w-3xl"
            style={{
              color: 'rgba(44, 18, 16, 0.78)',
              fontSize: '0.91rem',
              lineHeight: 1.72,
            }}
          >
            {item.desc.split('\n\n').map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}
          </motion.div>

          {/* What We Explore Section (if present) */}
          {item.whatWeExplore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: silk, delay: 0.38 }}
              className="mb-5 rounded-[10px] border border-[#E9A534]/30 bg-[#FDECC8]/40 p-4 sm:p-5 max-w-3xl"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="h-px w-6 bg-[#E9A534]" />
                <h4 className="font-display text-[14px] sm:text-[15px] font-semibold uppercase tracking-[0.14em] text-[#3C080D]">
                  What We Explore
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-justify">
                {item.whatWeExplore.map((exp, expIdx) => (
                  <div key={expIdx} className="flex items-start gap-2 font-sans text-[12px] leading-[1.6] text-[#3C080D]/85">
                    <span className="text-[#C1272D] text-xs mt-0.5 shrink-0">✦</span>
                    <div>
                      <strong className="text-[#5A0E14]">{exp.title}</strong>
                      {exp.desc && <span className="text-[#6B3A2A]/80"> — {exp.desc}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Additional Sections (if present) */}
          {item.sections && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: silk, delay: 0.4 }}
              className="space-y-4 mb-5 max-w-3xl"
            >
              {item.sections.map((sec, sIdx) => (
                <div key={sIdx} className="text-justify font-sans">
                  <h4 className="font-display text-[15px] sm:text-[16px] font-semibold text-[#3C080D] mb-1.5">
                    {sec.heading}
                  </h4>
                  <div className="space-y-2 text-[0.91rem] leading-[1.72] text-[#2C1210]/78">
                    {sec.text.split('\n\n').map((p, pI) => (
                      <p key={pI}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Deliverables, Duration & Fee */}
          {item.deliverables && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: silk, delay: 0.4 }}
              className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 max-w-3xl pt-2 border-t border-[#5A0E14]/10"
            >
              {item.fee && (
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#C1272D] font-sans font-bold flex items-center gap-1.5">
                  <span className="text-[#C1272D] text-xs">✦</span> Fee: {item.fee}
                </p>
              )}
              {item.duration && (
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#5A0E14]/65 font-sans font-medium flex items-center gap-1.5">
                  <span className="text-[#E9A534] text-xs">✦</span> Duration: {item.duration}
                </p>
              )}
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#5A0E14]/60 font-sans font-medium flex items-center gap-1.5">
                <span className="text-[#C1272D] text-xs">✦</span> Includes: {item.deliverables}
              </p>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: silk, delay: 0.55 }}
          >
            <button
              type="button"
              onClick={() => onBook?.(item)}
              className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em] group"
              style={{ color: item.accent }}
              onMouseEnter={e => {
                const line = e.currentTarget.querySelector('[data-line]');
                if (line) line.style.width = '100%';
              }}
              onMouseLeave={e => {
                const line = e.currentTarget.querySelector('[data-line]');
                if (line) line.style.width = '24px';
              }}
            >
              <span className="relative pb-[3px]">
                {item.cta || 'Read Now'}
                <span
                  data-line
                  className="absolute bottom-0 left-0 h-px"
                  style={{
                    backgroundColor: item.accent,
                    width: 24,
                    transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </span>
              <svg
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 8h12M8 2l6 6-6 6" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Section Heading ─── */
function SectionHeading({ onBook }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#5A0E14',
        padding: '5rem 3.5rem 4rem',
        borderBottom: '1px solid rgba(233,165,52,0.2)',
      }}
    >
      {/* Massive Ghost Text */}
      <span
        className="absolute pointer-events-none select-none font-display"
        style={{
          fontSize: 'clamp(6rem, 18vw, 16rem)',
          lineHeight: 0.85,
          color: 'rgba(233,165,52,0.06)',
          bottom: '-0.1em',
          right: '-0.02em',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        Services
      </span>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: silk }}
          className="flex items-center gap-3 mb-5"
        >
          <span
            className="inline-block h-px w-8"
            style={{ backgroundColor: '#E9A534' }}
          />
          <span
            className="font-sans text-[10px] uppercase tracking-[0.32em]"
            style={{ color: '#E9A534' }}
          >
            What We Offer
          </span>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.h2
            initial={{ y: '100%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="font-display font-light"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              color: '#FDECC8',
              lineHeight: 1.05,
            }}
          >
            Let's Make <span className="italic text-[#E9A534]">Some Magic</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: silk, delay: 0.35 }}
          className="font-sans text-justify"
          style={{ color: 'rgba(253,236,200,0.7)', fontSize: '0.92rem', maxWidth: '62ch', lineHeight: '1.65', textAlign: 'justify' }}
        >
          Every consultation is thoughtfully personalized, combining the timeless wisdom of Vedic Numerology, Advanced Vastu and Ancient Vedic Astrology with a modern, analytical approach. Our approach is designed to help you understand, reflect and make informed personal choices, while always respecting your privacy, individuality and personal journey.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: silk, delay: 0.5 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={() => onBook?.(SERVICES[0])}
            className="group inline-flex items-center gap-3 bg-[#C1272D] hover:bg-[#A81E24] px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-[#FFF7E9] rounded-full shadow-lg shadow-[#C1272D]/30 hover:shadow-[#C1272D]/50 transition-all duration-300 font-sans cursor-pointer"
          >
            <span>Book a Consultation</span>
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 8h12M8 2l6 6-6 6" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export default function Services() {
  const [bookingService, setBookingService] = useState(null);

  return (
    <section id="services" className="bg-[#FFF7E9]">
      <SectionHeading onBook={setBookingService} />

      <div>
        {SERVICES.map((item, idx) => (
          <ServiceRow key={item.id} item={item} index={idx} onBook={setBookingService} />
        ))}
      </div>

      <BookingModal
        isOpen={Boolean(bookingService)}
        onClose={() => setBookingService(null)}
        initialService={bookingService}
      />

      {/* Footer CTA - Dark Maroon */}
      <div
        className="flex items-center justify-center py-14"
        style={{ backgroundColor: '#5A0E14', borderTop: '1px solid rgba(233,165,52,0.15)' }}
      >
        <a
          href="#pricing"
          className="relative inline-flex items-center gap-4 group font-sans text-[11px] uppercase tracking-[0.22em] text-[#E9A534]"
          onMouseEnter={e => (e.currentTarget.querySelector('[data-bar]').style.transform = 'scaleX(1)')}
          onMouseLeave={e => (e.currentTarget.querySelector('[data-bar]').style.transform = 'scaleX(0)')}
        >
          <span
            data-bar
            className="absolute inset-x-0 inset-y-0 -mx-6 -my-3"
            style={{
              backgroundColor: 'rgba(233,165,52,0.08)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
          <span className="relative">View All Services</span>
          <svg
            viewBox="0 0 16 16"
            className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 8h12M8 2l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
}