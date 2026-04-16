import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Landmark, FileText, Globe, Building2, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, BadgeCheck } from "lucide-react";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

function CredentialCard({ cred, idx }: { cred: any; idx: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ delay: idx * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="group relative cursor-pointer will-change-transform"
    >
      {/* Outer glow on hover */}
      <motion.div
        className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${cred.accentMedium}, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      
      {/* Card Body */}
      <div
        className="relative flex flex-col h-full rounded-[1.75rem] p-7 lg:p-9 transition-all duration-500 overflow-hidden"
        style={{
          background: isHovered
            ? `linear-gradient(145deg, #ffffff 0%, ${cred.accentLight} 100%)`
            : "linear-gradient(145deg, #ffffff 0%, #fafaf8 100%)",
          border: isHovered
            ? `1.5px solid ${cred.accentMedium}`
            : "1.5px solid rgba(0,0,0,0.04)",
          boxShadow: isHovered
            ? `0 24px 48px -12px rgba(0,0,0,0.08), 0 0 0 1px ${cred.accentLight}`
            : "0 4px 20px -4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: `linear-gradient(90deg, ${cred.accentColor}, transparent)`,
            transformOrigin: "left",
          }}
        />

        {/* Corner shimmer */}
        <motion.div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle, ${cred.accentLight} 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-start">
          {/* Icon + Badge Row */}
          <div className="flex items-start justify-between w-full mb-7">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden transition-all duration-500"
              animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                background: isHovered ? cred.accentColor : cred.accentLight,
                boxShadow: isHovered
                  ? `0 8px 20px -4px ${cred.accentMedium}`
                  : "none",
              }}
            >
              <cred.icon
                className="w-6 h-6 transition-colors duration-500"
                style={{ color: isHovered ? "#fff" : cred.accentColor }}
              />
            </motion.div>

            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-[0.12em] transition-all duration-500"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              style={{
                background: isHovered ? cred.accentColor : cred.accentLight,
                color: isHovered ? "#fff" : cred.accentColor,
              }}
            >
              <BadgeCheck className="w-3 h-3" />
              {cred.badge}
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3
              className="text-xl font-black text-gray-900 tracking-tight leading-tight mb-1.5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {cred.title}
            </h3>
            <p
              className="text-[10px] font-bold mb-4 uppercase tracking-[0.15em]"
              style={{ color: cred.accentColor, opacity: 0.8 }}
            >
              {cred.subtitle}
            </p>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              {cred.description}
            </p>
          </div>

          {/* Footer */}
          <motion.div
            className="mt-7 flex items-center justify-between w-full pt-5"
            style={{ borderTop: `1px solid ${isHovered ? cred.accentLight : 'rgba(0,0,0,0.04)'}` }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-300"
              style={{ color: isHovered ? cred.accentColor : '#94a3b8' }}
            >
              {cred.stats}
            </span>
            <motion.div
              animate={isHovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.3 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight
                className="w-4 h-4 transition-colors duration-300"
                style={{ color: isHovered ? cred.accentColor : '#cbd5e1' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function OurCredentials() {
  const { t } = useTranslation('home');

  const credentials = [
    {
      icon: Landmark,
      title: t('credentials.card1Title'),
      subtitle: t('credentials.card1Subtitle'),
      description: t('credentials.card1Desc'),
      accentColor: "var(--womb-forest)",
      accentLight: "rgba(29,110,63,0.08)",
      accentMedium: "rgba(29,110,63,0.15)",
      badge: t('credentials.verified'),
      stats: t('credentials.card1Stats'),
    },
    {
      icon: FileText,
      title: t('credentials.card2Title'),
      subtitle: t('credentials.card2Subtitle'),
      description: t('credentials.card2Desc'),
      accentColor: "var(--journey-saffron)",
      accentLight: "rgba(255,153,0,0.08)",
      accentMedium: "rgba(255,153,0,0.15)",
      badge: t('credentials.verified'),
      stats: t('credentials.card2Stats'),
    },
    {
      icon: Globe,
      title: t('credentials.card3Title'),
      subtitle: t('credentials.card3Subtitle'),
      description: t('credentials.card3Desc'),
      accentColor: "var(--future-sky)",
      accentLight: "rgba(0,174,239,0.08)",
      accentMedium: "rgba(0,174,239,0.15)",
      badge: t('credentials.verified'),
      stats: t('credentials.card3Stats'),
    },
    {
      icon: Building2,
      title: t('credentials.card4Title'),
      subtitle: t('credentials.card4Subtitle'),
      description: t('credentials.card4Desc'),
      accentColor: "#7c3aed",
      accentLight: "rgba(124,58,237,0.08)",
      accentMedium: "rgba(124,58,237,0.15)",
      badge: t('credentials.verified'),
      stats: t('credentials.card4Stats'),
    },
  ];

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFDF7 0%, #f8f7f2 50%, #FFFDF7 100%)" }}>
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: "var(--womb-forest)" }} />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.03] blur-[100px]" style={{ background: "#7c3aed" }} />
        
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1D6E3F 0.8px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Branding & Highlight */}
          <div className="lg:col-span-4">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(29,110,63,0.08) 0%, rgba(29,110,63,0.04) 100%)",
                    border: "1px solid rgba(29,110,63,0.12)"
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--womb-forest)]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--womb-forest)]">
                    {t('credentials.badge')}
                  </span>
                </motion.div>
                
                {/* Heading */}
                <motion.h2 
                  className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.1, duration: 0.7 }}
                >
                  <span className="text-gray-900">
                    {t('credentials.heading1')}
                  </span>
                  <br />
                  <span className="relative inline-block mt-1">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-400">
                      {t('credentials.heading2')}
                    </span>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-[var(--womb-forest)] to-emerald-300 rounded-full origin-left"
                    />
                  </span>
                </motion.h2>
                
                <motion.p
                  className="mt-6 text-sm text-gray-600 leading-relaxed italic font-medium"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  "{t('credentials.quote')}"
                </motion.p>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="space-y-2 mt-6"
              >
                {[
                  t('credentials.check1'),
                  t('credentials.check2'),
                  t('credentials.check3'),
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded-full bg-[var(--womb-forest)]/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-[var(--womb-forest)]" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-semibold">{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative mt-8 overflow-hidden rounded-2xl group max-w-[85%]"
              >
                <img 
                  src="/images/19197952.jpg" 
                  alt="Financial Metrics" 
                  className="w-full h-auto rounded-2xl object-cover drop-shadow-lg transform transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column: 2×2 Card Grid */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
              {credentials.map((cred, idx) => (
                <CredentialCard key={cred.title} cred={cred} idx={idx} />
              ))}
            </div>

            {/* Bottom Trust Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex items-center justify-center gap-3 flex-wrap"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[var(--womb-forest)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  {t('credentials.footer')}
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}