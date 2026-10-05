import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Play, X, Sparkles, ExternalLink, Calendar } from "lucide-react";
import BookingModal from "./BookingModal";
import { API_URL } from "../config/api";

export default function VideoMarqueeSection() {
  const [videos, setVideos] = useState([]);
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/videos`);
        if (isMounted) {
          setVideos(res.data?.videos || []);
        }
      } catch (err) {
        console.error("Failed to load videos for marquee:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveModalVideo(null);
    };
    if (activeModalVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeModalVideo]);

  if (loading && videos.length === 0) {
    return (
      <div className="mt-16 text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#C1272D] border-t-transparent" />
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  // Ensure seamless loop by repeating enough times to fill any screen width
  const minItemsForLoop = 12;
  const repeatCount = Math.max(2, Math.ceil(minItemsForLoop / videos.length) * 2);
  const repeatedVideos = Array(repeatCount).fill(videos).flat();

  return (
    <>
      <style>{`
        @keyframes videoMarqueeRTL {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .video-marquee-track {
          display: flex;
          width: max-content;
          animation: videoMarqueeRTL 38s linear infinite;
          will-change: transform;
        }
        .video-marquee-container:hover .video-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <section className="mt-16 md:mt-20 overflow-hidden">
        {/* Subtle section header */}
        <div className="text-center mb-8 px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9A534]/15 border border-[#E9A534]/30 text-[#5A0E14] text-xs uppercase tracking-widest font-semibold font-sans mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E9A534]" />
            Spiritual Wisdom & Insights
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-[#3C080D]">
            Watch <span className="text-[#C1272D]">Cosmic Guidance</span>
          </h3>
          <p className="mt-2 text-sm text-[#2C1210]/70 font-sans max-w-xl mx-auto">
            Explore authentic astrology, numerology, tarot, and vastu videos from Acharya Nidhi Asthana. Click any video to watch.
          </p>
        </div>

        {/* Marquee Track Container */}
        <div className="video-marquee-container relative w-full overflow-hidden py-4 cursor-pointer select-none">
          {/* Gradient edge masks for smooth fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FFF7E9] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FFF7E9] to-transparent z-10 pointer-events-none" />

          {/* Moving Track */}
          <div className="video-marquee-track gap-5 px-3">
            {repeatedVideos.map((video, index) => {
              const thumbUrl =
                video.thumbnail_url ||
                `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;

              return (
                <div
                  key={`${video._id || video.id}-${index}`}
                  onClick={() => setActiveModalVideo(video)}
                  className="group relative flex-shrink-0 w-64 sm:w-72 bg-[#FFFDF9] rounded-2xl p-3 border border-[#E9A534]/30 shadow-md hover:shadow-2xl hover:border-[#C1272D] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#2A0508]/10">
                    <img
                      src={thumbUrl}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${video.youtube_video_id}/mqdefault.jpg`;
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-90 transition-opacity" />

                    {/* Category Tag */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#30070B]/80 text-[#E9A534] text-[10px] uppercase font-bold tracking-wider backdrop-blur-sm border border-[#E9A534]/30">
                      {video.category || "Astrology"}
                    </span>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-[#C1272D] text-[#FFF7E9] flex items-center justify-center shadow-lg shadow-[#C1272D]/50 transition-all duration-300 group-hover:scale-115 group-hover:bg-[#E9A534] group-hover:text-[#3C080D]">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Video Meta */}
                  <div className="mt-3 px-1">
                    <h4 className="font-display text-[#3C080D] text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#C1272D] transition-colors">
                      {video.title}
                    </h4>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#2C1210]/60 font-sans">
                      <span className="inline-flex items-center gap-1 font-medium text-[#C1272D]">
                        Watch Video →
                      </span>
                      {video.created_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#E9A534]" />
                          {new Date(video.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsive Lightbox Video Player Modal */}
      <AnimatePresence>
        {activeModalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setActiveModalVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-[#1C0407] border border-[#E9A534]/30 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E9A534]/15 bg-gradient-to-r from-[#2A0508] to-[#1C0407]">
                <div className="flex items-center gap-3 pr-4">
                  <span className="px-2.5 py-1 rounded bg-[#E9A534]/20 border border-[#E9A534]/40 text-[#E9A534] text-xs font-semibold uppercase tracking-wider font-sans">
                    {activeModalVideo.category}
                  </span>
                  <h3 className="font-display text-white text-base sm:text-lg line-clamp-1">
                    {activeModalVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(null)}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive 16:9 YouTube iframe Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeModalVideo.youtube_video_id}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeModalVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              {/* Modal Footer & Consultation CTA */}
              <div className="p-4 sm:p-6 bg-[#250407] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="max-w-xl">
                  {activeModalVideo.description ? (
                    <p className="text-white/80 text-xs sm:text-sm font-sans line-clamp-2 leading-relaxed">
                      {activeModalVideo.description}
                    </p>
                  ) : (
                    <p className="text-white/60 text-xs sm:text-sm font-sans">
                      Guided by Acharya Nidhi Asthana · Authentic Vedic Astrology & Numerology
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalVideo(null);
                      setIsBookingOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C1272D] to-[#9C1C22] text-[#FFF7E9] text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-[#C1272D]/40 transition-all font-sans cursor-pointer"
                  >
                    <span>Book Consultation</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#E9A534]" />
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${activeModalVideo.youtube_video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                    title="Watch directly on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
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
