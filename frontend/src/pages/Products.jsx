import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Gem,
  Flame,
  BookOpen,
  Home,
  Moon,
  Star,
  ShoppingBag,
  Eye,
  Heart,
  ChevronRight,
  Plus,
  Minus,
  ArrowRight,
  Phone,
  Filter,
  Compass,
  Shield,
  Search
} from "lucide-react";
import Reveal from "../components/Reveal";
import BookingModal from "../components/BookingModal";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

/* Zodiac chakra backdrop */
import heroZodiac from "../assets/hero-zodiac3.png";

import { API_URL } from "../config/api";

/* ================================================================
   HELPERS
================================================================ */

function SafeImage({ src, alt, className, iconFallback: Icon }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-[#3C080D] to-[#1F0306]`}>
        {Icon && <Icon className="h-10 w-10 text-[#E9A534]/45" strokeWidth={1.5} />}
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`${className} absolute inset-0 animate-pulse bg-[#5A0E14]/10`} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      />
    </>
  );
}

const formatPrice = (val) => {
  if (val == null || val === "") return "";
  if (typeof val === "string" && val.includes("₹")) return val;
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? String(val) : `₹${num.toLocaleString("en-IN")}`;
};

const discountPct = (price, original) => {
  const toNum = (val) => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    return parseInt(String(val).replace(/[₹,\s]/g, ""), 10) || 0;
  };
  const p = toNum(price);
  const o = toNum(original);
  if (!o || o <= p) return null;
  return Math.round(((o - p) / o) * 100);
};

/* ================================================================
   EYEBROW
================================================================ */

function Eyebrow({ children, tone = "dark" }) {
  const textColor = tone === "dark" ? "text-[#8A5A1F]" : "text-[#E9C76D]";
  const ruleColor = tone === "dark" ? "bg-[#C89846]" : "bg-[#E9A534]/60";

  return (
    <div className="flex items-center gap-3">
      <span className={`h-px w-7 ${ruleColor}`} />
      <p className={`font-sans text-[10px] font-bold uppercase tracking-[0.28em] ${textColor}`}>
        {children}
      </p>
    </div>
  );
}

/* ================================================================
   CATEGORY CHIP (horizontal scroll)
================================================================ */

function CategoryChip({ category, onSelect }) {
  const Icon = category.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(category.name)}
      className="
        group relative flex w-[240px] shrink-0 items-center gap-3
        overflow-hidden rounded-[9px]
        border border-[#5A0E14]/12
        bg-[#FFFDF9]
        p-4 text-left
        shadow-[0_8px_24px_rgba(60,8,13,0.05)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#E9A534]/50
        hover:shadow-[0_16px_36px_rgba(60,8,13,0.12)]
        sm:w-[260px]
      "
    >
      {/* Image thumb */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#E9A534]/35">
        <SafeImage
          src={category.image}
          alt={category.name}
          iconFallback={Icon}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate font-display text-[15px] font-semibold text-[#3C080D] transition-colors duration-300 group-hover:text-[#8B2F2B]">
          {category.name}
        </p>
        <p className="mt-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A5A1F]/70">
          {category.productCount} items
        </p>
      </div>

      <ChevronRight
        className="ml-auto h-4 w-4 shrink-0 text-[#5A0E14]/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#E9A534]"
        strokeWidth={1.7}
      />
    </button>
  );
}

/* ================================================================
   PRODUCT CARD
================================================================ */

function ProductCard({ product, index, onQuickView, isWishlisted }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(Boolean(isWishlisted));
  const [added, setAdded] = useState(false);
  const off = discountPct(product.price, product.originalPrice);

  useEffect(() => {
    if (isWishlisted !== undefined) {
      setWishlisted(Boolean(isWishlisted));
    }
  }, [isWishlisted]);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    const pId = product._id || product.id;
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
      setWishlisted((w) => !w);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isAvailable = product.inStock !== undefined ? product.inStock : (product.stock === undefined || product.stock > 0);
  const productImage = product.images?.[0] || product.image || "";
  const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : (product.reviews || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      className="
        group relative flex flex-col overflow-hidden
        rounded-[9px]
        border border-[#5A0E14]/12
        bg-[#FFFDF9]
        shadow-[0_8px_24px_rgba(60,8,13,0.05)]
        transition-all duration-500
        hover:-translate-y-1
        hover:border-[#E9A534]/50
        hover:shadow-[0_18px_42px_rgba(60,8,13,0.14)]
      "
    >
      {/* Gold top line */}
      <span className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-[#F4E4C8]/30">
        <SafeImage
          src={productImage}
          alt={product.name}
          iconFallback={Gem}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-[#E9A534]/50 bg-[#E9A534] px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-[0_4px_12px_rgba(233,165,52,0.35)]">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="
            absolute right-3 top-3 z-10
            flex h-8 w-8 items-center justify-center
            rounded-full border border-[#5A0E14]/10
            bg-[#FFFDF9]/92 backdrop-blur-sm
            shadow-[0_4px_12px_rgba(60,8,13,0.10)]
            transition-all duration-300
            hover:scale-110 hover:border-[#C1272D]/30
          "
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${
              wishlisted ? "fill-[#C1272D] text-[#C1272D]" : "text-[#5A0E14]/50"
            }`}
            strokeWidth={1.7}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#3C080D]/85 to-transparent px-3 pb-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
          <button
            type="button"
            onClick={() => navigate(`/product/${product.slug}`)}
            className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#E9A534]/40 bg-[#FFFDF9]/95 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#3C080D] backdrop-blur-sm transition-colors hover:bg-[#FFFDF9]"
          >
            <Eye className="h-3 w-3" strokeWidth={1.8} />
            Quick View
          </button>
        </div>
      </div>

      {/* BODY */}
      <div 
        className="flex flex-1 flex-col p-4 cursor-pointer" 
        onClick={(e) => {
          if(e.target.closest('button')) return;
          navigate(`/product/${product.slug}`);
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#E9A534] text-[#E9A534]" strokeWidth={0} />
            <span className="font-sans text-[11px] font-bold text-[#3C080D]">
              {product.rating ?? 4.8}
            </span>
            <span className="font-sans text-[10px] text-[#5A0E14]/50">
              ({reviewCount})
            </span>
          </div>

          <span className="text-[#5A0E14]/20">·</span>

          <span
            className={`font-sans text-[10px] font-medium ${
              isAvailable ? "text-green-700" : "text-[#C1272D]"
            }`}
          >
            {isAvailable ? "In stock" : "Out of stock"}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[40px] font-display text-[15px] font-semibold leading-[1.3] text-[#3C080D]">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-2 min-h-[36px] font-sans text-[12px] leading-relaxed text-[#5A0E14]/70">
          {product.description || "Discover the energy and benefits of this carefully curated spiritual item."}
        </p>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-2">
          <span className="font-display text-[19px] font-bold leading-none text-[#C1272D]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-sans text-[11px] text-[#5A0E14]/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {off && (
            <span className="ml-auto font-sans text-[11px] font-bold text-green-700">
              {off}% off
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!isAvailable || added}
          onClick={handleAddToCart}
          className={`
            mt-3.5 flex w-full items-center justify-center gap-2
            rounded-full
            border ${added ? 'border-green-600 bg-green-50' : 'border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D]'}
            py-2.5
            font-sans text-[11px] font-bold uppercase tracking-[0.14em]
            ${added ? 'text-green-700' : 'text-[#3C080D]'}
            shadow-[0_6px_18px_rgba(0,0,0,0.10)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_10px_22px_rgba(0,0,0,0.18)]
            disabled:cursor-not-allowed
            disabled:border-[#5A0E14]/15
            disabled:bg-none
            disabled:bg-[#5A0E14]/10
            disabled:text-[#5A0E14]/40
            disabled:shadow-none
            disabled:hover:translate-y-0
          `}
        >
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.9} />
          {added ? "Added!" : (isAvailable ? "Add to Cart" : "Notify Me")}
        </button>
      </div>
    </motion.article>
  );
}

/* ================================================================
   PAGE
================================================================ */

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userWishlistIds, setUserWishlistIds] = useState(new Set());
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Filters
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    fetchCategories();
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.success && Array.isArray(res.data.wishlist)) {
          setUserWishlistIds(new Set(res.data.wishlist.map(p => (p._id || p.id).toString())));
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0 || activeCategory === 'all') {
      fetchProducts();
    }
  }, [activeCategory, searchQuery, minPrice, maxPrice, categories]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      const allCats = res.data.categories;
      
      const topLevel = allCats.filter((c) => !c.parentCategory);
      const withChildren = topLevel.map((parent) => ({
        _id: parent._id,
        id: parent._id,
        name: parent.name,
        slug: parent.slug,
        icon: Gem,
        description: parent.description,
        image: parent.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
        productCount: parent.productCount || 0,
        children: allCats.filter(
          (c) =>
            c.parentCategory?._id === parent._id ||
            c.parentCategory === parent._id
        ).map(child => ({
          _id: child._id,
          id: child._id,
          name: child.name,
          slug: child.slug,
          productCount: child.productCount || 0
        }))
      }));
      
      setCategories(withChildren);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/products?`;
      if (activeCategory !== "all") {
        // Find flat category by name
        let targetId = null;
        for (const cat of categories) {
          if (cat.name === activeCategory) targetId = cat._id;
          if (cat.children) {
            for (const child of cat.children) {
              if (child.name === activeCategory) targetId = child._id;
            }
          }
        }
        if (targetId) url += `category=${targetId}&`;
      }
      if (searchQuery) url += `search=${searchQuery}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      
      const res = await axios.get(url);
      setProducts(res.data.products.map(p => ({
        id: p._id,
        _id: p._id,
        slug: p.slug || p._id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || null,
        image: (p.images && p.images.length > 0 ? p.images[0] : "") || p.image || "",
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
        category: p.category ? (typeof p.category === 'object' ? p.category.name : p.category) : "",
        rating: p.rating || 5,
        reviews: Array.isArray(p.reviews) ? p.reviews.length : (p.reviews || 0),
        inStock: p.stock !== undefined ? p.stock > 0 : true,
        stock: p.stock !== undefined ? p.stock : 10,
        badge: p.badge || ""
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categoryNames = categories.map((c) => c.name);
  const displayedProducts = showAllProducts ? products : products.slice(0, 8);

  const selectCategory = (name) => {
    setActiveCategory(name);
    setShowAllProducts(false);
    setShowMobileFilter(false);
    document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative">
      <SEOHead 
        pageName="shop" 
        fallbackTitle="Shop Premium Zodiac Collections | Cosmic Nidhi" 
        fallbackDescription="Browse our exclusive collection of zodiac rings, pendants, crystals, and astrology-themed jewelry."
      />
      {/* ============================================================
          DARK HERO BAND — 2-column, compact
      ============================================================ */}
      <section className="relative overflow-hidden border-b border-[#E9A534]/15 bg-[#180205] pb-10 pt-24 text-[#FFF8EC] md:pt-28 md:pb-12">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 right-[8%] h-[400px] w-[400px] rounded-full bg-[#650F18]/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[5%] h-[350px] w-[350px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        {/* Rotating chakra */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute top-1/2 -translate-y-1/2
            h-[360px] w-[360px] right-[-160px]
            opacity-[0.10] mix-blend-screen
            sm:right-[-120px] sm:h-[420px] sm:w-[420px]
            lg:right-[-80px] lg:h-[460px] lg:w-[460px] lg:opacity-[0.14]
            xl:right-[-40px] xl:h-[520px] xl:w-[520px] xl:opacity-[0.16]
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
        <span className="pointer-events-none absolute left-[12%] top-[28%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/70 shadow-[0_0_12px_rgba(233,165,52,0.6)]" />
        <span className="pointer-events-none absolute right-[14%] top-[22%] h-[2px] w-[2px] rounded-full bg-[#E9A534]/60" />
        <span className="pointer-events-none absolute right-[22%] bottom-[24%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/50" />

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            {/* LEFT — Text */}
            <div>
              <Reveal>
                <Eyebrow tone="dark">Our Store</Eyebrow>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-4 max-w-[620px] font-display text-[36px] leading-[1.0] tracking-[-0.025em] text-[#FFF7E8] sm:text-[42px] md:text-[48px] lg:text-[54px]">
                  Crystals, jewels &amp;{" "}
                  <span className="text-[#E9B957]">sacred treasures</span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-4 max-w-[520px] font-sans text-[14px] leading-[1.65] text-[#F5E5C7]/85 sm:text-[15px]">
                  A curated collection of natural crystals, gemstone jewelry,
                  and spiritual products — each with a purpose, a story,
                  and instructions for use.
                </p>
              </Reveal>

              {/* Trust row */}
              <Reveal delay={240}>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E9A534]/15 pt-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                      <Shield className="h-3.5 w-3.5" strokeWidth={1.7} />
                    </div>
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#E9C76D]">
                      Ethically Sourced
                    </p>
                  </div>

                  <span className="hidden h-3.5 w-px bg-[#E9A534]/20 sm:block" />

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                      <Compass className="h-3.5 w-3.5" strokeWidth={1.7} />
                    </div>
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#E9C76D]">
                      Care Guidance Included
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT — Stats card */}
            <Reveal delay={200}>
              <div className="relative overflow-hidden rounded-[9px] border border-[#E9A534]/25 bg-gradient-to-br from-[#3C080D] via-[#2A0509] to-[#1F0306] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6">
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent" />

                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                  In Our Collection
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3.5">
                  {[
                    { value: "100+", label: "Products" },
                    { value: "6", label: "Categories" },
                    { value: "4.7★", label: "Avg Rating" },
                    { value: "Free", label: "Delivery" },
                  ].map((stat) => (
                    <div key={stat.label} className="border-l-2 border-[#E9A534]/35 pl-3">
                      <p className="font-display text-[22px] font-semibold leading-none text-[#E9C76D]">
                        {stat.value}
                      </p>
                      <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-[#FDECC8]/60">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Browse CTA */}
                <a
                  href="#product-grid"
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#F2C66D] bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#3C080D] shadow-[0_8px_22px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.32)]"
                >
                  Browse Collection
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E9A534]/30 to-transparent" />
      </section>

      {/* ============================================================
          LIGHT BODY — categories strip + product grid
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#FFF7E9] py-14 md:py-16">
        <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#C1272D]/[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.06] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10 xl:px-12">

          {/* ============================================
              CATEGORIES — horizontal scroll strip
          ============================================ */}
          <Reveal>
            <Eyebrow>Shop By Category</Eyebrow>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-5 flex items-end justify-between gap-6">
              <h2 className="max-w-[520px] font-display text-[28px] font-medium leading-[1.1] tracking-[-0.015em] text-[#3C080D] sm:text-[32px] md:text-[36px]">
                Browse six curated{" "}
                <span className="text-[#8B2F2B]">collections</span>
              </h2>
            </div>
          </Reveal>

          {/* Horizontal scroll */}
          <div className="relative mt-8">
            <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 bg-gradient-to-l from-[#FFF7E9] to-transparent" />

            <div
              className="
                flex gap-4 overflow-x-auto pb-4 pr-10
                scrollbar-thin
                scrollbar-track-transparent
                scrollbar-thumb-[#5A0E14]/25
                snap-x snap-mandatory
              "
              style={{ scrollbarWidth: "thin" }}
            >
              {categories.map((category) => (
                <div key={category.id} className="snap-start">
                  <CategoryChip category={category} onSelect={selectCategory} />
                </div>
              ))}
            </div>
          </div>

          {/* ============================================
              PRODUCTS
          ============================================ */}
          <div id="product-grid" className="mt-16 scroll-mt-24">
            <Reveal>
              <Eyebrow>Featured Products</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 max-w-[620px] font-display text-[28px] font-medium leading-[1.1] tracking-[-0.015em] text-[#3C080D] sm:text-[32px] md:text-[36px]">
                Every stone, chosen with{" "}
                <span className="text-[#8B2F2B]">intention</span>
              </h2>
            </Reveal>

            {/* ============================================
                FILTER BAR — sticky
            ============================================ */}
            <div
              className="
                sticky top-[86px] z-30
                mt-8 mb-8
                rounded-[9px]
                border border-[#5A0E14]/12
                bg-[#FFFDF9]/95
                p-3 backdrop-blur-md
                shadow-[0_8px_24px_rgba(60,8,13,0.06)]
              "
            >
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A0E14]/50" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9] py-2 pl-10 pr-4 font-sans text-[13px] text-[#3C080D] focus:border-[#E9A534]/60 focus:outline-none"
                  />
                </div>
                
                {/* Price Filter */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => {
                      const v = e.target.value;
                      setMinPrice(v === '' ? '' : Math.max(0, Number(v)).toString());
                    }}
                    className="w-20 rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9] px-3 py-1.5 font-sans text-[12px] text-[#3C080D] focus:border-[#E9A534]/60 focus:outline-none"
                  />
                  <span className="text-[#5A0E14]/40">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => {
                      const v = e.target.value;
                      setMaxPrice(v === '' ? '' : Math.max(0, Number(v)).toString());
                    }}
                    className="w-20 rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9] px-3 py-1.5 font-sans text-[12px] text-[#3C080D] focus:border-[#E9A534]/60 focus:outline-none"
                  />
                </div>
              </div>
              
              {/* Desktop filters */}
              <div className="hidden flex-wrap items-center gap-2 md:flex">
                <span className="mr-2 font-sans text-[10px] font-bold uppercase tracking-[0.20em] text-[#8A5A1F]">
                  Filter
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setShowAllProducts(false);
                  }}
                  className={`
                    rounded-full border px-4 py-1.5
                    font-sans text-[11px] font-bold uppercase tracking-[0.14em]
                    transition-all duration-300
                    ${
                      activeCategory === "all"
                        ? "border-[#5A0E14] bg-[#5A0E14] text-[#FFF8EC] shadow-[0_6px_16px_rgba(90,14,20,0.20)]"
                        : "border-[#5A0E14]/15 bg-transparent text-[#5A0E14]/75 hover:border-[#E9A534]/50 hover:text-[#3C080D]"
                    }
                  `}
                >
                  All
                </button>

                {categories.map((cat) => (
                  <div key={cat.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setShowAllProducts(false);
                      }}
                      className={`
                        rounded-full border px-4 py-1.5
                        font-sans text-[11px] font-bold uppercase tracking-[0.14em]
                        transition-all duration-300
                        ${
                          activeCategory === cat.name
                            ? "border-[#5A0E14] bg-[#5A0E14] text-[#FFF8EC] shadow-[0_6px_16px_rgba(90,14,20,0.20)]"
                            : "border-[#5A0E14]/15 bg-transparent text-[#5A0E14]/75 hover:border-[#E9A534]/50 hover:text-[#3C080D]"
                        }
                      `}
                    >
                      {cat.name}
                    </button>
                    {/* Subcategories Dropdown */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="flex flex-col gap-1 rounded-[9px] border border-[#5A0E14]/15 bg-[#FFFDF9] p-2 shadow-lg w-max min-w-[140px]">
                          {cat.children.map(child => (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => {
                                setActiveCategory(child.name);
                                setShowAllProducts(false);
                              }}
                              className={`
                                text-left px-3 py-2 rounded-[5px] font-sans text-[11px] font-bold uppercase tracking-[0.1em] transition-colors
                                ${activeCategory === child.name ? 'bg-[#5A0E14]/10 text-[#5A0E14]' : 'text-[#5A0E14]/70 hover:bg-[#FDECC8]/40 hover:text-[#3C080D]'}
                              `}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile filter button */}
              <div className="flex items-center justify-between md:hidden">
                <button
                  type="button"
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="
                    flex items-center gap-2 rounded-full border border-[#5A0E14]/15
                    px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em]
                    text-[#5A0E14]/75 transition-colors hover:border-[#E9A534]/50 hover:text-[#3C080D]
                  "
                >
                  <Filter className="h-3.5 w-3.5" strokeWidth={1.7} />
                  Filter
                  {activeCategory !== "all" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C1272D]" />
                  )}
                </button>

                {activeCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("all");
                      setShowAllProducts(false);
                    }}
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#C1272D] transition-colors hover:text-[#8B2F2B]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Mobile filter dropdown */}
              <AnimatePresence>
                {showMobileFilter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden md:hidden"
                  >
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#5A0E14]/10 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory("all");
                          setShowAllProducts(false);
                          setShowMobileFilter(false);
                        }}
                        className={`
                          rounded-full border px-4 py-1.5
                          font-sans text-[11px] font-bold uppercase tracking-[0.14em]
                          transition-all duration-300
                          ${
                            activeCategory === "all"
                              ? "border-[#5A0E14] bg-[#5A0E14] text-[#FFF8EC]"
                              : "border-[#5A0E14]/15 text-[#5A0E14]/75"
                          }
                        `}
                      >
                        All
                      </button>

                      {categories.map((cat) => (
                        <div key={cat.id} className="flex flex-col w-full gap-2 border-b border-[#5A0E14]/10 pb-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCategory(cat.name);
                              setShowAllProducts(false);
                              setShowMobileFilter(false);
                            }}
                            className={`
                              rounded-full border px-4 py-1.5 w-max
                              font-sans text-[11px] font-bold uppercase tracking-[0.14em]
                              transition-all duration-300
                              ${
                                activeCategory === cat.name
                                  ? "border-[#5A0E14] bg-[#5A0E14] text-[#FFF8EC]"
                                  : "border-[#5A0E14]/15 text-[#5A0E14]/75"
                              }
                            `}
                          >
                            {cat.name}
                          </button>
                          {cat.children && cat.children.length > 0 && (
                            <div className="flex flex-wrap gap-2 pl-4">
                              {cat.children.map(child => (
                                <button
                                  key={child.id}
                                  type="button"
                                  onClick={() => {
                                    setActiveCategory(child.name);
                                    setShowAllProducts(false);
                                    setShowMobileFilter(false);
                                  }}
                                  className={`
                                    rounded-full border px-3 py-1
                                    font-sans text-[10px] font-bold uppercase tracking-[0.14em]
                                    transition-all duration-300
                                    ${
                                      activeCategory === child.name
                                        ? "border-[#5A0E14] bg-[#5A0E14]/10 text-[#5A0E14]"
                                        : "border-[#5A0E14]/10 text-[#5A0E14]/60 bg-transparent"
                                    }
                                  `}
                                >
                                  ↳ {child.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ============================================
                GRID
            ============================================ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
              >
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product, index) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      index={index}
                      isWishlisted={userWishlistIds.has((product._id || product.id)?.toString())}
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-[9px] border border-dashed border-[#5A0E14]/20 bg-[#FDECC8]/20 py-16 text-center">
                    <p className="font-display text-[18px] text-[#3C080D]">
                      No products in this category yet.
                    </p>
                    <p className="mt-2 font-sans text-[13px] text-[#5A0E14]/55">
                      Explore other collections or reach out to us.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* View all button */}
            {products.length > 8 && (
              <Reveal>
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className="
                      group inline-flex items-center gap-2.5
                      rounded-full border border-[#5A0E14]
                      bg-[#5A0E14]
                      px-8 py-3.5
                      font-sans text-[11px] font-bold uppercase tracking-[0.16em]
                      text-[#FFF8EC]
                      shadow-[0_10px_26px_rgba(90,14,20,0.20)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#3C080D]
                      hover:shadow-[0_15px_34px_rgba(90,14,20,0.30)]
                    "
                  >
                    {showAllProducts ? (
                      <>
                        Show Less
                        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                      </>
                    ) : (
                      <>
                        View All {products.length} Products
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          DARK CTA BAND — 2-column with trust card
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#180205] py-20 text-[#FFF8EC] md:py-24">
        <div className="pointer-events-none absolute -top-40 right-[5%] h-[450px] w-[450px] rounded-full bg-[#650F18]/30 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-40 left-[5%] h-[400px] w-[400px] rounded-full bg-[#E9A534]/[0.05] blur-[120px]" />

        <span className="pointer-events-none absolute left-[10%] top-[30%] h-[2px] w-[2px] rounded-full bg-[#E9A534]/60" />
        <span className="pointer-events-none absolute right-[15%] bottom-[25%] h-[3px] w-[3px] rounded-full bg-[#E9A534]/50" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10 xl:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            {/* LEFT — Text */}
            <div>
              <Reveal>
                <Eyebrow tone="dark">Need Help Choosing?</Eyebrow>
              </Reveal>

              <Reveal delay={80}>
                <h2 className="mt-5 max-w-[560px] font-display text-[36px] font-medium leading-[1.05] tracking-[-0.025em] text-[#FFF8EC] sm:text-[44px] md:text-[52px]">
                  Not sure which crystal is{" "}
                  <span className="text-[#E9B957]">right for you?</span>
                </h2>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-5 max-w-[520px] font-sans text-[14px] leading-[1.75] text-[#F5E5C7]/75 sm:text-[15px]">
                  Our astrologers can help you choose based on your chart,
                  your intentions, and the energy you want to bring into
                  your space.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    className="
                      group inline-flex items-center justify-center gap-2.5
                      rounded-full border border-[#F2C66D]
                      bg-gradient-to-r from-[#F3D49B] to-[#DDB56D]
                      px-8 py-4
                      font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                      text-[#3C080D]
                      shadow-[0_10px_26px_rgba(0,0,0,0.30)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_15px_34px_rgba(0,0,0,0.40)]
                      cursor-pointer
                    "
                  >
                    Book a Consultation
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </button>

                  <a
                    href="tel:9560437360"
                    className="
                      group inline-flex items-center justify-center gap-2.5
                      rounded-full border border-[#E9A534]/50
                      bg-transparent px-8 py-4
                      font-sans text-[12px] font-bold uppercase tracking-[0.16em]
                      text-[#E9C76D]
                      transition-all duration-300
                      hover:border-[#E9A534]/85
                      hover:bg-[#E9A534]/[0.10]
                    "
                  >
                    <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
                    Call Us
                  </a>
                </div>
              </Reveal>
            </div>

            {/* RIGHT — Trust card */}
            <Reveal delay={200}>
              <div className="relative overflow-hidden rounded-[9px] border border-[#E9A534]/25 bg-gradient-to-br from-[#3C080D] via-[#2A0509] to-[#1F0306] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent" />

                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#E9C76D]">
                  Our Promise
                </p>

                <ul className="mt-5 space-y-4">
                  {[
                    { title: "Ethically Sourced", desc: "Every stone traced to origin" },
                    { title: "Cared Guidance", desc: "How to use and care included" },
                    { title: "Easy Returns", desc: "7-day return window" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#E9C76D]">
                        <Star className="h-4 w-4" strokeWidth={1.7} />
                      </div>
                      <div>
                        <p className="font-sans text-[13px] font-semibold text-[#FFF8EC]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 font-sans text-[11px] text-[#FDECC8]/60">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E9A534]/25 to-transparent" />
      </section>

      {/* Chakra rotation */}
      <style>{`
        @keyframes zodiacRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes zodiacRotate { from, to { transform: none; } }
        }
      `}</style>
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={{
          title: "Personal Astrology Consultation",
          type: "consultancy",
        }}
      />
    </main>
  );
}