import { useState } from "react";
import axios from "axios";
import { loadRazorpay } from "../utils/loadRazorpay";
import { API_URL } from "../config/api";
import { CreditCard, Loader2 } from "lucide-react";

/**
 * Reusable Razorpay Standard Checkout Button Component
 *
 * Props:
 * - amount: Amount in paise (minimum 100 paise = ₹1.00) or rupees if isRupees is true
 * - isRupees: Boolean, true if amount is in rupees (will be converted to paise)
 * - name: Display title in Razorpay modal (default: "Cosmic Nidhi")
 * - description: Description in modal (default: "Vedic Astrology & Guidance")
 * - prefill: { name, email, contact }
 * - receipt: Optional custom receipt ID
 * - localOrderId: Optional MongoDB local order id to update status
 * - bookingId: Optional MongoDB booking id to update status
 * - onSuccess: Callback with verification response
 * - onFailure: Callback with error object
 * - onDismiss: Callback when user closes/dismisses modal without paying
 * - buttonText: Text displayed on the button
 * - className: Custom CSS classes
 * - disabled: Boolean
 */
export default function RazorpayCheckoutButton({
  amount,
  isRupees = false,
  name = "Cosmic Nidhi",
  description = "Consultation & Gemstones",
  prefill = {},
  receipt,
  localOrderId,
  bookingId,
  onSuccess,
  onFailure,
  onDismiss,
  buttonText = "Pay with Razorpay",
  className = "",
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpay();
      if (!isLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your network connection.");
      }

      // Calculate amount in paise (minimum 100 paise)
      const amountInPaise = isRupees ? Math.round(Number(amount) * 100) : Math.round(Number(amount));
      if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
        throw new Error("Invalid payment amount. Minimum amount is ₹1.00 (100 paise).");
      }

      // 2. Call backend order creation endpoint (POST /api/create-order)
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const createOrderRes = await axios.post(
        `${API_URL}/create-order`,
        {
          amount: amountInPaise,
          currency: "INR",
          receipt: receipt || `rcpt_${Date.now()}`,
          local_order_id: localOrderId,
          booking_id: bookingId,
        },
        { headers }
      );

      if (!createOrderRes.data.success && !createOrderRes.data.order_id && !createOrderRes.data.order?.id) {
        throw new Error(createOrderRes.data.message || "Failed to create payment order.");
      }

      const orderId = createOrderRes.data.order_id || createOrderRes.data.order?.id || createOrderRes.data.id;
      const keyId =
        createOrderRes.data.keyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        "rzp_live_ThtGnZqbg36Kwx";

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: keyId,
        amount: createOrderRes.data.amount || amountInPaise,
        currency: createOrderRes.data.currency || "INR",
        name: name || "Cosmic Nidhi",
        description: description || "Order Payment",
        image: "/favicon.png",
        order_id: orderId,
        prefill: {
          name: prefill.name || "",
          email: prefill.email || "",
          contact: prefill.contact || prefill.phone || "",
        },
        theme: {
          color: "#E9A534",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log("Razorpay checkout modal closed by user");
            if (onDismiss) onDismiss();
          },
        },
        handler: async function (response) {
          try {
            // 4. Send payment_id, order_id, signature to /api/verify-payment
            const verifyRes = await axios.post(
              `${API_URL}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                local_order_id: localOrderId,
                booking_id: bookingId,
              },
              { headers }
            );

            setLoading(false);
            if (verifyRes.data.success) {
              if (onSuccess) {
                onSuccess(verifyRes.data, response);
              } else {
                alert("Payment verified successfully!");
              }
            } else {
              throw new Error(verifyRes.data.message || "Payment verification failed.");
            }
          } catch (verifyErr) {
            setLoading(false);
            const msg = verifyErr.response?.data?.message || verifyErr.message || "Verification failed.";
            setErrorMessage(msg);
            if (onFailure) onFailure(verifyErr);
          }
        },
      };

      // 5. Open Razorpay modal
      const rzpInstance = new window.Razorpay(options);

      // Handle payment failure event
      rzpInstance.on("payment.failed", function (response) {
        setLoading(false);
        const failMsg = response.error?.description || "Payment failed or cancelled.";
        setErrorMessage(failMsg);
        console.error("Razorpay Payment Failed:", response.error);
        if (onFailure) onFailure(response.error);
      });

      rzpInstance.open();
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || "An error occurred during checkout.";
      setErrorMessage(msg);
      console.error("Checkout Error:", err);
      if (onFailure) onFailure(err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={
          className ||
          `inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E9A534] via-[#F2C66D] to-[#E9A534] px-6 py-3.5 font-display text-sm font-semibold tracking-wider text-[#30070B] shadow-[0_4px_20px_rgba(233,165,52,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_25px_rgba(233,165,52,0.45)] disabled:cursor-not-allowed disabled:opacity-60`
        }
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[#30070B]" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 text-[#30070B]" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
