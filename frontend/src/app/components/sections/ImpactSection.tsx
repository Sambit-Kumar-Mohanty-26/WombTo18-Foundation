import { TrendingUp, Users, Heart, GraduationCap, Home, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { ScrollReveal } from "../ui/ScrollReveal";

const metrics = [
  { icon: Users, value: "15,234", label: "Children Supported", color: "text-primary" },
  { icon: Heart, value: "3,500+", label: "Mothers Cared For", color: "text-primary" },
  { icon: GraduationCap, value: "8,100", label: "Students Educated", color: "text-primary" },
  { icon: Stethoscope, value: "45,000", label: "Health Check-ups", color: "text-primary" },
  { icon: Home, value: "200+", label: "Communities Reached", color: "text-primary" },
  { icon: TrendingUp, value: "98%", label: "Funds Utilized", color: "text-primary" },
];

export function ImpactSection() {
  return (
    <section className="py-20 bg-background text-white border-t border-white/5">
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 text-white">
          <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Our Impact</p>
          <h2 className="text-3xl sm:text-4xl text-white mb-4" style={{ fontWeight: 700 }}>
            Numbers That Tell Our Story
          </h2>
          <p className="text-emerald-200/70 max-w-2xl mx-auto">
            Every number represents a life changed, a family empowered, and a community strengthened.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="mx-auto h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <p className="text-3xl sm:text-4xl text-white mb-1" style={{ fontWeight: 800 }}>{metric.value}</p>
              <p className="text-sm text-emerald-200/50">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}