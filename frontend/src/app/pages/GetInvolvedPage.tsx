import { Heart, GraduationCap, Stethoscope, Users, ArrowRight, School, TreePine, ShieldCheck, BarChart3, Award, Mail, CheckCircle, Sparkles, Globe, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

/* ──────────────────── DATA ──────────────────── */

const stakeholderPills = [
  "Donors", "CSR Partners", "Volunteers", "Healthcare Providers", "Schools", "Channel Partners",
];

const schoolReceives = [
  { text: "Dedicated School Health Coordinator", icon: Users },
  { text: "Annual health screenings & doctor-led camps", icon: Stethoscope },
  { text: "Mental wellness and SEL modules for all ages", icon: Heart },
  { text: "Emergency preparedness training by real-life experts", icon: ShieldCheck },
  { text: "Tree planting for every student — Green Cohort", icon: TreePine },
  { text: "Live Student Wellness Dashboard", icon: BarChart3 },
  { text: "Annual School Health Report", icon: BookOpen },
];

const whyPartner = [
  "Aligned with NEP 2020, UN SDGs, and Green School mandates",
  "Enhances school reputation, parent trust, and CSR visibility",
  "Part of India's first Carbon-Neutral Child Cohort",
  "Opportunity to participate in Guinness World Record campaign",
  "School featured on WOMBTO18's national partner dashboard",
  "Certificates of Partnership issued to school and staff",
];

const volunteerColumns = [
  {
    title: "Healthcare Volunteers",
    emoji: "🩺",
    color: "var(--womb-forest)",
    items: [
      "Paediatricians, GPs, dentists",
      "Ophthalmologists, nutritionists",
      "Mental health counsellors",
      "For school health camp days",
    ],
  },
  {
    title: "Safety & Preparedness",
    emoji: "🛡️",
    color: "var(--journey-saffron)",
    items: [
      "Ex-Armed Forces officers",
      "NDRF and police personnel",
      "Fire officers, first responders",
      "School emergency drill trainers",
    ],
  },
  {
    title: "Technology & Content",
    emoji: "💻",
    color: "var(--future-sky)",
    items: [
      "React / Next.js / Supabase devs",
      "Data analysts and researchers",
      "Content writers, designers",
      "Regional language translators",
    ],
  },
];

/* ──────────────────── COMPONENT ──────────────────── */

export function GetInvolvedPage() {
  return (
    <div className="bg-[#FFFDF7] min-h-screen">

      {/* ═══════════════════════════════════════════════
          HERO — Light theme inspired by About page
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 bg-gradient-to-b from-[#fef6ed] to-white overflow-hidden relative border-b border-gray-100">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.05] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`p-${i}`}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 3,
                height: Math.random() * 6 + 3,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? "var(--journey-saffron)" : i % 3 === 1 ? "var(--womb-forest)" : "var(--future-sky)",
                opacity: 0,
              }}
              animate={{ opacity: [0, 0.3, 0], y: [0, -40, -80], scale: [0.5, 1, 0.5] }}
              transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 4, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--journey-saffron)]/10 to-[var(--journey-saffron)]/5 flex items-center justify-center mb-6 border border-[var(--journey-saffron)]/20 shadow-sm"
            >
              <Heart className="w-10 h-10 text-[var(--journey-saffron)] fill-[var(--journey-saffron)]/20" />
            </motion.div>

            <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--journey-saffron)]/20 mb-4 sm:mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Get Involved
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] text-gray-900 mb-6" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              There Are Many Ways to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400 drop-shadow-sm">
                Join This Mission.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-10">
              Donors, CSR partners, volunteers, healthcare providers, schools, channel partners — every role matters.
            </p>

            {/* Stakeholder Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2.5"
            >
              {stakeholderPills.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  className="px-4 py-2 rounded-full text-xs font-bold tracking-wide border bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                  style={{
                    color: i % 3 === 0 ? "var(--womb-forest)" : i % 3 === 1 ? "var(--journey-saffron)" : "var(--future-sky)",
                    borderColor: i % 3 === 0 ? "rgba(29,110,63,0.2)" : i % 3 === 1 ? "rgba(255,153,0,0.2)" : "rgba(0,174,239,0.2)",
                  }}
                >
                  {pill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOR DONORS — Full-width immersive card
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_60%)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-gradient-to-br from-[#FFFDF7] to-white rounded-[2rem] p-8 sm:p-12 lg:p-16 border border-gray-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.06)] overflow-hidden group"
          >
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--journey-saffron)]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--journey-saffron)]/10 to-[var(--journey-saffron)]/5 flex items-center justify-center border border-[var(--journey-saffron)]/20">
                    <Heart className="w-6 h-6 text-[var(--journey-saffron)]" />
                  </div>
                  <span className="text-xs font-black tracking-[0.2em] uppercase text-[var(--journey-saffron)]">For Donors</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6" style={{ lineHeight: 1.1 }}>
                  Every contribution is treated with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400">
                    equal rigour.
                  </span>
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Whether you give ₹500 or ₹5,00,000 — every contribution is treated with equal rigour, equal accountability, and equal gratitude. Your 80G certificate arrives within 2 minutes. Your dashboard is live within 5 minutes. Your impact is measurable, reportable, and yours to share.
                </p>

                <Link
                  to="/donate"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--journey-saffron)] to-orange-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group/btn"
                >
                  <span className="text-lg">💜</span>
                  Donate Now
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Stats visual */}
              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "2 min", label: "80G Certificate", icon: "📄" },
                    { value: "5 min", label: "Live Dashboard", icon: "📊" },
                    { value: "80G", label: "Tax Benefit", icon: "💰" },
                    { value: "100%", label: "Transparent", icon: "🔍" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      className="p-4 sm:p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
                    >
                      <span className="text-xl sm:text-2xl block mb-2">{stat.icon}</span>
                      <p className="text-xl sm:text-2xl font-black text-gray-900">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOR SCHOOLS & EDUCATORS — Two-panel layout
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#FAFAF8] border-b border-gray-100 relative overflow-hidden">
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--womb-forest)]/10 to-[var(--womb-forest)]/5 flex items-center justify-center border border-[var(--womb-forest)]/20">
                <GraduationCap className="w-6 h-6 text-[var(--womb-forest)]" />
              </div>
            </div>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-[var(--womb-forest)] mb-3 block">For Schools & Educators</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4" style={{ lineHeight: 1.1 }}>
              Your School Becomes a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500">Centre of Wellness</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Schools are more than places of learning — they are the most powerful platforms we have for building healthier, more climate-conscious generations.
            </p>
          </motion.div>

          {/* Two Panels */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* What Schools Receive */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[1.5rem] p-8 sm:p-10 border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all duration-700"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <School className="w-5 h-5 text-[var(--womb-forest)]" />
                What Schools Receive
              </h3>
              <div className="space-y-3">
                {schoolReceives.map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-[var(--womb-forest)]/5 transition-all duration-300 cursor-default"
                  >
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[var(--womb-forest)]/10 flex items-center justify-center group-hover:bg-[var(--womb-forest)]/20 transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-[var(--womb-forest)]" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium leading-relaxed pt-1 group-hover:text-gray-900 transition-colors">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why Partner */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="bg-white rounded-[1.5rem] p-8 sm:p-10 border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all duration-700"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[var(--journey-saffron)]" />
                Why Partner with WOMBTO18
              </h3>
              <div className="space-y-3">
                {whyPartner.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-[var(--journey-saffron)]/5 transition-all duration-300 cursor-default"
                  >
                    <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-[var(--journey-saffron)] to-orange-400 flex items-center justify-center mt-0.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOR HEALTHCARE PROVIDERS — Cinematic card
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/2 right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--future-sky)_0%,_transparent_70%)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-gradient-to-br from-[var(--future-sky)]/5 to-blue-50/30 rounded-[2rem] p-8 sm:p-12 lg:p-16 border border-[var(--future-sky)]/15 overflow-hidden group"
          >
            {/* Decorative pulse */}
            <div className="absolute top-8 right-8 pointer-events-none hidden lg:block">
              <motion.div
                className="w-24 h-24 rounded-full border-2 border-[var(--future-sky)]/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 w-24 h-24 rounded-full border border-[var(--future-sky)]/10"
                animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-[var(--future-sky)]/20">
                  <Stethoscope className="w-6 h-6 text-[var(--future-sky)]" />
                </div>
                <span className="text-xs font-black tracking-[0.2em] uppercase text-[var(--future-sky)]">For Healthcare Providers</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-6" style={{ lineHeight: 1.1 }}>
                Extend Your Impact{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--future-sky)] to-blue-500">
                  Beyond Clinic Walls
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                You are the trusted voice for families. WOMBTO18 extends that voice beyond your clinic walls — with free maternal vaccine reminder support for your patients, digital tools, white-labelled registration forms, and the opportunity to serve as a Health Ambassador for a local school.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { text: "Free maternal vaccine reminders for your patients", icon: "💉" },
                  { text: "White-labelled digital tools and registration forms", icon: "📋" },
                  { text: "Serve as Health Ambassador for a local school", icon: "🏫" },
                  { text: "Expand your community impact and recognition", icon: "🌟" },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[var(--future-sky)]/10 hover:bg-white hover:shadow-sm transition-all duration-300"
                  >
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span className="text-sm text-gray-700 font-medium leading-relaxed">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOR VOLUNTEERS — 3-column animated grid
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#FAFAF8] relative overflow-hidden">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_60%)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--womb-forest)]/10 to-[var(--womb-forest)]/5 flex items-center justify-center border border-[var(--womb-forest)]/20">
                <Users className="w-6 h-6 text-[var(--womb-forest)]" />
              </div>
            </div>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-[var(--womb-forest)] mb-3 block">For Volunteers</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4" style={{ lineHeight: 1.1 }}>
              Lend Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500">
                Expertise
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Whether you're a doctor, a developer, or a first responder — there's a meaningful role waiting for you.
            </p>
          </motion.div>

          {/* 3 Columns */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {volunteerColumns.map((col, colIdx) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: colIdx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white rounded-[1.5rem] p-7 sm:p-8 border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, ${col.color}15, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <span className="text-3xl mb-4 block">{col.emoji}</span>
                  <h3 className="text-lg font-black text-gray-900 mb-5 tracking-tight">{col.title}</h3>
                  <div className="space-y-2.5">
                    {col.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                        className="flex items-center gap-3 py-2 group/item cursor-default"
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0 transition-all duration-300 group-hover/item:scale-150"
                          style={{ background: col.color }}
                        />
                        <span className="text-sm text-gray-600 font-medium group-hover/item:text-gray-900 transition-colors">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certificate + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-[2rem] p-8 sm:p-10 lg:p-12 border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] overflow-hidden max-w-4xl mx-auto"
          >
            {/* Flash sweep on hover */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem] group">
              <div className="absolute top-0 left-[-150%] w-[100%] h-full transform -skew-x-12 bg-gradient-to-r from-transparent via-[var(--womb-forest)]/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[350%] transition-all duration-[1.5s] ease-in-out" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--womb-forest)]/10 to-emerald-50 flex items-center justify-center border border-[var(--womb-forest)]/20 shrink-0">
                <Award className="w-8 h-8 text-[var(--womb-forest)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Certificate of Contribution</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Every volunteer receives a signed Certificate of Contribution recognising their service and impact.
                </p>
              </div>
              <a
                href="mailto:volunteer@wombto18.org"
                className="inline-flex items-center gap-2 bg-[var(--womb-forest)] text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shrink-0 group/btn"
              >
                <Mail className="w-4 h-4" />
                Register
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          <p className="text-center text-xs text-gray-400 font-medium mt-6">
            To register:{" "}
            <a href="mailto:volunteer@wombto18.org" className="text-[var(--journey-saffron)] font-bold hover:underline">
              volunteer@wombto18.org
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
