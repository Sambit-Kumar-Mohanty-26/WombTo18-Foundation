import { ShieldPlus, Syringe, Brain, AlertTriangle, Leaf, Baby } from "lucide-react";
import { Link } from "react-router";
import { ScrollReveal } from "../ui/ScrollReveal";
import { motion } from "motion/react";

const programs = [
  {
    icon: ShieldPlus,
    title: "Integrated School Health",
    description: "Annual screenings, doctor-led camps, WASH education, and emergency readiness in our Health Promoting Schools.",
    route: "/programmes#school-health",
  },
  {
    icon: Syringe,
    title: "Vaccines",
    description: "Our 9-touchpoint structured reminder system ensuring no child misses a critical dose.",
    route: "/programmes#vaccines",
  },
  {
    icon: Brain,
    title: "Mental Wellness",
    description: "Mental health and emotional regulation support tailored from prenatal stages right through to adolescence.",
    route: "/programmes#mental-wellness",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Preparedness",
    description: "Hands-on disaster response and first-aid training led by real heroes on school campuses.",
    route: "/programmes#emergency-preparedness",
  },
  {
    icon: Leaf,
    title: "Green Cohort",
    description: "One enrolled child equals one geo-tagged tree planted—India's first Carbon-Neutral Child Cohort.",
    route: "/programmes#green-cohort",
  },
  {
    icon: Baby,
    title: "Maternal Care",
    description: "Prenatal stress reduction, bonding exercises, and birth-preparedness support for expecting mothers.",
    route: "/programmes#maternal-care",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--womb-forest)]/5 rounded-full blur-3xl -z-0"></div>
      
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-4 py-1.5 rounded-full text-sm font-semibold border border-[var(--journey-saffron)]/20 shadow-sm mb-4">
            Programmes at a Glance
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-6" style={{ fontWeight: 800 }}>
            32 Services. <span style={{ color: 'var(--womb-forest)' }}>One Seamless Journey.</span>
          </h2>
          <p className="text-lg text-gray-600">
            From the moment of conception through adolescence, we unite healthcare, education, and environment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group h-full"
            >
              <Link to={program.route} className="block h-full cursor-pointer">
                <div className="h-full bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  
                  {/* Decorative background accent inside card */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-[var(--womb-forest)]/5 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                  
                  <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-[var(--womb-forest)]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--womb-forest)] group-hover:text-white transition-all duration-300 text-[var(--womb-forest)]">
                      <program.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--journey-saffron)] transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {program.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
