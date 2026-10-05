import React from "react";
import YouTubeVideoSection from "../components/YouTubeVideoSection";
import SEOHead from "../components/SEOHead";
import Reveal from "../components/Reveal";
import heroZodiac from "../assets/hero-zodiac3.webp";
import { Sparkles, Film, Compass, Shield } from "lucide-react";

export default function VideosPage() {
  return (
    <main className="relative">
      <SEOHead
        pageName="videos"
        fallbackTitle="Astrology & Spiritual Guidance Videos | Cosmic Nidhi"
        fallbackDescription="Watch authentic Vedic astrology, tarot readings, numerology insights, and horoscope predictions by Acharya Nidhi Asthana on Cosmic Nidhi."
        fallbackKeywords="astrology videos, vedic astrology youtube, tarot reading videos, numerology guidance, cosmic nidhi videos"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Videos", url: "/videos" },
        ]}
      />

      {/* ============================================================
          DARK HERO BAND
      ============================================================ */}
      <section className="relative overflow-hidden border-b border-[#E9A534]/15 bg-[#180205] pb-12 pt-24 text-[#FFF8EC] md:pt-28 md:pb-16">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 right-[8%] h-[400px] w-[400px] rounded-full bg-[#650F18]/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[5%] h-[350px] w-[350px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        {/* Rotating chakra */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[360px] w-[360px] right-[-140px] opacity-[0.10] mix-blend-screen sm:right-[-100px] sm:h-[420px] sm:w-[420px] lg:right-[-60px] lg:h-[480px] lg:w-[480px] lg:opacity-[0.14]"
        >
          <img
            src={heroZodiac}
            alt="Cosmic Nidhi Sacred Zodiac Chakra"
            className="h-full w-full object-contain"
            style={{ animation: "zodiacRotate 90s linear infinite" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <div className="max-w-[720px]">
            <Reveal>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] px-3.5 py-1 text-[#E9C76D]">
                <Film size={13} className="text-[#E9A534]" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em]">
                  Video Library
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.025em] text-[#FFF7E8] sm:text-[42px] md:text-[50px] lg:text-[56px]">
                Sacred Wisdom &amp;{" "}
                <span className="text-[#E9B957]">Cosmic Insights</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 font-sans text-[14px] leading-[1.7] text-[#F5E5C7]/85 sm:text-[15px]">
                Watch authentic Vedic astrology teachings, planetary guidance, tarot revelations, and
                numerology discussions led by Acharya Nidhi Asthana.
              </p>
            </Reveal>

            {/* Trust row */}
            <Reveal delay={240}>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E9A534]/15 pt-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />
                  </div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#E9C76D]">
                    Authentic Vedic Teachings
                  </p>
                </div>

                <span className="hidden h-3.5 w-px bg-[#E9A534]/20 sm:block" />

                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                    <Compass className="h-3.5 w-3.5" strokeWidth={1.7} />
                  </div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#E9C76D]">
                    Practical Remedies &amp; Guidance
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Dynamic YouTube Section */}
      <YouTubeVideoSection showFeatured={true} showGallery={true} />
    </main>
  );
}
