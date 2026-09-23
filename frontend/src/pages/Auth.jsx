import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Compass,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Star,
  Moon,
  Shield,
  Heart,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Gem,
  KeyRound,
  RotateCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";

/* Zodiac chakra backdrop */
import heroZodiac from "../assets/hero-zodiac3.png";

import { API_URL } from "../config/api";

/* ================================================================
   HIGHLIGHTS
================================================================ */

const HIGHLIGHTS = [
  { icon: Shield, title: "100% Confidential", desc: "Your data is safe with us" },
  { icon: Star, title: "Expert Astrologers", desc: "10+ years of experience" },
  { icon: Heart, title: "4,200+ Happy Clients", desc: "Trusted by many" },
];

/* ================================================================
   PAGE
================================================================ */

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    placeOfBirth: "",
    timeOfBirth: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  /* OTP Verification State */
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");

  // OTP Countdown timer
  useEffect(() => {
    let interval;
    if (isVerifyingOTP && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVerifyingOTP, otpTimer]);

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "name") {
      val = val.replace(/[^a-zA-Z\s]/g, "");
    } else if (e.target.name === "phone") {
      val = val.replace(/\D/g, "").slice(0, 10);
    }
    setFormData({ ...formData, [e.target.name]: val });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin) {
      const cleanName = String(formData.name || "").trim();
      if (!cleanName) newErrors.name = "Full name is required";
      else if (!/^[a-zA-Z\s]{2,50}$/.test(cleanName))
        newErrors.name = "Full name must contain only alphabets (minimum 2 letters)";
      if (formData.phone && !/^\d{10}$/.test(String(formData.phone).trim()))
        newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!isLogin && !agreeTerms) newErrors.agreeTerms = "Please agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      let endpoint, payload;

      if (isLogin) {
        endpoint = `${API_URL}/auth/login`;
        payload = { email: formData.email, password: formData.password };
      } else {
        endpoint = `${API_URL}/auth/register`;
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          timeOfBirth: formData.timeOfBirth || undefined,
          placeOfBirth: formData.placeOfBirth || undefined,
        };
      }

      const response = await axios.post(endpoint, payload);

      // Check if email OTP verification is required
      if (response.data.requiresVerification) {
        setIsVerifyingOTP(true);
        setOtpEmail(response.data.email || formData.email);
        setOtpTimer(60);
        setOtpCode("");
        setApiError("");
        setOtpSuccessMessage(
          response.data.message || "A 6-digit verification code has been sent to your email."
        );
        return;
      }

      if (response.data.success) {
        /* =====================================================
           Persist auth
        ===================================================== */
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const authUserId = response.data.user?.id || response.data.user?._id;

        if (!isLogin) {
          if (authUserId) {
            localStorage.setItem(`cart_user_${authUserId}`, JSON.stringify([]));
          }
          localStorage.removeItem("cart_guest");
          localStorage.removeItem("cartItems");
          window.dispatchEvent(new CustomEvent("auth-state-changed", {
            detail: { action: "register", user: response.data.user }
          }));
        } else {
          localStorage.removeItem("cart_guest");
          localStorage.removeItem("cartItems");
          window.dispatchEvent(new CustomEvent("auth-state-changed", {
            detail: { action: "login", user: response.data.user }
          }));
        }

        const role = response.data.user?.role || "user";
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error) {
      if (error.response?.data?.requiresVerification) {
        setIsVerifyingOTP(true);
        setOtpEmail(error.response.data.email || formData.email);
        setOtpTimer(60);
        setOtpCode("");
        setApiError("");
        setOtpSuccessMessage(error.response.data.message);
        return;
      }

      setApiError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setApiError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setApiError("");
    setOtpSuccessMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: otpEmail,
        otp: otpCode.trim(),
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const authUserId = response.data.user?.id || response.data.user?._id;
        if (authUserId) {
          localStorage.setItem(`cart_user_${authUserId}`, JSON.stringify([]));
        }
        localStorage.removeItem("cart_guest");
        localStorage.removeItem("cartItems");
        window.dispatchEvent(new CustomEvent("auth-state-changed", {
          detail: { action: "register", user: response.data.user }
        }));

        const role = response.data.user?.role || "user";
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Invalid verification code. Please check your email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0 || isResending) return;
    setIsResending(true);
    setApiError("");
    setOtpSuccessMessage("");

    try {
      const res = await axios.post(`${API_URL}/auth/resend-otp`, { email: otpEmail });
      setOtpSuccessMessage(res.data.message || "A new code has been sent!");
      setOtpTimer(60);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#FFF7E9] pb-6 pt-[74px] lg:pt-[78px]">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#C1272D]/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

      {/* ROTATING ZODIAC CHAKRA — right side */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute top-1/2 -translate-y-1/2
          hidden
          h-[680px] w-[680px]
          right-[-300px]
          opacity-[0.07]
          mix-blend-multiply
          lg:block
          xl:right-[-260px] xl:h-[760px] xl:w-[760px] xl:opacity-[0.08]
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
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[8%] top-[18%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/50 shadow-[0_0_10px_rgba(233,165,52,0.5)]" />
        <span className="absolute right-[12%] top-[24%] h-[2px] w-[2px] rounded-full bg-[#E9A534]/40" />
        <span className="absolute left-[18%] bottom-[22%] h-[2px] w-[2px] rounded-full bg-[#C1272D]/40" />
        <span className="absolute right-[22%] bottom-[16%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">

          {/* LEFT — Brand / Trust card */}
          <Reveal className="hidden lg:block">
            <div className="relative overflow-hidden rounded-[9px] border border-[#5A0E14]/12 bg-gradient-to-br from-[#3C080D] via-[#5A0E14] to-[#2A0509] p-8 shadow-[0_20px_60px_rgba(60,8,13,0.20)]">
              <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent" />

              <div className="pointer-events-none absolute -top-20 -right-16 h-[280px] w-[280px] rounded-full bg-[#650F18]/40 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-[240px] w-[240px] rounded-full bg-[#E9A534]/[0.08] blur-[100px]" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.12] text-[#E9C76D]">
                    <Compass className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <div>
                    <h2 className="font-display text-[21px] font-semibold text-[#FFF8EC]">
                      Cosmic Nidhi
                    </h2>
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#E9C76D]/70">
                      Your Destiny, Written in Stars
                    </p>
                  </div>
                </div>

                <h3 className="mt-8 font-display text-[30px] font-bold leading-[1.2] text-[#FFF8EC]">
                  Welcome to the{" "}
                  <span className="bg-gradient-to-r from-[#FFD57E] via-[#E9A534] to-[#F59E0B] bg-clip-text text-transparent">
                    Cosmic Family
                  </span>
                </h3>

                <p className="mt-3 font-sans text-[13px] leading-[1.7] text-[#F5E5C7]/80">
                  {isVerifyingOTP
                    ? "Verify your email address to secure your account and access your astrology consultations."
                    : isLogin
                    ? "Sign in to access your personalised dashboard, reading history, and consultation details."
                    : "Create your account to unlock personalised astrology readings and connect with our experts."}
                </p>

                <div className="mt-6 space-y-3.5">
                  {HIGHLIGHTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                          <Icon className="h-4 w-4" strokeWidth={1.7} />
                        </div>
                        <div>
                          <p className="font-sans text-[13px] font-semibold text-[#FFF8EC]">
                            {item.title}
                          </p>
                          <p className="font-sans text-[11px] text-[#FDECC8]/60">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-[#E9A534]/15 pt-5">
                  <span className="h-px w-6 bg-[#E9A534]/50" />
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#E9C76D]/70">
                    Trusted by Thousands
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Form (Auth or OTP) */}
          <Reveal delay={120}>
            <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-[0_20px_60px_rgba(60,8,13,0.08)] lg:mx-0">

              {/* Header strip */}
              <div className="relative border-b border-[#5A0E14]/12 bg-[#FDECC8]/30 px-6 py-4 sm:px-8">
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/50 to-transparent" />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.12] text-[#8A5A1F]">
                      {isVerifyingOTP ? (
                        <KeyRound className="h-4 w-4" strokeWidth={1.7} />
                      ) : (
                        <Moon className="h-4 w-4" strokeWidth={1.7} />
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
                        {isVerifyingOTP ? "Security Check" : isLogin ? "Sign In" : "Register"}
                      </p>
                      <p className="mt-0.5 font-display text-[17px] font-semibold text-[#3C080D]">
                        {isVerifyingOTP ? "Verify Your Email" : isLogin ? "Welcome Back" : "Create Account"}
                      </p>
                    </div>
                  </div>

                  <Gem className="hidden h-5 w-5 text-[#C89846]/40 sm:block" strokeWidth={1.5} />
                </div>
              </div>

              <div className="p-6 sm:p-7">
                {/* Success Message */}
                {otpSuccessMessage && (
                  <div className="mb-4 flex items-start gap-3 rounded-[7px] border border-[#25D366]/40 bg-[#25D366]/[0.08] p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#128C7E]" strokeWidth={1.8} />
                    <p className="font-sans text-[12px] text-[#0A5A35]">
                      {otpSuccessMessage}
                    </p>
                  </div>
                )}

                {/* API Error */}
                {apiError && (
                  <div className="mb-4 flex items-start gap-3 rounded-[7px] border border-[#C1272D]/30 bg-[#C1272D]/[0.06] p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C1272D]" strokeWidth={1.7} />
                    <p className="font-sans text-[12px] text-[#8B2F2B]">
                      {apiError}
                    </p>
                  </div>
                )}

                {/* ========================================================
                    VIEW 1: OTP VERIFICATION SCREEN
                ======================================================== */}
                {isVerifyingOTP ? (
                  <form onSubmit={handleVerifyOTP} className="space-y-5">
                    <div className="rounded-lg bg-[#FDECC8]/30 border border-[#E9A534]/30 p-4 text-center">
                      <p className="font-sans text-[12px] text-[#5A0E14]/80">
                        We sent a 6-digit verification code to:
                      </p>
                      <p className="mt-1 font-sans text-[14px] font-bold text-[#3C080D]">
                        {otpEmail}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-center font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#5A0E14]/75">
                        Enter 6-Digit Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          autoFocus
                          placeholder="••••••"
                          value={otpCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setOtpCode(val);
                            if (apiError) setApiError("");
                          }}
                          className="w-full rounded-[8px] border-2 border-[#E9A534]/50 bg-[#FFFDF9] py-3 text-center font-mono text-[26px] font-bold tracking-[14px] text-[#3C080D] shadow-sm transition-all focus:border-[#E9A534] focus:outline-none focus:ring-2 focus:ring-[#E9A534]/25"
                        />
                      </div>
                    </div>

                    {/* Verify Button */}
                    <button
                      type="submit"
                      disabled={isLoading || otpCode.length !== 6}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[7px] bg-gradient-to-r from-[#E9A534] via-[#F0B348] to-[#E9A534] py-3 font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#3C080D] shadow-[0_10px_30px_rgba(233,165,52,0.30)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(233,165,52,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3C080D] border-t-transparent" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <>
                          <span>Verify & Activate Account</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                        </>
                      )}
                    </button>

                    {/* Resend & Back */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#5A0E14]/10 pt-4 text-[12px]">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={otpTimer > 0 || isResending}
                        className="font-medium text-[#8A5A1F] hover:text-[#5A0E14] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <RotateCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                        {otpTimer > 0 ? (
                          <span>Resend code in <strong className="text-[#3C080D]">{otpTimer}s</strong></span>
                        ) : (
                          <span className="underline font-semibold">Resend Code</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsVerifyingOTP(false);
                          setApiError("");
                          setOtpSuccessMessage("");
                        }}
                        className="text-[#5A0E14]/70 hover:text-[#3C080D] hover:underline transition-colors"
                      >
                        Change Email / Back
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ========================================================
                      VIEW 2: REGULAR SIGN IN / REGISTER FORM
                  ======================================================== */
                  <>
                    {/* Toggle */}
                    <div className="mb-5 flex rounded-full border border-[#5A0E14]/10 bg-[#FDECC8]/40 p-1">
                      <button
                        type="button"
                        onClick={() => { setIsLogin(true); setApiError(""); setOtpSuccessMessage(""); }}
                        className={`flex-1 rounded-full py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                          isLogin
                            ? "bg-[#5A0E14] text-[#FFF8EC] shadow-[0_8px_20px_rgba(90,14,20,0.20)]"
                            : "text-[#5A0E14]/65 hover:text-[#3C080D]"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsLogin(false); setApiError(""); setOtpSuccessMessage(""); }}
                        className={`flex-1 rounded-full py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                          !isLogin
                            ? "bg-[#5A0E14] text-[#FFF8EC] shadow-[0_8px_20px_rgba(90,14,20,0.20)]"
                            : "text-[#5A0E14]/65 hover:text-[#3C080D]"
                        }`}
                      >
                        Register
                      </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      {/* Name (register only) */}
                      <AnimatePresence initial={false}>
                        {!isLogin && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <Field
                              icon={User}
                              name="name"
                              type="text"
                              placeholder="Full Name"
                              value={formData.name}
                              onChange={handleChange}
                              error={errors.name}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Email */}
                      <Field
                        icon={Mail}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />

                      {/* Password */}
                      <Field
                        icon={Lock}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min. 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        trailing={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#5A0E14]/50 hover:text-[#5A0E14] focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />

                      {/* Confirm Password (register only) */}
                      <AnimatePresence initial={false}>
                        {!isLogin && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-3.5"
                          >
                            <Field
                              icon={Lock}
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              error={errors.confirmPassword}
                              trailing={
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="text-[#5A0E14]/50 hover:text-[#5A0E14] focus:outline-none"
                                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              }
                            />

                            {/* ASTRO DETAILS (Optional) */}
                            <div className="border-t border-[#5A0E14]/10 pt-3">
                              <p className="mb-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F]">
                                Astrology Profile (Optional)
                              </p>

                              <div className="space-y-2.5">
                                <Field
                                  icon={Phone}
                                  name="phone"
                                  type="tel"
                                  placeholder="Phone (optional)"
                                  value={formData.phone}
                                  onChange={handleChange}
                                />

                                <div className="grid grid-cols-2 gap-2.5">
                                  <Field
                                    icon={Calendar}
                                    name="dateOfBirth"
                                    type="date"
                                    placeholder="Date of Birth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                  />
                                  <Field
                                    icon={Clock}
                                    name="timeOfBirth"
                                    type="time"
                                    placeholder="Time of Birth"
                                    value={formData.timeOfBirth}
                                    onChange={handleChange}
                                  />
                                </div>

                                <Field
                                  icon={MapPin}
                                  name="placeOfBirth"
                                  type="text"
                                  placeholder="Place of Birth (City, Country)"
                                  value={formData.placeOfBirth}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            {/* Terms checkbox */}
                            <div>
                              <label className="flex items-start gap-2.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={agreeTerms}
                                  onChange={(e) => {
                                    setAgreeTerms(e.target.checked);
                                    if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: "" });
                                  }}
                                  className="mt-0.5 h-3.5 w-3.5 rounded border-[#5A0E14]/30 text-[#E9A534] focus:ring-[#E9A534]/40"
                                />
                                <span className="font-sans text-[11.5px] leading-snug text-[#5A0E14]/75">
                                  I agree to the{" "}
                                  <a href="/page/terms" className="text-[#8A5A1F] underline hover:text-[#5A0E14]">
                                    Terms
                                  </a>{" "}
                                  and{" "}
                                  <a href="/page/privacy-policy" className="text-[#8A5A1F] underline hover:text-[#5A0E14]">
                                    Privacy Policy
                                  </a>
                                </span>
                              </label>
                              {errors.agreeTerms && (
                                <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.agreeTerms}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Remember me / Forgot password (login only) */}
                      {isLogin && (
                        <div className="flex items-center justify-between text-[12px]">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="h-3.5 w-3.5 rounded border-[#5A0E14]/30 text-[#E9A534] focus:ring-[#E9A534]/40"
                            />
                            <span className="font-sans text-[#5A0E14]/70">Remember me</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setApiError("Password reset instructions will be sent to your email.")}
                            className="font-sans text-[11px] font-semibold text-[#8A5A1F] hover:text-[#5A0E14] hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[7px] bg-gradient-to-r from-[#E9A534] via-[#F0B348] to-[#E9A534] py-3 font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#3C080D] shadow-[0_10px_30px_rgba(233,165,52,0.30)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(233,165,52,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3C080D] border-t-transparent" />
                            <span>{isLogin ? "Signing in..." : "Sending Verification Code..."}</span>
                          </div>
                        ) : (
                          <>
                            <span>{isLogin ? "Sign In" : "Register & Verify Email"}</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                          </>
                        )}
                      </button>

                      {/* Alternate switch */}
                      <p className="pt-2 text-center font-sans text-[12px] text-[#5A0E14]/65">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(!isLogin);
                            setErrors({});
                            setApiError("");
                            setOtpSuccessMessage("");
                          }}
                          className="font-bold text-[#8A5A1F] hover:text-[#5A0E14] hover:underline"
                        >
                          {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CHAKRA ANIMATION */}
      <style>{`
        @keyframes zodiacRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes zodiacRotate { from, to { transform: none; } }
        }
      `}</style>
    </section>
  );
}

/* ================================================================
   FIELD
================================================================ */

function Field({ icon: Icon, name, type, placeholder, value, onChange, error, trailing }) {
  return (
    <div>
      <div
        className={`
          relative flex items-center rounded-[7px]
          border bg-[#FFFDF9]
          transition-all duration-300
          ${
            error
              ? "border-[#C1272D]/60 focus-within:border-[#C1272D] focus-within:ring-2 focus-within:ring-[#C1272D]/15"
              : "border-[#5A0E14]/15 focus-within:border-[#E9A534]/60 focus-within:ring-2 focus-within:ring-[#E9A534]/15"
          }
        `}
      >
        <Icon className="pointer-events-none ml-3.5 h-4 w-4 shrink-0 text-[#5A0E14]/45" strokeWidth={1.7} />

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent px-3 py-3 font-sans text-[13.5px] text-[#2C1210] placeholder:text-[#5A0E14]/40 focus:outline-none"
        />

        {trailing && <div className="mr-3.5 shrink-0">{trailing}</div>}
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
          <AlertCircle className="h-3 w-3" strokeWidth={1.7} />
          {error}
        </p>
      )}
    </div>
  );
}