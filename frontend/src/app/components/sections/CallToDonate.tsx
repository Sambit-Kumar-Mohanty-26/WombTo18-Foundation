import { Link } from "react-router";
import { Button } from "../ui/button";
import { Heart, Handshake, UsersRound } from "lucide-react";
import { ScrollReveal } from "../ui/ScrollReveal";

export function CallToDonate() {
  return (
    <section className="py-24 bg-[var(--womb-forest)] text-white relative overflow-hidden">
      {/* Decorative abstract shapes */}
      <div className="absolute inset-0 overflow-hidden mix-blend-overlay opacity-20 pointer-events-none">
        <svg viewBox="0 0 800 800" className="absolute -top-64 -right-32 w-[1200px] h-[1200px] animate-spin-slow" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M437.5,655.5C361,681,268,693,198.5,640.5C129,588,83,471,94,374C105,277,173,200,247.5,148.5C322,97,403,71,489.5,84.5C576,98,668,151,707.5,230.5C747,310,734,416,684.5,491.5C635,567,549.5,612.5,437.5,655.5Z" />
        </svg>
      </div>

      <ScrollReveal className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-extrabold text-white leading-tight">
          Join the Movement
        </h2>
        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-medium">
          Whether you donate, volunteer, or partner as a corporate entity — you become a co-builder of an entire generation's future.
        </p>
        
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
          <Link to="/donate" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-white hover:bg-gray-100 text-[var(--womb-forest)] font-extrabold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all h-14 px-8 text-base rounded-xl">
              <Heart className="h-5 w-5 mr-2 fill-current" /> DONATE
            </Button>
          </Link>
          <Link to="/get-involved#volunteer" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-bold shadow-xl hover:-translate-y-1 transition-all h-14 px-8 text-base rounded-xl backdrop-blur-sm">
              <UsersRound className="h-5 w-5 mr-2" /> VOLUNTEER
            </Button>
          </Link>
          <Link to="/get-involved#csr" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full bg-[var(--journey-saffron)] border-none text-white hover:bg-[#2e4d54] font-extrabold shadow-xl hover:-translate-y-1 transition-all h-14 px-8 text-base rounded-xl">
              <Handshake className="h-5 w-5 mr-2" /> PARTNER (CSR/ESG)
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}