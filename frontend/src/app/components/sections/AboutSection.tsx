import { CheckCircle } from "lucide-react";
import { ScrollReveal } from "../ui/ScrollReveal";

const highlights = [
  "Registered 80G & 12A certified NGO",
  "Operating across 12 states in India",
  "100% transparent fund utilization",
  "Partnerships with 50+ hospitals",
];

export function AboutSection() {
  return (
    <section className="py-20 bg-background text-white">
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1770261430761-192b0b72e4a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBjaGlsZCUyMGNhcmUlMjBwcmVnbmFuY3l8ZW58MXx8fHwxNzczMTM0MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Mother and child care"
              className="rounded-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-xl p-5 shadow-lg">
              <p className="text-3xl" style={{ fontWeight: 800 }}>18</p>
              <p className="text-sm">Years of Journey</p>
            </div>
          </div>

          <div>
            <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>About Us</p>
            <h2 className="text-3xl sm:text-4xl text-foreground mb-6" style={{ fontWeight: 700 }}>
              From the First Heartbeat to Their 18th Birthday
            </h2>
            <p className="text-muted-foreground mb-4">
              WombTo18 Foundation is dedicated to ensuring that every child receives the care, nutrition, education, and support they need from the moment of conception through their 18th birthday.
            </p>
            <p className="text-muted-foreground mb-8">
              We believe that the foundation for a successful life is laid long before a child enters a classroom. Our holistic approach addresses prenatal care, early childhood development, educational support, and youth empowerment.
            </p>
            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
