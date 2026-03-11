import { Link } from "react-router";
import { Button } from "../ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { ScrollReveal } from "../ui/ScrollReveal";

export function CallToDonate() {
  return (
    <section className="py-20 bg-background border-t border-white/5 text-white">
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <Heart className="h-12 w-12 mx-auto mb-6 fill-white/20" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6" style={{ fontWeight: 800 }}>
            Every Rupee Creates a Ripple of Change
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Your donation provides prenatal care, nutritious meals, school supplies, and hope to thousands of children. 100% of your contribution goes directly to our programs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20 px-8">
                Donate Now <Heart className="h-4 w-4 ml-2 fill-current" />
              </Button>
            </Link>
            <Link to="/impact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/5">
                See Our Impact <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}