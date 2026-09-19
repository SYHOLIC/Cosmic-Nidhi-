import { useState } from "react";
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
  Star,
  Moon,
  Shield,
  Heart,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Gem,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name) newErrors.name = "Full name is required";
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

      if (response.data.success) {
        /* =====================================================
           Persist auth
        ===================================================== */
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const authUserId = response.data.user?.id || response.data.user?._id;

        if (!isLogin) {
          // Registration of a brand new user: guarantee completely fresh empty cart
          if (authUserId) {
            localStorage.setItem(`cart_user_${authUserId}`, JSON.stringify([]));
          }
          localStorage.removeItem("cart_guest");
          localStorage.removeItem("cartItems");
          window.dispatchEvent(new CustomEvent("auth-state-changed", {
            detail: { action: "register", user: response.data.user }
          }));
        } else {
          // Login: restore this user's saved cart and clear guest leftovers
          localStorage.removeItem("cart_guest");
          localStorage.removeItem("cartItems");
          window.dispatchEvent(new CustomEvent("auth-state-changed", {
            detail: { action: "login", user: response.data.user }
          }));
        }

        /* =====================================================
           ROLE-BASED REDIRECT
        ===================================================== */
        const role = response.data.user?.role || "user";

        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setApiError("");
    setFormData({ ...formData, name: "", confirmPassword: "" });
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

                <h3 className="mt-6 font-display text-[28px] font-medium leading-[1.15] tracking-[-0.015em] text-[#FFF8EC]">
                  Welcome to the{" "}
                  <span className="text-[#E9B957]">Cosmic Family</span>
                </h3>

                <p className="mt-3 font-sans text-[13px] leading-[1.7] text-[#F5E5C7]/80">
                  {isLogin
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

          {/* RIGHT — Form */}
          <Reveal delay={120}>
            <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-[0_20px_60px_rgba(60,8,13,0.08)] lg:mx-0">

              {/* Header strip */}
              <div className="relative border-b border-[#5A0E14]/12 bg-[#FDECC8]/30 px-6 py-4 sm:px-8">
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/50 to-transparent" />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.12] text-[#8A5A1F]">
                      <Moon className="h-4 w-4" strokeWidth={1.7} />
                    </div>
                    <div>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
                        {isLogin ? "Sign In" : "Register"}
                      </p>
                      <p className="mt-0.5 font-display text-[17px] font-semibold text-[#3C080D]">
                        {isLogin ? "Welcome Back" : "Create Account"}
                      </p>
                    </div>
                  </div>

                  <Gem className="hidden h-5 w-5 text-[#C89846]/40 sm:block" strokeWidth={1.5} />
                </div>
              </div>

              <div className="p-6 sm:p-7">
                {/* API error */}
                {apiError && (
                  <div className="mb-4 flex items-start gap-3 rounded-[7px] border border-[#C1272D]/30 bg-[#C1272D]/[0.06] p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C1272D]" strokeWidth={1.7} />
                    <p className="font-sans text-[12px] text-[#8B2F2B]">
                      {apiError}
                    </p>
                  </div>
                )}

                {/* Toggle */}
                <div className="mb-5 flex rounded-full border border-[#5A0E14]/10 bg-[#FDECC8]/40 p-1">
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setApiError(""); }}
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
                    onClick={() => { setIsLogin(false); setApiError(""); }}
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
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-[#5A0E14]/45 transition-colors hover:text-[#5A0E14]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" strokeWidth={1.7} />
                        ) : (
                          <Eye className="h-4 w-4" strokeWidth={1.7} />
                        )}
                      </button>
                    }
                  />

                  {/* Confirm password (register only) */}
                  <AnimatePresence initial={false}>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
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
                              onClick={() => setShowConfirmPassword((v) => !v)}
                              className="text-[#5A0E14]/45 transition-colors hover:text-[#5A0E14]"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" strokeWidth={1.7} />
                              ) : (
                                <Eye className="h-4 w-4" strokeWidth={1.7} />
                              )}
                            </button>
                          }
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Extra fields (register only) */}
                  <AnimatePresence initial={false}>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3.5"
                      >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Field
                            icon={Phone}
                            name="phone"
                            type="tel"
                            placeholder="Phone (optional)"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          <Field
                            icon={Calendar}
                            name="dateOfBirth"
                            type="date"
                            placeholder="Date of Birth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Field
                            icon={Clock}
                            name="timeOfBirth"
                            type="time"
                            placeholder="Time of Birth"
                            value={formData.timeOfBirth}
                            onChange={handleChange}
                          />
                          <Field
                            icon={MapPin}
                            name="placeOfBirth"
                            type="text"
                            placeholder="Place of Birth (optional)"
                            value={formData.placeOfBirth}
                            onChange={handleChange}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Remember / forgot */}
                  {isLogin && (
                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe((v) => !v)}
                          className="h-4 w-4 rounded border-[#5A0E14]/20 accent-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/20"
                        />
                        <span className="font-sans text-[12px] text-[#5A0E14]/70">
                          Remember me
                        </span>
                      </label>
                      <a
                        href="#forgot"
                        className="font-sans text-[12px] font-semibold text-[#C1272D] transition-colors hover:text-[#8B2F2B]"
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {/* Terms (register only) */}
                  {!isLogin && (
                    <div className="flex items-start gap-3 pt-0.5">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={() => setAgreeTerms((v) => !v)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#5A0E14]/20 accent-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/20"
                      />
                      <label className="cursor-pointer font-sans text-[12px] leading-[1.6] text-[#5A0E14]/70">
                        I agree to the{" "}
                        <a href="#terms" className="font-semibold text-[#C1272D] hover:underline">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a href="#privacy" className="font-semibold text-[#C1272D] hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  )}

                  {errors.agreeTerms && (
                    <p className="flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
                      <AlertCircle className="h-3 w-3" strokeWidth={1.7} />
                      {errors.agreeTerms}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] py-3 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-[0_10px_26px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_34px_rgba(0,0,0,0.22)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#3C080D]/30 border-t-[#3C080D]" />
                        Loading...
                      </>
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                      </>
                    )}
                  </button>

                  {/* Toggle link */}
                  <p className="pt-1 text-center font-sans text-[12.5px] text-[#5A0E14]/65">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-[#C1272D] transition-colors hover:text-[#8B2F2B]"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </form>
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