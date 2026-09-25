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
        fallbackTitle="Cosmic Nidhi - Birth Chart Reading, Vastu Consultation & Explore Zodiac Astrology" 
        fallbackDescription="Explore Cosmic Nidhi for authentic Vedic birth chart reading, personalized consultation, expert vastu guidance, and certified gemstone spiritual jewelry."
        fallbackKeywords="reading, vastu, birth, consultation, explore, birth chart reading, vastu consultation, astrology consultation, cosmic nidhi, vedic astrology"
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