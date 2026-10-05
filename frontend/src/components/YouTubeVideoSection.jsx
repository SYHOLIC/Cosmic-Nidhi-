import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Play,
  X,
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  Layers,
  ChevronRight,
  Film,
  ExternalLink,
} from "lucide-react";
import Reveal from "./Reveal";
import BookingModal from "./BookingModal";
import { API_URL } from "../config/api";

export default function YouTubeVideoSection({
  showFeatured = true,
  showGallery = true,
  sectionId = "videos",
  initialCategory = "All",
}) {
  const [videos, setVideos] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideosData();
  }, []);

  const fetchVideosData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel fetch for active videos and featured video
      const [videosRes, featuredRes] = await Promise.all([
        axios.get(`${API_URL}/videos`).catch(() => ({ data: { videos: [], categories: [] } })),
        axios.get(`${API_URL}/videos/featured`).catch(() => ({ data: { video: null } })),
      ]);

      const fetchedVideos = videosRes.data.videos || [];
      setVideos(fetchedVideos);

      // Featured video from API or fallback to first video with is_featured or first video in list
      const feat =
        featuredRes.data?.video ||
        fetchedVideos.find((v) => v.is_featured) ||
        fetchedVideos[0] ||
        null;
      setFeaturedVideo(feat);

      // Available categories from API or derived from active videos
      if (Array.isArray(videosRes.data.categories) && videosRes.data.categories.length > 0) {
        setCategories(["All", ...videosRes.data.categories]);
      } else {
        const uniqueCats = ["All", ...new Set(fetchedVideos.map((v) => v.category).filter(Boolean))];
        setCategories(uniqueCats);
      }
    } catch (err) {
      console.error("Error loading YouTube videos:", err);
      setError("Unable to load videos right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered videos for gallery
  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((v) => v.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModalVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id={sectionId} className="relative overflow-hidden bg-[#FFFDF9] py-20 sm:py-24 md:py-28">
      {/* Background Ambient Cosmic Accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-[#E9A534]/[0.06] via-[#5A0E14]/[0.03] to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 right-[-10%] h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.04] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
        {/* =========================================================================
            FEATURED VIDEO SPOTLIGHT HERO
        ========================================================================= */}
        {showFeatured && (
          <div className="mb-20">
            <div className="mx-auto max-w-[780px] text-center">
              <Reveal>
                <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.08] px-3.5 py-1 text-[#8A5A1F]">
                  <Sparkles size={13} className="text-[#E9A534]" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em]">
                    Discover Your Cosmic Path
                  </span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h2 className="font-display text-[30px] font-medium leading-[1.15] tracking-[-0.02em] text-[#3C080D] sm:text-[38px] md:text-[44px]">
                  Explore astrology, numerology &amp; tarot{" "}
                  <span className="text-[#8B2F2B]">insights from CosmiNidhi</span>
                </h2>
              </Reveal>

              <Reveal delay={160}>
                <p className="mx-auto mt-4 max-w-[620px] font-sans text-[14px] leading-[1.7] text-[#5A0E14]/75 sm:text-[15px]">
                  Immerse yourself in authentic Vedic wisdom, planetary transits, and spiritual guidance
                  curated to empower your soul's journey.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D8A948]/75 bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-[0_4px_16px_rgba(233,165,52,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(233,165,52,0.35)] cursor-pointer"
                  >
                    <span>Book a Consultation</span>
                    <ArrowRight size={14} />
                  </button>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-[#5A0E14]/20 bg-white/80 px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#5A0E14] backdrop-blur-sm transition-all duration-300 hover:border-[#E9A534] hover:bg-[#FFFDF9] hover:text-[#3C080D]"
                  >
                    <span>Explore Services</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Featured Video Showcase Card */}
            {loading ? (
              <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-[#5A0E14]/12 bg-[#FDECC8]/20 aspect-video animate-pulse" />
            ) : featuredVideo ? (
              <Reveal delay={280}>
                <div className="mx-auto mt-12 max-w-4xl">
                  <div
                    onClick={() => setActiveModalVideo(featuredVideo)}
                    className="group relative overflow-hidden rounded-2xl border-2 border-[#E9A534]/40 bg-[#170205] shadow-[0_20px_60px_rgba(60,8,13,0.18)] transition-all duration-500 hover:border-[#E9A534] hover:shadow-[0_28px_80px_rgba(233,165,52,0.30)] cursor-pointer aspect-video"
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={
                        featuredVideo.thumbnail_url ||
                        `https://img.youtube.com/vi/${featuredVideo.youtube_video_id}/maxresdefault.jpg`
                      }
                      alt={featuredVideo.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${featuredVideo.youtube_video_id}/hqdefault.jpg`;
                      }}
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/45" />

                    {/* Featured Tag Badge */}
                    <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9A534] px-3.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-md">
                        <Sparkles size={11} className="fill-[#3C080D]" />
                        Featured Video
                      </span>
                      <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 font-sans text-[10px] font-semibold text-white backdrop-blur-sm">
                        {featuredVideo.category}
                      </span>
                    </div>

                    {/* Center Big Play Button with Pulse */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute h-20 w-20 rounded-full bg-[#E9A534]/30 animate-ping opacity-75" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#E9A534] bg-gradient-to-br from-[#E9A534] to-[#C1892F] text-[#3C080D] shadow-[0_0_35px_rgba(233,165,52,0.6)] transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-8 w-8 fill-[#3C080D] translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                      <h3 className="font-display text-[20px] font-semibold text-white sm:text-[24px] md:text-[26px] line-clamp-2 drop-shadow-md">
                        {featuredVideo.title}
                      </h3>
                      {featuredVideo.description && (
                        <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#FDECC8]/90 line-clamp-2 max-w-2xl drop-shadow">
                          {featuredVideo.description}
                        </p>
                      )}
                      <div className="mt-3.5 flex items-center gap-2 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#E9C76D] group-hover:underline">
                        <span>Click to Watch Full Video</span>
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : null}
          </div>
        )}

        {/* =========================================================================
            VIDEO GALLERY ("Explore Our Insights")
        ========================================================================= */}
        {showGallery && (
          <div className="pt-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-[#5A0E14]/12 pb-6">
              <div>
                <Reveal>
                  <p className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
                    Video Gallery
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <h3 className="mt-2 font-display text-[26px] font-medium tracking-[-0.015em] text-[#3C080D] sm:text-[32px]">
                    Explore Our <span className="text-[#8B2F2B]">Insights</span>
                  </h3>
                </Reveal>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-[#5A0E14] bg-[#5A0E14] text-[#FFF8EC] shadow-[0_4px_12px_rgba(90,14,20,0.20)]"
                          : "border-[#5A0E14]/15 bg-white text-[#5A0E14]/75 hover:border-[#E9A534]/60 hover:text-[#3C080D]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="mt-10">
              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="overflow-hidden rounded-xl border border-[#5A0E14]/10 bg-white p-3 shadow-xs animate-pulse"
                    >
                      <div className="aspect-video w-full rounded-lg bg-[#FDECC8]/30" />
                      <div className="mt-4 h-4 w-3/4 rounded bg-[#5A0E14]/10" />
                      <div className="mt-2 h-3 w-1/2 rounded bg-[#5A0E14]/08" />
                    </div>
                  ))}
                </div>
              ) : filteredVideos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#5A0E14]/20 bg-[#FDECC8]/20 p-12 text-center">
                  <Film className="mx-auto h-12 w-12 text-[#5A0E14]/30" strokeWidth={1.5} />
                  <h4 className="mt-4 font-display text-[18px] font-medium text-[#3C080D]">
                    No videos available in this category
                  </h4>
                  <p className="mt-1.5 font-sans text-[13px] text-[#5A0E14]/70">
                    Check back soon for new CosmiNidhi insights.
                  </p>
                  {selectedCategory !== "All" && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#5A0E14] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#3C080D] transition-colors cursor-pointer"
                    >
                      View All Videos
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredVideos.map((video, index) => (
                    <Reveal key={video._id} delay={index * 50}>
                      <div
                        onClick={() => setActiveModalVideo(video)}
                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#5A0E14]/12 bg-white shadow-[0_6px_20px_rgba(60,8,13,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E9A534]/60 hover:shadow-[0_16px_36px_rgba(60,8,13,0.10)] cursor-pointer"
                      >
                        {/* 16:9 Thumbnail Container */}
                        <div className="relative aspect-video w-full overflow-hidden bg-black">
                          <img
                            src={
                              video.thumbnail_url ||
                              `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`
                            }
                            alt={video.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;
                            }}
                          />

                          {/* Gradient Vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                          {/* Category Badge Top Left */}
                          <div className="absolute left-3 top-3 z-10">
                            <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                              {video.category}
                            </span>
                          </div>

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md text-white shadow-lg transition-all duration-300 group-hover:scale-115 group-hover:bg-[#E9A534] group-hover:text-[#3C080D] group-hover:border-[#E9A534]">
                              <Play className="h-5 w-5 fill-current translate-x-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-1 flex-col p-5">
                          <h4 className="font-display text-[16px] font-semibold leading-[1.3] text-[#3C080D] transition-colors group-hover:text-[#8B2F2B] line-clamp-2">
                            {video.title}
                          </h4>

                          {video.description && (
                            <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-[#6B3A2A]/75 line-clamp-2">
                              {video.description}
                            </p>
                          )}

                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#5A0E14]/08 text-[11px]">
                            <span className="font-sans font-bold uppercase tracking-[0.14em] text-[#8A5A1F] group-hover:text-[#5A0E14] transition-colors inline-flex items-center gap-1">
                              Watch Video
                              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                            </span>
                            <span className="font-sans text-[10px] text-[#5A0E14]/40">
                              YouTube
                            </span>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          LIGHTBOX VIDEO PLAYER MODAL
      ========================================================================= */}
      <AnimatePresence>
        {activeModalVideo && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-[#120103]/85 backdrop-blur-md"
              onClick={() => setActiveModalVideo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#E9A534]/35 bg-[#170205] text-[#FFF8EC] shadow-[0_25px_80px_rgba(0,0,0,0.6)] z-10"
              style={{ scrollbarWidth: "thin" }}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-[#E9A534]/15 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#E9A534]/20 px-3 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[#E9C76D]">
                    {activeModalVideo.category}
                  </span>
                  <h3 className="font-display text-[16px] font-medium text-white sm:text-[18px] line-clamp-1">
                    {activeModalVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(null)}
                  className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Responsive 16:9 YouTube Embed */}
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeModalVideo.youtube_video_id}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeModalVideo.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info & CTAs */}
              <div className="p-5 sm:p-6 bg-[#1A0307]">
                <h4 className="font-display text-[18px] font-semibold text-[#FFF8EC] sm:text-[20px]">
                  {activeModalVideo.title}
                </h4>

                {activeModalVideo.description && (
                  <p className="mt-2.5 font-sans text-[13px] leading-relaxed text-[#F5E5C7]/80">
                    {activeModalVideo.description}
                  </p>
                )}

                {/* Bottom Spiritual CTA Box */}
                <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#E9A534]/20 bg-gradient-to-r from-[#5A0E14]/60 to-[#2A0509]/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-[15px] font-semibold text-[#E9C76D]">
                      Need Personal Astrological Clarity?
                    </p>
                    <p className="font-sans text-[12px] text-[#F5E5C7]/75">
                      Schedule a 1-on-1 private reading with Acharya Nidhi Asthana.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalVideo(null);
                      setIsBookingOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8A948]/75 bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-5 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-md transition-all hover:scale-102 cursor-pointer shrink-0"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </section>
  );
}
