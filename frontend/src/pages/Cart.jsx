import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { API_URL } from "../config/api";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, addToCart } = useCart();
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth?redirect=/cart");
      return;
    }
    // Fetch wishlist
    axios
      .get(`${API_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.wishlist)) {
          setWishlistItems(res.data.wishlist);
        }
      })
      .catch(() => {})
      .finally(() => setWishlistLoading(false));
  }, [navigate]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleAddWishlistToCart = (product) => {
    const pId = product._id || product.id;
    addToCart({
      id: pId,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
    });
    setAddedIds((prev) => new Set(prev).add(pId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(pId);
        return next;
      });
    }, 2000);
  };

  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setWishlistItems((prev) => prev.filter((p) => (p._id || p.id) !== productId));
    try {
      await axios.delete(`${API_URL}/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Wishlist remove error:", err);
    }
  };

  const formatPrice = (val) => {
    const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <main className="min-h-screen bg-[#FFFDF9] pt-28 pb-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        
        <div className="mb-8">
          <h1 className="font-display text-[32px] font-medium text-[#3C080D] sm:text-[40px]">
            Your Shopping Cart
          </h1>
          <a
            href="/products"
            className="mt-2 inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-[#E9A534] transition-colors hover:text-[#C89846]"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </a>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#E9A534]/30 bg-[#FFF7E9] py-20 text-center shadow-sm">
            <h2 className="font-display text-[22px] font-medium text-[#3C080D]">Your cart is empty</h2>
            <p className="mt-2 max-w-md font-sans text-[14px] text-[#5A0E14]/70">
              Looks like you haven't added any products to your cart yet. Explore our collection of crystals, rudrakshas, and spiritual tools.
            </p>
            <a
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-6 py-3 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
            >
              Browse Store
            </a>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            
            {/* CART ITEMS */}
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => {
                const priceStr = String(item.price).replace(/[₹,]/g, "");
                const price = parseFloat(priceStr) || 0;
                const itemTotal = price * item.quantity;

                return (
                  <motion.div
                    layout
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[12px] border border-[#5A0E14]/10 bg-white p-4 shadow-[0_4px_16px_rgba(60,8,13,0.03)] sm:flex-row sm:items-center sm:gap-6"
                  >
                    {/* Image */}
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[8px] border border-[#E9A534]/20 bg-[#F4E4C8]/30">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-display text-[17px] font-semibold text-[#3C080D]">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-sans text-[12px] font-medium text-[#5A0E14]/60">
                        {item.category}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-between sm:mt-3">
                        {/* Quantity Control */}
                        <div className="flex items-center rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center text-[#3C080D] transition-colors hover:bg-[#E9A534]/10 hover:text-[#E9A534] rounded-l-full disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-sans text-[13px] font-semibold text-[#3C080D]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#3C080D] transition-colors hover:bg-[#E9A534]/10 hover:text-[#E9A534] rounded-r-full"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        {/* Price & Remove */}
                        <div className="flex items-center gap-6">
                          <span className="font-display text-[18px] font-bold text-[#C1272D]">
                            ₹{itemTotal.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#5A0E14]/40 transition-colors hover:text-[#C1272D]"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <div className="self-start rounded-[12px] border border-[#E9A534]/25 bg-gradient-to-br from-[#180205] to-[#260005] p-6 text-[#FFF8EC] shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E9C76D]">
                Order Summary
              </h3>
              
              <div className="mt-6 flex flex-col gap-4 border-b border-[#E9A534]/15 pb-6">
                <div className="flex items-center justify-between font-sans text-[14px]">
                  <span className="text-[#F5E5C7]/70">Subtotal</span>
                  <span className="font-medium text-[#FFF8EC]">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-sans text-[14px]">
                  <span className="text-[#F5E5C7]/70">Shipping</span>
                  <span className="font-medium text-green-400">Free</span>
                </div>
                <div className="flex items-center justify-between font-sans text-[14px]">
                  <span className="text-[#F5E5C7]/70">Tax</span>
                  <span className="font-medium text-[#FFF8EC]">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="font-display text-[18px] font-medium text-[#FFF8EC]">Total</span>
                <span className="font-display text-[26px] font-bold text-[#E9A534]">
                  ₹{getCartTotal().toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] py-4 font-sans text-[13px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-[0_8px_20px_rgba(233,165,52,0.25)] transition-transform hover:-translate-y-0.5"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            WISHLIST SECTION
        ===================================================== */}
        {!wishlistLoading && wishlistItems.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#5A0E14]/10">
            <div className="mb-8 flex items-center gap-3">
              <Heart className="h-5 w-5 text-[#C1272D]" fill="#C1272D" strokeWidth={0} />
              <h2 className="font-display text-[24px] font-medium text-[#3C080D] sm:text-[28px]">
                Your Wishlist
              </h2>
              <span className="ml-1 rounded-full bg-[#C1272D]/10 px-2.5 py-0.5 font-sans text-[11px] font-bold text-[#C1272D]">
                {wishlistItems.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {wishlistItems.map((product) => {
                const pId = product._id || product.id;
                const productImage = product.images?.[0] || product.image || "";
                const isAdded = addedIds.has(pId);

                return (
                  <motion.div
                    key={pId}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex flex-col overflow-hidden rounded-[9px] border border-[#5A0E14]/10 bg-white shadow-[0_4px_16px_rgba(60,8,13,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(60,8,13,0.10)]"
                  >
                    {/* Remove from wishlist */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFromWishlist(pId)}
                      className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-[#5A0E14]/10 text-[#C1272D] shadow-sm transition-all hover:bg-[#C1272D] hover:text-white hover:scale-110"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                    </button>

                    {/* Image */}
                    <div
                      className="aspect-square overflow-hidden bg-[#F4E4C8]/30 cursor-pointer"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3C080D] to-[#1F0306]">
                          <ShoppingBag className="h-8 w-8 text-[#E9A534]/40" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-3">
                      <h3
                        className="line-clamp-2 min-h-[36px] font-display text-[13px] font-semibold leading-tight text-[#3C080D] cursor-pointer hover:text-[#C1272D] transition-colors"
                        onClick={() => navigate(`/product/${product.slug}`)}
                      >
                        {product.name}
                      </h3>

                      <span className="mt-1.5 font-display text-[16px] font-bold text-[#C1272D]">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleAddWishlistToCart(product)}
                        disabled={isAdded}
                        className={`
                          mt-2.5 flex w-full items-center justify-center gap-1.5
                          rounded-full border py-2
                          font-sans text-[10px] font-bold uppercase tracking-[0.14em]
                          transition-all duration-300
                          ${
                            isAdded
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] text-[#3C080D] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
                          }
                        `}
                      >
                        <ShoppingBag className="h-3 w-3" strokeWidth={1.9} />
                        {isAdded ? "Added!" : "Add to Cart"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
