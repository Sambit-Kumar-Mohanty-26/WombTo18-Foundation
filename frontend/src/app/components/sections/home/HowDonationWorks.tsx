import { motion } from "motion/react";
import { HeartHandshake, ShieldCheck, AreaChart } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HowDonationWorks() {
  const { t } = useTranslation('home');

  const steps = [
    {
      icon: HeartHandshake,
      title: t('howDonation.step1Title'),
      description: t('howDonation.step1Desc'),
      delay: 0.1
    },
    {
      icon: ShieldCheck,
      title: t('howDonation.step2Title'),
      description: t('howDonation.step2Desc'),
      delay: 0.4
    },
    {
      icon: AreaChart,
      title: t('howDonation.step3Title'),
      description: t('howDonation.step3Desc'),
      delay: 0.7
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--journey-saffron)]/5 via-white to-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-6" style={{ fontWeight: 800 }}>
            {t('howDonation.heading')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('howDonation.desc')}
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-1 bg-gray-100 rounded-full">
            <motion.div 
              className="h-full bg-[var(--journey-saffron)] rounded-full"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: false }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: step.delay }}
                className="flex flex-col items-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-36 h-36 rounded-full bg-white shadow-xl border-4 border-white flex items-center justify-center mb-8 relative z-10"
                  style={{
                    background: `linear-gradient(135deg, white 40%, var(--journey-saffron) 150%)`
                  }}
                >
                  <div className="w-24 h-24 rounded-full bg-[var(--journey-saffron)]/10 flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-[var(--journey-saffron)]" />
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
