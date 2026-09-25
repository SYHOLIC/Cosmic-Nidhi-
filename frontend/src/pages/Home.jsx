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
        fallbackTitle="Cosmic Nidhi - Vedic Astrology & Vastu Consultation" 
        fallbackDescription="Explore Cosmic Nidhi for authentic Vedic astrology, personalized birth chart readings, expert vastu consultation, and certified gemstones."
        fallbackKeywords="cosmic nidhi, vedic astrology, vastu consultation, birth chart, astrology, consultation"
        canonicalUrl="https://cosmic-nidhi.onrender.com"
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