import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ShieldCheck, Download, Lock, CheckCircle2, Shield, ArrowUpRight, Quote, CalendarDays, LineChart, FileText, Activity, BookOpen, Award, Target, Users } from "lucide-react";
import { Badge } from "../components/ui/badge";

const pledges = [
  "We will never spend more than 30% of total donations on administrative, technology, and overhead costs combined.",
  "We will publish audited accounts within 90 days of each financial year end.",
  "We will publish every Board resolution summary within 30 days of each meeting.",
  "We will issue 80G certificates automatically within 2 minutes — no requests, no delays, no exceptions.",
  "We will respond to every donor query within 48 working hours.",
  "We will publicly acknowledge, in writing, when we fail to meet any programme target — along with an explanation and a corrective plan.",
  "We will never redirect designated programme funds to general operations without donor notification."
];

const disclosureItems = [
  { doc: "Quarterly Impact Report", freq: "April / July / October / January", access: "Free download — no login required" },
  { doc: "Annual Audited Accounts", freq: "Every July (for prior FY)", access: "Free download — no login required" },
  { doc: "Fund Utilisation Breakdown", freq: "Monthly update", access: "Public dashboard + donor portal" },
  { doc: "Board Meeting Summaries", freq: "Within 30 days of each meeting", access: "PDF download — public page" },
  { doc: "80G Registration Certificate", freq: "Permanent (updated if reissued)", access: "Transparency Centre download" },
  { doc: "12A Certificate", freq: "Permanent", access: "Transparency Centre download" },
  { doc: "DPIIT / TechSoup Certificates", freq: "Permanent", access: "Transparency Centre download" },
  { doc: "Programme Targets vs Actuals", freq: "Quarterly", access: "Live public dashboard" },
  { doc: "Donor Honour Board", freq: "Monthly refresh", access: "Public dashboard" }
];



export function TransparencyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Quote Section Refs (Exactly matching Home page style)
  const quoteRef = useRef<HTMLDivElement>(null);
  const isQuoteInView = useInView(quoteRef, { once: true, margin: "-100px" });

  const q1q2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const q3q4 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-[#1D6E3F]/20" ref={containerRef}>

      {/* ── CINEMATIC HERO (Premium Lavender, Airy) ── */}
      <section className="relative pt-20 pb-20 lg:pt-24 lg:pb-28 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f8f5ff] to-white border-b border-gray-100">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_#ede9fe_0%,_transparent_70%)] opacity-50 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_#f3e8ff_0%,_transparent_70%)] opacity-40 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto px-4 mt-8">
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <p className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-700 px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-violet-500/20 mb-4 sm:mb-6 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" /> Transparency Centre
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] text-gray-900 mb-6" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              Nothing Hidden.<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 drop-shadow-sm">Nothing Assumed.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mx-auto">
              Public disclosure schedule, ring-fenced wallets, <br className="hidden md:block" /> pledge of accountability.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── AWARD-WINNING HOVER LIST TIMELINE ── */}
      <section className="py-24 lg:py-32 relative bg-[#FAFAF8] border-b border-gray-100 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-[-5%] right-[-5%] w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(29,110,63,0.03)_0%,_transparent_70%)] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(16,185,129,0.02)_0%,_transparent_70%)] rounded-full blur-[80px] pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-28 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-emerald-100 mb-8 shadow-sm">
              <Activity className="w-4 h-4" /> 100% Visibility
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-black text-gray-900 tracking-tight leading-[1.05]">
              Public Disclosure <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D6E3F] to-emerald-500">Schedule</span>
            </h2>
          </motion.div>

          <div className="flex flex-col border-t-2 border-gray-200 pt-2">
            {disclosureItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative flex flex-col md:flex-row md:items-center justify-between py-6 md:py-8 border-b-2 border-gray-100 hover:border-transparent transition-all duration-300 cursor-pointer overflow-hidden rounded-xl md:rounded-3xl"
              >
                {/* Floating highlight background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1D6E3F] to-emerald-700 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />

                {/* Left side: Document Name & Floating number */}
                <div className="flex items-center gap-6 md:gap-8 px-6 py-2 md:py-0 w-full md:w-1/2">
                  <span className="text-sm font-black text-gray-300 group-hover:text-emerald-400/50 transition-colors duration-500 w-6">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-white transition-colors duration-500 tracking-tight leading-snug">
                    {item.doc}
                  </h3>
                </div>

                {/* Right side: Meta info */}
                <div className="mt-4 md:mt-0 px-6 py-2 md:py-0 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 w-full md:w-1/2 justify-end">
                  <div className="flex flex-col flex-1 sm:max-w-[200px]">
                    <span className="text-[10px] font-black text-gray-400 group-hover:text-emerald-300/80 tracking-widest uppercase mb-1 transition-colors duration-500">Frequency</span>
                    <span className="text-sm md:text-[0.95rem] font-bold text-gray-600 group-hover:text-white leading-tight transition-colors duration-500">{item.freq}</span>
                  </div>
                  
                  <div className="flex flex-col flex-1 sm:max-w-[220px]">
                    <span className="text-[10px] font-black text-gray-400 group-hover:text-emerald-300/80 tracking-widest uppercase mb-1 transition-colors duration-500">Access</span>
                    <div className="flex items-center gap-2 group/btn">
                      <span className="text-sm md:text-[0.95rem] font-bold text-gray-600 group-hover:text-white leading-tight transition-colors duration-500">{item.access}</span>
                      <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RING-FENCED WALLETS (Light Interactive Mode) ── */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-white border-b border-gray-100">
        {/* Soft Animated Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(16,185,129,0.05)_0%,_transparent_60%)] rounded-full blur-[60px]"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(56,189,248,0.05)_0%,_transparent_60%)] rounded-full blur-[80px]"
          />
          {/* Abstract light grid texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text Content (Left) */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-[#1D6E3F]/10 text-[#1D6E3F] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-[#1D6E3F]/20 mb-6">
                <Lock className="w-3.5 h-3.5" /> How Donor Funds Are Protected
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                Ring-Fenced <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D6E3F] to-emerald-500">
                  Wallet Architecture.
                </span>
              </h2>

              <div className="space-y-6 text-gray-600 font-medium leading-relaxed text-lg">
                <p>
                  All donations are received into programme-specific sub-accounts <strong className="text-gray-900 font-bold bg-gray-100 py-0.5 px-2 rounded border border-gray-200">(ring-fenced wallets)</strong> maintained at the Foundation’s bank. Funds donated for a specific programme — for example, ‘Vaccine Reminders’ — are legally and operationally separated from the general corpus and can only be released for that designated purpose.
                </p>

                <p>
                  This architecture is disclosed to donors at the point of giving, published in our quarterly reports, and verified annually by our statutory auditor.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-transparent border border-emerald-100 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-transparent group-hover:h-[120%] transition-all duration-700" />
                  <p className="text-[0.95rem] text-gray-800 leading-snug m-0">
                    Undisbursed programme funds at year-end are carried forward and ring-fenced for the following year. <strong className="text-gray-900 font-extrabold pb-0.5 border-b border-rose-500/50">No surplus is absorbed into administration</strong> without Board resolution and public disclosure.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cinematic SVG Architecture Diagram / Rings (Right) */}
            <div className="relative flex justify-center items-center py-10 min-h-[400px]">
              <div className="relative flex items-center justify-center w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]">

                {/* Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-emerald-200/60"
                >
                  <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.5)]" />
                </motion.div>

                {/* Middle Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border border-emerald-300/40"
                >
                  <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                </motion.div>

                {/* Inner Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 rounded-full border-2 border-dashed border-[#1D6E3F]/30"
                >
                  <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1D6E3F] shadow-[0_0_8px_rgba(29,110,63,0.5)]" />
                </motion.div>

                {/* Glow behind center icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 bg-emerald-100 rounded-full blur-[30px] opacity-60" />
                </div>

                {/* Core Content */}
                <div className="absolute z-10 w-28 h-28 bg-white rounded-full shadow-[0_20px_40px_-5px_rgba(29,110,63,0.15)] ring-1 ring-emerald-50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1D6E3F] to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(29,110,63,0.3)]">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY PLEDGES (Staggered Masonry feel with Giant Numbers) ── */}
      <section className="py-32 relative z-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight drop-shadow-sm">The Accountability Pledge</h2>
            <p className="text-xl text-gray-500 font-medium">Seven binding commitments we make to every donor.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pledges.map((pledge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 70 }}
                className="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-transparent transition-all duration-500 relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(29,110,63,0.12)] hover:-translate-y-2"
              >
                {/* Giant floating number behind the text */}
                <div className="absolute -bottom-8 -right-4 text-[10rem] font-black text-gray-50 leading-none pointer-events-none group-hover:text-[#1D6E3F]/5 transition-colors duration-500 select-none">
                  0{i + 1}
                </div>

                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent group-hover:via-[#1D6E3F] transition-colors duration-700" />

                <div className="relative z-10 h-full flex flex-col justify-between pl-2">
                  <p className="text-[1.05rem] text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors mb-12">
                    “{pledge}”
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Pledge 0{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                      <ShieldCheck className="w-5 h-5 text-[#1D6E3F]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXACT REPLICA of AnimatedQuoteSection from HomePage ── */}
      <section
        className="relative w-full py-16 md:py-24 min-h-[calc(100vh-64px)] bg-[#FFFDF7] overflow-hidden flex items-center justify-center border-t border-b border-[#1D6E3F]/10 shadow-[inset_0_20px_40px_rgba(0,0,0,0.02)]"
      >
        {/* Background Cinematic Glows */}
        <motion.div
          style={{ y: q1q2 }}
          className="absolute top-0 left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-10 blur-3xl rounded-full pointer-events-none"
        />
        <motion.div
          style={{ y: q3q4 }}
          className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-10 blur-3xl rounded-full pointer-events-none"
        />

        {/* Grid Pattern overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231D6E3F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center" ref={quoteRef}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isQuoteInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 md:mb-12 flex justify-center"
          >
            <div className="p-4 rounded-full bg-[var(--womb-forest)]/10 text-[var(--journey-saffron)] shadow-[0_0_30px_rgba(255,153,0,0.15)] ring-1 ring-[#1D6E3F]/30 backdrop-blur-md">
              <Quote size={32} className="opacity-90 md:w-10 md:h-10" />
            </div>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, filter: "blur(20px)", y: 30, scale: 0.95 }}
            animate={isQuoteInView ? { opacity: 1, filter: "blur(0px)", y: 0, scale: 1, transition: { duration: 1.8, ease: "easeOut" } } : { opacity: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight md:leading-tight lg:leading-[1.15] tracking-tight relative"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
              "Transparency is not a report we file once a year.{" "}
            </span>
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-[#155e33] font-bold drop-shadow-sm">
              It is a culture we practise every day
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-500">
              {", "}in every transaction,
            </span>
            <br className="hidden lg:block mt-4" />
            <span className="block mt-6 md:mt-8 text-2xl sm:text-3xl md:text-4xl text-[var(--journey-saffron)] font-medium italic drop-shadow-sm">
              with every person who trusts us."
            </span>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isQuoteInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 md:mt-16 flex items-center justify-center gap-4"
          >
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--womb-forest)]"></div>
            <span className="text-sm md:text-base text-gray-500 font-bold tracking-[0.2em] uppercase">Sowjanya, Founder</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--womb-forest)]"></div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
