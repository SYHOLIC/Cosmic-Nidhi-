import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Loader2, ArrowLeft, Send, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";

import SEOHead from "../components/SEOHead";

import { API_URL } from "../config/api";

const formatPrice = (val) => {
  if (val == null || val === "") return "";
  if (typeof val === "string" && val.includes("₹")) return val;
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? String(val) : `₹${num.toLocaleString("en-IN")}`;
};

function formatRelativeTime(dateInput) {
  if (!dateInput) return "recently";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "recently";
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) return "1 min ago";
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return "1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "1 month ago";
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [quantity, setQuantity] = useState(1);

  const cartItem = cartItems.find(i => i.id === product?._id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      fetchReviews();
      checkWishlistStatus();
    }
  }, [product]);

  const checkWishlistStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token || !product?._id) return;
    try {
      const res = await axios.get(`${API_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && Array.isArray(res.data.wishlist)) {
        setWishlisted(res.data.wishlist.some(p => (p._id || p.id) === product._id));
      }
    } catch {}
  };

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    const pId = product?._id;
    if (!pId) return;

    try {
      if (wishlisted) {
        setWishlisted(false);
        await axios.delete(`${API_URL}/users/wishlist/${pId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        setWishlisted(true);
        await axios.post(`${API_URL}/users/wishlist/${pId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      setWishlisted(prev => !prev);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/slug/${slug}`);
      setProduct(res.data.product);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/${product._id}/reviews`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    if (!product || !product.stock) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
    }, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setReviewError("You must be logged in to review.");
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/reviews`, {
        product: product._id,
        rating,
        comment
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setComment("");
      setRating(5);
      await fetchReviews(); // refresh reviews list
      await fetchProduct(); // refresh product with updated rating & reviews count
    } catch (err) {
      setReviewError(err.response?.data?.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <Loader2 className="h-8 w-8 animate-spin text-[#A2691F]" />
      </div>
    );
  }

  if (!product) {
    return <div className="p-20 text-center text-xl font-bold">Product not found.</div>;
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) 
    : (product.rating ? Number(product.rating).toFixed(1) : "5.0");

  const totalReviewsCount = Math.max(reviews.length, Array.isArray(product.reviews) ? product.reviews.length : 0);

  return (
    <main className="min-h-screen bg-[#FFFDF9] pt-28 pb-20">
      <SEOHead 
        pageName="product" 
        fallbackTitle={`${product.name} | Cosmic Nidhi`} 
        fallbackDescription={product.description?.substring(0, 160)} 
      />
      <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#A2691F] hover:text-[#5A0E14]">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Product Section */}
        <div className="grid gap-10 md:grid-cols-2 mb-16">
          <div className="relative rounded-[16px] overflow-hidden border border-[#E9A534]/30 bg-white p-4 flex items-center justify-center min-h-[360px] max-h-[520px]">
            <img 
              src={product.images?.[0] || product.image || "https://placehold.co/600x600?text=No+Image"} 
              alt={product.name} 
              className="max-h-[480px] w-auto max-w-full object-contain rounded-[8px]"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-display text-[32px] md:text-[42px] font-bold text-[#3C080D] leading-tight break-words">
                {product.name}
              </h1>
              {/* Prominent Wishlist / Like button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all hover:scale-105 ${
                  wishlisted 
                    ? "border-[#C1272D] bg-[#C1272D]/10 text-[#C1272D] shadow-sm" 
                    : "border-[#5A0E14]/20 bg-white text-[#5A0E14]/70 hover:border-[#C1272D] hover:text-[#C1272D]"
                }`}
                title={wishlisted ? "In Wishlist (Click to remove)" : "Add to Wishlist"}
                aria-label="Wishlist"
              >
                <Heart 
                  className={`h-5 w-5 transition-colors ${wishlisted ? "fill-[#C1272D] text-[#C1272D]" : ""}`} 
                  strokeWidth={1.8} 
                />
              </button>
            </div>

            <div className="mt-2 text-lg text-[#5A0E14] opacity-80 capitalize">
              {product.category?.name || (typeof product.category === "string" ? product.category : "Sacred Treasures")}
            </div>

            {/* Rating & In stock header */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#E9A534] text-[#E9A534]" strokeWidth={0} />
                <span className="font-sans text-sm font-bold text-[#3C080D]">
                  {avgRating}
                </span>
                <span className="font-sans text-xs text-[#5A0E14]/60">
                  ({totalReviewsCount})
                </span>
              </div>
              <span className="text-[#5A0E14]/30">·</span>
              <span className={`font-sans text-xs font-semibold ${product.stock > 0 ? "text-green-700" : "text-[#C1272D]"}`}>
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-display text-[32px] font-bold text-[#C1272D]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[#5A0E14]/40 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="mt-6 text-base text-[#5A0E14]/80 leading-relaxed text-justify">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-[#5A0E14]/20 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-l-full text-[#5A0E14] hover:bg-[#FDECC8]/30 transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="flex h-12 w-8 items-center justify-center font-bold text-[#3C080D]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-r-full text-[#5A0E14] hover:bg-[#FDECC8]/30 transition-colors disabled:opacity-30"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.stock}
                className={`flex flex-1 sm:flex-initial min-w-[200px] items-center justify-center gap-3 rounded-full py-4 px-8 font-sans text-sm font-bold uppercase tracking-[0.14em] shadow-lg transition-transform hover:-translate-y-1 ${
                  justAdded 
                    ? 'border border-green-600 bg-green-50 text-green-700' 
                    : 'border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] text-[#3C080D]'
                } disabled:opacity-50 disabled:hover:translate-y-0`}
              >
                <ShoppingBag size={18} />
                {justAdded 
                  ? "Added to Cart!" 
                  : (inCartQty > 0 ? "Add More to Cart" : "Add to Cart")}
              </button>

              {inCartQty > 0 && (
                <span className="text-xs font-semibold text-green-800 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                  ✓ {inCartQty} in cart
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-[#5A0E14]/10 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-display text-[28px] font-bold text-[#3C080D]">Customer Reviews</h2>
            <span className="rounded-full bg-[#E9A534]/15 px-3 py-1 font-sans text-xs font-bold text-[#8A5A1F]">
              {totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            
            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-[#5A0E14]/60 italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="rounded-xl border border-[#5A0E14]/15 p-6 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#E9A534]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-[#3C080D] ml-1">{review.user?.name || review.name || "Customer"}</span>
                      </div>
                      <span className="text-xs font-medium text-[#5A0E14]/50">
                        {formatRelativeTime(review.createdAt || review.date)}
                      </span>
                    </div>
                    <p className="text-[#5A0E14]/80 text-sm mt-3 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Form */}
            <div className="rounded-[16px] bg-[#180205] text-[#FFF8EC] p-8 border border-[#E9A534]/20 h-max">
              <h3 className="font-display text-[22px] text-[#E9A534] font-semibold mb-6">Write a Review</h3>
              
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E9A534]/80 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(num => (
                      <button 
                        type="button" 
                        key={num} 
                        onClick={() => setRating(num)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`h-8 w-8 ${rating >= num ? 'fill-[#E9A534] text-[#E9A534]' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E9A534]/80 mb-2">Your Comment</label>
                  <textarea 
                    required
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                    className="w-full rounded bg-[#260005] border border-[#E9A534]/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E9A534]"
                    placeholder="Tell us what you think..."
                  />
                </div>
                
                {reviewError && <p className="text-red-400 text-sm">{reviewError}</p>}

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="mt-2 flex items-center justify-center gap-2 rounded bg-[#E9A534] py-3 text-sm font-bold uppercase text-[#3C080D] hover:bg-[#F2C66D] disabled:opacity-50"
                >
                  <Send size={16} />
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
