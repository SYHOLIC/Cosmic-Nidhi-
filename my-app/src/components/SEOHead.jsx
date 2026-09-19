import { useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SEOHead({ pageName, fallbackTitle, fallbackDescription }) {
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await axios.get(`${API_URL}/seo`);
        const seoList = res.data.seoList || [];
        const match = seoList.find(s => s.pageName.toLowerCase() === pageName.toLowerCase());

        const finalTitle = match?.title || fallbackTitle || "Cosmic Nidhi - Zodiac & Astrology";
        const finalDesc = match?.description || fallbackDescription || "Discover premium zodiac jewelry, crystals, and astrology services.";
        
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
  }, [pageName, fallbackTitle, fallbackDescription]);

  return null;
}
