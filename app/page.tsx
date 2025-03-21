import FeaturesSection from "@/components/landing-page/FeaturesSection";
import HeroSection from "@/components/landing-page/HeroSection";
import InfoSection from "@/components/landing-page/InfoSection";
import PricingSection from "@/components/landing-page/PricingSection";
import TestimonialSection from "@/components/landing-page/TestimonialSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section*/}
      <HeroSection />
      {/* Features Section*/}
      <FeaturesSection />
      {/* Pricing Section*/}
      <PricingSection />
      {/* Info Section*/}
      <InfoSection />
      {/* Testimonials Section*/}
      <TestimonialSection />
    </div>
  );
}
