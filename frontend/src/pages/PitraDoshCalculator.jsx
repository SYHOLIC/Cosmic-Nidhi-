import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  RotateCcw,
  Sun,
  Compass,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Printer,
  Share2,
  Check,
  Globe,
} from "lucide-react";
import { calculatePitraDosha, CITIES_DATABASE } from "../utils/pitraDoshEngine";
import VedicKundaliChart from "../components/VedicKundaliChart";

// Country dialing codes with flags for the WhatsApp selector
const COUNTRY_LIST = [
  { code: "+91", country: "India", flag: "🇮🇳", short: "IN" },
  { code: "+1", country: "United States", flag: "🇺🇸", short: "US" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", short: "GB" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪", short: "AE" },
  { code: "+1", country: "Canada", flag: "🇨🇦", short: "CA" },
  { code: "+61", country: "Australia", flag: "🇦🇺", short: "AU" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", short: "SG" },
  { code: "+49", country: "Germany", flag: "🇩🇪", short: "DE" },
  { code: "+977", country: "Nepal", flag: "🇳🇵", short: "NP" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", short: "SA" },
  { code: "+974", country: "Qatar", flag: "🇶🇦", short: "QA" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿", short: "NZ" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", short: "MY" },
  { code: "+27", country: "South Africa", flag: "🇿🇦", short: "ZA" },
];

export default function PitraDoshCalculator() {
  // Form State
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeHours, setTimeHours] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");
  const [timePeriod, setTimePeriod] = useState("AM");
  const [isNoonTime, setIsNoonTime] = useState(false);
  const [birthPlace, setBirthPlace] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_LIST[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Calculation & UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const resultsRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const placeDropdownRef = useRef(null);
  const minutesInputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
      if (placeDropdownRef.current && !placeDropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Birth Place suggestions
  const handlePlaceChange = (e) => {
    const query = e.target.value;
    setBirthPlace(query);
    if (query.trim().length > 1) {
      const filtered = CITIES_DATABASE.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7);
      setPlaceSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city) => {
    setBirthPlace(city.name);
    setShowSuggestions(false);
  };

  // Time handling with smooth formatting & navigation
  const handleToggleNoonTime = () => {
    if (!isNoonTime) {
      setTimeHours("12");
      setTimeMinutes("00");
      setTimePeriod("PM");
      setIsNoonTime(true);
    } else {
      setTimeHours("");
      setTimeMinutes("");
      setIsNoonTime(false);
    }
  };

  const handleHoursChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setTimeHours("");
      setIsNoonTime(false);
      return;
    }
    const num = parseInt(raw, 10);
    if (num > 12) {
      setTimeHours("12");
    } else {
      setTimeHours(raw);
    }
    setIsNoonTime(false);
    if (raw.length === 2 && minutesInputRef.current) {
      minutesInputRef.current.focus();
    }
  };

  const handleHoursBlur = () => {
    if (timeHours) {
      const num = Math.min(12, Math.max(1, parseInt(timeHours, 10) || 1));
      setTimeHours(String(num).padStart(2, "0"));
    }
  };

  const handleMinutesChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setTimeMinutes("");
      setIsNoonTime(false);
      return;
    }
    const num = parseInt(raw, 10);
    if (num > 59) {
      setTimeMinutes("59");
    } else {
      setTimeMinutes(raw);
    }
    setIsNoonTime(false);
  };

  const handleMinutesBlur = () => {
    if (timeMinutes !== "") {
      const num = Math.min(59, Math.max(0, parseInt(timeMinutes, 10) || 0));
      setTimeMinutes(String(num).padStart(2, "0"));
    }
  };

  // Submit Handler
  const handleCalculate = (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!dateOfBirth) {
      setError("Please enter your date of birth.");
      return;
    }
    if (!timeHours) {
      setError("Please specify your time of birth (or check the Solar Chart 12:00 PM option).");
      return;
    }

    const formattedTime = `${timeHours.padStart(2, "0")}:${(timeMinutes || "00").padStart(2, "0")}`;

    setLoading(true);

    setTimeout(() => {
      try {
        const calculated = calculatePitraDosha({
          fullName: fullName.trim(),
          dateOfBirth,
          timeOfBirth: formattedTime,
          timePeriod,
          birthPlace: birthPlace || "Noida, Uttar Pradesh, India",
          whatsappNumber: `${selectedCountry.code} ${whatsappNumber}`.trim(),
        });

        setResult(calculated);
        setLoading(false);

        // Background lead capture to Cosmic Nidhi contact/lead system
        try {
          fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName.trim(),
              email: `${(whatsappNumber || "client").replace(/\D/g, "") || "client"}@pitradosha.leads`,
              subject: `Pitra Dosh Lead: ${fullName.trim()} (${selectedCountry.code} ${whatsappNumber || "N/A"})`,
              message: `Pitra Dosha Calculator Submission\n• Client: ${fullName.trim()}\n• DOB: ${dateOfBirth} (${formattedTime} ${timePeriod})\n• Place: ${birthPlace || "Noida, India"}\n• Phone: ${selectedCountry.code} ${whatsappNumber || "Not Provided"}\n• Status: ${calculated.scores.statusText} (${calculated.scores.severity})\n• Net Score: ${calculated.scores.netScore}/10`,
            }),
          }).catch(() => {});
        } catch (ignored) {}

        // Scroll smoothly to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } catch (err) {
        setError(err.message || "Calculation failed. Please check your inputs.");
        setLoading(false);
      }
    }, 1100);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!result) return;
    const shareText = encodeURIComponent(
      `🔮 Pitra Dosha Kundali Report for ${result.meta.fullName}:\n• Result: ${result.scores.statusText}\n• Severity: ${result.scores.severity}\n• Net Score: ${result.scores.netScore} / 10\n• Lagna: ${result.ascendant.sign} | 9th House: ${result.ninthHouse.sign}\n\nCheck yours at Cosmic Nidhi: https://www.cosmicnidhi.in/pitra-dosh-calculator`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
  };

  // WhatsApp consult link with pre-filled Kundali summary
  const getWhatsAppConsultUrl = () => {
    if (!result) return "https://wa.me/919560437360";
    const msg = encodeURIComponent(
      `Namaste Cosmic Nidhi 🙏\n\nI just checked my Pitra Dosha on your website:\n• Name: ${result.meta.fullName}\n• DOB: ${result.meta.dateOfBirth} (${result.meta.timeOfBirth} ${result.meta.timePeriod})\n• Place: ${result.meta.birthPlace}\n• Dosha Result: ${result.scores.statusText} (${result.scores.severity})\n• Lagna: ${result.ascendant.sign} | 9th House: ${result.ninthHouse.sign}\n\nCould you please guide me on customized Pitra Dosha Nivaran remedies and personalized consultation?`
    );
    return `https://wa.me/919560437360?text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F6F0] pt-24 pb-20 sm:pt-32 print:bg-white print:pt-4 print:pb-4">
      {/* Background celestial ambient light */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden print:hidden">
        <div className="absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-[#E9A534]/10 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-[450px] w-[450px] rounded-full bg-[#B8380D]/8 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ==============================================================
            HERO / MAIN FORM SECTION (MATCHES SCREENSHOT PIXEL-PERFECTLY)
        ============================================================== */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12 print:hidden">
          {/* LEFT SIDE: HEADING & COPY */}
          <div className="pt-2 lg:col-span-5 lg:pt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B8380D]/20 bg-[#B8380D]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#B8380D]">
              <Flame size={13} />
              Vedic Kundali Analysis Engine
            </div>

            <h1 className="mt-5 font-serif text-3xl sm:text-4xl md:text-[46px] font-bold leading-[1.18] tracking-tight text-[#2C1210]">
              Pitra Dosha Checker in Your Kundali
            </h1>

            <p className="mt-5 font-sans text-base sm:text-lg leading-relaxed text-[#564540]">
              Identify ancestral karmic debts and planetary alignments with precision.
              Get highly personalized Vedic insights into the Sun, Saturn, Rahu, and Ketu
              placements in your birth chart.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 space-y-3.5 border-t border-[#2C1210]/10 pt-6 font-sans text-sm text-[#44302C]">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-[#7EA326]" />
                <span>Lahiri Sidereal Ayanamsha &amp; Exact Planetary Longitudes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-[#7EA326]" />
                <span>9th House (Pitru Bhava) &amp; Karaka Surya Affliction Checks</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-[#7EA326]" />
                <span>Jupiter Aspect (Guru Drishti) &amp; Bhanga Cancellation Factors</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-[#7EA326]" />
                <span>Authentic Classical Vedic Remedies &amp; Tarpan Guidance</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE FORM CARD */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] border border-black/5 bg-white p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              <form onSubmit={handleCalculate} className="space-y-5">
                {/* Error Banner */}
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 border border-red-200">
                    <AlertTriangle size={16} className="shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* 1. FULL NAME */}
                <div>
                  <label className="block font-sans text-[11.5px] font-bold uppercase tracking-wider text-[#4A3B37] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-sans text-sm text-[#2C1210] placeholder-gray-400 outline-none transition-all focus:border-[#B8380D] focus:ring-2 focus:ring-[#B8380D]/15"
                  />
                </div>

                {/* 2. DATE OF BIRTH + TIME OF BIRTH (2-COL ON DESKTOP) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* DATE OF BIRTH */}
                  <div>
                    <label className="block font-sans text-[11.5px] font-bold uppercase tracking-wider text-[#4A3B37] mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={dateOfBirth}
                        max={new Date().toISOString().split("T")[0]}
                        min="1920-01-01"
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-sans text-sm text-[#2C1210] outline-none transition-all focus:border-[#B8380D] focus:ring-2 focus:ring-[#B8380D]/15"
                      />
                    </div>
                  </div>

                  {/* TIME OF BIRTH */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-sans text-[11.5px] font-bold uppercase tracking-wider text-[#4A3B37]">
                        Time of Birth
                      </label>
                      <button
                        type="button"
                        onClick={handleToggleNoonTime}
                        className={`text-[10px] font-semibold transition-colors ${
                          isNoonTime
                            ? "text-[#B8380D] font-bold"
                            : "text-gray-500 hover:text-[#B8380D]"
                        }`}
                      >
                        {isNoonTime ? "✓ Using 12:00 PM (Noon)" : "Don't know exact time?"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 focus-within:border-[#B8380D] focus-within:ring-2 focus-within:ring-[#B8380D]/15">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="HH"
                        value={timeHours}
                        onChange={handleHoursChange}
                        onBlur={handleHoursBlur}
                        className="w-12 text-center font-sans text-sm font-semibold text-[#2C1210] outline-none"
                      />
                      <span className="text-gray-400 font-bold">:</span>
                      <input
                        ref={minutesInputRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="MM"
                        value={timeMinutes}
                        onChange={handleMinutesChange}
                        onBlur={handleMinutesBlur}
                        className="w-12 text-center font-sans text-sm font-semibold text-[#2C1210] outline-none"
                      />

                      {/* AM / PM TOGGLE PILL */}
                      <div className="ml-auto flex items-center rounded-lg bg-gray-100 p-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTimePeriod("AM");
                            setIsNoonTime(false);
                          }}
                          className={`rounded-md px-2.5 py-1 font-sans text-xs font-bold transition-all ${
                            timePeriod === "AM"
                              ? "bg-[#D88A36]/30 text-[#8A4B00] shadow-sm"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTimePeriod("PM");
                            setIsNoonTime(false);
                          }}
                          className={`rounded-md px-2.5 py-1 font-sans text-xs font-bold transition-all ${
                            timePeriod === "PM"
                              ? "bg-[#D88A36]/30 text-[#8A4B00] shadow-sm"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. PLACE OF BIRTH */}
                <div className="relative" ref={placeDropdownRef}>
                  <label className="block font-sans text-[11.5px] font-bold uppercase tracking-wider text-[#4A3B37] mb-2">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    required
                    value={birthPlace}
                    onChange={handlePlaceChange}
                    onFocus={() => {
                      if (birthPlace.trim().length > 1) setShowSuggestions(true);
                    }}
                    placeholder="City, State, Country (e.g. Noida, Uttar Pradesh)"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-sans text-sm text-[#2C1210] placeholder-gray-400 outline-none transition-all focus:border-[#B8380D] focus:ring-2 focus:ring-[#B8380D]/15"
                  />

                  {/* City Autocomplete dropdown */}
                  {showSuggestions && placeSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                      {placeSuggestions.map((city) => (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => handleSelectCity(city)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-sans text-xs text-[#2C1210] hover:bg-[#F4F6F0] transition-colors"
                        >
                          <MapPin size={13} className="text-[#B8380D] shrink-0" />
                          <span>{city.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. WHATSAPP NUMBER (WITH INTERACTIVE COUNTRY CODE SELECTOR) */}
                <div>
                  <label className="block font-sans text-[11.5px] font-bold uppercase tracking-wider text-[#4A3B37] mb-2">
                    WhatsApp Number
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1.5 focus-within:border-[#B8380D] focus-within:ring-2 focus-within:ring-[#B8380D]/15 relative">
                    {/* Interactive Country Code Dropdown */}
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-1.5 border-r border-gray-200 pr-3 mr-3 text-xs font-semibold text-gray-700 hover:text-black focus:outline-none transition-colors cursor-pointer"
                        title="Change Country Code"
                      >
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span>
                          {selectedCountry.short} {selectedCountry.code}
                        </span>
                        <ChevronDown
                          size={12}
                          className={`text-gray-400 transition-transform ${
                            showCountryDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-2 z-30 w-56 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-2xl">
                          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Select Country
                          </div>
                          {COUNTRY_LIST.map((item) => (
                            <button
                              key={`${item.country}-${item.code}`}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(item);
                                setShowCountryDropdown(false);
                              }}
                              className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                                selectedCountry.country === item.country
                                  ? "bg-[#B8380D]/10 font-bold text-[#B8380D]"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{item.flag}</span>
                                <span>{item.country}</span>
                              </span>
                              <span className="text-gray-500 font-mono text-[11px]">
                                {item.code}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Enter your WhatsApp number (e.g. 98765 43210)"
                      className="w-full font-sans text-sm text-[#2C1210] placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                {/* 5. CALCULATE BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#C13B0E] py-4 font-sans text-base font-bold text-white shadow-lg shadow-[#C13B0E]/30 transition-all duration-300 hover:bg-[#A9330B] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Calculating Kundali Planetary Alignment...
                    </span>
                  ) : (
                    "Calculate Pitra Dosha"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ==============================================================
            CALCULATION RESULTS (REVEALED WHEN RESULT IS READY)
        ============================================================== */}
        <div ref={resultsRef}>
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-16 space-y-8"
              >
                {/* RESULT HEADER CARD */}
                <div className="relative overflow-hidden rounded-[28px] border border-[#2C1210]/10 bg-gradient-to-br from-[#1C0508] via-[#2A080D] to-[#3C080D] p-7 sm:p-10 text-[#FFF8EC] shadow-2xl">
                  <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#E9A534]/10 blur-3xl pointer-events-none" />

                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#E9A534]">
                        Vedic Horoscope Analysis
                      </span>
                      <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
                        {result.meta.fullName}'s Pitra Dosha Report
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#FFF8EC]/70">
                        Birth: {result.meta.dateOfBirth} at {result.meta.timeOfBirth}{" "}
                        {result.meta.timePeriod} · {result.meta.birthPlace}
                      </p>
                    </div>

                    {/* TOP ACTIONS: PRINT, SHARE, RESET */}
                    <div className="flex flex-wrap items-center gap-2 print:hidden">
                      <button
                        type="button"
                        onClick={handleShareWhatsApp}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/15"
                        title="Share on WhatsApp"
                      >
                        <Share2 size={13} />
                        Share
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/15"
                        title="Print or Save PDF"
                      >
                        <Printer size={13} />
                        Print Report
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/15"
                      >
                        <RotateCcw size={13} />
                        Check Another
                      </button>
                    </div>
                  </div>

                  {/* DOSHA STATUS BADGE & SCORE */}
                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
                    <div className="md:col-span-7">
                      <div
                        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md"
                        style={{ backgroundColor: result.scores.badgeColor }}
                      >
                        <Flame size={15} />
                        {result.scores.statusText}
                      </div>

                      <h3 className="mt-4 font-serif text-xl sm:text-2xl font-semibold text-[#FDECC8]">
                        Severity: {result.scores.severity}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-[#FFF8EC]/80">
                        {result.summary}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-4 text-xs">
                        <div className="rounded-xl bg-white/5 px-3.5 py-2 border border-white/10">
                          <span className="text-[#E9A534] font-semibold block">
                            Lagna (Ascendant)
                          </span>
                          <span className="text-white font-medium">
                            {result.ascendant.sign} ({result.ascendant.sanskritSign})
                          </span>
                        </div>
                        <div className="rounded-xl bg-white/5 px-3.5 py-2 border border-white/10">
                          <span className="text-[#E9A534] font-semibold block">
                            9th House (Pitru Bhava)
                          </span>
                          <span className="text-white font-medium">
                            {result.ninthHouse.sign} (Lord: {result.ninthHouse.ruler})
                          </span>
                        </div>
                        <div className="rounded-xl bg-white/5 px-3.5 py-2 border border-white/10">
                          <span className="text-[#E9A534] font-semibold block">
                            Sun (Surya - Atma)
                          </span>
                          <span className="text-white font-medium">
                            {result.planets.Sun.sign} in {result.planets.Sun.house}th House
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SCORE METER COLUMN */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center md:col-span-5">
                      <span className="text-xs uppercase tracking-wider text-white/60">
                        Karmic Alignment Intensity
                      </span>
                      <div className="my-3 font-serif text-4xl sm:text-5xl font-extrabold text-[#E9C76D]">
                        {result.scores.netScore}
                        <span className="text-lg font-normal text-white/50"> / 10</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-white/75 border-t border-white/10 pt-3 text-left">
                        <div className="flex justify-between">
                          <span>Raw Dosha Points:</span>
                          <span className="font-semibold text-red-300">
                            +{result.scores.rawDoshaPoints}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mitigation (Bhanga Points):</span>
                          <span className="font-semibold text-green-300">
                            -{result.scores.mitigationPoints}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2-COLUMN SECTION: TRIGGERED RULES & MITIGATIONS */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* TRIGGERED DOSHA RULES */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 sm:p-7 shadow-sm">
                    <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C1210]">
                      <AlertTriangle size={18} className="text-[#B8380D]" />
                      Identified Astrological Factors
                    </h3>
                    <p className="mt-1 text-xs text-[#564540]">
                      Classical Parashari combinations that contribute to ancestral karmic debt.
                    </p>

                    <div className="mt-4 space-y-3">
                      {result.triggeredRules.length === 0 ? (
                        <div className="rounded-xl bg-green-50 p-4 text-xs sm:text-sm text-green-800 border border-green-200">
                          ✦ No malefic yogas formed on the Sun, 9th house, or ancestors in this chart!
                        </div>
                      ) : (
                        result.triggeredRules.map((rule, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-[#B8380D]/15 bg-[#B8380D]/[0.03] p-4"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-sans text-sm font-bold text-[#2C1210]">
                                {rule.title}
                              </h4>
                              <span className="rounded-full bg-[#B8380D]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#B8380D]">
                                {rule.intensity}
                              </span>
                            </div>
                            <p className="mt-1.5 text-xs text-[#564540] leading-relaxed">
                              {rule.description}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* MITIGATION & CANCELLATION (BHANGA FACTORS) */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 sm:p-7 shadow-sm">
                    <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C1210]">
                      <ShieldCheck size={18} className="text-[#2E7D32]" />
                      Mitigating &amp; Protective Blessings (Bhanga)
                    </h3>
                    <p className="mt-1 text-xs text-[#564540]">
                      Benefic planetary safeguards neutralizing or shielding the native.
                    </p>

                    <div className="mt-4 space-y-3">
                      {result.mitigations.length === 0 ? (
                        <div className="rounded-xl bg-amber-50 p-4 text-xs sm:text-sm text-amber-800 border border-amber-200">
                          ✦ Minimal planetary neutralization observed; proactive remedial rituals are advised.
                        </div>
                      ) : (
                        result.mitigations.map((mit, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-green-200 bg-green-50/60 p-4"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-sans text-sm font-bold text-green-900">
                                {mit.title}
                              </h4>
                              <span className="rounded-full bg-green-200/80 px-2 py-0.5 text-[10px] font-bold text-green-800">
                                Protective Shield
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-green-800 font-medium">
                              {mit.benefit}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* VEDIC KUNDALI DIAMOND CHART (NORTH INDIAN STYLE) */}
                <VedicKundaliChart ascendant={result.ascendant} planets={result.planets} />

                {/* PLANETARY LONGITUDES & KUNDALI TABLE */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#2C1210]">
                    Vedic Planetary Placements (Nirayana / Lahiri)
                  </h3>
                  <p className="mt-1 text-xs text-[#564540]">
                    Precise astronomical longitudes and whole sign house mappings used for this calculation.
                  </p>

                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/80 text-[#564540]">
                          <th className="px-4 py-3 font-bold">Planet</th>
                          <th className="px-4 py-3 font-bold">Sign (Rashi)</th>
                          <th className="px-4 py-3 font-bold">House (Bhava)</th>
                          <th className="px-4 py-3 font-bold">Degree</th>
                          <th className="px-4 py-3 font-bold">Nakshatra</th>
                          <th className="px-4 py-3 font-bold">Dignity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#2C1210]">
                        {Object.entries(result.planets).map(([pName, pInfo]) => (
                          <tr
                            key={pName}
                            className={
                              pName === "Sun" || pInfo.house === 9
                                ? "bg-[#B8380D]/[0.04] font-semibold"
                                : ""
                            }
                          >
                            <td className="px-4 py-3 font-bold flex items-center gap-1.5">
                              {pName === "Sun" && <Sun size={14} className="text-[#C13B0E]" />}
                              {pName}
                            </td>
                            <td className="px-4 py-3">
                              {pInfo.sign} ({pInfo.sanskritSign})
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-md px-2 py-0.5 ${
                                  pInfo.house === 9
                                    ? "bg-[#B8380D] text-white font-bold"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                House {pInfo.house}
                              </span>
                            </td>
                            <td className="px-4 py-3">{pInfo.degree}°</td>
                            <td className="px-4 py-3">{pInfo.nakshatra}</td>
                            <td className="px-4 py-3">
                              <span
                                className={
                                  pInfo.dignity.includes("Exalted")
                                    ? "text-green-600 font-bold"
                                    : pInfo.dignity.includes("Debilitated")
                                    ? "text-red-600 font-bold"
                                    : "text-gray-600"
                                }
                              >
                                {pInfo.dignity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* LIFE IMPACT & SYMPTOMS */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#2C1210]">
                    Life Areas Influenced by this Kundali Configuration
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {result.lifeImpacts.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                      >
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#B8380D]">
                          {item.area}
                        </span>
                        <p className="mt-2 text-xs leading-relaxed text-[#564540]">
                          {item.effect}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TRADITIONAL VEDIC REMEDIES */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-[#B8380D]" />
                    <h3 className="font-serif text-xl font-bold text-[#2C1210]">
                      Prescribed Traditional Vedic Remedies (Nivaran)
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-[#564540]">
                    Time-tested spiritual and charitable remedies to bring peace to departed souls and liberate family lineage.
                  </p>

                  <div className="mt-6 space-y-4">
                    {result.remedies.map((rem, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border border-amber-200/80 bg-[#FFFDF9] p-4 sm:p-5"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B8380D]/10 font-bold text-xs text-[#B8380D]">
                          0{idx + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-sans text-sm font-bold text-[#2C1210]">
                              {rem.title}
                            </h4>
                            <span className="rounded-md bg-[#E9A534]/20 px-2 py-0.5 text-[10px] font-bold text-[#7D5300] uppercase tracking-wider">
                              {rem.type}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#564540]">
                            {rem.instruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA CONSULTATION BOX WITH PRE-FILLED KUNDALI */}
                <div className="rounded-[24px] border border-[#E9A534]/30 bg-gradient-to-r from-[#3C080D] via-[#5A0E14] to-[#76151D] p-7 sm:p-10 text-[#FFF8EC] shadow-xl text-center sm:text-left print:hidden">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#E9C76D]">
                        Need Personal Pitra Dosh Shanti &amp; Kundali Reading?
                      </span>
                      <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-white">
                        Consult Lead Astrologer Nidhi Asthana
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#FFF8EC]/80 max-w-xl leading-relaxed">
                        Share this Kundali chart directly for detailed root-cause verification, personalized Tarpan muhurat, and dedicated Pitra Dosh Nivaran guidance.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                      <a
                        href={getWhatsAppConsultUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#1EBE5D] hover:scale-105"
                      >
                        <MessageCircle size={16} />
                        WhatsApp Consultation
                      </a>

                      <a
                        href="tel:9560437360"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20"
                      >
                        <Phone size={15} />
                        Call: 95604 37360
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
