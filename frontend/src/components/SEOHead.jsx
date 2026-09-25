import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

let cachedSeoList = null;
let seoPromise = null;

const getSeoList = async () => {
  if (cachedSeoList) return cachedSeoList;
  if (seoPromise) return seoPromise;

  seoPromise = axios
    .get(`${API_URL}/seo`)
    .then((res) => {
      cachedSeoList = res.data.seoList || [];
      return cachedSeoList;
    })
    .catch((err) => {
      console.warn("Failed to fetch SEO config:", err.message);
      return [];
    })
    .finally(() => {
      seoPromise = null;
    });

  return seoPromise;
};

function updateMeta(attrName, attrValue, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function updateLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export default function SEOHead({
  pageName,
  title,
  description,
  keywords,
  image,
  type = "website",
  fallbackTitle,
  fallbackDescription,
  fallbackKeywords,
  fallbackImage,
  canonicalUrl,
  noindex = false,
  productData,
  breadcrumbs,
  structuredData,
}) {
  useEffect(() => {
    let isMounted = true;

    const applySEO = async () => {
      try {
        const seoList = await getSeoList();
        if (!isMounted) return;

        const pName = String(pageName || "").trim().toLowerCase();
        const match = pName
          ? seoList.find((s) => String(s?.pageName || "").trim().toLowerCase() === pName)
          : null;

        const finalTitle =
          match?.title ||
          title ||
          fallbackTitle ||
          "Cosmic Nidhi - Zodiac Jewelry, Crystals & Astrology";

        const finalDesc =
          match?.description ||
          description ||
          fallbackDescription ||
          "Discover premium handcrafted zodiac jewelry, authentic crystals, and sacred Vedic astrology consultations at Cosmic Nidhi.";

        const finalKeywords =
          match?.keywords ||
          keywords ||
          fallbackKeywords ||
          "cosmic nidhi, zodiac jewelry, crystals, astrology consultations, pitra dosh calculator, vedic remedies";

        const currentUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "https://cosmicnidhi.com");
        const finalImage = image || fallbackImage || "https://cosmicnidhi.com/assets/about-img.webp";

        // 1. Title Tag
        document.title = finalTitle;

        // 2. Standard Meta Tags
        updateMeta("name", "description", finalDesc);
        updateMeta("name", "keywords", finalKeywords);
        updateMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

        // 3. Open Graph Tags
        updateMeta("property", "og:type", type);
        updateMeta("property", "og:site_name", "Cosmic Nidhi");
        updateMeta("property", "og:title", finalTitle);
        updateMeta("property", "og:description", finalDesc);
        updateMeta("property", "og:url", currentUrl);
        updateMeta("property", "og:image", finalImage);

        // 4. Twitter Card Tags
        updateMeta("name", "twitter:card", "summary_large_image");
        updateMeta("name", "twitter:title", finalTitle);
        updateMeta("name", "twitter:description", finalDesc);
        updateMeta("name", "twitter:image", finalImage);

        // 5. Canonical Link
        updateLink("canonical", currentUrl);

        // 6. Structured Data (JSON-LD)
        if (structuredData) {
          setJsonLd("seo-custom-schema", structuredData);
        } else if (productData) {
          const productSchema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            name: productData.name,
            image: productData.images?.[0] || productData.image || finalImage,
            description: productData.description || finalDesc,
            sku: productData.sku || productData.SKU || `CN-${productData._id}`,
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: productData.price || 0,
              availability:
                (productData.stock ?? 1) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: currentUrl,
            },
          };
          if (productData.rating) {
            productSchema.aggregateRating = {
              "@type": "AggregateRating",
              ratingValue: productData.rating,
              reviewCount: Math.max(1, productData.numReviews || productData.reviews?.length || 1),
            };
          }
          setJsonLd("seo-custom-schema", productSchema);
        } else {
          const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Cosmic Nidhi",
            url: "https://cosmicnidhi.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://cosmicnidhi.com/products?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          };
          setJsonLd("seo-custom-schema", websiteSchema);
        }

        // 7. Breadcrumbs Schema
        if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
          const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((b, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: b.name,
              item: b.url.startsWith("http") ? b.url : `https://cosmicnidhi.com${b.url}`,
            })),
          };
          setJsonLd("seo-breadcrumb-schema", breadcrumbSchema);
        } else {
          setJsonLd("seo-breadcrumb-schema", null);
        }
      } catch (err) {
        console.error("Failed to fetch or apply SEO config", err);
        document.title = fallbackTitle || "Cosmic Nidhi";
      }
    };

    applySEO();

    return () => {
      isMounted = false;
    };
  }, [
    pageName,
    title,
    description,
    keywords,
    image,
    type,
    fallbackTitle,
    fallbackDescription,
    fallbackKeywords,
    fallbackImage,
    canonicalUrl,
    noindex,
    productData,
    breadcrumbs,
    structuredData,
  ]);

  return null;
}
