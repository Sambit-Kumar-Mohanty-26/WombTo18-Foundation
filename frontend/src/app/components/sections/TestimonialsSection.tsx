import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sunita Verma",
    role: "Partner Pediatrician",
    initials: "SV",
    quote: "WombTo18's prenatal program has reduced infant mortality in our district by 40%. Their systematic approach to maternal health is truly remarkable.",
  },
  {
    name: "Ramesh Gupta",
    role: "Corporate Donor",
    initials: "RG",
    quote: "The transparency dashboard lets us see exactly where our CSR funds go. It's refreshing to work with an NGO that values accountability this much.",
  },
  {
    name: "Lakshmi Devi",
    role: "Program Beneficiary",
    initials: "LD",
    quote: "My daughter received a scholarship from WombTo18 and is now studying engineering. This foundation gave us hope when we had none.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 text-white">
          <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Testimonials</p>
          <h2 className="text-3xl sm:text-4xl text-white mb-4" style={{ fontWeight: 700 }}>
            Voices of Impact
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="bg-emerald-950/20 border-white/10 text-white">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/10 mb-4" />
                <p className="text-emerald-50/90 text-sm mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-white" style={{ fontWeight: 600 }}>{t.name}</p>
                    <p className="text-xs text-emerald-100/70">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
