import { ShieldPlus, Syringe, Brain, AlertTriangle, Leaf, Baby } from "lucide-react";
import { Link } from "react-router";
import { ScrollReveal } from "../ui/ScrollReveal";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function ServicesSection() {
  const { t } = useTranslation('home');

  const programs = [
    {
      icon: Baby,
      title: t('services.prog1Title'),
      description: t('services.prog1Desc'),
      route: "/programmes#maternal-care",
    },
    {
      icon: Leaf,
      title: t('services.prog2Title'),
      description: t('services.prog2Desc'),
      route: "/programmes#green-cohort",
    },
    {
      icon: Syringe,
      title: t('services.prog3Title'),
      description: t('services.prog3Desc'),
      route: "/programmes#vaccines",
    },
    {
      icon: ShieldPlus,
      title: t('services.prog4Title'),
      description: t('services.prog4Desc'),
      route: "/programmes#school-health",
    },
    {
      icon: AlertTriangle,
      title: t('services.prog5Title'),
      description: t('services.prog5Desc'),
      route: "/programmes#emergency-preparedness",
    },
    {
      icon: Brain,
      title: t('services.prog6Title'),
      description: t('services.prog6Desc'),
      route: "/programmes#mental-wellness",
    },
  ];
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--womb-forest)]/5 rounded-full blur-3xl -z-0"></div>
      
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-4 py-1.5 rounded-full text-sm font-semibold border border-[var(--journey-saffron)]/20 shadow-sm mb-4">
            {t('services.badge')}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-6" style={{ fontWeight: 800 }}>
            {t('services.heading1')} <span style={{ color: 'var(--womb-forest)' }}>{t('services.heading2')} </span>
          </h2>
          <p className="text-lg text-gray-600">
            {t('services.desc')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
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
