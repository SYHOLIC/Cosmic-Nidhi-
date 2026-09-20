import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  Loader2,
  Star,
  Shield,
  FileText,
} from "lucide-react";
import axios from "axios";

import { API_URL } from "../config/api";

const SERVICES_LIST = [
  {
    type: "numerology",
    name: "Numerology Profile",
    duration: "45–60 minutes",
    icon: Calendar,
    amount: 1100,
    deliverables: "Numerology report, video/phone call, name-analysis notes",
  },
  {
    type: "birth-chart",
    name: "Birth Chart / Janam Kundli Reading",
    duration: "60–75 minutes",
    icon: Star,
    amount: 1100,
    deliverables: "Chart PDF, consultation call, written summary, recording",
  },
  {
    type: "vastu",
    name: "Applied Vastu Consultation",
    duration: "60–90 minutes",
    icon: Shield,
    amount: 2100,
    deliverables: "Annotated plan, written recommendations, call, follow-up",
  },
  {
    type: "kundli-matching",
    name: "Kundli Matching / Relationship Guidance",
    duration: "60–75 minutes",
    icon: Sparkles,
    amount: 2100,
    deliverables: "Side-by-side chart reading, compatibility report",
  },
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "07:30 PM",
];

export default function BookingModal({ isOpen, onClose, initialService }) {
  const [selectedServiceType, setSelectedServiceType] = useState("birth-chart");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);

  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    questions: "",
  });

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Populate from initialService or logged-in user
  useEffect(() => {
    if (initialService) {
      const match = SERVICES_LIST.find(
        (s) =>
          s.name.toLowerCase().includes(initialService.title?.toLowerCase() || "") ||
          s.type === initialService.type?.toLowerCase() ||
          initialService.title?.toLowerCase().includes(s.type)
      );
      if (match) {
        setSelectedServiceType(match.type);
      }
    }

    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);

    // Prepopulate user details if logged in
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        setClientDetails((prev) => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
        }));
      }
    } catch {}
    
    setSuccessBooking(null);
    setErrorMsg("");
  }, [initialService, isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => e.key === "Escape" && onClose?.();
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const activeService =
    SERVICES_LIST.find((s) => s.type === selectedServiceType) || SERVICES_LIST[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        serviceType: activeService.type,
        serviceName: activeService.name,
        date: selectedDate,
        time: selectedTime,
        duration: activeService.duration,
        amount: activeService.amount,
        clientDetails: {
          name: clientDetails.name,
          email: clientDetails.email,
          phone: clientDetails.phone,
          dateOfBirth: clientDetails.dateOfBirth,
          timeOfBirth: clientDetails.timeOfBirth,
          placeOfBirth: clientDetails.placeOfBirth,
          questions: clientDetails.questions,
        },
        notes: clientDetails.questions,
      };

      const res = await axios.post(`${API_URL}/bookings`, payload, { headers });

      if (res.data.success) {
        setSuccessBooking(res.data.booking);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to schedule consultation. Please try again or call us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#170205]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[14px] border border-[#E9A534]/30 bg-[#FFFDF9] shadow-[0_30px_90px_rgba(24,2,5,0.45)]"
        >
          {/* Header Glow Banner */}
          <div className="relative border-b border-[#E9A534]/20 bg-gradient-to-r from-[#210307] via-[#3C080D] to-[#210307] p-6 text-[#FFF8EC]">
            <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/70 to-transparent" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/15 text-[#E9C76D]">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#E9C76D]">
                    Consultation Booking
                  </p>
                  <h2 className="font-display text-[20px] font-semibold text-[#FFF8EC] sm:text-[22px]">
                    Schedule Your Sacred Reading
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E9A534]/30 bg-black/20 text-[#E9C76D] transition-colors hover:bg-[#C1272D] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-7">
            {successBooking ? (
              /* Success confirmation */
              <div className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-green-600/30 bg-green-50 text-green-600 shadow-lg"
                >
                  <CheckCircle2 size={36} strokeWidth={2} />
                </motion.div>
                <h3 className="font-display text-[24px] font-semibold text-[#3C080D]">
                  Consultation Request Confirmed!
                </h3>
                <p className="mx-auto mt-2 max-w-md font-sans text-[13.5px] leading-relaxed text-[#6B3A2A]/85">
                  Thank you, <strong className="text-[#3C080D]">{clientDetails.name}</strong>. Your appointment for{" "}
                  <strong className="text-[#8B2F2B]">{activeService.name}</strong> on{" "}
                  <strong className="text-[#3C080D]">{new Date(selectedDate).toLocaleDateString()}</strong> at{" "}
                  <strong className="text-[#3C080D]">{selectedTime}</strong> has been received.
                </p>

                <div className="mx-auto my-6 max-w-md rounded-[8px] border border-[#E9A534]/25 bg-[#FDECC8]/30 p-4 text-left font-sans text-[12.5px] text-[#3C080D]">
                  <p className="flex items-center gap-2 font-semibold">
                    <Clock size={14} className="text-[#E9A534]" /> Session Duration: {activeService.duration}
                  </p>
                  <p className="mt-1 flex items-center gap-2">
                    <FileText size={14} className="text-[#E9A534]" /> Deliverables: {activeService.deliverables}
                  </p>
                  <p className="mt-2 text-[11.5px] text-[#6B3A2A]/75">
                    ✦ Our lead astrologer will connect with you via Phone / WhatsApp prior to the session.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="tel:9560437360"
                    className="inline-flex items-center gap-2 rounded-full border border-[#E9A534] bg-[#FFF8EC] px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    <Phone size={13} className="text-[#8B2F2B]" /> Call Us: 9560437360 / 8826044955
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-[#5A0E14] px-7 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFF8EC] transition-colors hover:bg-[#3C080D]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Select Service */}
                <div>
                  <label className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
                    1. Choose Service
                  </label>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {SERVICES_LIST.map((svc) => {
                      const isSelected = selectedServiceType === svc.type;
                      const Icon = svc.icon;
                      return (
                        <button
                          key={svc.type}
                          type="button"
                          onClick={() => setSelectedServiceType(svc.type)}
                          className={`flex items-start gap-3 rounded-[8px] border p-3 text-left transition-all ${
                            isSelected
                              ? "border-[#E9A534] bg-[#FDECC8]/40 shadow-sm ring-1 ring-[#E9A534]"
                              : "border-[#5A0E14]/12 bg-white hover:border-[#E9A534]/50"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                              isSelected
                                ? "bg-[#5A0E14] text-[#FFF8EC]"
                                : "bg-[#FDECC8]/40 text-[#8A5A1F]"
                            }`}
                          >
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-display text-[13px] font-semibold text-[#3C080D]">
                              {svc.name}
                            </p>
                            <p className="font-sans text-[11px] text-[#6B3A2A]/70">
                              {svc.duration} · ₹{svc.amount}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Date & Time Selection */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
                      2. Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
                      Preferred Time Slot
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Client Information */}
                <div>
                  <label className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
                    3. Your Details
                  </label>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B3A2A]/80">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Priya Sharma"
                          value={clientDetails.name}
                          onChange={(e) =>
                            setClientDetails({ ...clientDetails, name: e.target.value })
                          }
                          className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B3A2A]/80">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={clientDetails.phone}
                        onChange={(e) =>
                          setClientDetails({ ...clientDetails, phone: e.target.value })
                        }
                        className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B3A2A]/80">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. priya@example.com"
                        value={clientDetails.email}
                        onChange={(e) =>
                          setClientDetails({ ...clientDetails, email: e.target.value })
                        }
                        className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Astrological Chart Details (Optional / Contextual) */}
                <div className="rounded-[8px] border border-[#E9A534]/20 bg-[#FDECC8]/25 p-4">
                  <p className="mb-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F]">
                    Birth Details (Optional but Recommended for Kundli & Numerology)
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block font-sans text-[9px] font-bold uppercase text-[#6B3A2A]/75">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={clientDetails.dateOfBirth}
                        onChange={(e) =>
                          setClientDetails({ ...clientDetails, dateOfBirth: e.target.value })
                        }
                        className="w-full rounded-[6px] border border-[#5A0E14]/15 bg-white px-3 py-1.5 font-sans text-[12px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-sans text-[9px] font-bold uppercase text-[#6B3A2A]/75">
                        Exact Time of Birth
                      </label>
                      <input
                        type="time"
                        value={clientDetails.timeOfBirth}
                        onChange={(e) =>
                          setClientDetails({ ...clientDetails, timeOfBirth: e.target.value })
                        }
                        className="w-full rounded-[6px] border border-[#5A0E14]/15 bg-white px-3 py-1.5 font-sans text-[12px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-sans text-[9px] font-bold uppercase text-[#6B3A2A]/75">
                        City / Place of Birth
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Udaipur, Rajasthan"
                        value={clientDetails.placeOfBirth}
                        onChange={(e) =>
                          setClientDetails({ ...clientDetails, placeOfBirth: e.target.value })
                        }
                        className="w-full rounded-[6px] border border-[#5A0E14]/15 bg-white px-3 py-1.5 font-sans text-[12px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Questions / Notes */}
                <div>
                  <label className="mb-1.5 block font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F]">
                    Specific Questions or Focus Area
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Career changes in the coming year, relationship compatibility, health, or new business venture..."
                    value={clientDetails.questions}
                    onChange={(e) =>
                      setClientDetails({ ...clientDetails, questions: e.target.value })
                    }
                    className="w-full resize-none rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                  />
                </div>

                {errorMsg && (
                  <p className="rounded-[6px] bg-red-50 p-3 font-sans text-[12px] font-medium text-red-700">
                    {errorMsg}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] py-3.5 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_34px_rgba(0,0,0,0.20)] disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Scheduling Consultation..." : "Confirm Consultation Booking"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-[#5A0E14]/20 py-3.5 px-6 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#5A0E14]/70 transition-colors hover:border-[#5A0E14]/40 hover:text-[#3C080D]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
