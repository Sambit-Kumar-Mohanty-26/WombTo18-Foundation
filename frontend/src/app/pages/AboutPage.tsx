import { Heart, Globe, Users, Target, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { motion, useTransform, useSpring, useMotionValue, useMotionTemplate } from "motion/react";
import React from "react";

const womboValues = [
  { letter: "W", title: "Wellness", desc: "Comprehensive health — physical, mental, emotional — from pregnancy through age 18. Health is not the absence of illness; it is the fullness of a well-supported life." },
  { letter: "O", title: "Outreach", desc: "We go to communities. We do not wait for communities to come to us. Every initiative is designed with accessibility and equity at its centre." },
  { letter: "M", title: "Measurable", desc: "Every programme must be measurable. If we cannot measure it, we will not claim it. Accountability is foundational, never optional." },
  { letter: "B", title: "Belonging", desc: "Every child — regardless of geography, income, or background — belongs within the circle of our care. Inclusion is the mission itself." },
  { letter: "O", title: "Optimisation", desc: "We use technology, data, and the Health Promoting Schools framework to continuously improve every intervention. Good enough is never good enough." },
];

function ValueCard({ val, index }: { val: typeof womboValues[0], index: number }) {
  const mouseX = useMotionValue(150);
  const mouseY = useMotionValue(200);

  const springConfig = { damping: 20, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [0, 400], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(150);
    mouseY.set(200);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full sm:h-full">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.95 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: 0.8,
              delay: index * 0.1,
              ease: [0.23, 1, 0.32, 1],
              when: "beforeChildren",
              staggerChildren: 0.2
            }
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group w-full will-change-transform sm:h-full sm:min-h-[300px] lg:min-h-[320px]"
      >
        {/* Cinematic Ambient Glow */}
        <div className="absolute -inset-0.5 rounded-[1.2rem] bg-gradient-to-br from-[var(--womb-forest)]/40 via-transparent to-[var(--journey-saffron)]/40 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 pointer-events-none" />

        {/* Main Card */}
        <div className="relative bg-[#fdfcfb] rounded-[1rem] p-4 sm:p-5 lg:p-6 xl:p-8 pt-7 sm:pt-8 xl:pt-10 border border-gray-200/50 shadow-sm overflow-hidden flex flex-col items-center justify-start text-center transition-all duration-700 group-hover:bg-white group-hover:border-[var(--womb-forest)]/20 group-hover:shadow-[0_20px_40px_-15px_rgba(29,110,63,0.15)] z-10 w-full sm:h-full">

          {/* Spotlight */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[1rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  250px circle at ${smoothMouseX}px ${smoothMouseY}px,
                  rgba(29,110,63,0.08),
                  transparent 80%
                )
              `,
            }}
          />

          {/* Background WOMBO Letter */}
          <motion.div
            variants={itemVariants}
            className="absolute top-0 right-0 -mr-1 -mt-3 text-[5.5rem] sm:text-[6.5rem] lg:text-[9rem] font-black leading-none text-gray-100/70 transition-all duration-700 ease-[0.23,1,0.32,1] z-0 select-none pointer-events-none origin-top-right group-hover:scale-110 group-hover:-translate-x-3 group-hover:translate-y-2 group-hover:text-[var(--womb-forest)]/10"
            style={{ transform: "translateZ(10px)" }}
          >
            {val.letter}
          </motion.div>

          {/* Content Wrapper */}
          <div
            className="relative z-10 flex flex-col items-center justify-start w-full sm:flex-1"
            style={{ transform: "translateZ(30px)" }}
          >
            <motion.div variants={itemVariants} className="relative mb-3 lg:mb-4 w-full">
              <h3 className="text-[1.05rem] sm:text-[1.15rem] xl:text-[1.25rem] font-black text-[var(--womb-forest)] transition-colors duration-500 group-hover:text-[var(--journey-saffron)] tracking-tighter">
                {val.title}
              </h3>
              <div className="absolute -bottom-[8px] left-1/2 w-0 h-[2.5px] bg-gradient-to-r from-[var(--womb-forest)] to-[var(--journey-saffron)] transition-all duration-500 ease-out group-hover:w-[80%] group-hover:left-[10%] rounded-full opacity-0 group-hover:opacity-100" />
            </motion.div>

            <motion.p variants={itemVariants} className="text-[0.78rem] sm:text-[0.8rem] xl:text-[0.85rem] text-gray-600 leading-[1.6] font-medium transition-colors duration-500 group-hover:text-gray-900 mt-2 px-1">
              {val.desc}
            </motion.p>
          </div>

          {/* Flash Sweep */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[1rem]">
            <div className="absolute top-0 left-[-150%] w-[100%] h-full transform -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[250%] transition-all duration-[1.2s] ease-in-out" />
          </div>

        </div>
      </motion.div>
    </div>
  );
}

const advisoryBoard = [
  {
    name: "Dr. Pramod Jog",
    role: "Former President, Indian Academy of Pediatrics (IAP)",
    image: "/Dr.-Pramod-Jog.jpg",
    bio: [
      "Chairman, India's Vaccine Advisory Committee (ACVIP)",
      "Pioneer of 'Goodbye Polio' grassroots movement",
      "Global contributor to GAVI and IPA",
      "Brings 40+ years of pediatric and public health leadership"
    ]
  },
  {
    name: "Dr. Tanmay R. Amladi",
    role: "Former HOD Neonatology, Wadia Maternity Hospital",
    image: "/Tanmay.webp",
    bio: [
      "Past President, IAP Mumbai",
      "WHO and UNICEF collaborator on child health missions",
      "35+ years of excellence in pediatrics and neonatology",
      "Currently practising at Prime Healthcare Group, Dubai"
    ]
  },
  {
    name: "Eshwar Reddy",
    role: "President • WOMBTO18 Foundation",
    image: "/Eshwar Reddy.jpg",
    bio: [
      "Currently advising an AI SaaS startup in New Jersey",
      "18+ years of enterprise operations leadership across India and the US",
      "Leads the Foundation's institutional strategy",
      "Applies scalable systems thinking to school-based health delivery"
    ]
  }
];

/* ─── Story chapter data ─── */
const storyChapters = [
  {
    number: "01",
    accent: "var(--womb-forest)",
    heading: "The Problem",
    body: "India loses over <strong>800,000 children</strong> every year to causes that are entirely preventable. Millions more fall silently through the gaps — missing vaccines by days, growing up without access to mental health support, attending schools that lack even the most basic health infrastructure.",
    highlight: "800,000 children lost every year"
  },
  {
    number: "02",
    accent: "var(--journey-saffron)",
    heading: "The Gap",
    body: "No single platform had ever been built to hold a child's health journey together — from the moment of conception through adolescence — with full transparency to donors and families alike. <strong>WOMBTO18 Foundation was created to change that.</strong>",
    highlight: "A shortage of connection"
  },
  {
    number: "03",
    accent: "var(--womb-forest)",
    heading: "The Spark",
    body: "It began as a pilot in Pune under the initiative <strong>OTAAT</strong> (One Text at a Time) — a deceptively simple idea: send timely vaccine reminders to expecting mothers via SMS, WhatsApp and Email. The results were immediate and humbling. Lives changed by a single, well-timed message. That proof of concept became a movement, and that movement became a Foundation.",
    highlight: "One Text at a Time"
  },
  {
    number: "04",
    accent: "var(--journey-saffron)",
    heading: "Today",
    body: "WOMBTO18 Foundation operates as India's first integrated child health non-profit platform — uniting <strong>32 health services</strong> across pregnancy, infancy, childhood, and adolescence. Delivered through schools, hospitals, and communities. Serving 25 schools today. Scaling to 300.",
    highlight: "32 health services united"
  }
];

export function AboutPage() {

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-[#fef6ed] to-white overflow-hidden relative border-b border-gray-100">
        {/* Subtle Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full max-w-4xl mx-auto"
          >
            <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--journey-saffron)]/20 mb-4 sm:mb-6 shadow-sm">
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] text-gray-900 mb-6" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              We Didn't Start With a Plan. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400 drop-shadow-sm">We Started With a Question.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
              Why, in a country of 1.4 billion people — with brilliant doctors, dedicated teachers, and parents who would do anything for their children — do we still lose so many?
            </p>
          </motion.div>
        </div>
      </section>

      {storyChapters.map((chapter, i) => (
        <section
          key={chapter.number}
          className={`relative py-28 sm:py-36 overflow-hidden ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"}`}
        >
          {/* Accent glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-200px" }}
            transition={{ duration: 1.5 }}
            className={`absolute ${i % 2 === 0 ? "top-[-20%] right-[-10%]" : "bottom-[-20%] left-[-10%]"} w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none`}
            style={{ background: `radial-gradient(ellipse at center, ${chapter.accent} 0%, transparent 70%)`, opacity: 0.06 }}
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`grid lg:grid-cols-12 gap-12 lg:gap-20 items-center ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}>

              {/* Number + Highlight Column */}
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`lg:col-span-4 flex flex-col ${i % 2 !== 0 ? "lg:order-2 lg:items-end lg:text-right" : "items-start text-left"}`}
                style={{ direction: "ltr" }}
              >
                <span
                  className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black leading-none tracking-tighter select-none"
                  style={{ color: chapter.accent, opacity: 0.1 }}
                >
                  {chapter.number}
                </span>
                <div className="mt-[-2rem] sm:mt-[-3rem] relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${chapter.accent}15`, border: `1px solid ${chapter.accent}30` }}>
                      <Zap className="w-5 h-5" style={{ color: chapter.accent }} />
                    </div>
                    <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: chapter.accent }}>Chapter {chapter.number}</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4" style={{ lineHeight: 1.08 }}>
                    {chapter.heading}
                  </h2>
                  <div className="px-4 py-3 rounded-xl border-l-4 bg-gray-50" style={{ borderColor: chapter.accent }}>
                    <p className="text-sm font-bold" style={{ color: chapter.accent }}>{chapter.highlight}</p>
                  </div>
                </div>
              </motion.div>

              {/* Body Text Column */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`lg:col-span-8 ${i % 2 !== 0 ? "lg:order-1" : ""}`}
                style={{ direction: "ltr" }}
              >
                <p
                  className="text-xl sm:text-2xl lg:text-[1.7rem] text-gray-700 leading-[1.75] font-serif tracking-tight"
                  dangerouslySetInnerHTML={{ __html: chapter.body }}
                />
              </motion.div>

            </div>
          </div>
        </section>
      ))}

      {/* ════════════════════════════════════════════════════════
          FOUNDING PHILOSOPHY — Full-width immersive quote
      ════════════════════════════════════════════════════════ */}
      <section className="relative py-32 sm:py-40 bg-gradient-to-b from-[#FFFDF7] to-white overflow-hidden border-y border-gray-100">
        {/* Animated glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_60%)] opacity-[0.04] blur-[100px] rounded-full" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--womb-forest)]/10 border border-[var(--womb-forest)]/20 flex items-center justify-center mb-10">
              <span className="text-4xl text-[var(--womb-forest)] font-serif font-bold">"</span>
            </div>

            <blockquote className="text-3xl sm:text-4xl md:text-5xl text-gray-900 font-serif italic leading-[1.3] tracking-tight mb-12" style={{ fontWeight: 400 }}>
              We don't just want to treat children when they fall sick. We want to build the conditions in which they{" "}
              <span className="not-italic font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400">
                never become sick
              </span>{" "}
              in the first place.
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="w-[60px] h-[1px] bg-gray-300" />
              <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">Founding Philosophy</p>
              <div className="w-[60px] h-[1px] bg-gray-300" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white p-10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/60 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden relative group"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--journey-saffron)]/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--journey-saffron)]/10 to-[var(--journey-saffron)]/5 flex items-center justify-center mb-6 border border-[var(--journey-saffron)]/20 shadow-inner"
              >
                <Target className="w-8 h-8 text-[var(--journey-saffron)]" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl font-extrabold text-gray-900 mb-4"
              >
                Our Mission
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg text-gray-600 leading-relaxed mb-6"
              >
                To ensure that every child in India — from the moment of conception to the age of 18 — has access to integrated, evidence-based health support, quality education infrastructure, and an environmental legacy worth inheriting.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-sm text-gray-500 bg-gray-50/50 p-5 rounded-xl border border-gray-100/80 shadow-inner"
              >
                Delivered through a dual-entity model: <strong className="text-gray-900 font-bold">WOMBTO18 Integrated Care Pvt Ltd</strong> drives tech innovation; <strong className="text-gray-900 font-bold">WOMBTO18 Foundation</strong> drives access, equity, and community impact.
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="bg-white p-10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/60 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden relative group"
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--future-sky)]/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <motion.div
                initial={{ y: -80, opacity: 0, scale: 0.8, rotate: -20 }}
                whileInView={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.6, duration: 1.2, delay: 0.5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--future-sky)]/10 to-[var(--future-sky)]/5 flex items-center justify-center mb-6 border border-[var(--future-sky)]/20 shadow-inner"
              >
                <Globe className="w-8 h-8 text-[var(--future-sky)]" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-3xl font-extrabold text-gray-900 mb-6"
              >
                Our Vision — 2030
              </motion.h2>

              <ul className="space-y-4">
                {[
                  "25 million children/families supported with preventive care.",
                  "300+ schools operating as WHO-standard Health Promoting Schools.",
                  "Zero preventable child deaths from vaccine-preventable diseases in partners.",
                  "India’s first Carbon-Neutral Child Cohort — 1 tree per child.",
                  "Every donor empowered with real-time tracking dashboards."
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 + (i * 0.15) }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-[var(--future-sky)] to-blue-400 text-white flex items-center justify-center mt-0.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values - W.O.M.B.O. */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The philosophical framework driving our operations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6 items-stretch">
            {womboValues.map((val, i) => (
              <ValueCard key={val.title} val={val} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Certifications — Constellation Reveal */}
      <section className="relative py-28 sm:py-36 bg-[#0a0f1a] text-white overflow-hidden">
        {/* Animated Particle Field */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? 'var(--journey-saffron)' : i % 3 === 1 ? 'var(--womb-forest)' : '#ffffff',
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [0, -30, -60],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 4 + 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Radial gradient background from center */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,_rgba(227,171,59,0.08)_0%,_transparent_60%)] rounded-full blur-[40px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(29,110,63,0.06)_0%,_transparent_70%)] rounded-full blur-[60px]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-5 py-2 rounded-full text-[10px] font-black tracking-[0.25em] uppercase border border-[var(--journey-saffron)]/20 mb-6 backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5" /> Verified & Certified
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4" style={{ lineHeight: 1.05 }}>
              Governance &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-amber-300">
                Certifications
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Accountable. Audited. Transparent.</p>
          </motion.div>

          {/* Central Shield + Constellation */}
          <div className="relative">
            {/* Central Shield Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
              className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 rounded-full items-center justify-center"
            >
              {/* Shield glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--journey-saffron)]/30"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-[var(--journey-saffron)]/15"
                animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--journey-saffron)] to-amber-500 flex items-center justify-center shadow-[0_0_60px_rgba(227,171,59,0.4)]">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </motion.div>

            {/* SVG Connecting Lines (desktop only) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block" style={{ overflow: "visible" }}>
              {[
                { x1: "50%", y1: "50%", x2: "20%", y2: "18%" },
                { x1: "50%", y1: "50%", x2: "80%", y2: "18%" },
                { x1: "50%", y1: "50%", x2: "15%", y2: "72%" },
                { x1: "50%", y1: "50%", x2: "85%", y2: "72%" },
                { x1: "50%", y1: "50%", x2: "50%", y2: "100%" },
              ].map((line, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="url(#goldGradient)"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                />
              ))}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--journey-saffron)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--journey-saffron)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Cards Grid — Orbital Layout */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto relative z-10"
            >
              {[
                { cert: "12A Registration", desc: "Foundation income is tax-exempt. All activities are public benefit.", icon: "🏛️" },
                { cert: "80G Certification", desc: "Donations are eligible for tax benefits under Section 80G of the Income Tax Act.", icon: "📜" },
                { cert: "NGO DARPAN Recognition", desc: "NITI Aayog registered for transparency & funding.", icon: "🚀" },
                { cert: "TechSoup India", desc: "Verified non-profit for global tech grants.", icon: "🌐" },
              ].map((item, i) => (
                <motion.div
                  key={item.cert}
                  variants={{
                    hidden: {
                      opacity: 0,
                      scale: 0.5,
                      y: 60,
                      rotate: i % 2 === 0 ? -8 : 8,
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 80,
                        damping: 15,
                        delay: 0.6 + i * 0.15,
                      },
                    },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative rounded-[1.2rem] p-6 sm:p-7 cursor-pointer overflow-hidden"
                  style={{ backdropFilter: "blur(20px)" }}
                >
                  {/* Glassmorphism card bg */}
                  <div className="absolute inset-0 rounded-[1.2rem] bg-white/[0.04] border border-white/[0.08] group-hover:bg-white/[0.08] group-hover:border-[var(--journey-saffron)]/30 transition-all duration-700" />

                  {/* Hover glow */}
                  <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-br from-[var(--journey-saffron)]/0 via-transparent to-[var(--womb-forest)]/0 group-hover:from-[var(--journey-saffron)]/15 group-hover:to-[var(--womb-forest)]/10 blur-xl transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-100" />

                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[1.2rem]">
                    <div className="absolute top-0 left-[-150%] w-[100%] h-full transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[350%] transition-all duration-[1.5s] ease-in-out" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex items-start gap-5">
                    <motion.div
                      className="w-14 h-14 shrink-0 rounded-2xl bg-[var(--journey-saffron)]/10 group-hover:bg-[var(--journey-saffron)]/20 flex items-center justify-center text-2xl transition-all duration-500 border border-[var(--journey-saffron)]/10 group-hover:border-[var(--journey-saffron)]/40 group-hover:shadow-[0_0_30px_rgba(227,171,59,0.2)]"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-lg sm:text-xl text-white group-hover:text-[var(--journey-saffron)] transition-colors duration-500 mb-1.5 tracking-tight">
                        {item.cert}
                      </h4>
                      <p className="text-gray-400 group-hover:text-gray-300 text-sm leading-relaxed transition-colors duration-500">
                        {item.desc}
                      </p>
                    </div>
                    <motion.div
                      className="shrink-0 w-8 h-8 rounded-full bg-[var(--womb-forest)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                      whileHover={{ scale: 1.2 }}
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Foundation Bar — Full Width */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 80, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 60,
                      damping: 15,
                      delay: 1.2,
                    },
                  },
                }}
                whileHover={{ y: -4 }}
                className="md:col-span-2 group relative rounded-[1.2rem] overflow-hidden cursor-pointer"
                style={{ backdropFilter: "blur(20px)" }}
              >
                {/* Special gradient bg for foundation card */}
                <div className="absolute inset-0 rounded-[1.2rem] bg-gradient-to-r from-[var(--womb-forest)]/10 via-white/[0.04] to-[var(--journey-saffron)]/10 border border-white/[0.08] group-hover:border-[var(--journey-saffron)]/30 transition-all duration-700" />

                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-[1.2rem] pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, var(--journey-saffron), var(--womb-forest), var(--journey-saffron))",
                    backgroundSize: "200% 100%",
                    opacity: 0,
                    padding: 1,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                  whileHover={{ opacity: 0.5 }}
                  transition={{ backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" } }}
                />

                <div className="relative z-10 p-7 sm:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[var(--womb-forest)] to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(29,110,63,0.3)] group-hover:shadow-[0_0_60px_rgba(29,110,63,0.5)] transition-shadow duration-700">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-xl sm:text-2xl text-white group-hover:text-[var(--journey-saffron)] transition-colors duration-500 mb-2 tracking-tight">
                      Section 8 Company
                    </h4>
                    <p className="text-gray-400 group-hover:text-gray-300 text-sm sm:text-base leading-relaxed transition-colors duration-500">
                      Incorporated under the Companies Act 2013. Annually audited & publicly accountable — the strongest legal framework for transparent non-profit governance in India.
                    </p>
                  </div>
                  <div className="shrink-0 hidden sm:flex items-center gap-2 text-[var(--journey-saffron)] text-xs font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">
                    Foundation <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 bg-[var(--future-sky)]/10 text-[var(--future-sky)] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border border-[var(--future-sky)]/20 mb-6">
              Leadership
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Advisory Board</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guided by clinical depth, national credibility, and global perspective.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {advisoryBoard.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                style={{ perspective: 1000 }}
                className="group relative bg-white rounded-[2rem] p-8 lg:p-10 border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
              >
                {/* Subtle cinematic background glow on hover */}
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-[var(--womb-forest)]/10 via-transparent to-[var(--journey-saffron)]/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 mb-6 flex items-center justify-center text-gray-400 group-hover:text-[var(--womb-forest)] transition-all duration-500 border border-gray-200 group-hover:border-[var(--womb-forest)]/30 group-hover:scale-110 shadow-sm group-hover:shadow-[0_10px_20px_-10px_rgba(29,110,63,0.2)] overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 lg:w-10 lg:h-10" />
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:-translate-y-0.5 transition-transform duration-500">{member.name}</h3>
                  <p className="text-sm font-bold text-[var(--journey-saffron)] mb-6 h-10 group-hover:-translate-y-0.5 transition-transform duration-500 delay-75">{member.role}</p>

                  <ul className="space-y-4">
                    {member.bio.map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
                        className="flex items-start gap-3 group/item cursor-default"
                      >
                        <div className="w-2 h-2 rounded-full bg-[var(--womb-forest)]/20 group-hover/item:bg-[var(--womb-forest)] shrink-0 mt-1.5 transition-colors duration-300" />
                        <span className="text-sm text-gray-600 group-hover/item:text-gray-900 transition-colors duration-300 leading-relaxed">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden bg-[var(--womb-forest)] rounded-[2.5rem] p-10 lg:p-14 text-center max-w-4xl mx-auto shadow-[0_20px_60px_-15px_rgba(29,110,63,0.4)]"
          >
            {/* Decorative abstract shapes matching CallToDonate */}
            <div className="absolute inset-0 overflow-hidden mix-blend-overlay opacity-20 pointer-events-none">
              <svg viewBox="0 0 800 800" className="absolute -top-64 -right-32 w-[1000px] h-[1000px] animate-spin-slow" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M437.5,655.5C361,681,268,693,198.5,640.5C129,588,83,471,94,374C105,277,173,200,247.5,148.5C322,97,403,71,489.5,84.5C576,98,668,151,707.5,230.5C747,310,734,416,684.5,491.5C635,567,549.5,612.5,437.5,655.5Z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Join Our Advisory Board</h3>
              <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                We are actively building our Advisory Board. If you bring subject expertise, policy experience, or health/education credentials — without financial obligation — we welcome your interest.
              </p>
              <a href="mailto:advisory@wombto18.org" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[var(--womb-forest)] font-extrabold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all h-14 px-8 text-base rounded-xl group">
                advisory@wombto18.org <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
