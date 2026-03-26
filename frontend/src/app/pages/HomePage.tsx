import { HeroSection } from "../components/sections/HeroSection";
import { AnimatedQuoteSection } from "../components/sections/home/AnimatedQuoteSection";
// import { ImpactTicker } from "../components/sections/home/ImpactTicker";
import { OurCredentials } from "../components/sections/home/OurCredentials";
import { TrustStrip } from "../components/sections/home/TrustStrip";
import { AboutSection } from "../components/sections/AboutSection";
import { ServicesSection } from "../components/sections/ServicesSection";
import { HowDonationWorks } from "../components/sections/home/HowDonationWorks";
import { ImpactSection } from "../components/sections/ImpactSection";
import { DonorWall } from "../components/sections/DonorWall";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { CertificationsStrip } from "../components/sections/home/CertificationsStrip";
import { CallToDonate } from "../components/sections/CallToDonate";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AnimatedQuoteSection />
      {/* <ImpactTicker /> */}
      <OurCredentials />
      <TrustStrip />
      <ServicesSection />
      <HowDonationWorks />
      <AboutSection />
      <TestimonialsSection />
      <CertificationsStrip />
      <CallToDonate />
    </>
  );
}
