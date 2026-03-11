import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/AboutSection";
import { ServicesSection } from "../components/sections/ServicesSection";
import { ImpactSection } from "../components/sections/ImpactSection";
import { DonorWall } from "../components/sections/DonorWall";
import { CallToDonate } from "../components/sections/CallToDonate";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ImpactSection />
      <DonorWall />
      <TestimonialsSection />
      <CallToDonate />
    </>
  );
}
