import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Loader2, ArrowLeft, Send } from "lucide-react";
import { useCart } from "../context/CartContext";

import SEOHead from "../components/SEOHead";

import { API_URL } from "../config/api";

const formatPrice = (val) => {
  if (val == null || val === "") return "";
  if (typeof val === "string" && val.includes("₹")) return val;
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? String(val) : `₹${num.toLocaleString("en-IN")}`;
};

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [quantity, setQuantity] = useState(1);

  const added = cartItems.some(i => i.id === product?._id);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [product]);

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
      setReviews(res.data.reviews);
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
      image: product.images?.[0],
    }, quantity);
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
      fetchReviews(); // refresh
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
          <div className="rounded-[16px] overflow-hidden border border-[#E9A534]/30 bg-white p-4">
            <img 
              src={product.images?.[0] || "https://placehold.co/600x600?text=No+Image"} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-[8px]"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-[32px] md:text-[42px] font-bold text-[#3C080D] leading-tight">
              {product.name}
            </h1>
            <div className="mt-2 text-lg text-[#5A0E14] opacity-80 capitalize">
              {product.category?.name || "Uncategorized"}
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

            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center rounded-full border border-[#5A0E14]/20 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-l-full text-[#5A0E14] hover:bg-[#FDECC8]/30 transition-colors disabled:opacity-50"
                  disabled={added}
                >
                  -
                </button>
                <span className="flex h-12 w-8 items-center justify-center font-bold text-[#3C080D]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-r-full text-[#5A0E14] hover:bg-[#FDECC8]/30 transition-colors disabled:opacity-50"
                  disabled={added || quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.stock || added}
                className={`flex w-full md:w-max min-w-[200px] items-center justify-center gap-3 rounded-full py-4 px-8 font-sans text-sm font-bold uppercase tracking-[0.14em] shadow-lg transition-transform hover:-translate-y-1 ${
                  added 
                    ? 'border border-green-600 bg-green-50 text-green-700' 
                    : 'border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] text-[#3C080D]'
                } disabled:opacity-50 disabled:hover:translate-y-0`}
              >
                <ShoppingBag size={18} />
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-[#5A0E14]/10 pt-16">
          <h2 className="font-display text-[28px] font-bold text-[#3C080D] mb-8">Customer Reviews</h2>

          <div className="grid gap-12 md:grid-cols-2">
            
            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-[#5A0E14]/60 italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="rounded-xl border border-[#5A0E14]/15 p-6 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-[#E9A534]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-[#3C080D] ml-2">{review.user?.name}</span>
                    </div>
                    <p className="text-[#5A0E14]/80 text-sm mt-3">{review.comment}</p>
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
