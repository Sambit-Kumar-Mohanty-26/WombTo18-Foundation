import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { 
  ArrowRight, 
  ChevronRight,
  ChevronDown,
  Baby, 
  Stethoscope, 
  Building2, 
  Syringe, 
  Utensils, 
  Microscope, 
  Brain, 
  Puzzle, 
  Zap, 
  GraduationCap,
  ShieldCheck,
  Search,
  CheckSquare,
  Handshake,
  Users,
  Activity,
  Heart,
  School,
  BookOpen,
  HeartPulse,
  UserCheck,
  Flame,
  Scale,
  Shield,
  Globe,
  Leaf,
  FileText,
  Languages,
  Monitor,
  BarChart3,
  Layout,
  Lock,
  Briefcase,
  TrendingUp,
  Megaphone,
  Landmark
} from "lucide-react";

type DomainCategory = "HEALTHCARE" | "CHILD DEV" | "EDUCATION" | "SAFETY" | "SOCIAL" | "CONTENT" | "TECH" | "BUSINESS" | "POLICY";

const categoryColors: Record<DomainCategory, { text: string; bg: string; border: string; dot: string }> = {
  HEALTHCARE: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-400" },
  "CHILD DEV": { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-400" },
  EDUCATION: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
  SAFETY: { text: "text-red-500", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400" },
  SOCIAL: { text: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", dot: "bg-pink-400" },
  CONTENT: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
  TECH: { text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", dot: "bg-cyan-400" },
  BUSINESS: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-400" },
  POLICY: { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-400" },
};

const expertiseDomains: { icon: typeof Baby; title: string; desc: string; category: DomainCategory }[] = [
  // Healthcare
  { icon: Baby, title: "Maternal & newborn care", desc: "Obstetrics, NICU, midwifery", category: "HEALTHCARE" },
  { icon: Stethoscope, title: "Paediatrics", desc: "General, neonatal, adolescent", category: "HEALTHCARE" },
  { icon: Building2, title: "Hospital administration", desc: "Clinical ops, QA, protocols", category: "HEALTHCARE" },
  { icon: Syringe, title: "Vaccines & immunisation", desc: "IAP, WHO EPI, cold chain", category: "HEALTHCARE" },
  { icon: Utensils, title: "Child nutrition", desc: "Dietetics, malnutrition, ICDS", category: "HEALTHCARE" },
  // Child Dev
  { icon: Microscope, title: "Research & academia", desc: "Clinical research, faculty", category: "CHILD DEV" },
  { icon: Brain, title: "Child mental health", desc: "Psychiatry, psychology, counselling", category: "CHILD DEV" },
  { icon: Puzzle, title: "Autism specialist", desc: "Early diagnosis & intervention", category: "CHILD DEV" },
  { icon: Zap, title: "ADHD & learning disability", desc: "Assessment, behaviour therapy", category: "CHILD DEV" },
  { icon: GraduationCap, title: "Special education", desc: "IEP, inclusive classrooms", category: "CHILD DEV" },
  // Education
  { icon: School, title: "School administration", desc: "Principal, trustee, school ops", category: "EDUCATION" },
  { icon: BookOpen, title: "Curriculum & pedagogy", desc: "EdTech, curriculum design", category: "EDUCATION" },
  { icon: HeartPulse, title: "School health systems", desc: "Health promoting schools", category: "EDUCATION" },
  { icon: UserCheck, title: "School counselor", desc: "Student wellbeing, guidance", category: "EDUCATION" },
  // Safety
  { icon: Shield, title: "Emergency & NDRF", desc: "Disaster response, first aid", category: "SAFETY" },
  { icon: Flame, title: "Fire & safety", desc: "Fire dept, safety drills", category: "SAFETY" },
  { icon: ShieldCheck, title: "Law enforcement", desc: "Police, child protection", category: "SAFETY" },
  { icon: Scale, title: "Child rights & law", desc: "POCSO, juvenile justice", category: "SAFETY" },
  // Social
  { icon: Users, title: "NGO & social impact", desc: "Community mobilisation", category: "SOCIAL" },
  { icon: Heart, title: "CSR & philanthropy", desc: "Corporate social responsibility", category: "SOCIAL" },
  { icon: Globe, title: "International health", desc: "WHO, UNICEF, global NGO", category: "SOCIAL" },
  { icon: Leaf, title: "Environment & green health", desc: "Eco-health, green cohort", category: "SOCIAL" },
  // Content
  { icon: FileText, title: "Medical content writing", desc: "Health journalism, advocacy", category: "CONTENT" },
  { icon: Languages, title: "Regional language & media", desc: "Vernacular health comms", category: "CONTENT" },
  // Tech
  { icon: Monitor, title: "HealthTech & digital health", desc: "EMR, health IT, digital", category: "TECH" },
  { icon: BarChart3, title: "Data & AI/ML", desc: "Epidemiology, biostatistics", category: "TECH" },
  { icon: Layout, title: "Product management & UX", desc: "Product strategy, design", category: "TECH" },
  { icon: Lock, title: "Cybersecurity & DPDP", desc: "Data privacy, compliance", category: "TECH" },
  // Business
  { icon: Briefcase, title: "Sales & partnerships", desc: "B2B health sales, alliances", category: "BUSINESS" },
  { icon: TrendingUp, title: "Finance & investment", desc: "VC, grants, health finance", category: "BUSINESS" },
  { icon: Megaphone, title: "Marketing & comms", desc: "Brand, PR, outreach", category: "BUSINESS" },
  // Policy
  { icon: Landmark, title: "Government & policy", desc: "IAS/IPS retd., health policy", category: "POLICY" },
];

const processSteps = [
  {
    num: "01",
    icon: CheckSquare,
    title: "Smart application",
    desc: "5-step guided form capturing identity, expertise, experience, documents, and intent alignment.",
    bullets: ["OTP + email verification", "Domain expertise cards", "CV and bio upload", "Motivation statement"]
  },
  {
    num: "02",
    icon: Search,
    title: "Verification & scoring",
    desc: "3-level verification — automated, manual review, and optional video call for senior profiles.",
    bullets: ["100-point auto-scoring", "LinkedIn & credential check", "Domain alignment review", "Background validation"]
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Approval decision",
    desc: "Committee reviews applications within 10-14 working days. Shortlisted candidates get an orientation call.",
    bullets: ["30-min orientation call", "Role clarity briefing", "Conflict of interest check", "Soft rejection pathway"]
  },
  {
    num: "04",
    icon: Handshake,
    title: "Formal onboarding",
    desc: "Letter of appointment, public profile listing, community access, and monthly advisory meets.",
    bullets: ["Appointment letter issued", "Website profile published", "WhatsApp / Slack access", "Advisory engagement plan"]
  }
];

const whyJoinPoints = [
  { icon: Activity, title: "National impact at scale", desc: "300+ schools · 3M+ children · Pan-India expansion in progress" },
  { icon: Heart, title: "Recognition & visibility", desc: "Public profile, advisory board listing, co-authorship on publications" },
  { icon: Users, title: "Cross-domain network", desc: "Connect with India's leading doctors, technologists, policy makers, and educators" },
  { icon: ShieldCheck, title: "Mission-aligned - no conflicts", desc: "Honorary role — you're here because you believe in the mission" },
  { icon: Zap, title: "Flexible commitment", desc: "1 to 10+ hours/month — we design engagement around your schedule" }
];

const scoringCriteria = [
  { label: "Domain relevance", points: 25, width: "100%" },
  { label: "Experience depth", points: 20, width: "80%" },
  { label: "Strategic value", points: 15, width: "60%" },
  { label: "Intent quality", points: 15, width: "60%" },
  { label: "Credibility signals", points: 15, width: "60%" },
  { label: "Documents complete", points: 10, width: "40%" },
];

export function AdvisoryBoardApplicationPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const [showAllDomains, setShowAllDomains] = useState(false);

  const visibleDomains = showAllDomains ? expertiseDomains : expertiseDomains.slice(0, 10);

  return (
    <div className="bg-[#FAF9F6] min-h-[100vh] font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center pt-20 pb-8 lg:pt-24 lg:pb-12 overflow-hidden border-b border-gray-100 bg-gradient-to-b from-[#FFFDF7] to-[#FAF9F6]">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.04] blur-[80px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full" />
        </motion.div>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 bg-[#F8F4EA] text-[var(--womb-forest)] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 border border-[#E8DFCE]">
                <span className="w-2 h-2 rounded-full bg-[var(--womb-forest)] animate-pulse" />
                Now accepting applications <span className="text-gray-500 font-medium lowercase">· Cohort 2025-26</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-[1.08] tracking-tight mb-5 relative">
                Shape India's child health <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-green-700 italic font-serif leading-[1.1]">ecosystem</span>
              </h1>
              
              <p className="text-base lg:text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                Join a mission-driven advisory board powering India's first integrated child health infrastructure — from womb to age 18, across 300+ schools and hospitals.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 border-b border-gray-200 pb-6 mb-5">
                <Link to="/advisory-board/apply" className="w-full sm:w-auto inline-flex items-center justify-center bg-[var(--womb-forest)] text-white px-7 h-12 rounded-xl font-bold hover:bg-green-900 hover:shadow-[0_15px_30px_-10px_rgba(29,110,63,0.4)] hover:-translate-y-1 transition-all">
                  Apply to join the board
                </Link>
                <a href="#process" className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-[#E8DFCE] text-[var(--womb-forest)] px-7 h-12 rounded-xl font-bold hover:border-[var(--womb-forest)] hover:bg-[#FAF9F6] transition-all">
                  Learn about the process
                </a>
              </div>
              
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--journey-saffron)]" /> Limited slots open per domain · Applications reviewed fortnightly
              </p>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            >
              <div className="bg-white rounded-[2rem] border border-[#E8DFCE] shadow-[0_30px_80px_-20px_rgba(189,179,161,0.25)] relative overflow-hidden">
                {/* Top gradient accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-[var(--womb-forest)] via-emerald-500 to-[var(--journey-saffron)]" />

                {/* Stats Grid */}
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { value: "25+", label: "Schools onboarded", icon: Building2, color: "var(--womb-forest)", bg: "from-emerald-50 to-green-50" },
                      { value: "32", label: "Services", icon: Stethoscope, color: "var(--journey-saffron)", bg: "from-amber-50 to-orange-50" },
                      { value: "0–18", label: "Age coverage", icon: Heart, color: "var(--womb-forest)", bg: "from-emerald-50 to-teal-50" },
                      { value: "300", label: "Schools target", icon: Activity, color: "var(--journey-saffron)", bg: "from-orange-50 to-amber-50" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                        whileHover={{ y: -4, transition: { duration: 0.25 } }}
                        className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-4 lg:p-5 border border-[#E8DFCE]/60 cursor-default group relative overflow-hidden`}
                      >
                        <div className="absolute top-3 right-3 opacity-[0.12] group-hover:opacity-[0.2] transition-opacity">
                          <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-black mb-0.5 tracking-tight" style={{ color: stat.color }}>{stat.value}</h3>
                        <p className="text-[11px] lg:text-xs font-bold text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Advisors Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="bg-[#FAF9F6] rounded-2xl p-4 lg:p-5 border border-[#E8DFCE]/60"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold text-[var(--womb-forest)] uppercase tracking-[0.15em]">Advisors onboarded</p>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-[#E8DFCE]">12 active</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2.5">
                        {['DR', 'SK', 'PM', 'AK'].map((initials, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 1 + i * 0.1, type: "spring" }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm ${
                              i === 0 ? 'bg-gradient-to-br from-[#FDE68A] to-[#F59E0B] text-amber-900' :
                              i === 1 ? 'bg-gradient-to-br from-[#D1FAE5] to-[#10B981] text-emerald-900' :
                              i === 2 ? 'bg-gradient-to-br from-[#E0E7FF] to-[#818CF8] text-indigo-900' :
                              'bg-gradient-to-br from-[#FCE7F3] to-[#EC4899] text-pink-900'
                            }`}
                            style={{ zIndex: 10 - i }}
                          >
                            {initials}
                          </motion.div>
                        ))}
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-gray-500 border-2 border-[#E8DFCE] z-0">+8</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {['🩺 Paediatrics', '🧠 Mental health', '💉 Vaccines', '+27'].map((tag, i) => (
                          <span key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${i === 3 ? 'bg-white/60 text-gray-400' : 'bg-white text-gray-600 border border-[#E8DFCE]/50 shadow-sm'}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advisory Board Process */}
      <section id="process" className="min-h-[100vh] flex items-center py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8DFCE] to-transparent" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.02] blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-12 lg:mb-16"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gradient-to-r from-[var(--womb-forest)] to-transparent" />
              <span className="text-[var(--womb-forest)] font-extrabold text-[11px] tracking-[0.25em] uppercase">Advisory Board Process</span>
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-[var(--womb-forest)]/20 to-transparent" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 tracking-tight mb-5 leading-[1.08]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              From application<br className="hidden sm:block" /> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-600 italic">onboarding</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-500 max-w-lg leading-relaxed font-medium">
              A rigorous, transparent 4-stage journey — designed to ensure every advisor is a genuine fit for our mission.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 60, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: index * 0.18, type: "spring", stiffness: 80, damping: 15 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="bg-white rounded-[1.5rem] border border-[#E8DFCE] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_50px_-15px_rgba(29,110,63,0.15)] group-hover:border-[var(--womb-forest)]/30 transition-all duration-500 overflow-hidden h-full flex flex-col">
                  {/* Top gradient bar per card */}
                  <div className={`h-1 ${index === 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : index === 1 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : index === 2 ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-gradient-to-r from-violet-400 to-purple-500'}`} />

                  <div className="p-5 lg:p-6 flex flex-col flex-1">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        index === 0 ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                        index === 1 ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' :
                        index === 2 ? 'bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white' :
                        'bg-violet-50 text-violet-600 group-hover:bg-violet-500 group-hover:text-white'
                      }`}>
                        <step.icon className="w-4.5 h-4.5" />
                      </div>
                      <span className={`text-3xl font-black select-none transition-colors duration-500 ${
                        index === 0 ? 'text-emerald-100 group-hover:text-emerald-200' :
                        index === 1 ? 'text-amber-100 group-hover:text-amber-200' :
                        index === 2 ? 'text-sky-100 group-hover:text-sky-200' :
                        'text-violet-100 group-hover:text-violet-200'
                      }`} style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{step.num}</span>
                    </div>

                    <h3 className="text-[15px] lg:text-base font-extrabold text-gray-900 mb-2 leading-snug tracking-tight">{step.title}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4 font-medium line-clamp-3">
                      {step.desc}
                    </p>

                    {/* Bullets */}
                    <ul className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                      {step.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            index === 0 ? 'bg-emerald-400' : index === 1 ? 'bg-amber-400' : index === 2 ? 'bg-sky-400' : 'bg-violet-400'
                          }`} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Domains */}
      <section className="py-16 lg:py-20 bg-[#FFFDF7] border-y border-[#E8DFCE] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-12 lg:mb-14"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gradient-to-r from-[var(--journey-saffron)] to-transparent" />
              <span className="text-[var(--journey-saffron)] font-extrabold text-[11px] tracking-[0.25em] uppercase">Expertise Domains</span>
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-[var(--journey-saffron)]/20 to-transparent" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 tracking-tight mb-5 leading-[1.08]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              We seek experts across<br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-500 italic">{expertiseDomains.length} domains</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-500 max-w-xl leading-relaxed font-medium">
              From neonatology to NDRF, from autism specialists to HealthTech founders — every domain that touches a child's life matters.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
            <AnimatePresence mode="popLayout">
              {visibleDomains.map((domain, index) => {
                const colors = categoryColors[domain.category];
                return (
                  <motion.div
                    key={domain.title}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.45, delay: index < 10 ? index * 0.06 : (index - 10) * 0.04, type: "spring", stiffness: 100, damping: 14 }}
                    whileHover={{ y: -5, transition: { duration: 0.25 } }}
                    layout
                    className="cursor-default group"
                  >
                    <div className={`bg-white rounded-2xl p-4 lg:p-5 border border-[#E8DFCE] group-hover:${colors.border} shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] group-hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] transition-all duration-400 h-full flex flex-col relative overflow-hidden`}>
                      {/* Subtle top accent */}
                      <div className={`absolute top-0 left-0 right-0 h-0.5 ${colors.dot} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                      
                      <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} mb-3 transition-all duration-400 group-hover:scale-110`}>
                        <domain.icon className="w-4 h-4" />
                      </div>
                      <p className={`text-[9px] font-extrabold ${colors.text} uppercase tracking-[0.15em] mb-1.5`}>
                        {domain.category}
                      </p>
                      <h4 className="text-[13px] font-extrabold text-gray-900 mb-1 leading-snug tracking-tight group-hover:text-gray-800 transition-colors">
                        {domain.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-auto">
                        {domain.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* View More */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setShowAllDomains(!showAllDomains)}
              className="group inline-flex items-center gap-2.5 bg-white border border-[#E8DFCE] hover:border-[var(--journey-saffron)]/50 text-gray-700 hover:text-[var(--journey-saffron)] px-7 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:shadow-[0_10px_30px_-10px_rgba(255,156,59,0.2)] transition-all duration-300"
            >
              {showAllDomains ? 'Show fewer domains' : `View all ${expertiseDomains.length} domains`}
              <motion.div
                animate={{ rotate: showAllDomains ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Why Join & Scoring */}
      <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8DFCE] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-12 items-start">
            
            {/* Left Column - Why Join */}
            <div className="lg:col-span-6 xl:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-gradient-to-r from-[var(--womb-forest)] to-transparent" />
                  <span className="text-[var(--womb-forest)] font-extrabold text-[11px] tracking-[0.25em] uppercase">Why Join</span>
                  <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-[var(--womb-forest)]/20 to-transparent" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.08]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                  Advisory that<br /> actually <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-600 italic">matters</span>
                </h2>
              </motion.div>

              <div className="grid gap-6">
                {whyJoinPoints.map((point, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 sm:gap-5 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-50/80 group-hover:bg-emerald-100 border border-emerald-100 group-hover:border-emerald-200 flex items-center justify-center shrink-0 transition-all text-emerald-400 group-hover:text-[var(--womb-forest)]">
                      <point.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-[15px] font-extrabold text-gray-800 mb-1 tracking-tight">{point.title}</h4>
                      <p className="text-xs sm:text-[13px] text-gray-400 font-medium leading-relaxed">{point.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Scoring Module */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 xl:col-span-5 bg-[#FAF9F6] border border-[#E8DFCE] rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(189,179,161,0.25)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--journey-saffron)] to-[var(--womb-forest)]" />
              <div className="p-8 sm:p-10">
                <h3 className="text-xl font-extrabold text-gray-900 mb-8">How your application is scored</h3>
                
                <div className="space-y-5 mb-10">
                  {scoringCriteria.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-600">{item.label}</span>
                        <span className="text-xs font-extrabold text-[var(--womb-forest)]">{item.points} pts</span>
                      </div>
                      <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#E8DFCE]">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: item.width }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                          className="h-full bg-[var(--womb-forest)] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8DFCE] pt-8 mt-8">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-base font-extrabold text-gray-900">Total score</span>
                    <span className="text-4xl font-black text-[var(--womb-forest)] font-serif tracking-tighter leading-none">100</span>
                  </div>
                  
                  <div className="bg-white px-4 py-4 rounded-xl border border-[#E8DFCE] text-center text-xs font-medium text-gray-600 leading-relaxed space-y-1 shadow-sm">
                    <p><span className="text-[var(--womb-forest)] font-bold">≥ 65</span> = approved</p>
                    <p><span className="text-[var(--womb-forest)] font-bold">50–64</span> = shortlisted for call</p>
                    <p><span className="text-[var(--womb-forest)] font-bold">&lt; 50</span> = contributor tier offered</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="apply" className="py-20 sm:py-28 bg-gradient-to-b from-[#FAF9F6] to-[#F5F0E8] border-t border-[#E8DFCE] text-center text-gray-900 relative overflow-hidden">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          {/* Limited Slots Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2.5 bg-white border border-red-200 px-5 py-2.5 rounded-full shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Limited slots remaining</span>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Cohort 2025–26</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black mb-5 tracking-tight leading-[1.08]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-600 italic">shape</span><br/>the future?
            </h2>
            <p className="text-base lg:text-lg text-gray-500 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
              Bring your expertise to India's most ambitious child health mission. Only a few advisory seats remain open this cohort.
            </p>
          </motion.div>

          {/* Slots Counter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-6 sm:gap-8 mb-10"
          >
            {[
              { value: "5", label: "Healthcare slots" },
              { value: "3", label: "Tech & AI slots" },
              { value: "4", label: "Education slots" },
            ].map((slot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.12, type: "spring", stiffness: 120 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-black text-[var(--womb-forest)]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{slot.value}</div>
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{slot.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/advisory-board/apply" className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--womb-forest)] to-green-800 text-white px-10 h-14 rounded-2xl font-bold text-base shadow-[0_20px_40px_-10px_rgba(29,110,63,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(29,110,63,0.4)] hover:-translate-y-1.5 transition-all duration-300 group">
              Start Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-[11px] font-bold text-gray-400"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 10–14 day review</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400" /> 100-point scoring</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-400" /> Honorary advisory role</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
