import { motion } from "motion/react";
import { ShieldCheck, Receipt, Eye, Sparkles, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TrustStrip() {
  const { t } = useTranslation('home');
  const cards = [
    {
      icon: ShieldCheck,
      title: t('trust.card1Title'),
      desc: t('trust.card1Desc'),
      color: "text-[var(--womb-forest)]",
      bg: "bg-[var(--womb-forest)]/10 text-[var(--womb-forest)]",
      borderColor: "group-hover:border-[var(--womb-forest)]/40",
      shadowColor: "group-hover:shadow-[var(--womb-forest)]/20",
    },
    {
      icon: Receipt,
      title: t('trust.card2Title'),
      desc: t('trust.card2Desc'),
      color: "text-[var(--journey-saffron)]",
      bg: "bg-[var(--journey-saffron)]/15 text-[var(--journey-saffron)]",
      borderColor: "group-hover:border-[var(--journey-saffron)]/40",
      shadowColor: "group-hover:shadow-[var(--journey-saffron)]/20",
    },
    {
      icon: Eye,
      title: t('trust.card3Title'),
      desc: t('trust.card3Desc'),
      color: "text-[var(--future-sky)]",
      bg: "bg-[var(--future-sky)]/15 text-[var(--future-sky)]",
      borderColor: "group-hover:border-[var(--future-sky)]/40",
      shadowColor: "group-hover:shadow-[var(--future-sky)]/20",
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#FFFDF7]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-[40%] h-[40%] rounded-full bg-[var(--womb-forest)] opacity-[0.03] blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-[var(--journey-saffron)] opacity-[0.03] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #1D6E3F 1px, transparent 0)", backgroundSize: "48px 48px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center w-full max-w-3xl mb-16"
        >
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-[var(--womb-forest)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">
              <span className="text-[var(--womb-forest)]">Womb</span>To<span className="text-[var(--journey-saffron)]">18</span> {t('trust.badge')}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {t('trust.heading1')} <br />
            <span className="relative inline-block mt-1">
              <span className="relative z-10 bg-gradient-to-r from-[var(--womb-forest)] to-emerald-400 bg-clip-text text-transparent">
                {t('trust.heading2')}
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                className="absolute -bottom-2 md:-bottom-3 left-0 right-0 h-2 bg-[var(--journey-saffron)]/20 rounded-full origin-left -z-0"
              />
            </span>
          </h2>
        </motion.div>

        {/* Level, same-height Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch"
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group flex flex-col bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-500 ease-out cursor-default relative overflow-hidden ${card.borderColor} ${card.shadowColor} h-full`}
            >
              {/* Card Hover Ambient Flare */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-gray-50 to-white rounded-full opacity-50 blur-3xl group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
                <card.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-3 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {card.title}
                </h3>
                <p className="text-[13px] lg:text-sm text-gray-500 font-medium leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute top-8 right-8 text-gray-200 group-hover:text-gray-300 transition-colors duration-500">
                <Award className="w-8 h-8 opacity-20" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Illustration Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="relative mt-24 w-full max-w-5xl mx-auto z-0"
        >
          {/* Decorative Gradient fading into the illustration */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FFFDF7] via-[#FFFDF7]/80 to-transparent z-10 pointer-events-none" />
          
          <div className="flex justify-center overflow-hidden px-4">
            <img 
              src="/images/7732595_5222.svg" 
              alt="Trust Illustration" 
              className="w-[120%] md:w-full max-w-4xl h-auto transform transition-transform duration-1000 drop-shadow-sm opacity-90 hover:opacity-100 mix-blend-multiply"
            />
          </div>
          
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FFFDF7]/10 to-transparent pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
