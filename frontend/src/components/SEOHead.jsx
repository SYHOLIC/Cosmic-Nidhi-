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

export default function SEOHead({ pageName, title, description, fallbackTitle, fallbackDescription }) {
  useEffect(() => {
    let isMounted = true;

    const fetchSEO = async () => {
      try {
        const seoList = await getSeoList();
        if (!isMounted) return;

        const pName = String(pageName || "").trim().toLowerCase();
        const match = pName
          ? seoList.find((s) => String(s?.pageName || "").trim().toLowerCase() === pName)
          : null;

        const finalTitle = match?.title || fallbackTitle || title || "Cosmic Nidhi - Zodiac & Astrology";
        const finalDesc = match?.description || fallbackDescription || description || "Discover premium zodiac jewelry, crystals, and astrology services.";
        
        document.title = finalTitle;
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = finalDesc;

        if (match?.keywords) {
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
          }
          metaKeywords.content = match.keywords;
        }

      } catch (err) {
        console.error("Failed to fetch SEO config", err);
        document.title = fallbackTitle || "Cosmic Nidhi";
      }
    };

    fetchSEO();
    return () => {
      isMounted = false;
    };
  }, [pageName, fallbackTitle, fallbackDescription]);

  return null;
}
