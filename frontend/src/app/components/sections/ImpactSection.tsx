import { TrendingUp, Users, Heart, GraduationCap, Home, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { ScrollReveal } from "../ui/ScrollReveal";
import { useTranslation } from "react-i18next";

export function ImpactSection() {
  const { t } = useTranslation('home');

  const metrics = [
    { icon: Users, value: "15,234", label: t('impact.stat1Label'), color: "text-primary" },
    { icon: Heart, value: "3,500+", label: t('impact.stat2Label'), color: "text-primary" },
    { icon: GraduationCap, value: "8,100", label: t('impact.stat3Label'), color: "text-primary" },
    { icon: Stethoscope, value: "45,000", label: t('impact.stat4Label'), color: "text-primary" },
    { icon: Home, value: "200+", label: t('impact.stat5Label'), color: "text-primary" },
    { icon: TrendingUp, value: "98%", label: t('impact.stat6Label'), color: "text-primary" },
  ];
  return (
    <section className="py-20 bg-white border-t border-gray-200">
      <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t('impact.badge')}</p>
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            {t('impact.heading')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('impact.desc')}
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
              className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition border border-gray-200"
            >
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <p className="text-3xl sm:text-4xl text-gray-900 mb-1" style={{ fontWeight: 800 }}>{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}