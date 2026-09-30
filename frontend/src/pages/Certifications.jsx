import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ShieldCheck,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  Sparkles,
  Star,
  Eye,
  BookOpen,
  Compass,
  Flame,
  Calendar,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import BookingModal from "../components/BookingModal";
import nidhi2 from "../assets/nidhi2.webp";

// Configured PDF path (36-page scanned dossier from desktop)
const CERTIFICATE_PDF_URL = "/certificates.pdf";

// Featured certificates with extracted high-res scans
const FEATURED_CERTIFICATES = [
  {
    id: 1,
    image: "/certificates/cert-1.jpg",
    title: "Professional Vedic Numerology",
    category: "numerology",
    organization: "Anko Ka Khel LLP",
    date: "14th August 2025",
    mentors: "Deepa Arora & Sanddeep Bajaj",
    badge: "Numerology",
  },
  {
    id: 2,
    image: "/certificates/cert-2.jpg",
    title: "50+ Vedic Yantra Science",
    category: "yantra",
    organization: "Anko Ka Khel LLP",
    date: "16th October 2025",
    mentors: "Dr. Anamika N Ratliya & Sanddeep Bajaj",
    badge: "Sacred Yantra",
  },
  {
    id: 3,
    image: "/certificates/cert-3.jpg",
    title: "Lagna Faladesh Workshop",
    category: "astrology",
    organization: "Anko Ka Khel LLP",
    date: "10th March 2025",
    mentors: "Dr. Anamika N Ratliya & Sanddeep Bajaj",
    badge: "Parashari Jyotish",
  },
  {
    id: 4,
    image: "/certificates/cert-4.jpg",
    title: "Atamkarak Karansh Retro & Combust Planet",
    category: "astrology",
    organization: "Anko Ka Khel LLP",
    date: "05th May 2025",
    mentors: "Dr. Anamika N Ratliya & Sanddeep Bajaj",
    badge: "Advanced Astrology",
  },
  {
    id: 5,
    image: "/certificates/cert-5.jpg",
    title: "9 Planets Gochar (Planetary Transits)",
    category: "astrology",
    organization: "Anko Ka Khel LLP",
    date: "08th May 2025",
    mentors: "Dr. Anamika N Ratliya & Sanddeep Bajaj",
    badge: "Gochar Shastra",
  },
  {
    id: 6,
    image: "/certificates/cert-6.jpg",
    title: "Planet Conjunction Astrology",
    category: "astrology",
    organization: "Anko Ka Khel LLP",
    date: "14th April 2025",
    mentors: "Dr. Anamika N Ratliya & Sanddeep Bajaj",
    badge: "Yuti Faladesh",
  },
];

// Generate full list of all 36 certificates for the complete portfolio
const ALL_CERTIFICATES = Array.from({ length: 36 }, (_, index) => {
  const pageNum = index + 1;
  const featured = FEATURED_CERTIFICATES.find((c) => c.id === pageNum);
  if (featured) return featured;

  return {
    id: pageNum,
    image: `/certificates/cert-${pageNum}.jpg`,
    title: `Vedic Accreditation Document #${pageNum}`,
    category: pageNum % 3 === 0 ? "numerology" : pageNum % 4 === 0 ? "yantra" : "astrology",
    organization: "Verified Vedic Institution / Anko Ka Khel LLP",
    date: "Certified Professional",
    mentors: "Senior Vedic Astrologers & Numerologists",
    badge: `Page ${pageNum} of 36`,
  };
});

const PILLARS = [
  {
    title: "Vedic Astrology (Jyotish Acharya)",
    subtitle: "Parashari Hora Shastra & Birth Chart Mastery",
    icon: Star,
    badge: "Core Mastery",
    desc: "Rigorous study in classical Janam Kundli interpretation, Dasha analysis, Gochar (transits), retro & combust planet dynamics, and authentic karmic remedies.",
  },
  {
    title: "Applied Vastu Shastra Consultant",
    subtitle: "16-Zone Shakti Chakra & Spatial Energy Alignment",
    icon: Compass,
    badge: "Spatial Expert",
    desc: "Certified in Vedic architectural principles, directional audits, energy grid balancing, and non-demolition space remedies for residential and commercial spaces.",
  },
  {
    title: "Professional Numerology Mastery",
    subtitle: "Vedic, Chaldean & Pythagorean Vibrations",
    icon: Layers,
    badge: "Numerical Science",
    desc: "Certified across Vedic & Western numerology systems, name vibrations, personal year cycles, and brand/corporate name frequency alignment.",
  },
  {
    title: "50+ Sacred Vedic Yantras & Remedies",
    subtitle: "Authentic Geometric Yantra Energization",
    icon: Flame,
    badge: "Remedial Shastra",
    desc: "Certified in the sacred drawing, sanctification, and ritual activation of over 50 Vedic Yantras and targeted remedies for peace, growth, and dosha mitigation.",
  },
];

export default function Certifications() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const filteredCertificates =
    selectedCategory === "all"
      ? ALL_CERTIFICATES
      : ALL_CERTIFICATES.filter((c) => c.category === selectedCategory);

  const handleOpenLightbox = (index) => {
    setActiveImageIndex(index);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) =>
      prev === 0 ? filteredCertificates.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) =>
      prev === filteredCertificates.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <SEOHead
        pageName="certifications"
        fallbackTitle="Certifications & Accreditations | Aacharya Nidhi Asthana - Cosmic Nidhi"
        fallbackDescription="View the 36+ verified certifications and official credentials achieved by Aacharya Nidhi Asthana in Vedic Astrology (Jyotish), Applied Vastu Shastra, and Numerology."
        fallbackKeywords="aacharya nidhi asthana certifications, certified vedic astrologer, vastu shastra certificate, certified numerologist, cosmic nidhi credentials"
        canonicalUrl="https://cosmic-nidhi.onrender.com/certifications"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Certifications", url: "/certifications" },
        ]}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#FFF7E9] pt-32 pb-16 md:pt-36 md:pb-16 border-b border-[#5A0E14]/10">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#C1272D]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E9A534]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E9A534]/50 bg-[#FDECC8]/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#8A5A1F]">
              <Award className="h-3.5 w-3.5 text-[#C1272D]" />
              36+ Official Certifications Achieved
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#3C080D]"
          >
            Certifications &amp;{" "}
            <span className="inline-block bg-gradient-to-r from-[#5A0E14] via-[#C1272D] to-[#E9A534] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
              Accreditations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 mx-auto max-w-2xl font-sans text-base sm:text-lg text-[#2C1210]/80 leading-relaxed"
          >
            Explore the authentic qualifications, workshops, and mastery credentials achieved by <strong>Aacharya Nidhi Asthana</strong> in Vedic Astrology, Vastu Shastra, and Numerology.
          </motion.p>

          {/* Quick PDF Action Buttons in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => setPdfModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#5A0E14] px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#43090E] transition-all shadow-md cursor-pointer"
            >
              <Eye className="h-4 w-4 text-[#E9C76D]" />
              View Complete PDF Dossier (36 Pages)
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#E9A534]" />
            <span className="text-[#E9A534] text-lg">✦</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#E9A534]" />
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative overflow-hidden bg-[#FFF7E9] py-14 md:py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          
          {/* Founder Profile & Official Dossier Banner */}
          <div className="mb-16 grid lg:grid-cols-12 gap-8 items-center bg-[#FDECC8]/30 rounded-3xl border border-[#E9A534]/30 p-6 sm:p-10 shadow-sm">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#E9A534]/40 bg-[#FFF7E9]">
                  <img
                    src={nidhi2}
                    alt="Aacharya Nidhi Asthana - Cosmic Nidhi Founder & Astrologer"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 rounded-xl border border-[#E9A534] bg-[#FFFDF9] px-3.5 py-2 shadow-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="text-[11px] font-bold text-[#3C080D] uppercase tracking-wider">
                      Verified
                    </p>
                    <p className="text-[9px] text-[#6B3A2A]/70">
                      Vedic Acharya
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md bg-[#5A0E14] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFF8EC]">
                <Sparkles className="h-3 w-3 text-[#E9C76D]" />
                Lead Practitioner &amp; Founder
              </div>

              <h2 className="font-display text-3xl sm:text-4xl text-[#3C080D]">
                Aacharya <span className="text-[#C1272D]">Nidhi Asthana</span>
              </h2>

              <p className="font-sans text-base text-[#2C1210]/80 leading-relaxed text-justify">
                With over a decade of dedicated study and consultation in <strong>Vedic Astrology (Jyotish)</strong>, <strong>Applied Vastu Shastra</strong>, and <strong>Numerology</strong>, Aacharya Nidhi Asthana has earned comprehensive certifications from esteemed institutions including <em>Anko Ka Khel LLP</em> and renowned astrological scholars.
              </p>

              {/* Official Certificate PDF Access Banner */}
              <div className="mt-5 rounded-2xl border border-[#E9A534]/60 bg-[#FFFDF9] p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#C1272D] border border-red-200">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-[#3C080D]">
                        Complete 36-Page Official Certificate Dossier
                      </h4>
                      <p className="font-sans text-xs text-[#6B3A2A]/80">
                        High-resolution scanned certificates and workshop accreditations
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setPdfModalOpen(true)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full border border-[#5A0E14]/20 bg-white px-4 py-2 font-sans text-xs font-bold text-[#3C080D] hover:bg-[#FDECC8]/40 hover:border-[#E9A534] transition-all cursor-pointer shadow-xs"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#8A5A1F]" />
                      Preview PDF
                    </button>
                    <a
                      href={CERTIFICATE_PDF_URL}
                      download="Aacharya_Nidhi_Asthana_Certificates.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#5A0E14] px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#43090E] transition-all shadow-md cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-[#E9C76D]" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars of Mastery */}
          <div className="mb-14 text-center">
            <h3 className="font-display text-3xl sm:text-4xl text-[#3C080D]">
              Core Disciplines &amp; <span className="text-[#C1272D]">Mastery</span>
            </h3>
            <p className="mt-2 text-sm text-[#6B3A2A]/80 font-sans max-w-xl mx-auto">
              Every consultation is anchored in certified knowledge from authentic shastras and continuous scholarly training.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-20">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-2xl border border-[#5A0E14]/10 bg-white/80 p-6 flex flex-col justify-between hover:border-[#E9A534] hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5A0E14] to-[#8E1B24] text-[#E9C76D]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5A1F] bg-[#FDECC8]/50 px-2 py-0.5 rounded border border-[#E9A534]/30">
                        {pillar.badge}
                      </span>
                    </div>
                    <h4 className="font-display text-lg text-[#3C080D] mb-1">
                      {pillar.title}
                    </h4>
                    <p className="font-sans text-[11px] font-semibold text-[#C1272D] mb-2.5">
                      {pillar.subtitle}
                    </p>
                    <p className="font-sans text-xs text-[#2C1210]/75 leading-relaxed text-justify">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Certificate Gallery */}
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#5A0E14]/10 pb-5">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#3C080D]">
                Certificate <span className="text-[#C1272D]">Gallery</span>
              </h3>
              <p className="font-sans text-xs text-[#6B3A2A]/80 mt-1">
                Click on any certificate to view high-resolution scan
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All 36 Certificates" },
                { id: "astrology", label: "Vedic Astrology" },
                { id: "numerology", label: "Numerology" },
                { id: "yantra", label: "Yantras & Remedies" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? "bg-[#5A0E14] text-[#FFF8EC] shadow-sm"
                      : "bg-white/80 border border-[#5A0E14]/15 text-[#6B3A2A] hover:bg-[#FDECC8]/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredCertificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
                onClick={() => handleOpenLightbox(index)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#5A0E14]/12 bg-white shadow-xs hover:border-[#E9A534] hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Certificate Scan Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-[#5A0E14]/8">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#3C080D] shadow-lg">
                      <ZoomIn className="h-5 w-5" />
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 rounded-md bg-[#5A0E14]/90 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[#FFF8EC] backdrop-blur-xs">
                    {cert.badge}
                  </span>
                </div>

                {/* Card Details */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#3C080D] group-hover:text-[#C1272D] transition-colors">
                      {cert.title}
                    </h4>
                    <p className="font-sans text-xs text-[#8A5A1F] mt-1 font-medium">
                      {cert.organization}
                    </p>
                    {cert.mentors && (
                      <p className="font-sans text-[11px] text-[#2C1210]/60 mt-1">
                        Mentor: {cert.mentors}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#5A0E14]/8 flex items-center justify-between text-xs">
                    <span className="font-sans text-[11px] text-[#6B3A2A]/70 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#E9A534]" />
                      {cert.date}
                    </span>
                    <span className="font-sans text-[11px] font-semibold text-[#C1272D] group-hover:underline flex items-center gap-0.5">
                      View Certificate <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Ethics & Booking CTA */}
          <div className="mt-20 rounded-3xl border border-[#E9A534]/30 bg-[#FDECC8]/30 p-8 sm:p-12 text-center">
            <h4 className="font-display text-3xl text-[#3C080D] mb-3">
              Consult with a Certified Vedic Acharya
            </h4>
            <p className="font-sans text-base text-[#2C1210]/80 max-w-xl mx-auto leading-relaxed">
              Experience authentic, personalized guidance grounded in canonical shastras, strict confidentiality, and constructive remedies.
            </p>

            <p className="mt-4 font-sans text-lg italic text-[#C1272D] font-medium">
              "Let the stars guide you, while you create your own destiny."
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#C1272D] px-8 py-4 font-sans text-sm font-semibold text-[#FFF7E9] hover:bg-[#9C1C22] shadow-lg shadow-[#C1272D]/30 transition-all cursor-pointer"
              >
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Certificate Image Zoom */}
      <AnimatePresence>
        {activeImageIndex !== null && filteredCertificates[activeImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageIndex(null)}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] max-w-4xl w-full flex flex-col rounded-2xl bg-[#FFFDF9] border border-[#E9A534]/50 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#5A0E14]/15 bg-gradient-to-r from-[#210307] via-[#3C080D] to-[#210307] px-6 py-3.5 text-[#FFF8EC]">
                <div>
                  <h3 className="font-display text-sm sm:text-base font-semibold text-[#FFF8EC]">
                    {filteredCertificates[activeImageIndex].title}
                  </h3>
                  <p className="text-[10px] text-[#E9C76D]">
                    {filteredCertificates[activeImageIndex].organization} • {filteredCertificates[activeImageIndex].date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={filteredCertificates[activeImageIndex].image}
                    download={`${filteredCertificates[activeImageIndex].title}.jpg`}
                    className="rounded-full p-1.5 text-[#E9C76D] hover:bg-white/10 transition-colors"
                    title="Download Image"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(null)}
                    className="rounded-full p-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative flex-1 bg-gray-900/90 flex items-center justify-center p-4 min-h-[50vh] max-h-[72vh] overflow-hidden">
                <img
                  src={filteredCertificates[activeImageIndex].image}
                  alt={filteredCertificates[activeImageIndex].title}
                  className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-xl"
                />

                {/* Prev / Next Arrows */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-[#C1272D] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-[#C1272D] transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-2.5 bg-[#FFF7E9] border-t border-[#5A0E14]/10 text-xs font-sans text-[#6B3A2A]">
                <span>
                  Certificate {activeImageIndex + 1} of {filteredCertificates.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(null);
                    setPdfModalOpen(true);
                  }}
                  className="font-semibold text-[#C1272D] hover:underline cursor-pointer"
                >
                  Open in 36-Page PDF Dossier →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Certificate PDF Viewer Modal */}
      <AnimatePresence>
        {pdfModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative flex flex-col h-[90vh] w-full max-w-5xl rounded-2xl bg-[#FFFDF9] border border-[#E9A534]/50 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#5A0E14]/15 bg-gradient-to-r from-[#210307] via-[#3C080D] to-[#210307] px-6 py-4 text-[#FFF8EC]">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-[#E9C76D]" />
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#FFF8EC]">
                      Aacharya Nidhi Asthana - Official Certifications
                    </h3>
                    <p className="text-[10px] text-[#E9C76D]/80 uppercase tracking-wider">
                      Verified 36-Page Portfolio Dossier (7.6 MB)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={CERTIFICATE_PDF_URL}
                    download="Aacharya_Nidhi_Asthana_Certificates.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E9A534]/40 bg-white/10 px-3 py-1.5 text-xs text-[#E9C76D] hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                  <a
                    href={CERTIFICATE_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E9A534]/40 bg-white/10 px-3 py-1.5 text-xs text-[#E9C76D] hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Tab
                  </a>
                  <button
                    type="button"
                    onClick={() => setPdfModalOpen(false)}
                    className="rounded-full p-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body: Embedded PDF or Friendly Fallback */}
              <div className="relative flex-1 bg-gray-100 overflow-hidden">
                <object
                  data={`${CERTIFICATE_PDF_URL}#toolbar=1&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#FFF7E9]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#C1272D] border border-red-200 mb-4">
                      <FileText className="h-8 w-8" />
                    </div>
                    <h4 className="font-display text-xl text-[#3C080D]">
                      Certificate Document Ready
                    </h4>
                    <p className="mt-2 max-w-md font-sans text-sm text-[#2C1210]/75">
                      Your browser does not support embedded PDF previews directly. You can view or download the complete 36-page certification dossier below:
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                      <a
                        href={CERTIFICATE_PDF_URL}
                        download="Aacharya_Nidhi_Asthana_Certificates.pdf"
                        className="inline-flex items-center gap-2 rounded-full bg-[#5A0E14] px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#FFF8EC] shadow-md hover:bg-[#43090E] transition-all cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-[#E9C76D]" />
                        Download Certificate PDF
                      </a>
                      <a
                        href={CERTIFICATE_PDF_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#5A0E14]/20 bg-white px-5 py-2.5 font-sans text-xs font-semibold text-[#3C080D] hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in New Window
                      </a>
                    </div>
                  </div>
                </object>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
