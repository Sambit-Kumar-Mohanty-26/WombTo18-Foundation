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
    <section className="py-20 bg-white text-gray-900">
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/7351733/pexels-photo-7351733.jpeg"
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
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>
              From the First Heartbeat to Their 18th Birthday
            </h2>
            <p className="text-gray-600 mb-4">
              WombTo18 Foundation is dedicated to ensuring that every child receives the care, nutrition, education, and support they need from the moment of conception through their 18th birthday.
            </p>
            <p className="text-gray-600 mb-8">
              We believe that the foundation for a successful life is laid long before a child enters a classroom. Our holistic approach addresses prenatal care, early childhood development, educational support, and youth empowerment.
            </p>
            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm text-gray-900">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
