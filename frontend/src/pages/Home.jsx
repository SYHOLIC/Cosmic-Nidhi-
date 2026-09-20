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
        fallbackTitle="Cosmic Nidhi - Zodiac Jewelry & Astrology" 
        fallbackDescription="Discover premium zodiac-themed jewelry, authentic crystals, and personalized astrology services at Cosmic Nidhi."
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