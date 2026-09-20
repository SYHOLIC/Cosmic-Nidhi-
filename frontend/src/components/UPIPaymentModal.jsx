import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Copy, Check, Smartphone, ShieldCheck, X, ArrowRight, CreditCard } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function UPIPaymentModal({
  isOpen,
  onClose,
  amount,
  orderNumber,
  localOrderId,
  upiId = "8005824565@paytm",
  merchantName = "Cosmic Nidhi",
  onOpenRazorpay,
  onPaymentSuccess,
}) {
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Standard Indian UPI Intent URL
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(`Order ${orderNumber || "Cosmic Nidhi"}`)}&cu=INR`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}&margin=8&color=1A0306`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmUpiPayment = async (e) => {
    e?.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMessage("Please enter the 12-digit UPI UTR / Reference number from your payment app.");
      return;
    }
    setSubmitting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/payment/verify-upi`,
        {
          local_order_id: localOrderId,
          utr_number: utrNumber.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err) {
      console.error("UPI Verification error:", err);
      setErrorMessage(err.response?.data?.message || "Failed to verify UPI payment. Please check the UTR number.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-2xl border border-[#E9A534]/30 bg-gradient-to-b from-[#220207] via-[#160104] to-[#0D0002] p-6 text-[#FFF8EC] shadow-[0_20px_60px_rgba(0,0,0,0.8)] scrollbar-thin scrollbar-thumb-[#E9A534]/20"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full border border-[#E9A534]/20 bg-white/5 p-1.5 text-[#F5E5C7]/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#E9A534]/30 bg-[#E9A534]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#E9C76D]">
              <QrCode size={13} />
              Instant UPI QR Code
            </div>
            <h2 className="font-display text-[22px] font-medium text-white">Scan & Pay</h2>
            <p className="mt-1 font-sans text-[12px] text-[#F5E5C7]/60">
              Scan with any UPI app on your phone
            </p>
          </div>

          {/* Amount Display */}
          <div className="mt-4 rounded-xl border border-[#E9A534]/20 bg-black/30 p-3 text-center">
            <span className="text-[11px] uppercase tracking-wider text-[#F5E5C7]/60">Amount to Pay</span>
            <div className="font-display text-[28px] font-bold text-[#FFD57E]">
              ₹{Number(amount).toLocaleString("en-IN")}
            </div>
            {orderNumber && (
              <span className="text-[10px] text-[#E9C76D]/80">Order Ref: {orderNumber}</span>
            )}
          </div>

          {/* QR Code Canvas Frame */}
          <div className="mt-4 flex flex-col items-center">
            <div className="relative rounded-2xl border-2 border-[#E9A534] bg-white p-3 shadow-[0_0_25px_rgba(233,165,52,0.25)]">
              <img
                src={qrImageSrc}
                alt="Scan UPI QR Code"
                className="h-[210px] w-[210px] object-contain"
                loading="eager"
              />
              <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-[#1A0306]">
                <ShieldCheck size={12} className="text-[#107038]" />
                BHIM &bull; UPI Verified
              </div>
            </div>

            {/* Supported App Logos Badges */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-[#F5E5C7]/70">
              <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">Google Pay</span>
              <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">PhonePe</span>
              <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">Paytm</span>
              <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">BHIM</span>
              <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">Cred</span>
            </div>
          </div>

          {/* Mobile Intent Button */}
          <div className="mt-4 block sm:hidden">
            <a
              href={upiUrl}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] py-3 text-center font-sans text-[13px] font-bold text-white shadow-lg transition-transform active:scale-95"
            >
              <Smartphone size={16} />
              Tap to Open UPI App
            </a>
          </div>

          {/* UPI ID Row */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-[#E9A534]/20 bg-white/5 px-3 py-2 text-[12px]">
            <span className="text-[#F5E5C7]/60">UPI ID:</span>
            <span className="font-mono font-medium text-[#FFD57E]">{upiId}</span>
            <button
              onClick={handleCopyUpi}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E9A534] hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* UTR Reference Input Form */}
          <form onSubmit={handleConfirmUpiPayment} className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3.5">
            <label className="block text-[11px] font-medium text-[#F5E5C7]/80">
              Paid via UPI? Enter 12-digit UTR / Reference No:
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                placeholder="e.g. 423456789012"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                maxLength={24}
                className="flex-1 rounded-lg border border-[#E9A534]/30 bg-[#120103] px-3 py-2 text-[13px] text-white placeholder-white/30 focus:border-[#E9A534] focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting || !utrNumber.trim()}
                className="rounded-lg border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-wider text-[#3C080D] transition-transform hover:scale-102 disabled:opacity-50"
              >
                {submitting ? "Verifying..." : "Confirm"}
              </button>
            </div>
            {errorMessage && (
              <p className="mt-1.5 text-[11px] text-red-400">{errorMessage}</p>
            )}
          </form>

          {/* Fallback to Razorpay */}
          {onOpenRazorpay && (
            <div className="mt-4 border-t border-white/10 pt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRazorpay();
                }}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#E9C76D] transition-colors hover:text-white"
              >
                <CreditCard size={14} />
                Or Pay with Cards / NetBanking / Razorpay
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
