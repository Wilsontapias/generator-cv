import "@/styles/globals.css";
import "@/styles/home.css";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CtaFinalSection } from "@/components/home/CtaFinalSection";

export default function Home() {
  return (
    <div className="home">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaFinalSection />
    </div>
  );
}
