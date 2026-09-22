import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gem,
  Sparkles,
  Flame,
  BookOpen,
  Home,
  Moon,
  Star,
  ShoppingBag,
  Eye,
  Heart,
  ArrowRight,
  Minus,
} from "lucide-react";
import Reveal from "./Reveal";

// ============================================================================
// CATEGORIES
// ============================================================================

const CATEGORIES = [
  {
    id: 1,
    name: "Crystals & Gemstones",
    slug: "crystals",
    icon: Gem,
    description:
      "Natural crystals and gemstones for healing, meditation and spiritual practices",
    image:
      "https://www.crystalage.com/img/products/amethyst-cluster-uruguayan-8cm_66.jpg?w=800&h=600&fit=crop",
    productCount: 24,
  },
  {
    id: 2,
    name: "Spiritual Jewelry",
    slug: "jewelry",
    icon: Sparkles,
    description:
      "Handcrafted jewelry with healing stones, rudraksha, and gemstone beads",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
    productCount: 18,
  },
  {
    id: 3,
    name: "Puja & Ritual Items",
    slug: "puja",
    icon: Flame,
    description:
      "Incense, diyas, yantras, and ritual items for spiritual practices",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.YF5MioibMUoo-PSW_NtuvAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3?w=800&h=600&fit=crop",
    productCount: 20,
  },
  {
    id: 4,
    name: "Books & Guides",
    slug: "books",
    icon: BookOpen,
    description:
      "Books on astrology, numerology, Vastu, and spiritual growth",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop",
    productCount: 12,
  },
  {
    id: 5,
    name: "Home Decor & Vastu",
    slug: "home-decor",
    icon: Home,
    description:
      "Vastu-friendly home decor, crystals, and energy-balancing items",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
    productCount: 16,
  },
  {
    id: 6,
    name: "Yantras & Sacred Symbols",
    slug: "yantras",
    icon: Moon,
    description:
      "Sacred yantras, Sri Yantra, and spiritual symbols for meditation",
    image:
      "https://i.pinimg.com/originals/24/f8/33/24f833c00818b27942008a13589cf7b3.jpg?w=800&h=600&fit=crop",
    productCount: 10,
  },
];

// ============================================================================
// PRODUCTS
// ============================================================================

const PRODUCTS = [
  {
    id: 1,
    name: "Amethyst Crystal Cluster",
    price: "₹499",
    originalPrice: "₹699",
    image:
      "https://th.bing.com/th?id=OPAC.1TJUkijeB8%2B0xQ474C474&w=380&h=380&o=5&dpr=1.3&pid=21.1?w=500&h=500&fit=crop",
    category: "Crystals & Gemstones",
    rating: 4.9,
    reviews: 127,
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Rose Quartz Heart",
    price: "₹399",
    originalPrice: "₹549",
    image:
      "https://cdn11.bigcommerce.com/s-74zp6w28re/images/stencil/1280x1280/products/3754/87810/new-moon-beginnings-rose-quartz-heart-polished-crystal-csp-aa526__32694.1647332411.jpg?c=1?w=500&h=500&fit=crop",
    category: "Crystals & Gemstones",
    rating: 4.8,
    reviews: 98,
    inStock: true,
    badge: "Love Stone",
  },
  {
    id: 3,
    name: "Citrine Point",
    price: "₹599",
    originalPrice: "₹799",
    image:
      "https://th.bing.com/th/id/OIP.IOP-e-U3veYR2kfI0Lvx7AHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3?w=500&h=500&fit=crop",
    category: "Crystals & Gemstones",
    rating: 4.7,
    reviews: 76,
    inStock: true,
    badge: "Success Stone",
  },
  {
    id: 4,
    name: "Clear Quartz Tower",
    price: "₹349",
    originalPrice: "₹499",
    image:
      "https://m.media-amazon.com/images/I/71V6lR7hDbS.jpg?w=500&h=500&fit=crop",
    category: "Crystals & Gemstones",
    rating: 4.6,
    reviews: 54,
    inStock: true,
    badge: "Healing Stone",
  },
  {
    id: 5,
    name: "Selenite Wand",
    price: "₹699",
    originalPrice: "₹899",
    image:
      "https://shop.atperrys.com/cdn/shop/products/cf5080850659f23007e527f6bbe1c78b.jpg?v=1684615486&width=950?w=500&h=500&fit=crop",
    category: "Crystals & Gemstones",
    rating: 4.8,
    reviews: 62,
    inStock: true,
    badge: "Popular",
  },
  {
    id: 6,
    name: "Lapis Lazuli Sphere",
    price: "₹799",
    originalPrice: "₹999",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.AW8vLG6SDd_nhf4Sjqe_fQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3?w=500&h=500&fit=crop",
    category: "Crystals & Gemstones",
    rating: 4.7,
    reviews: 43,
    inStock: true,
    badge: "Wisdom Stone",
  },
  {
    id: 7,
    name: "Rudraksha Mala 108 Beads",
    price: "₹899",
    originalPrice: "₹1,199",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2026/2/586452784/TJ/NY/FO/83730477/rudraksha-mala-1000x1000.png?w=500&h=500&fit=crop",
    category: "Spiritual Jewelry",
    rating: 4.9,
    reviews: 203,
    inStock: true,
    badge: "Sacred",
  },
  {
    id: 8,
    name: "Gemstone Bracelet",
    price: "₹699",
    originalPrice: "₹899",
    image:
      "https://venusgems.com/cdn/shop/files/amethyst-bracelet-with-venus-gems-watermark.png?v=1767531070&width=810?w=500&h=500&fit=crop",
    category: "Spiritual Jewelry",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    badge: "Handmade",
  },
  {
    id: 9,
    name: "Crystal Pendant Necklace",
    price: "₹1,299",
    originalPrice: "₹1,699",
    image:
      "https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=500&h=500&fit=crop",
    category: "Spiritual Jewelry",
    rating: 4.8,
    reviews: 67,
    inStock: true,
    badge: "Limited",
  },
  {
    id: 10,
    name: "Natural Incense Sticks Set",
    price: "₹249",
    originalPrice: "₹349",
    image:
      "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=500&h=500&fit=crop",
    category: "Puja & Ritual Items",
    rating: 4.5,
    reviews: 134,
    inStock: true,
    badge: "Popular",
  },
  {
    id: 11,
    name: "Brass Diya Set of 5",
    price: "₹399",
    originalPrice: "₹549",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2024/2/391660133/YP/OH/WN/164197319/brass-lotus-shape-5-step-diya-1000x1000.jpg?w=500&h=500&fit=crop",
    category: "Puja & Ritual Items",
    rating: 4.6,
    reviews: 78,
    inStock: true,
    badge: "Traditional",
  },
  {
    id: 12,
    name: "Astrology Guide Book",
    price: "₹499",
    originalPrice: "₹699",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop",
    category: "Books & Guides",
    rating: 4.7,
    reviews: 45,
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: 13,
    name: "Numerology Workbook",
    price: "₹399",
    originalPrice: "₹549",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
    category: "Books & Guides",
    rating: 4.6,
    reviews: 32,
    inStock: true,
    badge: "New",
  },
  {
    id: 14,
    name: "Vastu Pyramid",
    price: "₹799",
    originalPrice: "₹999",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=500&h=500&fit=crop",
    category: "Home Decor & Vastu",
    rating: 4.4,
    reviews: 56,
    inStock: true,
    badge: "Vastu",
  },
  {
    id: 15,
    name: "Crystal Tree",
    price: "₹1,499",
    originalPrice: "₹1,999",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=500&h=500&fit=crop",
    category: "Home Decor & Vastu",
    rating: 4.8,
    reviews: 41,
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: 16,
    name: "Sri Yantra",
    price: "₹599",
    originalPrice: "₹799",
    image:
      "https://images.unsplash.com/photo-1609766418204-2d5a71b1c8f3?w=500&h=500&fit=crop",
    category: "Yantras & Sacred Symbols",
    rating: 4.9,
    reviews: 88,
    inStock: true,
    badge: "Sacred",
  },
  {
    id: 17,
    name: "Om Yantra",
    price: "₹499",
    originalPrice: "₹699",
    image:
      "https://images.unsplash.com/photo-1620503374956-c942862f0372?w=500&h=500&fit=crop",
    category: "Yantras & Sacred Symbols",
    rating: 4.7,
    reviews: 56,
    inStock: true,
    badge: "Meditation",
  },
];

// ============================================================================
// SAFE IMAGE
// ============================================================================

function SafeImage({
  src,
  alt,
  className = "",
  iconFallback: Icon = Gem,
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-[#5A0E14] to-[#250408]`}
      >
        <Icon className="h-8 w-8 text-[#E9A534]/45" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-[#5A0E14]/10" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`
          ${className}
          ${loaded ? "opacity-100" : "opacity-0"}
          transition-opacity duration-500
        `}
      />
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

const formatPrice = (val) => {
  if (val == null || val === "") return "";
  if (typeof val === "string" && val.includes("₹")) return val;
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? String(val) : `₹${num.toLocaleString("en-IN")}`;
};

const discountPct = (price, original) => {
  const toNum = (val) => {
    if (val == null || val === "") return 0;
    if (typeof val === "number") return val;
    return parseInt(String(val).replace(/[₹,\s]/g, ""), 10) || 0;
  };
  const p = toNum(price);
  const o = toNum(original);

  if (!o || o <= p) return null;

  return Math.round(((o - p) / o) * 100);
};

// ============================================================================
// CATEGORY CARD
// ============================================================================

function CategoryCard({ category, index }) {
  const Icon = category.icon;

  return (
    <motion.article
      initial={{ opacity: 0, x: -35 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ y: -6 }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: "easeOut",
      }}
      viewport={{
        once: true,
        margin: "-70px",
      }}
      className="
        group
        relative
        h-[285px]
        w-[230px]
        shrink-0
        overflow-hidden
        rounded-[7px]
        border
        border-[#E9A534]/20
        bg-[#3C080D]
        shadow-[0_15px_45px_rgba(60,8,13,0.18)]
        sm:h-[310px]
        sm:w-[245px]
        lg:h-[325px]
        lg:w-[255px]
      "
    >
      {/* Image */}

      <SafeImage
        src={category.image}
        alt={category.name}
        iconFallback={Icon}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-transform
          duration-[900ms]
          ease-out
          group-hover:scale-110
        "
      />

      {/* Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#190205]
          via-[#3C080D]/55
          to-[#3C080D]/10
        "
      />

      {/* Gold top line */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#E9A534]/70
          to-transparent
        "
      />

      {/* Icon */}

      <div
        className="
          absolute
          left-4
          top-4
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-[#E9A534]/50
          bg-[#210307]/40
          text-[#E9A534]
          backdrop-blur-sm
        "
      >
        <Icon
          className="h-4 w-4"
          strokeWidth={1.5}
        />
      </div>

      {/* Content */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          p-4
          sm:p-5
        "
      >
        <p
          className="
            mb-2
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[#E9A534]
          "
        >
          {category.productCount} Products
        </p>

        <h3
          className="
            font-display
            text-[21px]
            leading-[1.02]
            text-[#FFF8EC]
            sm:text-[23px]
          "
        >
          {category.name}
        </h3>

        <p
          className="
            mt-2
            line-clamp-2
            text-[10px]
            leading-[1.55]
            text-[#FFF8EC]/65
          "
        >
          {category.description}
        </p>

        <div
          className="
            mt-4
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-[#E9A534]/65
            text-[#E9A534]
            transition-all
            duration-300
            group-hover:bg-[#E9A534]
            group-hover:text-[#3C080D]
          "
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================================
// PRODUCT CARD
// ============================================================================

function ProductCard({ product, index }) {
  const [wishlisted, setWishlisted] = useState(false);

  const off = discountPct(
    product.price,
    product.originalPrice
  );

  const isAvailable = product.inStock !== undefined ? product.inStock : (product.stock === undefined || product.stock > 0);
  const productImage = product.images?.[0] || product.image || "";
  const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : (product.reviews || 0);

  return (
    <motion.article
      initial={{
        opacity: 0,
        x: -35,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      className="
        group
        relative
        w-[235px]
        shrink-0
        overflow-hidden
        rounded-[7px]
        border
        border-[#5A0E14]/10
        bg-[#FFFDF9]
        shadow-[0_10px_30px_rgba(60,8,13,0.07)]
        transition-shadow
        duration-300
        hover:shadow-[0_18px_42px_rgba(60,8,13,0.13)]
        sm:w-[250px]
        lg:w-[260px]
        xl:w-[270px]
      "
    >
      {/* ================================================================ */}
      {/* IMAGE                                                            */}
      {/* ================================================================ */}

      <div
        className="
          relative
          h-[205px]
          overflow-hidden
          bg-[#F4E4C8]/30
          sm:h-[220px]
          lg:h-[230px]
        "
      >
        <SafeImage
          src={productImage}
          alt={product.name}
          iconFallback={Gem}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#3C080D]/10
            to-transparent
          "
        />

        {/* Badge */}

        {product.badge && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-[#FFF8EC]/92
              px-2.5
              py-1
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#5A0E14]
              shadow-sm
              backdrop-blur-sm
            "
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}

        <button
          type="button"
          onClick={() =>
            setWishlisted((value) => !value)
          }
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="
            absolute
            right-3
            top-3
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-[#FFF8EC]/90
            text-[#5A0E14]/55
            shadow-sm
            backdrop-blur-sm
            transition-transform
            duration-200
            hover:scale-110
          "
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              wishlisted
                ? "fill-[#9C1C22] text-[#9C1C22]"
                : "text-[#5A0E14]/60"
            }`}
          />
        </button>

        {/* Quick View */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            translate-y-full
            bg-gradient-to-t
            from-[#3C080D]/90
            to-transparent
            px-3
            pb-3
            pt-10
            transition-transform
            duration-300
            group-hover:translate-y-0
          "
        >
          <button
            type="button"
            className="
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-[5px]
              bg-[#FFF8EC]/95
              py-2
              text-[10px]
              font-medium
              text-[#3C080D]
            "
          >
            <Eye className="h-3 w-3" />
            Quick View
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* DETAILS                                                           */}
      {/* ================================================================ */}

      <div className="p-4">
        {/* Rating */}

        <div className="flex items-center gap-1.5">
          <Star
            className="
              h-3
              w-3
              fill-[#E9A534]
              text-[#E9A534]
            "
          />

          <span
            className="
              text-[9px]
              font-semibold
              text-[#3C080D]
            "
          >
            {product.rating}
          </span>

          <span
            className="
              text-[8px]
              text-[#6B443D]/50
            "
          >
            ({reviewCount})
          </span>

          {isAvailable && (
            <span
              className="
                ml-auto
                text-[8px]
                font-medium
                text-green-700
              "
            >
              In stock
            </span>
          )}
        </div>

        {/* Name */}

        <h3
          className="
            mt-2
            min-h-[42px]
            line-clamp-2
            font-display
            text-[17px]
            leading-[1.15]
            text-[#3C080D]
            lg:text-[18px]
          "
        >
          {product.name}
        </h3>

        {/* Price */}

        <div
          className="
            mt-2
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              font-display
              text-[19px]
              font-semibold
              text-[#5A0E14]
            "
          >
            {formatPrice(product.price)}
          </span>

          {product.originalPrice && (
            <span
              className="
                text-[10px]
                text-[#6B443D]/40
                line-through
              "
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}

          {off && (
            <span
              className="
                text-[9px]
                font-semibold
                text-green-700
              "
            >
              {off}% off
            </span>
          )}
        </div>

        {/* Add to Cart */}

        <button
          type="button"
          disabled={!isAvailable}
          className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-[5px]
            bg-[#5A0E14]
            py-2.5
            text-[10px]
            font-semibold
            text-[#FFF8EC]
            transition-colors
            duration-200
            hover:bg-[#3C080D]
            disabled:cursor-not-allowed
            disabled:bg-[#5A0E14]/20
            disabled:text-[#5A0E14]/40
          "
        >
          <ShoppingBag className="h-3.5 w-3.5" />

          {product.inStock
            ? "Add to Cart"
            : "Notify Me"}
        </button>
      </div>
    </motion.article>
  );
}

// ============================================================================
// HORIZONTAL SCROLL ROW
// ============================================================================

function HorizontalScrollRow({
  children,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Right fade */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          z-20
          h-full
          w-16
          bg-gradient-to-l
          from-[#210307]
          to-transparent
          lg:w-20
        "
      />

      <div
        className="
          flex
          gap-3
          overflow-x-auto
          pb-4
          pr-8
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-[#E9A534]/35
          sm:gap-4
          lg:gap-4
          xl:gap-5
        "
        style={{
          scrollbarWidth: "thin",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProductCategories() {
  const [showAllProducts, setShowAllProducts] =
    useState(false);

  const displayedProducts = showAllProducts
    ? PRODUCTS
    : PRODUCTS.slice(0, 4);

  const toggleProducts = () => {
    setShowAllProducts((current) => !current);
  };

  return (
    <section className="relative overflow-hidden">

      {/* ================================================================== */}
      {/* 01 — CATEGORIES                                                   */}
      {/* ================================================================== */}

      <section
        className="
          relative
          flex
          min-h-[calc(100svh-88px)]
          w-full
          items-center
          overflow-hidden
          bg-[#210307]
        "
      >
        {/* Background atmosphere */}

        <div className="pointer-events-none absolute inset-0">

          <div
            className="
              absolute
              left-[-12%]
              top-[-10%]
              h-[650px]
              w-[650px]
              rounded-full
              bg-[#B94A36]/10
              blur-[120px]
            "
          />

          <div
            className="
              absolute
              right-[-10%]
              bottom-[-20%]
              h-[600px]
              w-[600px]
              rounded-full
              bg-[#E9A534]/[0.045]
              blur-[130px]
            "
          />

          {/* Fine grid */}

          <div
            className="
              absolute
              inset-0
              opacity-25
              [background-image:linear-gradient(rgba(233,165,52,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(233,165,52,0.035)_1px,transparent_1px)]
              [background-size:55px_55px]
            "
          />

          {/* Stars */}

          <div
            className="
              absolute
              left-[8%]
              top-[18%]
              h-1
              w-1
              rounded-full
              bg-[#E9A534]/50
              shadow-[0_0_10px_rgba(233,165,52,0.5)]
            "
          />

          <div
            className="
              absolute
              left-[27%]
              top-[72%]
              h-1
              w-1
              rounded-full
              bg-[#FFF8EC]/30
            "
          />

          <div
            className="
              absolute
              right-[21%]
              top-[18%]
              h-1
              w-1
              rounded-full
              bg-[#E9A534]/40
            "
          />

          <div
            className="
              absolute
              right-[8%]
              bottom-[22%]
              h-1
              w-1
              rounded-full
              bg-[#FFF8EC]/25
            "
          />
        </div>

        {/* Main layout */}

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            min-h-[calc(100svh-88px)]
            w-full
            max-w-[1500px]
            grid-cols-1
            items-center
            gap-10
            px-5
            py-12
            sm:px-7
            lg:grid-cols-[260px_1fr]
            lg:gap-12
            lg:px-10
            lg:py-16
            xl:grid-cols-[275px_1fr]
            xl:gap-14
            xl:px-12
          "
        >

          {/* ============================================================ */}
          {/* LEFT CONTENT                                                  */}
          {/* ============================================================ */}

          <div className="lg:flex lg:flex-col lg:justify-center">

            <Reveal>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.27em]
                  text-[#E9A534]
                "
              >
                Shop Our Store
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h2
                className="
                  mt-3
                  font-display
                  text-[40px]
                  leading-[0.94]
                  tracking-[-0.02em]
                  text-[#FFF8EC]
                  sm:text-[46px]
                  lg:text-[48px]
                  xl:text-[54px]
                "
              >
                Explore
                <br />
                <span className="text-[#E9A534]">
                  Categories
                </span>
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p
                className="
                  mt-5
                  max-w-[250px]
                  text-[12px]
                  leading-[1.75]
                  text-[#FFF8EC]/55
                  lg:text-[13px]
                "
              >
                Discover thoughtfully selected
                spiritual tools, crystals, sacred
                objects and guides for your journey.
              </p>
            </Reveal>

            <Reveal delay={250}>
              <div
                className="
                  mt-7
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#E9A534]/70
                "
              >
                <span className="h-px w-8 bg-[#E9A534]/50" />
                Scroll to explore
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Reveal>

          </div>

          {/* ============================================================ */}
          {/* CATEGORY ROW                                                  */}
          {/* ============================================================ */}

          <div className="min-w-0">

            <HorizontalScrollRow>

              {CATEGORIES.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}

            </HorizontalScrollRow>

            {/* Scroll indicator */}

            <div
              className="
                mt-1
                flex
                items-center
                justify-end
                gap-2
                text-[8px]
                uppercase
                tracking-[0.18em]
                text-[#FFF8EC]/25
              "
            >
              <span>Swipe / Scroll</span>
              <ArrowRight className="h-3 w-3" />
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================== */}
      {/* 02 — PRODUCTS                                                      */}
      {/* ================================================================== */}

      <section
        className="
          relative
          flex
          min-h-[calc(100svh-88px)]
          w-full
          items-center
          overflow-hidden
          border-t
          border-[#5A0E14]/10
          bg-[#FFF8EC]
        "
      >

        {/* Background */}

        <div className="pointer-events-none absolute inset-0">

          <div
            className="
              absolute
              left-[-100px]
              top-[-120px]
              h-[500px]
              w-[500px]
              rounded-full
              bg-[#E9A534]/[0.055]
              blur-[110px]
            "
          />

          <div
            className="
              absolute
              right-[-100px]
              bottom-[-100px]
              h-[500px]
              w-[500px]
              rounded-full
              bg-[#B94A36]/[0.035]
              blur-[110px]
            "
          />

          <div
            className="
              absolute
              left-0
              right-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#E9A534]/30
              to-transparent
            "
          />

        </div>

        {/* Main layout */}

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            min-h-[calc(100svh-88px)]
            w-full
            max-w-[1500px]
            grid-cols-1
            items-center
            gap-10
            px-5
            py-12
            sm:px-7
            lg:grid-cols-[260px_1fr]
            lg:gap-12
            lg:px-10
            lg:py-16
            xl:grid-cols-[275px_1fr]
            xl:gap-14
            xl:px-12
          "
        >

          {/* ============================================================ */}
          {/* LEFT PRODUCT CONTENT                                          */}
          {/* ============================================================ */}

          <div className="lg:flex lg:flex-col lg:justify-center">

            <Reveal>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.27em]
                  text-[#5A0E14]/65
                "
              >
                Curated Collection
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h2
                className="
                  mt-3
                  font-display
                  text-[40px]
                  leading-[0.94]
                  tracking-[-0.02em]
                  text-[#3C080D]
                  sm:text-[46px]
                  lg:text-[48px]
                  xl:text-[54px]
                "
              >
                Sacred
                <br />
                <span className="text-[#8B2F2B]">
                  Products
                </span>
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p
                className="
                  mt-5
                  max-w-[250px]
                  text-[12px]
                  leading-[1.75]
                  text-[#6B443D]/70
                  lg:text-[13px]
                "
              >
                Curated spiritual tools to support
                your journey with intention, balance
                and positive energy.
              </p>
            </Reveal>

            <Reveal delay={250}>
              <button
                type="button"
                onClick={toggleProducts}
                className="
                  mt-7
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-[#5A0E14]
                  px-5
                  py-2.5
                  text-[10px]
                  font-semibold
                  text-[#FFF8EC]
                  shadow-[0_8px_25px_rgba(90,14,20,0.15)]
                  transition-all
                  duration-300
                  hover:bg-[#3C080D]
                  hover:shadow-[0_12px_30px_rgba(90,14,20,0.2)]
                "
              >
                {showAllProducts
                  ? "Show Featured Products"
                  : "View All Products"}

                {showAllProducts ? (
                  <Minus className="h-3.5 w-3.5" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </button>
            </Reveal>

          </div>

          {/* ============================================================ */}
          {/* PRODUCTS — ONE HORIZONTAL ROW                                */}
          {/* ============================================================ */}

          <div className="min-w-0">

            <AnimatePresence mode="wait">

              <motion.div
                key={
                  showAllProducts
                    ? "all-products"
                    : "featured-products"
                }
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                }}
                transition={{
                  duration: 0.35,
                }}
              >

                {/* Horizontal products */}

                <div className="relative">

                  {/* Right fade */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      right-0
                      top-0
                      z-20
                      h-full
                      w-16
                      bg-gradient-to-l
                      from-[#FFF8EC]
                      to-transparent
                      lg:w-20
                    "
                  />

                  <div
                    className="
                      flex
                      gap-3
                      overflow-x-auto
                      pb-5
                      pr-8
                      scrollbar-thin
                      scrollbar-track-transparent
                      scrollbar-thumb-[#5A0E14]/25
                      sm:gap-4
                      lg:gap-4
                      xl:gap-5
                    "
                    style={{
                      scrollbarWidth: "thin",
                    }}
                  >

                    {displayedProducts.map(
                      (product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      )
                    )}

                  </div>

                </div>

              </motion.div>

            </AnimatePresence>

            {/* Bottom scroll hint */}

            <div
              className="
                mt-1
                flex
                items-center
                justify-end
                gap-2
                text-[8px]
                uppercase
                tracking-[0.18em]
                text-[#5A0E14]/30
              "
            >
              <span>
                {showAllProducts
                  ? `${PRODUCTS.length} products`
                  : "4 featured products"}
              </span>

              <ArrowRight className="h-3 w-3" />

              <span>
                Swipe / Scroll
              </span>
            </div>

          </div>

        </div>
      </section>
    </section>
  );
}