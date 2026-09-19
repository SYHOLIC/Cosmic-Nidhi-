import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  Plus
} from "lucide-react";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [savingAddress, setSavingAddress] = useState(false);

  // New address form state
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }
    fetchAddresses();
  }, [navigate, cartItems.length]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      let userAddresses = [];
      try {
        const res = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userAddresses = res.data.user?.addresses || [];
      } catch {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userAddresses = res.data.user?.addresses || [];
      }
      setAddresses(userAddresses);
      
      const defaultAddr = userAddresses.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
      } else if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0]._id);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart_guest");
        localStorage.removeItem("cartItems");
        window.dispatchEvent(new CustomEvent("auth-state-changed", {
          detail: { action: "logout" }
        }));
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/users/addresses`, addressForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setAddressForm({ name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
      
      const updatedAddresses = res.data.addresses;
      if (Array.isArray(updatedAddresses)) {
        setAddresses(updatedAddresses);
        const defaultAddr = updatedAddresses.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (updatedAddresses.length > 0) {
          setSelectedAddressId(updatedAddresses[updatedAddresses.length - 1]._id);
        }
      } else {
        await fetchAddresses();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/coupons/apply`, {
        code: couponCode,
        totalAmount: getCartTotal()
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setAppliedCoupon({
        code: res.data.code,
        discountAmount: res.data.discountAmount,
        newTotal: res.data.newTotal
      });
      setCouponCode("");
    } catch (err) {
      setCouponError(err.response?.data?.message || "Failed to apply coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const address = addresses.find(a => a._id === selectedAddressId);
      const subtotal = getCartTotal();
      const totalAmount = appliedCoupon ? appliedCoupon.newTotal : subtotal; // add shipping/taxes here if any

      // 1. Create MongoDB Order (pending state)
      const orderRes = await axios.post(
        `${API_URL}/orders`,
        {
          items: cartItems.map(item => ({ product: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image })),
          shippingAddress: {
            name: address.name,
            phone: address.phone,
            address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
          subtotal,
          totalAmount,
          paymentMethod: "razorpay"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const localOrderId = orderRes.data.order._id;

      // 2. Create Razorpay Order
      const rzpRes = await axios.post(
        `${API_URL}/payment/create-order`,
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const razorpayOrderId = rzpRes.data.order.id;

      // 3. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder_key_id",
        amount: totalAmount * 100,
        currency: "INR",
        name: "Cosmic Nidhi",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 4. Verify Payment
            await axios.post(
              `${API_URL}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                local_order_id: localOrderId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            clearCart();
            navigate("/dashboard");
          } catch (err) {
            console.error("Payment verification failed", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: {
          color: "#E9A534"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while initiating payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E9A534] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] pt-28 pb-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        
        <div className="mb-8">
          <h1 className="font-display text-[32px] font-medium text-[#3C080D] sm:text-[40px]">
            Checkout
          </h1>
          <a
            href="/cart"
            className="mt-2 inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-[#E9A534] transition-colors hover:text-[#C89846]"
          >
            <ArrowLeft size={16} />
            Return to Cart
          </a>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          
          {/* LEFT COLUMN: Shipping Details */}
          <div className="flex flex-col gap-8">
            <section className="rounded-[12px] border border-[#5A0E14]/10 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-[22px] font-medium text-[#3C080D]">
                <MapPin className="text-[#E9A534]" />
                Delivery Address
              </h2>

              {addresses.length === 0 && !showAddForm && (
                <div className="rounded-[8px] bg-[#FFF7E9] p-5 text-center">
                  <p className="font-sans text-[14px] text-[#5A0E14]/70">
                    You don't have any saved addresses.
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-6 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] transition-transform hover:-translate-y-0.5"
                  >
                    <Plus size={14} /> Add Address
                  </button>
                </div>
              )}

              {addresses.length > 0 && !showAddForm && (
                <div className="space-y-4">
                  {addresses.map(addr => (
                    <label
                      key={addr._id}
                      className={`
                        relative flex cursor-pointer gap-4 rounded-[8px] border p-4 transition-all
                        ${selectedAddressId === addr._id 
                          ? "border-[#E9A534] bg-[#FDECC8]/20 shadow-[0_4px_12px_rgba(233,165,52,0.1)]" 
                          : "border-[#5A0E14]/15 hover:border-[#E9A534]/50"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1 h-4 w-4 shrink-0 text-[#E9A534] focus:ring-[#E9A534]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[15px] font-semibold text-[#3C080D]">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="rounded-full bg-[#5A0E14] px-2 py-0.5 text-[9px] font-bold uppercase text-white">Default</span>
                          )}
                        </div>
                        <p className="mt-1 font-sans text-[13px] text-[#5A0E14]/70">{addr.phone}</p>
                        <p className="mt-1 font-sans text-[13px] text-[#5A0E14]/70 leading-relaxed">
                          {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-2 font-sans text-[13px] font-medium text-[#E9A534] transition-colors hover:text-[#C89846]"
                  >
                    + Add a new address
                  </button>
                </div>
              )}

              {/* Add Address Form inline */}
              {showAddForm && (
                <form onSubmit={handleAddAddress} className="rounded-[8px] border border-[#5A0E14]/15 bg-[#FFFDF9] p-5">
                  <h3 className="mb-4 font-display text-[18px] font-medium text-[#3C080D]">Add New Address</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5A0E14]/70">Full Name</label>
                      <input type="text" required value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full rounded-[6px] border border-[#5A0E14]/20 p-2.5 text-[13px] focus:border-[#E9A534] focus:outline-none" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5A0E14]/70">Phone</label>
                      <input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full rounded-[6px] border border-[#5A0E14]/20 p-2.5 text-[13px] focus:border-[#E9A534] focus:outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5A0E14]/70">Address (House No, Street)</label>
                      <input type="text" required value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="w-full rounded-[6px] border border-[#5A0E14]/20 p-2.5 text-[13px] focus:border-[#E9A534] focus:outline-none" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5A0E14]/70">City</label>
                      <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full rounded-[6px] border border-[#5A0E14]/20 p-2.5 text-[13px] focus:border-[#E9A534] focus:outline-none" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5A0E14]/70">State</label>
                      <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full rounded-[6px] border border-[#5A0E14]/20 p-2.5 text-[13px] focus:border-[#E9A534] focus:outline-none" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#5A0E14]/70">Pincode</label>
                      <input type="text" required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full rounded-[6px] border border-[#5A0E14]/20 p-2.5 text-[13px] focus:border-[#E9A534] focus:outline-none" />
                    </div>
                    <div className="col-span-2 mt-2 flex items-center gap-2">
                      <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="rounded text-[#E9A534] focus:ring-[#E9A534]" />
                      <span className="text-[13px] text-[#5A0E14]/80">Set as default address</span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button type="submit" disabled={savingAddress} className="rounded-full bg-[#5A0E14] px-5 py-2 font-sans text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#3C080D] disabled:opacity-50">
                      {savingAddress ? "Saving..." : "Save Address"}
                    </button>
                    {addresses.length > 0 && (
                      <button type="button" onClick={() => setShowAddForm(false)} className="font-sans text-[13px] font-medium text-[#5A0E14]/70 transition-colors hover:text-[#3C080D]">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="flex flex-col gap-6">
            <div className="rounded-[12px] border border-[#E9A534]/25 bg-gradient-to-br from-[#180205] to-[#260005] p-6 text-[#FFF8EC] shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <h3 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E9C76D]">
                Order Summary
              </h3>
              
              <div className="mb-6 max-h-[300px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#E9A534]/20">
                {cartItems.map(item => {
                  const priceStr = String(item.price).replace(/[₹,]/g, "");
                  const price = parseFloat(priceStr) || 0;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[6px] border border-[#E9A534]/20 bg-white/5">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <p className="line-clamp-1 font-sans text-[13px] font-medium">{item.name}</p>
                        <p className="mt-1 font-sans text-[11px] text-[#F5E5C7]/60">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center font-sans text-[14px] font-bold text-[#E9C76D]">
                        ₹{(price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-[#E9A534]/15 py-4 mt-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded bg-[#331818] px-3 py-2">
                    <div>
                      <p className="text-[11px] font-bold text-green-400">Coupon Applied: {appliedCoupon.code}</p>
                      <p className="text-[10px] text-gray-400">- ₹{appliedCoupon.discountAmount.toLocaleString()}</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-[10px] text-red-400 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter Coupon Code" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 rounded border border-[#E9A534]/30 bg-[#1f090b] px-3 py-2 text-[12px] text-white focus:border-[#E9A534] focus:outline-none uppercase" 
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode}
                        className="rounded bg-[#E9A534] px-4 py-2 text-[12px] font-bold text-[#3C080D] hover:bg-[#F2C66D] disabled:opacity-50"
                      >
                        {applyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="mt-1 text-[10px] text-red-400">{couponError}</p>}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-[#E9A534]/15 pt-5">
                <div className="flex justify-between font-sans text-[13px]">
                  <span className="text-[#F5E5C7]/70">Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between font-sans text-[13px]">
                    <span className="text-[#F5E5C7]/70">Discount</span>
                    <span className="text-green-400">- ₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-sans text-[13px]">
                  <span className="text-[#F5E5C7]/70">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E9A534]/30 pt-5">
                <span className="font-display text-[16px] font-medium">Final Amount</span>
                <span className="font-display text-[24px] font-bold text-[#E9A534]">
                  ₹{(appliedCoupon ? appliedCoupon.newTotal : getCartTotal()).toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayment}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] py-4 font-sans text-[13px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-[0_8px_20px_rgba(233,165,52,0.25)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <Lock size={16} />
                {isProcessing ? "Processing..." : "Proceed to Payment"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 font-sans text-[11px] text-[#F5E5C7]/50">
                <ShieldCheck size={14} />
                Secure Encrypted Checkout
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
