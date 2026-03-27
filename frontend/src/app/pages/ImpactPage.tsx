import { useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, animate } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "react-i18next";
import { useBhashiniRuntimeTranslation } from "../hooks/useBhashiniRuntimeTranslation";
import { impactPageContent } from "./impactPageContent";

function Counter({ from = 0, to, duration = 2.5, prefix = "", suffix = "", decimals = 0 }: { from?: number, to: number, duration?: number, prefix?: string, suffix?: string, decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          if (ref.current) {
            const formatted = value.toLocaleString('en-IN', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            });
            ref.current.textContent = `${prefix}${formatted}${suffix}`;
          }
        }
      });
      return controls.stop;
    }
  }, [inView, from, to, duration, prefix, suffix, decimals]);
  
  return <span ref={ref}>{prefix}{from.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

function AnimatedChart({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return <div ref={ref} className="w-full h-full">{inView ? children : null}</div>;
}

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, IndianRupee, Users, ShieldCheck, Download, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";

const fundUtilization = [
  { name: "Direct Programs", value: 75, color: "#1D6E3F" }, // Forest Green
  { name: "Field Healthcare", value: 10, color: "#4C9F38" }, // Mint Green
  { name: "School Infrastructure", value: 8, color: "#F29F05" },  // Saffron
  { name: "Administration Cap", value: 4, color: "#195F70" },      // Teal
  { name: "Fundraising Core", value: 3, color: "#C5192D" },// Warm Red
];

const expenseBreakdown = [
  { name: "Field Salaries & Medical Staff", value: 28, color: "#1D6E3F" },
  { name: "Program Delivery Materials", value: 24, color: "#4C9F38" },
  { name: "Local Field Operations", value: 20, color: "#F29F05" },
  { name: "Anganwadi & School Infra", value: 12, color: "#195F70" },
  { name: "Tech & Tracking Systems", value: 8, color: "#C5192D" },
  { name: "Rural Travel & Logistics", value: 5, color: "#28804E" },
  { name: "Contingency Fund", value: 3, color: "#8C2D19" },
];

function MobileLegend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-2">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-gray-600">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl shadow-2xl text-white font-black text-sm relative z-50 pointer-events-none">
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full inline-block mr-2 shadow-inner" style={{ backgroundColor: payload[0].payload.fill }} />
          <span>{payload[0].name}: {payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

// Projected vs Baseline
const programSpend = [
  { program: "Prenatal", baseline: 0.5, target: 80 },
  { program: "Early Child", baseline: 0.4, target: 65 },
  { program: "Nutrition", baseline: 0.8, target: 110 },
  { program: "Education", baseline: 1.0, target: 145 },
  { program: "Youth", baseline: 0.5, target: 65 },
  { program: "Protection", baseline: 0.2, target: 35 },
];

const yearlyImpact = [
  { year: "2026", children: 250000, mothers: 50000, communities: 1200 },
  { year: "2027", children: 1200000, mothers: 240000, communities: 5000 },
  { year: "2028", children: 5000000, mothers: 1000000, communities: 12000 },
  { year: "2029", children: 12500000, mothers: 2500000, communities: 25000 },
  { year: "2030", children: 25000000, mothers: 5000000, communities: 50000 },
];

const programProgress = [
  { program: "Prenatal & Maternal Care", utilized: 0, allocated: 2500000, beneficiaries: "Target: Scaling phased" },
  { program: "Early Childhood Development", utilized: 0, allocated: 1800000, beneficiaries: "Target: Scaling phased" },
  { program: "Nutrition Programs", utilized: 0, allocated: 3200000, beneficiaries: "Target: Scaling phased" },
  { program: "Education Support", utilized: 0, allocated: 4100000, beneficiaries: "Target: Scaling phased" },
  { program: "Youth Empowerment", utilized: 0, allocated: 1500000, beneficiaries: "Target: Scaling phased" },
  { program: "Child Protection", utilized: 0, allocated: 1000000, beneficiaries: "Target: Scaling phased" },
];

const outcomes = [
  { metric: "Infant Mortality Target", value: 0, target: 50, detail: "Aiming for 50% reduction in partner districts by 2030" },
  { metric: "Universal School Enrollment", value: 0, target: 100, detail: "Targeting 100% enrollment for program cohort" },
  { metric: "Zero Malnutrition Goal", value: 0, target: 100, detail: "Setting benchmark at 100% children meeting healthy growth points" },
  { metric: "Complete Immunization", value: 0, target: 100, detail: "Total coverage planned for all infants in registry" },
  { metric: "Youth Employability", value: 0, target: 90, detail: "Targeting 90% post-training employment placement" },
];

function formatINR(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

const AnimatedProgressCard = ({ p, index }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const percent = Math.round((p.utilized / p.allocated) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.1, type: "spring" }}
      className="h-full flex"
    >
      <Card className="bg-white border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.12)] transition-shadow duration-500 h-full rounded-[1.5rem] w-full">
        <CardContent className="pt-6 pb-6">
          <h4 className="text-[1.1rem] leading-tight mb-1 tracking-tight text-gray-900 font-extrabold">{p.program}</h4>
          <p className="text-xs text-gray-500 mb-5 font-medium">{p.beneficiaries}</p>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-900 font-extrabold">{formatINR(p.utilized)}</span>
            <span className="text-gray-500 font-semibold">of {formatINR(p.allocated)}</span>
          </div>
          <div className="h-2.5 mb-2 bg-gray-100/80 rounded-full overflow-hidden shadow-inner flex">
             <motion.div 
               className="h-full bg-[#1D6E3F] rounded-full"
               initial={{ width: 0 }}
               animate={{ width: isInView ? `${percent}%` : 0 }}
               transition={{ duration: 1.5, delay: 0.2 + index * 0.15, ease: "easeOut" }}
             />
          </div>
          <p className="text-[0.7rem] text-right text-[#F29F05] font-bold tracking-tight uppercase">{p.seedLabel}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AnimatedOutcomeCard = ({ o, index }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: index * 0.15, type: "spring" }}
    >
      <Card className="bg-white border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.12)] transition-shadow duration-500 rounded-[1.5rem] overflow-hidden">
        <CardContent className="py-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-[1.1rem] text-gray-900 font-extrabold tracking-tight">{o.metric}</span>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{o.detail}</p>
            </div>
            <Badge variant="secondary" className="bg-[#1D6E3F]/10 text-[#1D6E3F] border-none font-black text-sm px-4 py-1.5 shadow-sm shrink-0 rounded-xl">
              {o.value}% <span className="text-gray-400 font-semibold text-xs ml-1">/ {o.target}%</span>
            </Badge>
          </div>
          <div className="h-3 bg-gray-100/80 rounded-full overflow-hidden shadow-inner flex">
             <motion.div 
               className="h-full bg-gradient-to-r from-[#1D6E3F] to-[#4C9F38] rounded-full shadow-sm"
               initial={{ width: 0 }}
               animate={{ width: isInView ? `${o.value}%` : 0 }}
               transition={{ duration: 1.5, delay: 0.3 + index * 0.15, ease: "easeOut" }}
             />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function ImpactPage() {
  const { i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];
  const { content, isLoading: isTranslating, error: translationError } = useBhashiniRuntimeTranslation(
    impactPageContent,
    currentLanguage,
  );
  const fundUtilizationData = fundUtilization.map((item, index) => ({
    ...item,
    name: content.charts.fundUtilization[index] || item.name,
  }));
  const expenseBreakdownData = expenseBreakdown.map((item, index) => ({
    ...item,
    name: content.charts.expenseBreakdown[index] || item.name,
  }));
  const programSpendData = programSpend.map((item, index) => ({
    ...item,
    program: content.charts.programSpendPrograms[index] || item.program,
  }));
  const programProgressData = programProgress.map((item, index) => ({
    ...item,
    program: content.programProgress.items[index]?.program || item.program,
    beneficiaries: content.programProgress.items[index]?.beneficiaries || item.beneficiaries,
    seedLabel: content.programProgress.seedPhase,
  }));
  const outcomesData = outcomes.map((item, index) => ({
    ...item,
    metric: content.outcomes.items[index]?.metric || item.metric,
    detail: content.outcomes.items[index]?.detail || item.detail,
  }));
  const totalAllocated = programProgress.reduce((s, p) => s + p.allocated, 0);
  const totalUtilized = programProgress.reduce((s, p) => s + p.utilized, 0);
  const utilizationPercent = Math.round((totalUtilized / totalAllocated) * 100);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-[#e0f2fe]/40 to-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#0ea5e9]/5 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_#0284c7_0%,_transparent_70%)] opacity-[0.03] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#1e40af_0%,_transparent_70%)] opacity-[0.03] blur-[80px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring" }} className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-[#0284c7]/10 text-[#0369a1] border-none font-bold px-4 py-1.5 mb-6 uppercase tracking-widest text-xs shadow-sm">{content.hero.badge}</Badge>
            <h1 className="text-[2.3rem] sm:text-[3.5rem] mb-6 font-black tracking-tight text-[#0f172a] leading-[1.1]">
              {content.hero.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] to-[#1e40af]">{content.hero.titleAccent}</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-10 font-medium leading-relaxed mx-auto">
              {content.hero.subtitle}
            </p>
            <div className="flex justify-center gap-5 flex-wrap">
              <Button size="lg" className="bg-[#1e40af] text-white hover:bg-[#1e3a8a] font-bold shadow-xl shadow-[#1e40af]/20 rounded-xl h-14 px-8 text-base transition-all hover:-translate-y-1 hover:shadow-2xl" onClick={() => toast.success(content.hero.primaryToastTitle, { description: content.hero.primaryToastDescription })}>
                <Download className="h-5 w-5 mr-2" /> {content.hero.primaryCta}
              </Button>
              <Button size="lg" variant="outline" className="group bg-white text-[#0f172a] border-gray-200 hover:border-[#1e40af]/30 hover:bg-[#1e40af] hover:text-white font-bold shadow-sm rounded-xl h-14 px-8 text-base transition-all hover:-translate-y-1" onClick={() => toast.success(content.hero.secondaryToastTitle, { description: content.hero.secondaryToastDescription })}>
                <FileText className="h-5 w-5 mr-3 group-hover:text-white transition-colors" /> {content.hero.secondaryCta}
              </Button>
            </div>
            {currentLanguage !== "en" && (
              <p className="mt-4 text-sm font-medium text-slate-500">
                {isTranslating
                  ? "Translating this page with Bhashini..."
                  : translationError
                    ? "Bhashini translation is unavailable right now, so this page is showing the default copy."
                    : `Live translation active: ${currentLanguage.toUpperCase()}`}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 lg:py-20 bg-white border-b border-gray-100 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-14"
          >
            <h2 className="text-[2rem] sm:text-4xl font-black text-gray-900 mb-5 tracking-tight">{content.sdg.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {content.sdg.subtitle}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 perspective-[2000px] items-stretch">
            {content.sdg.cards.map((sdg, i) => (
              <motion.div
                key={sdg.id}
                initial={{ opacity: 0, rotateX: -40, y: 80, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, delay: i * 0.2, type: "spring", bounce: 0.3 }}
                whileHover={{ scale: 1.03, y: -12, rotateY: i === 0 ? 5 : i === 2 ? -5 : 0 }}
                style={{ transformStyle: "preserve-3d", borderColor: sdg.color }}
                className="bg-white p-7 lg:p-8 rounded-[2.25rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] relative group cursor-pointer border-[1.5px] transition-shadow duration-500 overflow-hidden flex flex-col"
              >
                {/* Modern Hover Shine Sweep inside the card */}
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 z-20 pointer-events-none opacity-0 group-hover:opacity-100"
                />
                
                {/* Colored accent gradient on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" 
                  style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${sdg.color})` }} 
                />

                <div 
                  className="w-16 h-16 rounded-[1.1rem] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 z-10 overflow-hidden"
                >
                  <img 
                    src={sdg.image} 
                    alt={sdg.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-[1.2rem] lg:text-[1.3rem] font-extrabold text-gray-900 mb-3 z-10 tracking-tight">{sdg.title}</h3>
                <p className="text-[0.98rem] text-gray-600 mb-5 leading-relaxed z-10">
                  {sdg.desc}
                </p>

                <ul className="space-y-2.5 z-10 mt-auto">
                  {sdg.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[0.95rem] text-gray-700 leading-snug">
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: sdg.color }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reporting Calendar ── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafb 0%, #eef3f7 100%)' }}>
        {/* Decorative blurred orbs */}
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#0284c7_0%,_transparent_70%)] opacity-[0.04] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[-8%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_#1D6E3F_0%,_transparent_70%)] opacity-[0.04] blur-[80px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-center mb-16 lg:mb-20"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center shadow-lg shadow-[#0284c7]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </motion.div>
            <h2 className="text-[2rem] md:text-5xl font-black text-gray-900 tracking-tight mb-4">{content.reporting.title}</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
              {content.reporting.subtitle}
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical spine — desktop only */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent -translate-x-1/2" />

            <div className="space-y-8 lg:space-y-0">
              {[
                {
                  quarter: "Q1",
                  report: "Q1 Impact Report",
                  month: "APR",
                  day: "30",
                  color: "#1D6E3F",
                  lightBg: "rgba(29,110,63,0.07)",
                  contents: "Programme delivery, fund utilisation, children reached, schools served, trees planted — January to March.",
                  side: "left" as const,
                },
                {
                  quarter: "Q2",
                  report: "Q2 Impact Report",
                  month: "JUL",
                  day: "31",
                  color: "#F29F05",
                  lightBg: "rgba(242,159,5,0.07)",
                  contents: "Same metrics for April to June. Annual Report also published in July.",
                  side: "right" as const,
                },
                {
                  quarter: "Q3",
                  report: "Q3 Impact Report",
                  month: "OCT",
                  day: "31",
                  color: "#0284c7",
                  lightBg: "rgba(2,132,199,0.07)",
                  contents: "July to September metrics. Mid-year programme performance review.",
                  side: "left" as const,
                },
                {
                  quarter: "Q4",
                  report: "Q4 Impact Report",
                  month: "JAN",
                  day: "31",
                  color: "#8b5cf6",
                  lightBg: "rgba(139,92,246,0.07)",
                  contents: "October to December. Full-year preview ahead of Annual Report.",
                  side: "right" as const,
                },
                {
                  quarter: "Annual",
                  report: "Annual Report",
                  month: "JUL",
                  day: "31",
                  color: "#1D6E3F",
                  lightBg: "rgba(29,110,63,0.07)",
                  contents: "Audited accounts (Income & Expenditure + Balance Sheet), programme outcomes vs targets, governance report, donor acknowledgements, and next-year plan.",
                  side: "left" as const,
                  extraLabel: "For prior FY"
                },
              ].map((item, i) => (
                <div key={item.quarter} className={`lg:grid lg:grid-cols-2 lg:gap-16 relative ${i > 0 ? 'lg:mt-8' : ''}`}>
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.2, type: "spring", bounce: 0.5 }}
                    className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white z-10 shadow-md"
                    style={{ backgroundColor: item.color }}
                  />

                  {/* Card — position based on side */}
                  <motion.div
                    initial={{ opacity: 0, x: item.side === "left" ? -60 : 60, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: i * 0.12, type: "spring", stiffness: 80 }}
                    whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12)" }}
                    className={`group bg-white rounded-3xl p-0 overflow-hidden border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-colors duration-300 cursor-default ${
                      item.side === "right" ? "lg:col-start-2" : ""
                    }`}
                  >
                    <div className="flex h-full">
                      {/* Calendar date strip */}
                      <div
                        className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center py-6 relative overflow-hidden"
                        style={{ backgroundColor: item.lightBg }}
                      >
                        {/* Subtle pattern overlay */}
                        <div
                          className="absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage: `repeating-linear-gradient(0deg, ${item.color} 0px, ${item.color} 1px, transparent 1px, transparent 8px)`,
                          }}
                        />
                        <span className="text-xs font-black tracking-[0.2em] uppercase relative z-10" style={{ color: item.color }}>
                          {item.month}
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-gray-900 leading-none mt-1 relative z-10">
                          {item.day}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 sm:p-7">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="text-[0.7rem] font-black tracking-widest uppercase px-2.5 py-1 rounded-md"
                            style={{ backgroundColor: item.lightBg, color: item.color }}
                          >
                            {item.quarter}
                          </span>
                          <div className="h-px flex-1 bg-gray-100" />
                          {item.extraLabel && (
                            <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">{item.extraLabel}</span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight mb-2 group-hover:text-[#0369a1] transition-colors duration-300">
                          {item.report}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {item.contents}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Financial Metrics */}
      <section className="py-10 relative overflow-hidden bg-[#f8fcf9] border-y border-[#1D6E3F]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-80" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: IndianRupee, label: content.metrics[0].label, to: 500, prefix: "₹", suffix: " Cr", decimals: 0, change: content.metrics[0].change, color: "text-[#1D6E3F]" },
              { icon: TrendingUp, label: content.metrics[1].label, to: 82, prefix: "", suffix: "%", decimals: 0, change: content.metrics[1].change, color: "text-blue-600" },
              { icon: Users, label: content.metrics[2].label, to: 25, prefix: "", suffix: "M", decimals: 0, change: content.metrics[2].change, color: "text-[#1D6E3F]" },
              { icon: ShieldCheck, label: content.metrics[3].label, to: 1200, prefix: "₹", suffix: "", decimals: 0, change: content.metrics[3].change, color: "text-amber-500" },
            ].map((m, i) => (
              <motion.div 
                key={m.label} 
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, type: "spring", stiffness: 70 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:shadow-md transition-shadow duration-300"
                >
                  <m.icon className={`h-7 w-7 ${m.color}`} />
                </motion.div>
                <p className="text-[2rem] sm:text-[2.5rem] tracking-tight text-gray-900 font-black mb-2 drop-shadow-sm group-hover:text-[var(--womb-forest)] transition-colors duration-300">
                   <Counter from={0} to={m.to} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} duration={2.5} />
                </p>
                <p className="text-[1.05rem] text-gray-700 font-bold mb-2">{m.label}</p>
                <p className="text-sm text-gray-500 font-semibold bg-white/80 inline-block px-3 py-1.5 rounded-full border border-gray-100">{m.change}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fund Utilization & Expense Breakdown Charts */}
      <section className="py-16 bg-gray-50/50 relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[60px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Fund Utilization Pie */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, type: "spring" }}>
              <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.12)] transition-shadow duration-500 rounded-3xl h-full">
                <CardHeader className="pb-4 pt-6 sm:pt-8 px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{content.charts.fundUtilizationTitle}</CardTitle>
                  <Badge variant="secondary" className="w-fit bg-[#1D6E3F]/10 text-[#1D6E3F] border-none font-bold px-3 py-1 shadow-sm mt-0">{content.charts.fundUtilizationBadge}</Badge>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-6 sm:pb-8">
                  <div className="h-[250px] sm:h-[320px] [WebkitTapHighlightColor:transparent] [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none">
                    <AnimatedChart>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fundUtilizationData}
                          cx="50%"
                          cy="42%"
                          innerRadius="48%"
                          outerRadius="78%"
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          stroke="white"
                          strokeWidth={2}
                          isAnimationActive={true}
                          animationBegin={100}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        >
                          {fundUtilizationData.map((entry, index) => (
                            <Cell key={`util-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                      </PieChart>
                    </ResponsiveContainer>
                    </AnimatedChart>
                  </div>
                  <MobileLegend items={fundUtilizationData} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Expense Breakdown Pie */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, type: "spring", delay: 0.2 }}>
              <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.12)] transition-shadow duration-500 rounded-3xl h-full">
                <CardHeader className="pb-4 pt-6 sm:pt-8 px-5 sm:px-8">
                  <CardTitle className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{content.charts.expenseBreakdownTitle}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-6 sm:pb-8">
                  <div className="h-[250px] sm:h-[320px] [WebkitTapHighlightColor:transparent] [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none">
                    <AnimatedChart>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          cx="50%"
                          cy="42%"
                          innerRadius="48%"
                          outerRadius="78%"
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          stroke="white"
                          strokeWidth={2}
                          isAnimationActive={true}
                          animationBegin={400}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        >
                          {expenseBreakdownData.map((entry, index) => (
                            <Cell key={`expense-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                      </PieChart>
                    </ResponsiveContainer>
                    </AnimatedChart>
                  </div>
                  <MobileLegend items={expenseBreakdownData} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Comparison Bar Chart */}
      <section className="py-10 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, type: "spring" }}>
            <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 rounded-3xl">
              <CardHeader className="pt-6 px-5 sm:px-8 border-b border-gray-50 pb-4 mb-4">
                <CardTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{content.charts.programSpendTitle}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-6">
                <div className="h-[280px] sm:h-[320px]">
                  <AnimatedChart>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={programSpendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D6E3F" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#155e33" stopOpacity={0.9}/>
                        </linearGradient>
                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F29F05" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#d98c00" stopOpacity={0.9}/>
                        </linearGradient>
                        <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.25" />
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="program" tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip 
                        formatter={(value: number) => `₹${value} Cr`} 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600', fontSize: '14px' }} iconType="circle" />
                      <Bar 
                        dataKey="baseline" 
                        fill="url(#colorSpent)" 
                        radius={[6, 6, 0, 0]} 
                        name={content.charts.programSpendLegendBaseline} 
                        barSize={32}
                        filter="url(#barShadow)"
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                      <Bar 
                        dataKey="target" 
                        fill="url(#colorTarget)" 
                        radius={[6, 6, 0, 0]} 
                        name={content.charts.programSpendLegendTarget}

                        barSize={32}
                        filter="url(#barShadow)"
                        animationDuration={1500}
                        animationEasing="ease-out"
                        animationBegin={300}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  </AnimatedChart>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Program Progress Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="text-[2rem] text-gray-900 font-extrabold tracking-tight mb-2">{content.programProgress.title}</h2>
            <p className="text-gray-600 font-medium text-lg text-opacity-80">{content.programProgress.subtitle}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programProgressData.map((p, index) => (
              <AnimatedProgressCard key={p.program} p={p} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Growth Chart */}
      <section className="py-16 bg-gray-50/50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, type: "spring" }}>
            <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 rounded-3xl">
              <CardHeader className="pt-6 sm:pt-8 px-5 sm:px-8 border-b border-gray-50 pb-6 mb-6">
                <CardTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{content.charts.growthTitle}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-6 sm:pb-8">
                <div className="h-[300px] sm:h-[400px]">
                  <AnimatedChart>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearlyImpact} margin={{ top: 20, right: 30, left: 24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorChildren" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1D6E3F" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#1D6E3F" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMothers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F29F05" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F29F05" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCommunities" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#195F70" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#195F70" stopOpacity={0}/>
                          </linearGradient>
                          <filter id="lineShadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="8" stdDeviation="5" floodOpacity="0.15" />
                          </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="year" tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis
                          width={72}
                          tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                          cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600', fontSize: '14px' }} iconType="circle" />
                        <Area 
                          type="monotone" 
                          dataKey="children" 
                          stroke="#1D6E3F" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorChildren)" 
                          name={content.charts.growthSeries.children} 
                          filter="url(#lineShadow)"
                          animationDuration={2000}
                          animationEasing="ease-in-out"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="mothers" 
                          stroke="#F29F05" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorMothers)" 
                          name={content.charts.growthSeries.mothers} 
                          filter="url(#lineShadow)"
                          animationDuration={2000}
                          animationEasing="ease-in-out"
                          animationBegin={400}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="communities" 
                          stroke="#195F70" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorCommunities)" 
                          name={content.charts.growthSeries.communities} 
                          filter="url(#lineShadow)"
                          animationDuration={2000}
                          animationEasing="ease-in-out"
                          animationBegin={800}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </AnimatedChart>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Outcome Metrics */}
      <section className="py-16 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="text-[2rem] text-gray-900 font-extrabold tracking-tight mb-2">{content.outcomes.title}</h2>
            <p className="text-gray-600 font-medium text-lg text-opacity-80">{content.outcomes.subtitle}</p>
          </motion.div>
          <div className="space-y-6">
            {outcomesData.map((o, index) => (
              <AnimatedOutcomeCard key={o.metric} o={o} index={index} />
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Trust Section */}
      <section className="py-12 bg-[#f0faf4] border-t border-[#d1f5e0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl text-gray-900 mb-2 font-bold">{content.trust.title}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {content.trust.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {content.trust.badges.map((badge) => (
              <Badge key={badge} variant="outline" className="px-4 py-2 text-sm border-[#a7e8c3] text-[#155e33] bg-white shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-[#1D6E3F]" />
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
