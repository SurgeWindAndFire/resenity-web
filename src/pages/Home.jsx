import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import HeroSection from "../components/home/HeroSection.jsx";
import TrustStrip from "../components/home/TrustStrip.jsx";
import FeaturesSection from "../components/home/FeaturesSection.jsx";
import HowItWorksSection from "../components/home/HowItWorksSection.jsx";
import BuiltForSection from "../components/home/BuiltForSection.jsx";
import RoadmapTeaserSection from "../components/home/RoadmapTeaserSection.jsx";
import FinalCTASection from "../components/home/FinalCTASection.jsx";
import FadeIn from "../components/ui/FadeIn.jsx";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/home.css";

export default function HomePage() {
  usePageTitle("");
  
  return (
    <div id="page" className="page">
      <Navbar />
      <main>
        <HeroSection />
        
        <FadeIn>
          <TrustStrip />
        </FadeIn>
        
        <FadeIn>
          <FeaturesSection />
        </FadeIn>
        
        <FadeIn>
          <HowItWorksSection />
        </FadeIn>
        
        <FadeIn>
          <BuiltForSection />
        </FadeIn>
        
        <FadeIn>
          <RoadmapTeaserSection />
        </FadeIn>
        
        <FadeIn>
          <FinalCTASection />
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}