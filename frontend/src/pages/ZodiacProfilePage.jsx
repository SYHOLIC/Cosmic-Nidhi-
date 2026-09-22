import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useParams, useNavigate, Link } from "react-router-dom";

import { API_URL } from "../config/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  ShoppingBag,
  Heart,
  Star,
  Moon,
  X,
  Eye,
  Gem,
  Compass,
} from "lucide-react";
import { ZODIAC_PROFILES } from "../data/zodiacProfiles";
import Reveal from "../components/Reveal";
import heroZodiac from "../assets/hero-zodiac3.png";
import ctaCrystals from "../assets/image.png";

/* Zodiac icons */
import aries from "../assets/aries.png";
import taurus from "../assets/taurus.png";
import gemini from "../assets/gemini.png";
import cancer from "../assets/cancer.png";
import leo from "../assets/leo.png";
import virgo from "../assets/virgo.png";
import libra from "../assets/libra.png";
import scorpio from "../assets/scorpio.png";
import sagittarius from "../assets/sagittarius.png";
import capricorn from "../assets/capricorn.png";
import aquarius from "../assets/aquarius.png";
import pisces from "../assets/pisces.png";

const ZODIAC_ICONS = {
  Aries: aries,
  Taurus: taurus,
  Gemini: gemini,
  Cancer: cancer,
  Leo: leo,
  Virgo: virgo,
  Libra: libra,
  Scorpio: scorpio,
  Sagittarius: sagittarius,
  Capricorn: capricorn,
  Aquarius: aquarius,
  Pisces: pisces,
};

const SLUG_TO_NAME = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

/* ============================================================
   HELPERS
============================================================ */

const formatPrice = (val) => {
  if (val == null || val === "") return "";
  if (typeof val === "string" && val.includes("₹")) return val;
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? String(val) : `₹${num.toLocaleString("en-IN")}`;
};

const calcDiscount = (price, original) => {
  const toNum = (val) => {
    if (val == null || val === "") return 0;
    if (typeof val === "number") return val;
    return parseInt(String(val).replace(/[₹,\s]/g, ""), 10) || 0;
  };
  const p = toNum(price);
  const o = toNum(original);
  if (!o || o <= p) return null;
  return Math.round(((o - p) / o) * 100);
};

/* ============================================================
   PRODUCT CARD
============================================================ */

function ProductCard({ crystal, onViewDetails, onAddToCart }) {
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();
  const off = calcDiscount(crystal.price, crystal.originalPrice);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    const pId = crystal._id || crystal.id;
    try {
      if (wishlisted) {
        setWishlisted(false);
        await axios.delete(`${API_URL}/users/wishlist/${pId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        setWishlisted(true);
        await axios.post(`${API_URL}/users/wishlist/${pId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      setWishlisted((w) => !w);
    }
  };

  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-[10px]
        border border-[#5A0E14]/10
        bg-[#FFFDF9]
        shadow-[0_8px_24px_rgba(60,8,13,0.06)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_42px_rgba(60,8,13,0.12)]
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-[#F4E4C8]/30">
        <img
          src={crystal.images?.[0] || crystal.image || ""}
          alt={crystal.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {crystal.badge && (
          <span
            className="
              absolute left-3 top-3 z-10
              rounded-full
              bg-[#E9A534]
              px-3 py-1.5
              font-sans text-[10px] font-bold
              uppercase tracking-[0.08em]
              text-[#3C080D]
              shadow-[0_4px_12px_rgba(233,165,52,0.35)]
            "
          >
            {crystal.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="
            absolute right-3 top-3 z-10
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-[#5A0E14]/10
            bg-[#FFFDF9]/95 backdrop-blur-sm
            shadow-[0_4px_12px_rgba(60,8,13,0.10)]
            transition-all duration-300
            hover:scale-110 hover:border-[#C1272D]/30
          "
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            className={
              wishlisted
                ? "fill-[#C1272D] text-[#C1272D]"
                : "text-[#5A0E14]/55"
            }
          />
        </button>

        {/* Quick View */}
        <button
          type="button"
          onClick={onViewDetails}
          className="
            absolute inset-x-3 bottom-3 z-10
            flex translate-y-[120%] items-center justify-center gap-2
            rounded-full
            bg-[#FFFDF9]/95 backdrop-blur-sm
            py-2.5
            font-sans text-[11px] font-bold uppercase tracking-[0.14em]
            text-[#3C080D]
            shadow-[0_8px_20px_rgba(60,8,13,0.15)]
            transition-transform duration-300
            group-hover:translate-y-0
          "
        >
          <Eye size={13} strokeWidth={1.8} />
          View Details
        </button>
      </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star
              size={12}
              strokeWidth={0}
              className="fill-[#E9A534] text-[#E9A534]"
            />
            <span className="font-sans text-[12px] font-bold text-[#3C080D]">
              {crystal.rating ?? 4.8}
            </span>
            <span className="font-sans text-[11px] text-[#5A0E14]/55">
              ({crystal.reviews ?? 98})
            </span>
          </div>

          <span className="text-[#5A0E14]/20">·</span>

          <span
            className={`font-sans text-[11px] font-medium ${
              crystal.inStock !== false
                ? "text-green-700"
                : "text-[#C1272D]"
            }`}
          >
            {crystal.inStock !== false ? "In stock" : "Out of stock"}
          </span>
        </div>

        <h3
          className="
            mt-2 line-clamp-2 min-h-[44px]
            font-display text-[17px] font-semibold leading-[1.25]
            text-[#3C080D]
          "
        >
          {crystal.name}
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="font-display text-[22px] font-bold leading-none text-[#C1272D]">
            {formatPrice(crystal.price)}
          </span>

          {crystal.originalPrice && (
            <span className="font-sans text-[12px] text-[#5A0E14]/45 line-through">
              {formatPrice(crystal.originalPrice)}
            </span>
          )}

          {off && (
            <span className="ml-auto font-sans text-[12px] font-bold text-green-700">
              {off}% off
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={crystal.inStock === false}
          onClick={onAddToCart}
          className="
            mt-4 flex w-full items-center justify-center gap-2
            rounded-full
            bg-[#C1272D]
            py-3
            font-sans text-[12px] font-bold uppercase tracking-[0.14em]
            text-[#FFF7E9]
            shadow-[0_6px_18px_rgba(193,39,45,0.25)]
            transition-all duration-300
            hover:bg-[#9C1C22]
            hover:shadow-[0_10px_26px_rgba(193,39,45,0.35)]
            disabled:cursor-not-allowed
            disabled:bg-[#5A0E14]/20
            disabled:text-[#5A0E14]/40
            disabled:shadow-none
          "
        >
          <ShoppingBag size={14} strokeWidth={2} />
          {crystal.inStock !== false ? "Add to Cart" : "Notify Me"}
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   META BLOCK — for modal
============================================================ */

function MetaBlock({ icon: Icon, label, value }) {
  return (
    <div
      className="
        flex items-start gap-4
        rounded-[9px]
        border border-[#E9A534]/20
        bg-[#E9A534]/[0.05]
        p-5
      "
    >
      <div
        className="
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-full
          border border-[#E9A534]/45
          bg-[#E9A534]/[0.12]
          text-[#E9C76D]
        "
      >
        <Icon size={16} strokeWidth={1.7} />
      </div>

      <div className="min-w-0">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#E9C76D]">
          {label}
        </p>
        <p className="mt-1.5 font-sans text-[14px] leading-[1.65] text-[#F5E5C7]/90">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   PRODUCT DETAIL MODAL
============================================================ */

function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      const onEsc = (e) => e.key === "Escape" && onClose?.();
      window.addEventListener("keydown", onEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onEsc);
      };
    }
  }, [product, onClose]);

  const off = product ? calcDiscount(product.price, product.originalPrice) : null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="
            fixed inset-0 z-[200]
            flex items-start justify-center
            overflow-y-auto
            bg-[#170205]/85 backdrop-blur-md
            px-4 py-8
            sm:px-6 sm:py-12
          "
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-[1000px]
              overflow-hidden
              rounded-[12px]
              border border-[#E9A534]/25
              bg-[#210307]
              shadow-[0_40px_120px_rgba(0,0,0,0.55)]
            "
          >
            <span className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                absolute right-4 top-4 z-40
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-[#E9A534]/40
                bg-[#210307]/90 backdrop-blur-sm
                text-[#E9C76D]
                transition-all duration-300
                hover:border-[#E9A534]/80 hover:bg-[#5A0E14]
                sm:right-6 sm:top-6
              "
            >
              <X size={17} strokeWidth={1.8} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* LEFT — Image */}
              <div className="relative aspect-square overflow-hidden bg-[#210307] md:aspect-auto md:min-h-[560px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1F0306] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#210307]/60" />

                {product.badge && (
                  <span className="absolute left-5 top-5 rounded-full bg-[#E9A534] px-3.5 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.10em] text-[#3C080D] shadow-[0_4px_14px_rgba(233,165,52,0.35)]">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* RIGHT — Content */}
              <div className="relative flex flex-col p-7 sm:p-9 lg:p-10">
                <div className="flex items-center gap-3">
                  <span className="h-px w-7 bg-[#E9A534]" />
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                    Crystal Profile
                  </p>
                </div>

                <h2 className="mt-4 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#FFF8EC] sm:text-[42px]">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    <Star size={14} strokeWidth={0} className="fill-[#E9A534] text-[#E9A534]" />
                    <span className="font-sans text-[13px] font-bold text-[#FFF8EC]">
                      {product.rating ?? 4.8}
                    </span>
                    <span className="font-sans text-[12px] text-[#D8C8A8]/60">
                      ({product.reviews ?? 98} reviews)
                    </span>
                  </div>
                  <span className="text-[#E9A534]/30">·</span>
                  <span
                    className={`font-sans text-[12px] font-semibold ${
                      product.inStock !== false ? "text-green-500" : "text-[#E9A0A0]"
                    }`}
                  >
                    {product.inStock !== false ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-[36px] font-bold leading-none text-[#E9C76D]">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="font-sans text-[15px] text-[#D8C8A8]/45 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {off && (
                    <span className="rounded-full border border-green-500/40 bg-green-500/[0.10] px-3 py-1 font-sans text-[11px] font-bold text-green-400">
                      {off}% off
                    </span>
                  )}
                </div>

                {product.association && (
                  <p className="mt-5 font-sans text-[14px] leading-[1.7] text-[#F5E5C7]/80">
                    {product.association}
                  </p>
                )}

                <div className="mt-7 space-y-3">
                  {product.bestFor && (
                    <MetaBlock icon={Compass} label="Best For" value={product.bestFor} />
                  )}
                  {product.howToUse && (
                    <MetaBlock icon={Moon} label="How to Use" value={product.howToUse} />
                  )}
                  {product.care && (
                    <MetaBlock icon={Heart} label="Care" value={product.care} />
                  )}
                  {product.zodiacNote && (
                    <MetaBlock icon={Star} label="Zodiac" value={product.zodiacNote} />
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-[#E9A534]/15 pt-7 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (product) {
                        addToCart({
                          id: product.name,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        });
                        setAdded(true);
                        setTimeout(() => setAdded(false), 2000);
                      }
                    }}
                    className="
                      group inline-flex flex-1 items-center justify-center gap-2.5
                      rounded-full
                      border border-[#F2C66D]
                      bg-gradient-to-r from-[#F3D49B] to-[#DDB56D]
                      px-7 py-3.5
                      font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                      text-[#3C080D]
                      shadow-[0_10px_26px_rgba(0,0,0,0.22)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_15px_34px_rgba(0,0,0,0.32)]
                    "
                  >
                    <ShoppingBag size={15} strokeWidth={2} />
                    {added ? "Added to Cart!" : "Add to Cart"}
                  </button>

                  <a
                    href="tel:9560437360"
                    className="
                      group inline-flex items-center justify-center gap-2
                      rounded-full
                      border border-[#E9A534]/50
                      px-7 py-3.5
                      font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                      text-[#E9C76D]
                      transition-all duration-300
                      hover:border-[#E9A534]/85
                      hover:bg-[#E9A534]/[0.10]
                    "
                  >
                    Ask About This
                    <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function ZodiacProfilePage() {
  const { sign: signSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeProduct, setActiveProduct] = useState(null);

  const signName = SLUG_TO_NAME[signSlug?.toLowerCase()];
  const profile = signName ? ZODIAC_PROFILES[signName] : null;
  const icon = signName ? ZODIAC_ICONS[signName] : null;

  useEffect(() => {
    if (!profile) navigate("/", { replace: true });
  }, [profile, navigate]);

  if (!profile || !icon) return null;

  return (
    <main className="relative">

      {/* ============================================================
          DARK HERO BAND
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#170205] pb-16 pt-32 text-[#FFF8EC] md:pt-40">
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[550px] w-[550px] rounded-full bg-[#650F18]/40 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[450px] w-[450px] rounded-full bg-[#E9A534]/[0.06] blur-[130px]" />

        <div
          aria-hidden
          className="pointer-events-none absolute right-[-60px] top-1/2 h-[420px] w-[420px] -translate-y-1/2 opacity-[0.14] sm:right-[-30px] sm:h-[520px] sm:w-[520px] lg:right-[4%] lg:h-[600px] lg:w-[600px] lg:opacity-[0.20]"
        >
          <img
            src={heroZodiac}
            alt=""
            className="h-full w-full object-contain mix-blend-screen"
            style={{ animation: "zodiacRotate 90s linear infinite" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <Reveal>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-[#E9C76D] transition-colors hover:text-[#FFF8EC]"
            >
              <ArrowLeft size={14} strokeWidth={1.8} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-9 bg-[#E9A534]" />
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-[#E9C76D]">
                Zodiac Profile
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#E9A534]/45 bg-gradient-to-br from-[#E9A534]/[0.15] to-[#E9A534]/[0.02] shadow-[0_0_45px_rgba(233,165,52,0.22)] sm:h-28 sm:w-28">
                <img
                  src={icon}
                  alt={`${signName} zodiac sign`}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                  style={{
                    filter:
                      "brightness(1.6) saturate(0) drop-shadow(0 0 12px rgba(233,165,52,0.5))",
                  }}
                />
              </div>

              <div>
                <h1 className="font-display text-[52px] font-medium leading-[0.95] tracking-[-0.025em] text-[#FFF8EC] sm:text-[68px] lg:text-[80px]">
                  {signName}
                </h1>
                <p className="mt-3 font-sans text-[14px] font-medium text-[#F5E5C7]/85 sm:text-[15px]">
                  {profile.dates}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.10] px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#E9C76D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E9A534]" />
                {profile.element}
              </span>

              {profile.traits.map((trait, i) => (
                <span
                  key={trait}
                  className="font-sans text-[13px] font-medium text-[#F5E5C7]/70"
                >
                  {trait}
                  {i < profile.traits.length - 1 && (
                    <span className="ml-3 text-[#E9A534]/40">·</span>
                  )}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E9A534]/30 to-transparent" />
      </section>

      {/* ============================================================
          LIGHT BODY
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#FFF7E9] py-16 text-[#3C080D] md:py-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#C1272D]/[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
          {/* Strengths + Challenges */}
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            <Reveal>
              <div className="h-full rounded-[9px] border border-[#C89846]/30 bg-[#FFFDF9] p-7 shadow-[0_10px_30px_rgba(60,8,13,0.06)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-7 bg-[#C89846]" />
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#8B612F]">
                    Strengths
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[#C89846]/45 bg-[#E9A534]/[0.14] px-4 py-2 font-sans text-[13px] font-semibold text-[#5A2F0D]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="h-full rounded-[9px] border border-[#C1272D]/25 bg-[#FFFDF9] p-7 shadow-[0_10px_30px_rgba(60,8,13,0.06)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-7 bg-[#C1272D]" />
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#8B2F2B]">
                    Common Challenges
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.challenges.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[#C1272D]/35 bg-[#C1272D]/[0.08] px-4 py-2 font-sans text-[13px] font-medium text-[#7A1F1F]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* CRYSTALS */}
          <section className="mt-16 md:mt-20">
            <Reveal>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-9 bg-[#C89846]" />
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.30em] text-[#8B612F]">
                  Recommended Crystals
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="max-w-[760px] font-display text-[36px] font-medium leading-[1.02] tracking-[-0.025em] text-[#3C080D] sm:text-[42px] md:text-[48px]">
                Crystals for{" "}
                <span className="text-[#8B2F2B]">{signName}</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 max-w-[560px] font-sans text-[14px] leading-[1.7] text-[#624740]/80 sm:text-[15px]">
                Each stone below carries a traditional association. Click
                any card to learn how to use it, and how to care for it.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.crystals.map((crystal, i) => (
                <Reveal key={crystal.name} delay={i * 100}>
                  <ProductCard
                    crystal={crystal}
                    onViewDetails={() => setActiveProduct(crystal)}
                    onAddToCart={() => {
                      addToCart({
                        id: crystal.name,
                        name: crystal.name,
                        price: crystal.price,
                        image: crystal.image,
                      });
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* ============================================================
          DARK CTA BAND — 2-column with square photo
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#180205] py-20 text-[#FFF8EC] md:py-24">
        <div className="pointer-events-none absolute -top-40 right-[5%] h-[450px] w-[450px] rounded-full bg-[#650F18]/30 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[5%] h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.05] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            {/* LEFT — Content */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-[#E9A534]/60" />
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-[#E9C76D]">
                    Take the Next Step
                  </p>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h2 className="mt-5 max-w-[640px] font-display text-[36px] font-medium leading-[1.05] tracking-[-0.025em] text-[#FFF8EC] sm:text-[44px] md:text-[52px]">
                  Ready to work with your{" "}
                  <span className="text-[#E9B957]">{signName}</span> stones?
                </h2>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-5 max-w-[520px] font-sans text-[14px] leading-[1.75] text-[#F5E5C7]/70 sm:text-[15px]">
                  Explore curated crystals, get a personal recommendation,
                  or speak with us directly to understand what suits your
                  chart best.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    to="/products"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-[0_10px_26px_rgba(0,0,0,0.30)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_34px_rgba(0,0,0,0.40)]"
                  >
                    <ShoppingBag size={15} strokeWidth={2} />
                    Shop {signName} Crystals
                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    to="/services"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-[#E9A534]/50 bg-transparent px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#E9C76D] transition-all duration-300 hover:border-[#E9A534]/85 hover:bg-[#E9A534]/[0.10]"
                  >
                    <Gem size={15} strokeWidth={1.8} />
                    Personalised Recommendation
                  </Link>

                  <a
                    href="tel:9560437360"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-transparent px-5 py-4 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#D8C8A8]/70 transition-colors duration-300 hover:text-[#E9C76D]"
                  >
                    <Phone size={14} strokeWidth={1.8} />
                    Book a Consultation
                  </a>
                </div>
              </Reveal>

              <Reveal delay={280}>
                <p className="mt-8 max-w-[640px] font-sans text-[12px] leading-[1.75] text-[#D8C8A8]/50">
                  Crystal suggestions are based on traditional associations
                  and are offered for spiritual and educational purposes.
                  They are not a substitute for professional medical,
                  financial or psychological advice.
                </p>
              </Reveal>
            </div>

            {/* RIGHT — Square photo */}
            <Reveal delay={120}>
              <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
                {/* Outer frame */}
                <div className="relative aspect-square overflow-hidden rounded-[12px] border border-[#E9A534]/30 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                  <img
                    src={ctaCrystals}
                    alt="Glowing astrology crystals"
                    loading="lazy"
                    className="h-full w-full object-cover object-bottom"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180205]/70 via-transparent to-transparent" />

                  {/* Gold top line */}
                  <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/70 to-transparent" />

                  {/* Small floating label */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[#E9A534]/45 bg-[#180205]/85 backdrop-blur-sm px-3.5 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#E9C76D]">
                      Cosmic Nidhi
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#180205]/85 text-[#E9C76D] backdrop-blur-sm">
                      <Star size={14} strokeWidth={1.8} />
                    </span>
                  </div>
                </div>

                {/* Corner accents */}
                <span className="pointer-events-none absolute -left-2 -top-2 h-8 w-8 border-l-2 border-t-2 border-[#E9A534]/50" />
                <span className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#E9A534]/50" />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E9A534]/25 to-transparent" />
      </section>

      {/* PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />

      <style>{`
        @keyframes zodiacRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes zodiacRotate { from, to { transform: none; } }
        }
      `}</style>
    </main>
  );
}