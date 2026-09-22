import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  LogOut,
  Heart,
  ShoppingBag,
  BookOpen,
  Moon,
  ChevronRight,
  Compass,
  Star,
  Gem,
  ArrowRight,
  Plus,
  Trash2,
  X,
  MapPin,
  Loader2,
  CreditCard,
} from "lucide-react";
import Reveal from "../components/Reveal";
import BookingModal from "../components/BookingModal";
import { loadRazorpay } from "../utils/loadRazorpay";

/* Zodiac chakra backdrop */
import heroZodiac from "../assets/hero-zodiac3.png";

/* ================================================================
   ZODIAC ICONS — actual image assets
================================================================ */

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

import { API_URL } from "../config/api";

/* ================================================================
   ZODIAC HELPERS
================================================================ */

const ZODIAC_SIGNS = [
  { name: "Aries", slug: "aries", element: "Fire", dates: "Mar 21 – Apr 19" },
  { name: "Taurus", slug: "taurus", element: "Earth", dates: "Apr 20 – May 20" },
  { name: "Gemini", slug: "gemini", element: "Air", dates: "May 21 – Jun 20" },
  { name: "Cancer", slug: "cancer", element: "Water", dates: "Jun 21 – Jul 22" },
  { name: "Leo", slug: "leo", element: "Fire", dates: "Jul 23 – Aug 22" },
  { name: "Virgo", slug: "virgo", element: "Earth", dates: "Aug 23 – Sep 22" },
  { name: "Libra", slug: "libra", element: "Air", dates: "Sep 23 – Oct 22" },
  { name: "Scorpio", slug: "scorpio", element: "Water", dates: "Oct 23 – Nov 21" },
  { name: "Sagittarius", slug: "sagittarius", element: "Fire", dates: "Nov 22 – Dec 21" },
  { name: "Capricorn", slug: "capricorn", element: "Earth", dates: "Dec 22 – Jan 19" },
  { name: "Aquarius", slug: "aquarius", element: "Air", dates: "Jan 20 – Feb 18" },
  { name: "Pisces", slug: "pisces", element: "Water", dates: "Feb 19 – Mar 20" },
];

const getSignFromDate = (dob) => {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;

  const m = d.getMonth() + 1;
  const day = d.getDate();

  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return "Aries";
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return "Taurus";
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "Gemini";
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "Cancer";
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "Leo";
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "Virgo";
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "Libra";
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "Scorpio";
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "Sagittarius";
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "Capricorn";
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return "Aquarius";
  if ((m === 2 && day >= 19) || (m === 3 && day <= 20)) return "Pisces";
  return null;
};

const findSignMeta = (name) =>
  ZODIAC_SIGNS.find((s) => s.name === name) || null;

/* ================================================================
   DATA
================================================================ */

const UPCOMING_READINGS = [
  { name: "Birth Chart Analysis", date: "Mar 25, 2026", time: "3:00 PM", status: "Confirmed" },
  { name: "Numerology Profile", date: "Apr 2, 2026", time: "11:00 AM", status: "Pending" },
];

const QUICK_ACTIONS = [
  { label: "Book Reading", icon: Calendar, href: "/contact" },
  { label: "Explore Products", icon: ShoppingBag, href: "/products" },
  { label: "Check Forecast", icon: Moon, href: "/services" },
];

const BOOKINGS = [
  {
    service: "Birth Chart / Janam Kundli Reading",
    date: "Mar 25, 2026",
    time: "3:00 PM",
    status: "Confirmed",
    duration: "60–75 min",
    astrologer: "Nidhi Asthana",
  },
  {
    service: "Numerology Profile",
    date: "Apr 2, 2026",
    time: "11:00 AM",
    status: "Pending",
    duration: "45–60 min",
    astrologer: "Nidhi Asthana",
  },
];

// Real wishlist loaded dynamically from MongoDB API

/* ================================================================
   SMALL PARTS
================================================================ */

function Eyebrow({ children }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-7 bg-[#E9A534]" />
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
        {children}
      </p>
    </div>
  );
}

function StatusPill({ status }) {
  const isConfirmed = status === "Confirmed" || status === "Delivered";
  return (
    <span
      className={`
        inline-flex items-center gap-2 whitespace-nowrap
        rounded-full border px-3.5 py-1.5
        font-sans text-[11px] font-bold uppercase tracking-[0.14em]
        ${
          isConfirmed
            ? "border-green-700/30 bg-green-700/[0.08] text-green-800"
            : "border-[#C1892F]/45 bg-[#E9A534]/[0.12] text-[#8A5A1F]"
        }
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isConfirmed ? "bg-green-700" : "bg-[#C1892F]"}`} />
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="
        group relative overflow-hidden
        rounded-[7px] border border-[#5A0E14]/12
        bg-[#FFFDF9] p-5 sm:p-6
        shadow-[0_10px_30px_rgba(60,8,13,0.06)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#E9A534]/45
        hover:shadow-[0_18px_42px_rgba(60,8,13,0.12)]
      "
    >
      <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E9A534]/45 bg-gradient-to-br from-[#E9A534]/[0.18] to-[#E9A534]/[0.02] text-[#A2691F]">
          <Icon className="h-5 w-5" strokeWidth={1.7} />
        </div>
        <div className="min-w-0">
          <p className="font-display text-[32px] font-semibold leading-none text-[#3C080D] sm:text-[34px]">
            {value}
          </p>
          <p className="mt-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B3A2A]/75">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   SIDEBAR
================================================================ */

function Sidebar({ user, activeTab, setActiveTab, handleLogout }) {
  const items = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "zodiac", label: "My Zodiac", icon: Gem },
    { id: "bookings", label: "My Readings", icon: Calendar },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-32 overflow-hidden rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-[0_10px_30px_rgba(60,8,13,0.08)]">
        {/* Profile header */}
        <div className="relative border-b border-[#E9A534]/15 bg-gradient-to-br from-[#3C080D] via-[#5A0E14] to-[#2A0509] px-6 py-7 text-center">
          <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent" />

          <div
            className="mx-auto mb-4 flex items-center justify-center rounded-full border-2 border-[#E9A534]/55 bg-gradient-to-br from-[#711A24] to-[#2A0509] shadow-[0_0_30px_rgba(233,165,52,0.15)]"
            style={{ height: "72px", width: "72px" }}
          >
            <span className="font-display text-[28px] font-semibold text-[#E9C76D]">
              {user.name?.charAt(0) || "U"}
            </span>
          </div>

          <h3 className="font-display text-[20px] font-semibold text-[#FFF8EC]">
            {user.name}
          </h3>
          <p className="mt-1.5 truncate font-sans text-[13px] text-[#FDECC8]/75">
            {user.email}
          </p>

          <span className="mt-4 inline-block rounded-full border border-[#E9A534]/50 bg-[#E9A534]/[0.12] px-3.5 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#E9C76D]">
            {user.role || "User"}
          </span>
        </div>

        {/* Nav */}
        <nav className="p-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  group mb-1 flex w-full items-center gap-3
                  rounded-[6px] px-3.5 py-3
                  font-sans text-[14px] font-semibold
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#5A0E14] text-[#FFF8EC] shadow-[0_8px_20px_rgba(90,14,20,0.24)]"
                      : "text-[#5A0E14]/80 hover:bg-[#FDECC8]/40 hover:text-[#3C080D]"
                  }
                `}
              >
                <Icon
                  className={`shrink-0 ${
                    isActive
                      ? "text-[#E9C76D]"
                      : "text-[#5A0E14]/55 group-hover:text-[#5A0E14]"
                  }`}
                  style={{ height: "18px", width: "18px" }}
                  strokeWidth={1.7}
                />
                <span className="truncate">{item.label}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-[#E9C76D]" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#5A0E14]/12 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[6px] px-3.5 py-3 font-sans text-[14px] font-semibold text-[#8B2F2B] transition-all duration-300 hover:bg-[#C1272D]/[0.08] hover:text-[#C1272D]"
          >
            <LogOut style={{ height: "18px", width: "18px" }} strokeWidth={1.7} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ================================================================
   TAB: ZODIAC
================================================================ */

function ZodiacTab({ user }) {
  const signName = user.zodiac || getSignFromDate(user.dateOfBirth);
  const signMeta = findSignMeta(signName);

  if (!signMeta) {
    return (
      <div className="rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/30 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.12] text-[#A2691F]">
          <Gem className="h-6 w-6" strokeWidth={1.7} />
        </div>
        <h3 className="font-display text-[22px] font-semibold text-[#3C080D]">
          Add your date of birth
        </h3>
        <p className="mx-auto mt-2 max-w-[420px] font-sans text-[13px] leading-[1.7] text-[#6B3A2A]/75">
          Add your birth date in the profile settings and we'll unlock your
          personalised zodiac profile with crystal recommendations.
        </p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-6 py-3 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-[0_10px_26px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5">
          <Edit className="h-3.5 w-3.5" strokeWidth={2} />
          Add Birth Details
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#E9A534]" />
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#8A5A1F]">
              Your Zodiac Sign
            </p>
          </div>

          <div className="mt-4 flex items-center gap-5">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#E9A534]/55 bg-gradient-to-br from-[#E9A534]/[0.15] to-[#E9A534]/[0.02] shadow-[0_0_30px_rgba(233,165,52,0.18)]">
              <img
                src={ZODIAC_ICONS[signMeta.name]}
                alt={`${signMeta.name} zodiac sign`}
                className="h-11 w-11 object-contain brightness-[0.55] contrast-[1.35]"
              />
            </span>

            <div>
              <h2 className="font-display text-[40px] font-semibold leading-[1.05] text-[#3C080D] sm:text-[46px]">
                {signMeta.name}
              </h2>
              <p className="mt-1.5 font-sans text-[13px] font-medium text-[#6B3A2A]/85">
                {signMeta.dates}
              </p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.12] px-3.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E9A534]" />
                {signMeta.element}
              </span>
            </div>
          </div>
        </div>

        <Link
          to={`/zodiac/${signMeta.slug}`}
          className="group inline-flex h-fit items-center justify-center gap-2.5 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-6 py-3.5 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-[0_10px_26px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_34px_rgba(0,0,0,0.22)]"
        >
          View Full Profile
          <ArrowRight
            size={14}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="mt-8 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/30 p-6">
        <p className="font-sans text-[13px] leading-[1.75] text-[#6B3A2A]/85">
          Your full zodiac profile includes personality traits, strengths and
          challenges, and a curated set of three crystals — with how to use each
          stone and how to care for it.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={`/zodiac/${signMeta.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#5A0E14]/20 bg-[#FFFDF9] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#5A0E14] transition-colors hover:border-[#E9A534]/60 hover:text-[#8B2F2B]"
          >
            <Star size={13} strokeWidth={1.8} />
            Traits & Elements
          </Link>

          <Link
            to={`/zodiac/${signMeta.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#5A0E14]/20 bg-[#FFFDF9] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#5A0E14] transition-colors hover:border-[#E9A534]/60 hover:text-[#8B2F2B]"
          >
            <Gem size={13} strokeWidth={1.8} />
            Recommended Crystals
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TAB: OVERVIEW
================================================================ */

function OverviewTab({ user }) {
  const signName = user.zodiac || getSignFromDate(user.dateOfBirth);
  const signMeta = findSignMeta(signName);

  return (
    <div className="space-y-10">
      {signMeta && (
        <section>
          <Eyebrow>Your Sign</Eyebrow>

          <div className="flex flex-col gap-5 rounded-[7px] border border-[#5A0E14]/12 bg-gradient-to-br from-[#FDECC8]/40 via-[#FFFDF9] to-[#FDECC8]/20 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#E9A534]/55 bg-[#E9A534]/[0.12] shadow-[0_0_24px_rgba(233,165,52,0.15)]">
                <img
                  src={ZODIAC_ICONS[signMeta.name]}
                  alt={`${signMeta.name} zodiac sign`}
                  className="h-9 w-9 object-contain brightness-[0.55] contrast-[1.35]"
                />
              </span>

              <div className="min-w-0">
                <p className="font-display text-[22px] font-semibold text-[#3C080D]">
                  {signMeta.name}
                </p>
                <p className="mt-1 font-sans text-[12px] text-[#6B3A2A]/75">
                  {signMeta.dates} · {signMeta.element}
                </p>
              </div>
            </div>

            <Link
              to={`/zodiac/${signMeta.slug}`}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore
              <ArrowRight
                size={12}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      )}

      <section>
        <Eyebrow>Upcoming Readings</Eyebrow>
        <div className="space-y-3">
          {UPCOMING_READINGS.map((reading, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/35 p-5 transition-all duration-300 hover:border-[#E9A534]/50 hover:bg-[#FDECC8]/55 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-display text-[19px] font-semibold text-[#3C080D]">
                  {reading.name}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-2.5 font-sans text-[13px] text-[#6B3A2A]/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1.7} />
                    {reading.date}
                  </span>
                  <span className="text-[#5A0E14]/30">·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.7} />
                    {reading.time}
                  </span>
                </p>
              </div>
              <StatusPill status={reading.status} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <Eyebrow>Quick Actions</Eyebrow>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.href}
                className="group flex items-center justify-between gap-3 rounded-[7px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E9A534]/50 hover:shadow-[0_12px_28px_rgba(60,8,13,0.10)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.14] text-[#A2691F]">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
                  </div>
                  <span className="font-sans text-[14px] font-semibold text-[#3C080D]">
                    {action.label}
                  </span>
                </div>
                <ChevronRight
                  className="h-4.5 w-4.5 text-[#5A0E14]/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[#E9A534]"
                  strokeWidth={1.7}
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   TAB: BOOKINGS
================================================================ */

function BookingsTab({ bookings = [], onOpenBooking, onPayBooking, payingBookingId }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-[7px] border border-dashed border-[#5A0E14]/20 p-8 text-center">
        <Calendar className="mx-auto mb-2 h-6 w-6 text-[#5A0E14]/30" strokeWidth={1.5} />
        <p className="font-sans text-[12px] text-[#5A0E14]/60">You have no scheduled readings yet.</p>
        <button
          type="button"
          onClick={onOpenBooking}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#5A0E14] px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFF8EC] transition-colors hover:bg-[#3C080D]"
        >
          Book a Reading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
        <p className="font-sans text-[12px] font-medium text-[#6B3A2A]/80">
          Scheduled consultations with Astrologer Nidhi Asthana
        </p>
        <button
          type="button"
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Plus size={13} strokeWidth={2.5} />
          Book Consultation
        </button>
      </div>

      {bookings.map((booking, i) => {
        const isPendingPayment = booking.paymentStatus === "pending" || booking.status === "pending";
        return (
          <div
            key={booking._id || i}
            className="rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/35 p-6 transition-all duration-300 hover:border-[#E9A534]/50 hover:shadow-[0_12px_28px_rgba(60,8,13,0.08)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-display text-[20px] font-semibold text-[#3C080D]">
                  {booking.serviceName || booking.service}
                </p>
                <p className="mt-2 font-sans text-[13px] text-[#6B3A2A]/80">
                  {booking.date ? new Date(booking.date).toLocaleDateString() : ""} · {booking.time}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-5">
                  <span className="flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.10em] text-[#6B3A2A]/70">
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.7} />
                    {booking.duration || "60 mins"}
                  </span>
                  {booking.amount > 0 && (
                    <span className="flex items-center gap-2 font-sans text-[12px] font-semibold text-[#8B2F2B]">
                      ₹{booking.amount}
                    </span>
                  )}
                  {booking.paymentStatus && (
                    <span className={`rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider ${
                      booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      Payment: {booking.paymentStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <StatusPill status={booking.status || "pending"} />
                {isPendingPayment && (
                  <button
                    type="button"
                    disabled={payingBookingId === booking._id}
                    onClick={() => onPayBooking(booking)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#C1272D] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:bg-[#A01D22] hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {payingBookingId === booking._id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay Online (₹{booking.amount || 2100})</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   TAB: PROFILE
================================================================ */

function ProfileTab({ user, onUpdate }) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
  });

  // Address Modals
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/users/profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProfile(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: addressForm.name,
        phone: addressForm.phone,
        address: addressForm.address,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        country: addressForm.country || "India",
        isDefault: Boolean(addressForm.isDefault),
      };
      if (editingAddressId) {
        await axios.put(`${API_URL}/users/addresses/${editingAddressId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/users/addresses`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setAddressModalOpen(false);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/users/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete address");
    }
  };

  const openNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm({ name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
    setAddressModalOpen(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm(addr);
    setAddressModalOpen(true);
  };

  const fields = [
    { label: "Full Name", value: user.name, icon: User },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Phone", value: user.phone || "Not provided", icon: Phone },
    { label: "Date of Birth", value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided", icon: Calendar },
  ];

  return (
    <div className="space-y-10">
      {/* ─── Profile Section ─── */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <Eyebrow>Personal Information</Eyebrow>
          {!editingProfile && (
            <button 
              onClick={() => {
                setProfileForm({
                  name: user.name || "",
                  phone: user.phone || "",
                  dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
                });
                setEditingProfile(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-[0_8px_16px_rgba(0,0,0,0.10)] transition-all hover:-translate-y-0.5"
            >
              <Edit className="h-3 w-3" strokeWidth={2} />
              Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <form onSubmit={handleProfileUpdate} className="rounded-[7px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">Name</label>
                <input type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">Phone</label>
                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">Date of Birth</label>
                <input type="date" value={profileForm.dateOfBirth} onChange={e => setProfileForm({...profileForm, dateOfBirth: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none" />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-full bg-[#5A0E14] px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFF8EC] transition-colors hover:bg-[#3C080D] disabled:opacity-50">
                {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                Save Changes
              </button>
              <button type="button" onClick={() => setEditingProfile(false)} className="rounded-full border border-[#5A0E14]/20 px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#5A0E14]/70 transition-colors hover:border-[#5A0E14]/40 hover:text-[#3C080D]">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label}>
                  <label className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                    {field.label}
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/30 px-4 py-3.5">
                    <Icon style={{ height: "18px", width: "18px" }} className="shrink-0 text-[#5A0E14]/50" strokeWidth={1.7} />
                    <span className="truncate font-sans text-[14px] font-medium text-[#2C1210]">
                      {field.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Addresses Section ─── */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <Eyebrow>Delivery Addresses</Eyebrow>
          <button 
            onClick={openNewAddress}
            className="inline-flex items-center gap-2 rounded-full border border-[#5A0E14] bg-transparent px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#5A0E14] transition-all hover:bg-[#5A0E14]/[0.05]"
          >
            <Plus className="h-3 w-3" strokeWidth={2} />
            Add New
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {user.addresses?.map((addr) => (
            <div key={addr._id} className="relative rounded-[7px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-5 shadow-sm transition-all hover:border-[#E9A534]/50 hover:shadow-md">
              {addr.isDefault && (
                <span className="absolute right-4 top-4 rounded bg-[#E9A534]/20 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#A2691F]">Default</span>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-[#E9A534]" size={18} strokeWidth={1.7} />
                <div className="min-w-0 pr-12">
                  <p className="font-display text-[15px] font-semibold text-[#3C080D]">{addr.name}</p>
                  <p className="mt-1 font-sans text-[12.5px] leading-relaxed text-[#6B3A2A]/80">
                    {addr.address}<br />
                    {addr.city}, {addr.state} {addr.pincode}<br />
                    Ph: {addr.phone}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3 border-t border-[#5A0E14]/12 pt-3">
                <button onClick={() => openEditAddress(addr)} className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A0E14]/70 transition-colors hover:text-[#E9A534]">
                  <Edit size={12} strokeWidth={2} /> Edit
                </button>
                <button onClick={() => handleDeleteAddress(addr._id)} className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C1272D]/70 transition-colors hover:text-[#C1272D]">
                  <Trash2 size={12} strokeWidth={2} /> Delete
                </button>
              </div>
            </div>
          ))}
          {(!user.addresses || user.addresses.length === 0) && (
            <div className="col-span-full rounded-[7px] border border-dashed border-[#5A0E14]/20 p-8 text-center">
              <MapPin className="mx-auto mb-2 h-6 w-6 text-[#5A0E14]/30" strokeWidth={1.5} />
              <p className="font-sans text-[12px] text-[#5A0E14]/60">No delivery addresses saved yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Address Form Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#170205]/70 backdrop-blur-sm" onClick={() => setAddressModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg rounded-[10px] border border-[#E9A534]/25 bg-[#FFFDF9] shadow-[0_30px_70px_rgba(23,2,5,0.35)] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold text-[#3C080D]">
                {editingAddressId ? "Edit Address" : "Add Address"}
              </h3>
              <button onClick={() => setAddressModalOpen(false)} className="text-[#5A0E14]/50 hover:text-[#C1272D]"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">Name</label>
                  <input required type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 px-3 py-2 text-[13px] focus:border-[#E9A534]/60 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">Phone</label>
                  <input required type="tel" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 px-3 py-2 text-[13px] focus:border-[#E9A534]/60 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">Address</label>
                <textarea required rows={2} value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="w-full resize-none rounded-[7px] border border-[#5A0E14]/15 px-3 py-2 text-[13px] focus:border-[#E9A534]/60 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">City</label>
                  <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 px-3 py-2 text-[13px] focus:border-[#E9A534]/60 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">State</label>
                  <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 px-3 py-2 text-[13px] focus:border-[#E9A534]/60 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">Pincode</label>
                <input required type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full rounded-[7px] border border-[#5A0E14]/15 px-3 py-2 text-[13px] focus:border-[#E9A534]/60 focus:outline-none" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="h-4 w-4 rounded border-[#5A0E14]/25 accent-[#E9A534]" />
                <label htmlFor="isDefault" className="font-sans text-[12px] text-[#3C080D]">Make this my default address</label>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setAddressModalOpen(false)} className="flex-1 rounded-full border border-[#5A0E14]/20 py-2.5 text-[11px] font-bold uppercase text-[#5A0E14]/70 hover:bg-[#5A0E14]/5">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 rounded-full bg-[#5A0E14] py-2.5 text-[11px] font-bold uppercase text-[#FFF8EC] hover:bg-[#3C080D]">{loading ? "Saving..." : "Save Address"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   TAB: WISHLIST
================================================================ */

function WishlistTab({ wishlist = [], onRemove }) {
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState({});

  const handleAddToCart = (item, index) => {
    const productId = item._id || item.id || `wishlist-${index}`;
    addToCart({
      id: productId,
      _id: productId,
      name: item.name,
      price: item.price,
      image: item.image || (Array.isArray(item.images) ? item.images[0] : null),
      category: item.category,
    });
    setAddedMap((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [index]: false }));
    }, 2000);
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#E9A534]/30 bg-[#FFF7E9] py-16 text-center">
        <Heart className="mb-3 h-12 w-12 text-[#E9A534]/50" strokeWidth={1.5} />
        <h3 className="font-display text-[20px] font-medium text-[#3C080D]">Your wishlist is empty</h3>
        <p className="mt-1 max-w-md font-sans text-[13px] text-[#5A0E14]/70">
          Save your favorite crystals, rudrakshas, and spiritual tools to view them here.
        </p>
        <a
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {wishlist.map((item, i) => {
        const pId = item._id || item.id;
        const img = item.image || (Array.isArray(item.images) ? item.images[0] : null) || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300";
        return (
          <div
            key={pId || i}
            className="group relative overflow-hidden rounded-[7px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-[0_10px_30px_rgba(60,8,13,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(60,8,13,0.12)]"
          >
            <div className="relative h-48 overflow-hidden bg-[#F4E4C8]/40">
              <img
                src={img}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3C080D]/25 to-transparent" />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(pId)}
                  title="Remove from wishlist"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFDF9]/90 text-[#C1272D] shadow transition-transform hover:scale-110"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="p-5">
              <p className="line-clamp-1 font-display text-[16px] font-semibold text-[#3C080D]">
                {item.name}
              </p>
              <p className="mt-1.5 font-display text-[22px] font-semibold text-[#5A0E14]">
                {typeof item.price === 'number' ? `₹${item.price}` : item.price}
              </p>
              <button
                onClick={() => handleAddToCart(item, i)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#5A0E14] py-3 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#FFF8EC] transition-colors duration-200 hover:bg-[#3C080D]"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                {addedMap[i] ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   TAB: ORDERS
================================================================ */

function OrdersTab({ orders, onCancelOrder }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-[7px] border border-dashed border-[#5A0E14]/20 p-8 text-center">
        <p className="font-sans text-[12px] text-[#5A0E14]/60">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const canCancel = order.orderStatus !== "delivered" && order.orderStatus !== "cancelled";

        return (
          <div
            key={order._id}
            className="rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/35 p-6 transition-all duration-300 hover:border-[#E9A534]/50"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-display text-[19px] font-semibold text-[#3C080D]">
                  #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="mt-1.5 font-sans text-[12px] font-medium uppercase tracking-[0.10em] text-[#6B3A2A]/70">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-3 font-sans text-[14px] text-[#2C1210]/85">
                  {order.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <p className="font-display text-[24px] font-semibold text-[#5A0E14]">
                  ₹{order.totalAmount}
                </p>
                <StatusPill status={order.orderStatus} />
                {canCancel && (
                  <button
                    onClick={() => onCancelOrder(order._id)}
                    className="mt-2 rounded border border-[#C1272D]/30 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-[#C1272D] transition-colors hover:bg-[#C1272D]/10"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
================================================================ */

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const [userRes, ordersRes, bookingsRes, wishlistRes] = await Promise.all([
        axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/bookings/my-bookings`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { bookings: [] } })),
        axios.get(`${API_URL}/users/wishlist`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { wishlist: [] } }))
      ]);
      setUser(userRes.data.user);
      setOrders(ordersRes.data.orders);
      setBookings(bookingsRes?.data?.bookings || []);
      setWishlist(wishlistRes?.data?.wishlist || []);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart_guest");
      localStorage.removeItem("cartItems");
      window.dispatchEvent(new CustomEvent("auth-state-changed", {
        detail: { action: "logout" }
      }));
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh orders
      fetchUserData(token);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart_guest");
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new CustomEvent("auth-state-changed", {
      detail: { action: "logout" }
    }));
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFF7E9]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-[#E9A534]/30 border-t-[#E9A534]" />
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.20em] text-[#6B3A2A]/75">
            Loading your cosmic profile
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Total Readings", value: bookings.length, icon: BookOpen },
    { label: "Orders", value: orders.length, icon: Star },
    { label: "Wishlist", value: wishlist.length, icon: Heart },
  ];

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState(null);

  const handlePayBooking = async (booking) => {
    setPayingBookingId(booking._id);
    try {
      const token = localStorage.getItem("token");
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        alert("Payment gateway failed to load. Please check your internet connection.");
        return;
      }

      const amount = booking.amount || 2100;
      const rzpRes = await axios.post(
        `${API_URL}/payment/create-order`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rzpOrder = rzpRes.data.order;
      const keyId = rzpRes.data.keyId || "rzp_test_TeAqFB25uZz5vD";

      const options = {
        key: keyId,
        amount: rzpOrder.amount,
        currency: "INR",
        name: "Cosmic Nidhi",
        description: `Payment for ${booking.serviceName || "Consultation"}`,
        order_id: rzpOrder.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${API_URL}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: booking._id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Payment successful! Your reading is confirmed.");
            fetchUserData(token);
          } catch (err) {
            console.error("Payment verification failed", err);
            alert("Payment verification error: " + (err.response?.data?.message || err.message));
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#E9A534",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment: " + (err.response?.data?.message || err.message));
    } finally {
      setPayingBookingId(null);
    }
  };

  const TAB_LABELS = {
    overview: "Overview",
    zodiac: "My Zodiac",
    bookings: "My Readings",
    orders: "Orders",
    wishlist: "Wishlist",
    profile: "Profile",
  };

  const TABS = {
    overview: <OverviewTab user={user} />,
    zodiac: <ZodiacTab user={user} />,
    bookings: (
      <BookingsTab
        bookings={bookings}
        onOpenBooking={() => setBookingModalOpen(true)}
        onPayBooking={handlePayBooking}
        payingBookingId={payingBookingId}
      />
    ),
    orders: <OrdersTab orders={orders} onCancelOrder={handleCancelOrder} />,
    wishlist: <WishlistTab wishlist={wishlist} onRemove={handleRemoveWishlist} />,
    profile: <ProfileTab user={user} onUpdate={() => fetchUserData(localStorage.getItem("token"))} />,
  };

  return (
    <>
      {/* HERO BAND (dark) */}
      <section className="relative overflow-hidden border-b border-[#E9A534]/15 bg-[#180205] pt-32 pb-16 md:pt-40 md:pb-20">

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 right-[8%] h-[400px] w-[400px] rounded-full bg-[#650F18]/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[5%] h-[350px] w-[350px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        {/* ============================================================
            ROTATING ZODIAC CHAKRA — right side
        ============================================================ */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute top-1/2 -translate-y-1/2
            h-[420px] w-[420px]
            right-[-180px]
            opacity-[0.10]
            mix-blend-screen
            sm:right-[-140px] sm:h-[500px] sm:w-[500px]
            lg:right-[-100px] lg:h-[560px] lg:w-[560px] lg:opacity-[0.14]
            xl:right-[-40px] xl:h-[640px] xl:w-[640px] xl:opacity-[0.16]
          "
        >
          <img
            src={heroZodiac}
            alt=""
            className="h-full w-full object-contain"
            style={{ animation: "zodiacRotate 90s linear infinite" }}
          />
        </div>

        {/* Floating stars */}
        <span className="pointer-events-none absolute left-[12%] top-[28%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/70 shadow-[0_0_12px_rgba(233,165,52,0.6)]" />
        <span className="pointer-events-none absolute right-[14%] top-[22%] h-[2px] w-[2px] rounded-full bg-[#E9A534]/60" />
        <span className="pointer-events-none absolute right-[22%] bottom-[24%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/50" />

        <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#E9A534]/60" />
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                Your Cosmic Space
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-5 max-w-[720px] font-display text-[40px] leading-[1.0] tracking-[-0.02em] text-[#FFF7E8] sm:text-[48px] md:text-[56px] lg:text-[64px]">
              Welcome back,{" "}
              <span className="text-[#E9B957]">
                {user.name?.split(" ")[0] || "Seeker"}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-[#F5E5C7]/85 sm:text-[16px]">
              The stars have been keeping notes. Review your readings,
              orders and profile — all in one place.
            </p>
          </Reveal>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E9A534]/30 to-transparent" />
      </section>

      {/* DASHBOARD BODY (light) */}
      <section className="relative overflow-hidden bg-[#FFF7E9] py-12 md:py-16">
        <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#C1272D]/[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <div className="grid gap-8 lg:grid-cols-4">
            <Sidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleLogout={handleLogout}
            />

            <div className="space-y-8 lg:col-span-3">
              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>

              {/* TAB PANEL */}
              <Reveal>
                <div className="overflow-hidden rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-[0_20px_60px_rgba(60,8,13,0.08)]">
                  <div className="relative border-b border-[#5A0E14]/12 bg-[#FDECC8]/30 px-6 py-5 sm:px-8">
                    <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/50 to-transparent" />
                    <Eyebrow>{TAB_LABELS[activeTab] || "Overview"}</Eyebrow>
                  </div>
                  <div className="p-6 sm:p-8">{TABS[activeTab]}</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Footer */}
      <footer className="border-t border-[#5A0E14]/10 bg-[#FFFDF9] py-6 px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-xs text-[#6B3A2A]/70">
          <span>© {new Date().getFullYear()} All rights reserved By: Cosmic Nidhi.</span>
          <span className="text-[#5A0E14]/25 select-none">|</span>
          <a href="/page/privacy-policy" className="transition-colors duration-300 hover:text-[#A2691F]">Privacy Policy</a>
          <span className="text-[#5A0E14]/25 select-none">|</span>
          <a href="/page/return-policy" className="transition-colors duration-300 hover:text-[#A2691F]">Return Policy</a>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          const token = localStorage.getItem("token");
          if (token) fetchUserData(token);
        }}
      />
    </>
  );
}