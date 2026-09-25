import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import SEOHead from "../components/SEOHead";

import { API_URL } from "../config/api";

export default function StaticPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/pages/${slug}`);
        setPage(res.data.page);
        document.title = `${res.data.page.title} | Cosmic Nidhi`;
      } catch (err) {
        console.error(err);
        navigate('/'); // Redirect home if page not found
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <Loader2 className="h-8 w-8 animate-spin text-[#A2691F]" />
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <SEOHead
        pageName={`page-${slug}`}
        fallbackTitle={`${page.title} | Cosmic Nidhi`}
        fallbackDescription={
          typeof page.content === "string"
            ? page.content.replace(/<[^>]*>?/gm, "").substring(0, 160)
            : `${page.title} - Cosmic Nidhi policies and information.`
        }
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: page.title, url: `/page/${slug}` },
        ]}
      />
      
      {/* Hero section */}
      <section className="relative pt-32 pb-16 bg-[#180205] text-center border-b border-[#E9A534]/15 overflow-hidden">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,165,52,0.12),transparent_70%)]" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="inline-flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.2em] text-[#E9A534]/80 font-sans">
            <span>Cosmic Nidhi</span>
            <span>✦</span>
            <span>Official Policy</span>
          </div>
          <h1 className="font-display text-[32px] md:text-[46px] font-bold text-[#E9A534]">
            {page.title}
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#E9A534]/30" />
            <span className="text-xs text-[#E9A534]/60">✦</span>
            <span className="h-px w-10 bg-[#E9A534]/30" />
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
        <div className="relative rounded-2xl border border-[#5A0E14]/12 bg-[#FFFDF9] p-6 sm:p-10 md:p-14 shadow-[0_20px_50px_rgba(60,8,13,0.06)]">
          {/* Subtle top gold gradient border */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent" />
          
          <div 
            className="
              static-page-content
              text-[#2C1210]
              font-sans
              text-[15px]
              sm:text-[16px]
              leading-relaxed
              [&_p]:text-justify
              [&_p]:leading-[1.85]
              [&_p]:mb-5
              [&_p]:text-[#3D1E16]
              [&_h1]:font-display
              [&_h1]:text-[28px]
              [&_h1]:font-bold
              [&_h1]:text-[#3C080D]
              [&_h1]:mb-6
              [&_h1]:pb-3
              [&_h1]:border-b
              [&_h1]:border-[#E9A534]/25
              [&_h2]:font-display
              [&_h2]:text-[22px]
              [&_h2]:sm:text-[24px]
              [&_h2]:font-bold
              [&_h2]:text-[#3C080D]
              [&_h2]:mt-10
              [&_h2]:mb-4
              [&_h2]:pt-5
              [&_h2]:border-t
              [&_h2]:border-[#5A0E14]/10
              [&_h2:first-of-type]:mt-0
              [&_h2:first-of-type]:pt-0
              [&_h2:first-of-type]:border-t-0
              [&_h3]:font-display
              [&_h3]:text-[17px]
              [&_h3]:font-semibold
              [&_h3]:text-[#A2691F]
              [&_h3]:mt-6
              [&_h3]:mb-3
              [&_ul]:list-disc
              [&_ul]:pl-6
              [&_ul]:space-y-2
              [&_ul]:my-5
              [&_li]:text-[#3D1E16]
              [&_li]:leading-relaxed
              [&_li]:text-justify
              [&_strong]:font-semibold
              [&_strong]:text-[#3C080D]
              [&_a]:text-[#A2691F]
              [&_a]:underline
              hover:[&_a]:text-[#7A4B0E]
            "
            dangerouslySetInnerHTML={{
              __html: (page.content || "")
                .replace(/<h1\b/gi, "<h2")
                .replace(/<\/h1>/gi, "</h2>")
            }}
          />
        </div>
      </main>
    </div>
  );
}
