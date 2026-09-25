import { Link } from "react-router-dom";
import { Sparkles, Home, ShoppingBag, Compass, ArrowLeft } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] flex items-center justify-center px-6 py-32">
      <SEOHead
        title="404 - Page Not Found | Cosmic Nidhi"
        description="The celestial page you are looking for does not exist or has moved in the cosmos."
        noindex={true}
      />
      <div className="max-w-xl text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#E9A534]/15 border border-[#E9A534]/40 text-[#A2691F] mb-6 shadow-lg shadow-[#E9A534]/10">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
        
        <p className="font-sans text-[12px] font-bold uppercase tracking-[0.28em] text-[#C1272D]">
          Error 404 · Celestial Coordinates Lost
        </p>
        
        <h1 className="mt-3 font-display text-[38px] sm:text-[48px] font-bold text-[#3C080D] leading-tight">
          Page Not Found
        </h1>
        
        <p className="mt-4 font-sans text-[15px] leading-relaxed text-[#5A0E14]/75">
          The stars could not align with the URL you requested. It may have been moved, renamed, or dissolved into the cosmic ether.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8E1B24] to-[#C1272D] px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#FFF7E9] shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            <Home size={16} /> Return Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[#5A0E14]/20 bg-[#FFFDF9] px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#3C080D] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10"
          >
            <ShoppingBag size={16} /> Explore Crystals
          </Link>
          <Link
            to="/calculators"
            className="inline-flex items-center gap-2 rounded-full border border-[#5A0E14]/20 bg-[#FFFDF9] px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#3C080D] transition-all hover:border-[#E9A534] hover:bg-[#E9A534]/10"
          >
            <Compass size={16} /> Free Calculators
          </Link>
        </div>
      </div>
    </main>
  );
}
