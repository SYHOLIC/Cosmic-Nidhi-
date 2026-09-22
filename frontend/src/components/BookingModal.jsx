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
  Compass,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

import { API_URL } from "../config/api";
import { loadRazorpay } from "../utils/loadRazorpay";

const SERVICES_LIST = [
  {
    type: "numerology",
    name: "Numerology Consultation",
    duration: "30–40 minutes",
    icon: Calendar,
    amount: 2100,
    priceDisplay: "₹2,100",
    deliverables: "Numerology report, video/phone call, name-analysis notes",
  },
  {
    type: "birth-chart",
    name: "Birth Chart / Janam Kundli Reading",
    duration: "30 minutes",
    icon: Star,
    amount: 2100,
    priceDisplay: "₹2,100",
    deliverables: "Chart PDF, consultation call, written summary, recording",
  },
  {
    type: "vastu",
    name: "Applied Vastu Consultation",
    duration: "50–60 minutes",
    icon: Shield,
    amount: 3100,
    priceDisplay: "₹3,100",
    deliverables: "Annotated plan, written recommendations, call, follow-up",
  },
  {
    type: "vastu-visit",
    name: "Location Visit for Applied Vastu",
    duration: "On-site visit",
    icon: MapPin,
    amount: 5100,
    priceDisplay: "₹5,100",
    deliverables: "On-site space inspection, directional audit, remedy plan",
  },
  {
    type: "vastu-gridding",
    name: "Gridding for Home Map (Vastu)",
    duration: "Floor plan analysis",
    icon: Compass,
    amount: 12,
    priceDisplay: "₹12 / sq.ft",
    deliverables: "16-zone Shakti Chakra map grid (₹12 per sq. ft)",
  },
  {
    type: "kundli-matching",
    name: "Kundli Matching / Relationship Guidance",
    duration: "30 minutes",
    icon: Sparkles,
    amount: 2100,
    priceDisplay: "₹2,100",
    deliverables: "Side-by-side kundli reading, compatibility report (Requires Bride & Groom Name & DOB)",
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

const isSlotPassed = (slotStr, dateStr) => {
  if (!dateStr || !slotStr) return false;
  const now = new Date();
  
  // Format local today as YYYY-MM-DD
  const localYear = now.getFullYear();
  const localMonth = String(now.getMonth() + 1).padStart(2, '0');
  const localDay = String(now.getDate()).padStart(2, '0');
  const todayStr = `${localYear}-${localMonth}-${localDay}`;
  
  if (dateStr !== todayStr) return false;

  const [timePart, modifier] = slotStr.split(" ");
  if (!timePart || !modifier) return false;
  let [hours, minutes] = timePart.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  return slotTime <= now;
};

export default function BookingModal({ isOpen, onClose, initialService }) {
  const [selectedServiceType, setSelectedServiceType] = useState("birth-chart");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [paymentMode, setPaymentMode] = useState("advance_online");
  const [bookedSlots, setBookedSlots] = useState([]);

  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    partnerName: "",
    partnerDateOfBirth: "",
    partnerTimeOfBirth: "",
    partnerPlaceOfBirth: "",
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
          phone: (u.phone || "").replace(/\D/g, "").slice(0, 10),
        }));
      }
    } catch {}
    
    setSuccessBooking(null);
    setErrorMsg("");
  }, [initialService, isOpen]);

  // Fetch booked slots whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      axios
        .get(`${API_URL}/bookings/booked-slots?date=${selectedDate}`)
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.bookedSlots)) {
            setBookedSlots(res.data.bookedSlots);
          } else {
            setBookedSlots([]);
          }
        })
        .catch(() => setBookedSlots([]));
    }
  }, [selectedDate]);

  // If currently selected slot is passed or booked, automatically switch to first available slot
  useEffect(() => {
    const isCurrentUnavailable =
      isSlotPassed(selectedTime, selectedDate) ||
      bookedSlots.includes(selectedTime);

    if (isCurrentUnavailable) {
      const firstAvailable = TIME_SLOTS.find(
        (slot) => !isSlotPassed(slot, selectedDate) && !bookedSlots.includes(slot)
      );
      if (firstAvailable) {
        setSelectedTime(firstAvailable);
      }
    }
  }, [selectedDate, bookedSlots, selectedTime]);

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

    // Validate phone number: strictly 10 digits
    const cleanedPhone = String(clientDetails.phone || "").trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    // Validate time slot: must not have already passed
    if (isSlotPassed(selectedTime, selectedDate)) {
      setErrorMsg("The selected time slot has already passed today. Please choose a future slot.");
      setLoading(false);
      return;
    }

    // Validate time slot: must not be booked by another user
    if (bookedSlots.includes(selectedTime)) {
      setErrorMsg("This time slot is already booked by another user. Please choose another slot.");
      setLoading(false);
      return;
    }

    const isMatching = activeService.type === "kundli-matching";

    if (isMatching) {
      if (!clientDetails.name?.trim()) {
        setErrorMsg("Bride's Full Name is required for matching.");
        setLoading(false);
        return;
      }
      if (!clientDetails.dateOfBirth) {
        setErrorMsg("Bride's Date of Birth is required for matching.");
        setLoading(false);
        return;
      }
      if (!clientDetails.partnerName?.trim()) {
        setErrorMsg("Groom's Full Name is required for matching.");
        setLoading(false);
        return;
      }
      if (!clientDetails.partnerDateOfBirth) {
        setErrorMsg("Groom's Date of Birth is required for matching.");
        setLoading(false);
        return;
      }
    }

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
        paymentMethod: paymentMode === "advance_online" ? "online_razorpay" : "pay_later",
        clientDetails: {
          name: clientDetails.name,
          email: clientDetails.email,
          phone: clientDetails.phone,
          dateOfBirth: clientDetails.dateOfBirth,
          timeOfBirth: clientDetails.timeOfBirth,
          placeOfBirth: clientDetails.placeOfBirth,
          partnerName: clientDetails.partnerName,
          partnerDateOfBirth: clientDetails.partnerDateOfBirth,
          partnerTimeOfBirth: clientDetails.partnerTimeOfBirth,
          partnerPlaceOfBirth: clientDetails.partnerPlaceOfBirth,
          questions: clientDetails.questions,
        },
        notes: isMatching
          ? `[Kundli Matching] Bride: ${clientDetails.name} (DOB: ${clientDetails.dateOfBirth}) | Groom: ${clientDetails.partnerName} (DOB: ${clientDetails.partnerDateOfBirth}) | Notes: ${clientDetails.questions || "None"}`
          : clientDetails.questions,
      };

      const res = await axios.post(`${API_URL}/bookings`, payload, { headers });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to schedule consultation.");
      }

      const createdBooking = res.data.booking;

      // Handle Advance Online Payment
      if (paymentMode === "advance_online") {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          setErrorMsg("Booking created! Payment gateway failed to load. You may pay at the consultation.");
          setSuccessBooking(createdBooking);
          setLoading(false);
          return;
        }

        const orderRes = await axios.post(
          `${API_URL}/payment/create-order`,
          { amount: activeService.amount },
          { headers }
        );

        if (!orderRes.data.success || !orderRes.data.order) {
          setErrorMsg("Booking created! Could not initiate online payment order. You may pay at the consultation.");
          setSuccessBooking(createdBooking);
          setLoading(false);
          return;
        }

        const { order, keyId } = orderRes.data;

        const options = {
          key: keyId || "rzp_test_TeAqFB25uZz5vD",
          amount: order.amount,
          currency: "INR",
          name: "Cosmic Nidhi",
          description: `${activeService.name} Consultation Booking`,
          order_id: order.id,
          config: {
            display: {
              blocks: {
                upi: {
                  name: "Pay via UPI / QR Code",
                  instruments: [{ method: "upi" }]
                },
                other: {
                  name: "Cards, NetBanking & Wallets",
                  instruments: [
                    { method: "card" },
                    { method: "netbanking" },
                    { method: "wallet" }
                  ]
                }
              },
              sequence: ["block.upi", "block.other"],
              preferences: {
                show_default_blocks: true
              }
            }
          },
          handler: async function (response) {
            try {
              await axios.post(
                `${API_URL}/payment/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  booking_id: createdBooking._id,
                },
                { headers }
              );

              setSuccessBooking({
                ...createdBooking,
                paymentStatus: "paid",
                paymentId: response.razorpay_payment_id,
                paymentMethod: "online_razorpay",
              });
            } catch (vErr) {
              console.error("Payment verify error:", vErr);
              setSuccessBooking({
                ...createdBooking,
                paymentStatus: "paid",
                paymentId: response.razorpay_payment_id,
              });
            }
          },
          prefill: {
            name: clientDetails.name,
            email: clientDetails.email,
            contact: clientDetails.phone,
          },
          theme: {
            color: "#5A0E14",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setSuccessBooking(createdBooking);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          setErrorMsg("Payment was cancelled or failed. Your appointment has been booked with payment due at consultation.");
          setSuccessBooking(createdBooking);
        });
        rzp.open();
      } else {
        setSuccessBooking(createdBooking);
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

                {successBooking.paymentStatus === "paid" ? (
                  <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full border border-green-600/30 bg-green-50 px-3 py-1 font-sans text-[11.5px] font-bold uppercase tracking-[0.1em] text-green-800">
                    <CheckCircle2 size={13} />
                    <span>Advance Payment Verified · {activeService.priceDisplay || `₹${activeService.amount}`}</span>
                  </div>
                ) : (
                  <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#E9A534]/40 bg-[#FDECC8]/40 px-3 py-1 font-sans text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#8A5A1F]">
                    <Clock size={13} />
                    <span>Payment Due at Consultation · {activeService.priceDisplay || `₹${activeService.amount}`}</span>
                  </div>
                )}

                <p className="mx-auto mt-3 max-w-md font-sans text-[13.5px] leading-relaxed text-[#6B3A2A]/85">
                  Thank you, <strong className="text-[#3C080D]">{clientDetails.name}</strong>. Your appointment for{" "}
                  <strong className="text-[#8B2F2B]">{activeService.name}</strong> on{" "}
                  <strong className="text-[#3C080D]">{new Date(selectedDate).toLocaleDateString()}</strong> at{" "}
                  <strong className="text-[#3C080D]">{selectedTime}</strong> has been received.
                </p>

                <div className="mx-auto my-6 max-w-md rounded-[8px] border border-[#E9A534]/25 bg-[#FDECC8]/30 p-4 text-left font-sans text-[12.5px] text-[#3C080D]">
                  <p className="flex items-center gap-2 font-semibold">
                    <Clock size={14} className="text-[#E9A534]" /> Session Duration: {activeService.duration}
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#8B2F2B]">
                    <span>✦</span> Fee: {activeService.priceDisplay || `₹${activeService.amount}`}{" "}
                    <span className={successBooking.paymentStatus === "paid" ? "text-green-700 font-bold ml-1" : "text-[#8A5A1F] ml-1"}>
                      ({successBooking.paymentStatus === "paid" ? "Paid in Advance ✓" : "Due at session"})
                    </span>
                  </p>
                  {successBooking.paymentId && (
                    <p className="mt-1 text-[11px] font-medium text-[#6B3A2A]/80">
                      <span>✦</span> Payment Reference: {successBooking.paymentId}
                    </p>
                  )}
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
                              {svc.duration} · {svc.priceDisplay || `₹${svc.amount}`}
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
                      {TIME_SLOTS.map((slot) => {
                        const passed = isSlotPassed(slot, selectedDate);
                        const booked = bookedSlots.includes(slot);
                        const disabled = passed || booked;
                        return (
                          <option key={slot} value={slot} disabled={disabled}>
                            {slot}
                            {passed ? " (Passed)" : booked ? " (Already Booked)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Notice for Kundli Matching */}
                {activeService.type === "kundli-matching" ? (
                  <>
                    <div className="rounded-[8px] border border-[#C1272D]/30 bg-[#C1272D]/5 p-3.5 flex items-start gap-2.5">
                      <span className="text-[#C1272D] text-sm mt-0.5 shrink-0">✦</span>
                      <p className="font-sans text-[12px] leading-[1.6] text-[#5A0E14]">
                        <strong>Kundli / Match Making:</strong> Both <strong>Date of Birth</strong> and <strong>Full Name</strong> are required to match (Bride &amp; Groom).
                      </p>
                    </div>

                    {/* Bride's Details */}
                    <div className="rounded-[8px] border border-[#C1272D]/20 bg-[#FFF7E9] p-4">
                      <p className="mb-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#C1272D] flex items-center gap-1.5">
                        <span>✦</span> Bride's Details (Required)
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Bride's Full Name *
                          </label>
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
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Bride's Date of Birth *
                          </label>
                          <input
                            type="date"
                            required
                            value={clientDetails.dateOfBirth}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, dateOfBirth: e.target.value })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Exact Time of Birth (Optional)
                          </label>
                          <input
                            type="time"
                            value={clientDetails.timeOfBirth}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, timeOfBirth: e.target.value })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Place of Birth (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Udaipur, Rajasthan"
                            value={clientDetails.placeOfBirth}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, placeOfBirth: e.target.value })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Groom's Details */}
                    <div className="rounded-[8px] border border-[#E9A534]/30 bg-[#FDECC8]/30 p-4">
                      <p className="mb-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F] flex items-center gap-1.5">
                        <span>✦</span> Groom's Details (Required)
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Groom's Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Verma"
                            value={clientDetails.partnerName}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, partnerName: e.target.value })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Groom's Date of Birth *
                          </label>
                          <input
                            type="date"
                            required
                            value={clientDetails.partnerDateOfBirth}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, partnerDateOfBirth: e.target.value })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Exact Time of Birth (Optional)
                          </label>
                          <input
                            type="time"
                            value={clientDetails.partnerTimeOfBirth}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, partnerTimeOfBirth: e.target.value })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3A2A]/80">
                            Place of Birth (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Jaipur, Rajasthan"
                            value={clientDetails.partnerPlaceOfBirth}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, partnerPlaceOfBirth: e.target.value })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <label className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
                        Contact Details
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B3A2A]/80">
                            Phone / WhatsApp (10 digits) *
                          </label>
                          <input
                            type="tel"
                            required
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            value={clientDetails.phone}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                            }
                            className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534] focus:outline-none"
                          />
                        </div>
                        <div>
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
                  </>
                ) : (
                  <>
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
                            Phone / WhatsApp (10 digits) *
                          </label>
                          <input
                            type="tel"
                            required
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            value={clientDetails.phone}
                            onChange={(e) =>
                              setClientDetails({ ...clientDetails, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
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
                        Birth Details (Optional but Recommended for Kundli &amp; Numerology)
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
                  </>
                )}

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

                {/* 6. Payment Mode Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]">
                      Advance Payment Option
                    </label>
                    <span className="font-display text-[13px] font-bold text-[#8B2F2B]">
                      {activeService.priceDisplay || `₹${activeService.amount}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {/* Option 1: Pay Advance Online */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode("advance_online")}
                      className={`relative flex items-start gap-3 rounded-[8px] border p-3.5 text-left transition-all ${
                        paymentMode === "advance_online"
                          ? "border-[#E9A534] bg-[#FDECC8]/40 shadow-sm ring-1 ring-[#E9A534]"
                          : "border-[#5A0E14]/12 bg-white hover:border-[#E9A534]/50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          paymentMode === "advance_online"
                            ? "bg-[#5A0E14] text-[#FFF8EC]"
                            : "bg-[#FDECC8]/40 text-[#8A5A1F]"
                        }`}
                      >
                        <CreditCard size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-display text-[13px] font-semibold text-[#3C080D]">
                            Pay Advance Online
                          </p>
                          <span className="rounded-full bg-[#E9A534]/25 px-1.5 py-0.5 font-sans text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#8A5A1F]">
                            Instant
                          </span>
                        </div>
                        <p className="mt-0.5 font-sans text-[11px] text-[#6B3A2A]/75">
                          UPI (GPay / PhonePe / Paytm), QR, Cards &amp; NetBanking
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Pay Later */}
                    <button
                      type="button"
                      onClick={() => setPaymentMode("pay_later")}
                      className={`relative flex items-start gap-3 rounded-[8px] border p-3.5 text-left transition-all ${
                        paymentMode === "pay_later"
                          ? "border-[#E9A534] bg-[#FDECC8]/40 shadow-sm ring-1 ring-[#E9A534]"
                          : "border-[#5A0E14]/12 bg-white hover:border-[#E9A534]/50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          paymentMode === "pay_later"
                            ? "bg-[#5A0E14] text-[#FFF8EC]"
                            : "bg-[#FDECC8]/40 text-[#8A5A1F]"
                        }`}
                      >
                        <Clock size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-[13px] font-semibold text-[#3C080D]">
                          Pay at Consultation
                        </p>
                        <p className="mt-0.5 font-sans text-[11px] text-[#6B3A2A]/75">
                          Pay later during consultation via UPI or Cash
                        </p>
                      </div>
                    </button>
                  </div>

                  {paymentMode === "advance_online" && (
                    <div className="mt-2.5 flex items-center justify-between rounded-[7px] border border-[#E9A534]/30 bg-[#FFF7E9] px-3.5 py-2.5 font-sans text-[11.5px] text-[#6B3A2A]/85">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-[#8A5A1F]" />
                        Secured 256-bit payment gateway · Instant slot reservation
                      </span>
                      <strong className="text-[#3C080D]">
                        {activeService.priceDisplay || `₹${activeService.amount}`}
                      </strong>
                    </div>
                  )}
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
                    {loading
                      ? (paymentMode === "advance_online" ? "Processing Advance Payment..." : "Scheduling Consultation...")
                      : (paymentMode === "advance_online"
                          ? `Pay Advance (${activeService.priceDisplay || '₹' + activeService.amount}) & Book`
                          : "Confirm Consultation Booking (Pay Later)")}
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
