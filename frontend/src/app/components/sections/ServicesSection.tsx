import { Baby, GraduationCap, HeartPulse, Apple, Users, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ScrollReveal } from "../ui/ScrollReveal";

const programs = [
  {
    icon: Baby,
    title: "Prenatal Care",
    description: "Comprehensive healthcare for expectant mothers including nutrition, regular check-ups, and birth preparedness.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: HeartPulse,
    title: "Early Childhood Health",
    description: "Immunization drives, developmental screenings, and health monitoring for children aged 0-5.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Apple,
    title: "Nutrition Programs",
    description: "Mid-day meals, nutrition supplements, and awareness campaigns to combat child malnutrition.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: GraduationCap,
    title: "Education Support",
    description: "Scholarships, school supplies, tutoring, and digital literacy programs for children aged 6-18.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Youth Empowerment",
    description: "Skill development, mentorship, career counseling, and leadership programs for teenagers.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Shield,
    title: "Child Protection",
    description: "Advocacy, awareness, and support systems to protect children from abuse and exploitation.",
    color: "bg-green-50 text-green-600",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Our Programs</p>
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            Comprehensive Care at Every Stage
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our programs cover the full spectrum of a child's journey, ensuring no one falls through the cracks.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.title} className="group bg-white hover:shadow-md transition-all duration-300 border-gray-200">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <program.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-gray-900">{program.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">{program.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
