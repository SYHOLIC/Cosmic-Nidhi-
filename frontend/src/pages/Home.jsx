import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Signs from "../components/Signs";
import Services from "../components/Services";
import Voices from "../components/Voices";
import CTA from "../components/CTA";
import Pricing from "../components/Pricing";
import ProductCategories from "../components/ProductCategories";
import SEOHead from "../components/SEOHead";

function Home() {
  return (
    <main className="relative">
      <SEOHead 
        pageName="home" 
        fallbackTitle="Cosmic Nidhi - Zodiac Jewelry, Crystals & Vedic Astrology" 
        fallbackDescription="Discover premium handcrafted zodiac-themed jewelry, authentic certified crystals, and personalized Vedic astrology consultations at Cosmic Nidhi."
        fallbackKeywords="cosmic nidhi, zodiac jewelry, crystals, pitra dosh calculator, vedic astrology, astrologer consultation"
        canonicalUrl="https://cosmicnidhi.com"
      />
      <Hero />
      <Marquee />
      <About />
      <Signs />
      <Services />
      <ProductCategories />
      <Voices />
      <Pricing/>
      <CTA />
    </main>
  );
}

export default Home;