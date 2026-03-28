import React, { useState, useRef, useEffect } from "react";
import { Baby, GraduationCap, HeartPulse, Apple, Users, Shield, ArrowRight, Heart, CheckCircle, Leaf, Target, Activity, Syringe, Smartphone, MessageSquare, Mail, Stethoscope, AlertTriangle, ShieldAlert, Brain, Radio, Flame } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router";
import { motion, AnimatePresence, useInView, animate } from "motion/react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function Counter({ from = 0, to, duration = 2, prefix = "", suffix = "", decimals = 0 }: { from?: number, to: number, duration?: number, prefix?: string, suffix?: string, decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          if (ref.current) {
            ref.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
          }
        }
      });
      return controls.stop;
    }
  }, [inView, from, to, duration, prefix, suffix, decimals]);

  return <span ref={ref}>{prefix}{from.toFixed(decimals)}{suffix}</span>;
}

function MobilePdfPreview({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const renderPreview = async () => {
      try {
        setHasError(false);

        const loadingTask = getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = 900;
        const scale = targetWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas context unavailable");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        if (!isActive) {
          await pdf.destroy();
          return;
        }

        setPreviewSrc(canvas.toDataURL("image/png"));
        await pdf.destroy();
      } catch {
        if (isActive) {
          setHasError(true);
        }
      }
    };

    void renderPreview();

    return () => {
      isActive = false;
    };
  }, [pdfUrl]);

  if (previewSrc) {
    return <img src={previewSrc} alt={title} className="h-full w-full object-cover object-top" />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(180deg,#f8f7f2_0%,#ece5d8_100%)] px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#e7d9a2] bg-white shadow-md">
        <Leaf className="h-8 w-8 text-[#1D6E3F]" />
      </div>
      <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#1D6E3F]">Go Green Certificate</p>
      <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-[#5e5a4f]">
        {hasError ? "Tap to open the full PDF certificate." : "Generating certificate preview..."}
      </p>
    </div>
  );
}


const programs = [
  {
    icon: Baby,
    title: "Prenatal & Maternal Care",
    age: "Pre-birth",
    status: "Active",
    description: "Comprehensive healthcare for expectant mothers including regular check-ups, nutrition counseling, birth preparedness, and postpartum support.",
    target2026: "Updating soon",
    features: ["Regular health check-ups", "Nutrition supplements", "Birth preparedness classes", "Postpartum counseling"],
    image: "/images/site-assets/program_prenatal.png",
    category: "Health",
  },
  {
    icon: HeartPulse,
    title: "Early Childhood Development",
    age: "0-5 years",
    status: "Active",
    description: "Immunization drives, developmental screenings, growth monitoring, and early stimulation programs for infants and toddlers.",
    target2026: "Updating soon",
    features: ["Immunization tracking", "Developmental milestones", "Growth monitoring", "Parent education"],
    image: "/images/site-assets/program_childhood.png",
    category: "Health",
  },
  {
    icon: Apple,
    title: "Nutrition Programs",
    age: "0-18 years",
    status: "Active",
    description: "Mid-day meal programs, nutrition supplements, awareness campaigns, and kitchen gardens to combat malnutrition at every stage.",
    target2026: "Updating soon",
    features: ["Mid-day meals", "Micronutrient supplements", "Community kitchens", "Nutrition awareness"],
    image: "/images/site-assets/Mid-Day-meal-3.jpg",
    category: "Nutrition",
  },
  {
    icon: GraduationCap,
    title: "Education Support",
    age: "6-18 years",
    status: "Active",
    description: "Scholarships, school supplies, after-school tutoring, digital literacy, and career guidance for school-age children.",
    target2026: "Updating soon",
    features: ["Scholarships", "Digital literacy", "After-school tutoring", "Career guidance"],
    image: "/images/site-assets/Education-Support-01.jpg",
    category: "Education",
  },
  {
    icon: Users,
    title: "Youth Empowerment",
    age: "14-18 years",
    status: "Active",
    description: "Skill development, mentorship, leadership training, and career counseling to prepare teenagers for independent adult life.",
    target2026: "Updating soon",
    features: ["Skill development", "Mentorship", "Leadership programs", "Internship placements"],
    image: "/images/site-assets/National-Youth-Policy_Featured-Image-1.jpg",
    category: "Community",
  },
  {
    icon: Shield,
    title: "Child Protection",
    age: "0-18 years",
    status: "Active",
    description: "Advocacy, community awareness, helplines, and support systems to protect children from abuse, exploitation, and trafficking.",
    target2026: "Updating soon",
    features: ["Helpline services", "Community awareness", "Legal support", "Rehabilitation"],
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    category: "Community",
  },
];

const carePillars = [
  {
    id: "01",
    title: "Maternal & Early Care",
    color: "var(--journey-saffron)",
    bg: "from-[#fff5e8] to-white",
    border: "border-[#f4d6a3]",
    iconBg: "bg-[#fff2df]",
    Icon: Baby,
    points: ["Prenatal support", "Safe delivery prep", "Early nutrition"],
  },
  {
    id: "02",
    title: "Preventive Healthcare",
    color: "#2ca86e",
    bg: "from-[#ecfbf3] to-white",
    border: "border-[#bfead2]",
    iconBg: "bg-[#e6f8ee]",
    Icon: HeartPulse,
    points: ["Vaccination", "Screenings", "Growth tracking"],
  },
  {
    id: "03",
    title: "Mental Wellness",
    color: "#6d63ff",
    bg: "from-[#f1efff] to-white",
    border: "border-[#d9d2ff]",
    iconBg: "bg-[#eeebff]",
    Icon: Brain,
    points: ["Emotional development", "Counselling", "School readiness"],
  },
  {
    id: "04",
    title: "School Health Systems",
    color: "#3b82f6",
    bg: "from-[#eef5ff] to-white",
    border: "border-[#c9dcff]",
    iconBg: "bg-[#e9f2ff]",
    Icon: Shield,
    points: ["Health programmes", "WASH", "Emergency readiness"],
  },
  {
    id: "05",
    title: "Green Cohort",
    color: "#6b9f2f",
    bg: "from-[#f3fae8] to-white",
    border: "border-[#d7e8b7]",
    iconBg: "bg-[#edf7dd]",
    Icon: Leaf,
    points: ["Tree per child", "Climate awareness", "Carbon-neutral future"],
  },
];

function FivePillarsSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbf8f1] py-20 sm:py-24 lg:py-28 border-y border-[#efe8da]">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-[10%] top-[12%] h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(29,110,63,0.12)_0%,_transparent_65%)] blur-3xl"
          animate={{ x: [0, 18, -10, 0], y: [0, -10, 12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[8%] bottom-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(227,171,59,0.14)_0%,_transparent_70%)] blur-3xl"
          animate={{ x: [0, -16, 10, 0], y: [0, 12, -12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: "linear-gradient(rgba(29,110,63,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(29,110,63,0.05) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--womb-forest)]/15 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--womb-forest)] shadow-sm backdrop-blur-sm">
            Our Five Pillars
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-[4rem]" style={{ lineHeight: 1.02 }}>
            One Platform.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] via-[#29ae79] to-[#67c79f] italic">Five Dimensions of Care.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            WOMBTO18 Foundation operates as India's first integrated child health non-profit platform - uniting <strong className="font-black text-gray-900">32 programmes</strong> across five pillars, delivered through schools, hospitals, and communities. Serving <strong className="font-black text-gray-900">25 schools today</strong>.
          </p>
        </motion.div>

        <div className="relative mt-12 sm:mt-16">
          <svg className="pointer-events-none absolute left-0 right-0 top-[5.4rem] hidden h-24 w-full lg:block" viewBox="0 0 1200 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pillarBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(29,110,63,0)" />
                <stop offset="20%" stopColor="rgba(29,110,63,0.18)" />
                <stop offset="50%" stopColor="rgba(227,171,59,0.32)" />
                <stop offset="80%" stopColor="rgba(29,110,63,0.18)" />
                <stop offset="100%" stopColor="rgba(29,110,63,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M40 84 C220 30, 350 128, 520 84 S860 36, 1160 84"
              fill="none"
              stroke="url(#pillarBeam)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </svg>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {carePillars.map((pillar, index) => (
              <motion.article
                key={pillar.id}
                initial={{ opacity: 0, y: 40, rotateX: 12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
                className="group relative"
                style={{ perspective: 1200 }}
              >
                <motion.div
                  className="absolute -inset-2 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${pillar.color}25 0%, transparent 70%)` }}
                />
                <div className={`relative h-full overflow-hidden rounded-[1.8rem] border ${pillar.border} bg-gradient-to-b ${pillar.bg} p-5 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:shadow-[0_28px_55px_-20px_rgba(0,0,0,0.18)]`}>
                  <motion.div
                    className="absolute right-4 top-4 h-16 w-16 rounded-full blur-2xl"
                    style={{ backgroundColor: pillar.color, opacity: 0.12 }}
                    animate={{ scale: [0.9, 1.08, 0.94], opacity: [0.08, 0.16, 0.1] }}
                    transition={{ duration: 3.6, repeat: Infinity, delay: index * 0.25, ease: "easeInOut" }}
                  />
                  <div className="relative z-10 flex min-h-[220px] flex-col">
                    <div className="flex items-start justify-between">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: pillar.color }}>
                        Pillar {pillar.id}
                      </p>
                      <motion.div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${pillar.iconBg} shadow-inner ring-1 ring-black/5`}
                        animate={{ rotate: [0, -4, 4, 0], y: [0, -2, 2, 0] }}
                        transition={{ duration: 5, repeat: Infinity, delay: index * 0.25, ease: "easeInOut" }}
                      >
                        <pillar.Icon className="h-6 w-6" style={{ color: pillar.color }} />
                      </motion.div>
                    </div>

                    <h3 className="mt-6 text-[1.55rem] font-black tracking-tight text-gray-900 leading-[1.02]">
                      {pillar.title}
                    </h3>

                    <div className="mt-4 h-1.5 w-16 rounded-full transition-all duration-500 group-hover:w-24" style={{ backgroundColor: pillar.color }} />

                    <ul className="mt-5 space-y-2.5">
                      {pillar.points.map((point, pointIndex) => (
                        <motion.li
                          key={point}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45, delay: 0.25 + index * 0.08 + pointIndex * 0.06 }}
                          className="flex items-start gap-3 text-[0.92rem] font-medium leading-snug text-gray-600"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: pillar.color }} />
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>

                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 rounded-[2rem] border border-white/70 bg-white/70 px-6 py-6 shadow-[0_18px_45px_-22px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-8"
        >
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            {[
              { value: "25", label: "Schools active" },
              { value: "32", label: "Programmes" },
              { value: "Preg-18", label: "Full lifecycle" },
            ].map((stat, index) => (
              <div key={stat.label} className="relative">
                <p className="text-4xl font-black tracking-tight text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-gray-500">{stat.label}</p>
                {index < 2 && <div className="absolute right-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#dcd6ca] to-transparent md:block" />}
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-[#ece5d8] pt-6">
            <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
              <span className="font-black text-[var(--womb-forest)]">India's first integrated child health platform</span> - from the moment of conception through adolescence, designed as connected infrastructure rather than isolated interventions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function formatINR(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All Programs");

  const filteredPrograms = activeCategory === "All Programs"
    ? programs
    : programs.filter(p => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-[#f0faf4] to-white overflow-hidden relative border-b border-gray-100">
        {/* Subtle Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full max-w-4xl mx-auto"
          >
            <p className="inline-flex items-center gap-2 bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--womb-forest)]/20 mb-4 sm:mb-6 shadow-sm">
              Our Programs
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] text-gray-900 mb-6" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              Comprehensive Care at Every <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-[#36c276] drop-shadow-sm">Stage of Childhood.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
              From prenatal care to preparing young adults for life, our programs ensure no child is left behind. Choose a program to support and track your impact in real time.
            </p>
          </motion.div>
        </div>
      </section>

      <FivePillarsSection />

      {/* Programs Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Category Filters */}
          <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 flex-wrap mb-10">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider hidden sm:block mr-2">Categories:</span>
            {["All Programs", "Health", "Education", "Nutrition", "Community"].map((cat) => (
              <Badge
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer px-4 py-2 transition-all duration-300 font-semibold shadow-sm hover:shadow-md ${activeCategory === cat
                    ? "bg-[var(--womb-forest)] text-white hover:bg-[var(--womb-forest)]/90 scale-105"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[var(--womb-forest)]/30 hover:text-[var(--womb-forest)]"
                  }`}
              >
                {cat}
              </Badge>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPrograms.map((program) => {
                return (
                  <motion.div key={program.title} variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50, damping: 15 } }
                  }}>
                    <Card className="bg-white border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-[0_20px_50px_-15px_rgba(29,110,63,0.15)] transition-all duration-500 h-full flex flex-col rounded-[2rem]">
                      {/* Image */}
                      <div className="relative h-36 overflow-hidden rounded-t-[2rem]">
                        <img
                          src={program.image}
                          alt={program.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <Badge className="bg-white/95 text-[var(--womb-forest)] backdrop-blur-sm text-[10px] px-2 py-0.5 font-bold shadow-sm border-none">{program.category}</Badge>
                          <Badge className="bg-[var(--journey-saffron)] text-white text-[10px] px-2 py-0.5 shadow-sm border-none">{program.status}</Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/95 backdrop-blur-sm text-[9px] px-2.5 py-0.5 rounded-full text-[var(--womb-forest)] font-bold shadow-sm inline-flex items-center">
                            {program.age}
                          </span>
                        </div>
                        {/* Gradient Overlay for seamless blend */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      <CardContent className="p-4 md:p-5 flex-1 flex flex-col pt-4 z-10 bg-white relative">
                        {/* Sub-Glow */}
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-[var(--womb-forest)]/5 rounded-full blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Title & Icon */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--womb-forest)]/10 to-[var(--womb-forest)]/5 flex items-center justify-center shrink-0 border border-[var(--womb-forest)]/20 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <program.icon className="h-5 w-5 text-[var(--womb-forest)]" />
                          </div>
                          <div>
                            <h3 className="text-[1.15rem] leading-tight text-gray-900 font-bold group-hover:text-[var(--womb-forest)] transition-colors duration-300 tracking-tight">{program.title}</h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[0.85rem] text-gray-600 mb-3 flex-1 leading-snug">{program.description}</p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-1 mb-4 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-[var(--womb-forest)]/10 transition-colors">
                          {program.features.map((f) => (
                            <div key={f} className="flex items-start gap-1.5 text-[11px] text-gray-600 font-medium">
                              <div className="h-1.5 w-1.5 rounded-full bg-[var(--womb-forest)]/40 group-hover:bg-[var(--womb-forest)] shrink-0 mt-1 transition-colors" />
                              <span className="leading-tight">{f}</span>
                            </div>
                          ))}
                        </div>

                        {/* Target & Donate */}
                        <div className="border-t border-gray-100 pt-3 mt-auto flex justify-between items-center">
                          <span className="text-[10px] text-[var(--journey-saffron)] font-bold bg-[var(--journey-saffron)]/10 px-2.5 py-1 rounded-md leading-none uppercase tracking-wider">🎯 {program.target2026}</span>
                          <Link to="/donate">
                            <Button size="sm" className="bg-[var(--womb-forest)] hover:bg-[#155e33] h-8 px-4 text-[11px] font-bold rounded-lg shadow hover:shadow-md transition-all group-hover:scale-105">
                              <Heart className="h-3 w-3 mr-1.5" /> Donate Now
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Cinematic Lifelong Health Journey */}
      <section className="py-20 sm:py-32 bg-white relative overflow-hidden border-t border-gray-100">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_50%)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_50%)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-24"
          >
            <p className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-indigo-500/20 mb-4 sm:mb-6 shadow-sm">
              Care Continuum
            </p>
            <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 drop-shadow-sm tracking-tight leading-[0.95]">The Lifelong Health Journey</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From the very first day to young adulthood, we ensure no critical health milestone is missed through our <strong className="text-gray-900 font-bold bg-indigo-50 px-1 rounded">integrated multi-stage approach</strong>.
            </p>
          </motion.div>

          <div className="md:hidden max-w-md mx-auto">
            <div className="space-y-5">
              <div className="rounded-[1.75rem] border border-[#dbeadf] bg-gradient-to-br from-white to-[#f7fbf8] p-5 shadow-[0_12px_35px_-20px_rgba(29,110,63,0.25)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--womb-forest)]/10 text-[var(--womb-forest)]">
                    <Baby className="h-5 w-5" />
                  </div>
                  <Badge className="bg-[var(--womb-forest)] text-white hover:bg-[var(--womb-forest)]/90 border-none shadow-sm font-bold px-3 py-1">0 - 18 Months</Badge>
                </div>
                <h3 className="text-[1.75rem] font-extrabold text-gray-900 tracking-tight leading-none">Foundation of Life</h3>
                <p className="mt-3 text-[0.98rem] text-gray-600 leading-7 font-medium">Critical early protection with BCG, Polio, DPT, Hepatitis B, and Measles vaccines. A robust start for a healthy life.</p>
              </div>

              <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 p-5 shadow-[0_12px_35px_-20px_rgba(59,130,246,0.25)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <Badge className="bg-blue-600 text-white hover:bg-blue-700 border-none shadow-sm font-bold px-3 py-1">5 - 16 Years</Badge>
                </div>
                <h3 className="text-[1.75rem] font-extrabold text-gray-900 tracking-tight leading-none">School-Age Immunity</h3>
                <p className="mt-3 text-[0.98rem] text-gray-600 leading-7 font-medium">DPT Boosters, Typhoid, HPV, and Tdap. Protecting children as they enter school and preparing adolescents for adulthood safely.</p>
              </div>

              <div className="rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40 p-5 shadow-[0_12px_35px_-20px_rgba(99,102,241,0.25)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-sm font-bold px-3 py-1">0 - 18 Years</Badge>
                </div>
                <h3 className="text-[1.7rem] font-extrabold text-gray-900 tracking-tight leading-none">Mental Wellness</h3>

                <div className="mt-5 space-y-3.5">
                  <div className="rounded-[1.25rem] border border-indigo-100 bg-indigo-50/70 p-4">
                    <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold text-indigo-600 shadow-sm">Prenatal</div>
                    <p className="text-[0.95rem] font-bold leading-snug text-gray-900">Maternal mental health, bonding, stress reduction</p>
                    <p className="mt-2 text-xs leading-6 text-gray-600">Parent handbooks, antenatal class integration, WhatsApp module</p>
                  </div>

                  <div className="rounded-[1.25rem] border border-[#dbeadf] bg-[#f0faf4]/80 p-4">
                    <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[var(--womb-forest)] shadow-sm">0 - 5 yrs</div>
                    <p className="text-[0.95rem] font-bold leading-snug text-gray-900">Early attachment, emotional security, sensory play</p>
                    <p className="mt-2 text-xs leading-6 text-gray-600">Parent workshops, anganwadi tie-ups, illustrated booklets</p>
                  </div>

                  <div className="rounded-[1.25rem] border border-blue-100 bg-blue-50/70 p-4">
                    <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold text-blue-600 shadow-sm">6 - 12 yrs</div>
                    <p className="text-[0.95rem] font-bold leading-snug text-gray-900">SEL, classroom emotional regulation, peer relationships</p>
                    <p className="mt-2 text-xs leading-6 text-gray-600">School-based modules, teacher training, interactive group sessions</p>
                  </div>

                  <div className="rounded-[1.25rem] border border-amber-100 bg-amber-50/70 p-4">
                    <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold text-amber-600 shadow-sm">13 - 18 yrs</div>
                    <p className="text-[0.95rem] font-bold leading-snug text-gray-900">Identity formation, digital wellness, career anxiety</p>
                    <p className="mt-2 text-xs leading-6 text-gray-600">School counsellor training, peer mentor programme, parent sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 md:px-0 hidden md:block">
            {/* Central Animated Timeline Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-[36px] md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[var(--womb-forest)] to-indigo-500/30 -translate-x-1/2 rounded-full origin-top"
            />

            {/* Journey Milestones Container */}
            <div className="space-y-16 md:space-y-24">
              {/* Stage 1: Immunization */}
              <div className="relative flex flex-col md:flex-row items-center justify-between group/stage">
                <div className="md:w-[45%] hidden md:block" />

                {/* Glowing Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  className="absolute left-[36px] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border-[4px] border-[var(--womb-forest)] shadow-[0_0_20px_rgba(29,110,63,0.3)] z-10 flex items-center justify-center text-[var(--womb-forest)]"
                >
                  <Baby className="w-6 h-6" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="w-full md:w-[45%] pl-[80px] md:pl-0"
                >
                  <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(29,110,63,0.15)] hover:border-[var(--womb-forest)]/30 transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-[var(--womb-forest)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl" />
                    <div className="relative z-10">
                      <Badge className="bg-[var(--womb-forest)] text-white hover:bg-[var(--womb-forest)]/90 mb-5 border-none shadow-sm font-bold px-3 py-1">0 - 18 Months</Badge>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-3 hover:text-[var(--womb-forest)] transition-colors tracking-tight">Foundation of Life</h3>
                      <p className="text-gray-600 leading-relaxed font-medium">Critical early protection with BCG, Polio, DPT, Hepatitis B, and Measles vaccines. A robust start for a healthy life.</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stage 2: School Age Immunity */}
              <div className="relative flex flex-col md:flex-row items-center justify-between group/stage">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="w-full md:w-[45%] pl-[80px] md:pl-0 order-2 md:order-1 mt-8 md:mt-0"
                >
                  <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden group md:text-right">
                    <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl" />
                    <div className="relative z-10 flex flex-col items-start md:items-end">
                      <Badge className="bg-blue-600 text-white hover:bg-blue-700 mb-5 border-none shadow-sm font-bold px-3 py-1">5 - 16 Years</Badge>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-3 hover:text-blue-600 transition-colors tracking-tight">School-Age Immunity</h3>
                      <p className="text-gray-600 leading-relaxed font-medium text-left md:text-right">DPT Boosters, Typhoid, HPV, and Tdap. Protecting children as they enter schools and preparing adolescents for adulthood safely.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Glowing Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  className="absolute left-[36px] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border-[4px] border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10 flex items-center justify-center text-blue-500 order-1"
                >
                  <Shield className="w-6 h-6" />
                </motion.div>

                <div className="md:w-[45%] hidden md:block order-3" />
              </div>

              {/* Stage 3: Mental Wellness & Skills */}
              <div className="relative flex flex-col md:flex-row items-center justify-between group/stage">
                <div className="md:w-[45%] hidden md:block" />

                {/* Glowing Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  className="absolute left-[36px] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border-[4px] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] z-10 flex items-center justify-center text-indigo-500"
                >
                  <Heart className="w-6 h-6" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="w-full md:w-[45%] pl-[80px] md:pl-0 mt-8 md:mt-0"
                >
                  <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl" />
                    <div className="relative z-10">
                      <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 mb-5 border-none shadow-sm font-bold px-3 py-1">0 - 18 Years</Badge>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-5 hover:text-indigo-600 transition-colors tracking-tight">Mental Wellness</h3>

                      <div className="space-y-4">
                        <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100/50 hover:bg-indigo-100/50 transition-colors flex gap-4 items-center">
                          <div className="h-10 px-3 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 whitespace-nowrap">Prenatal</div>
                          <div>
                            <p className="font-bold text-gray-900 text-[0.9rem] leading-tight mb-1">Maternal mental health, bonding, stress reduction</p>
                            <p className="text-xs text-gray-600 leading-relaxed">Parent handbooks, antenatal class integration, WhatsApp module</p>
                          </div>
                        </div>

                        <div className="bg-[#f0faf4]/70 p-4 rounded-xl border border-[#a7e8c3]/30 hover:bg-[#e4fc/70] transition-colors flex gap-4 items-center">
                          <div className="h-10 px-3 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--womb-forest)] font-bold text-xs shrink-0 whitespace-nowrap">0–5 yrs</div>
                          <div>
                            <p className="font-bold text-gray-900 text-[0.9rem] leading-tight mb-1">Early attachment, emotional security, sensory play</p>
                            <p className="text-xs text-gray-600 leading-relaxed">Parent workshops, anganwadi tie-ups, illustrated booklets</p>
                          </div>
                        </div>

                        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100/50 hover:bg-blue-100/50 transition-colors flex gap-4 items-center">
                          <div className="h-10 px-3 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 whitespace-nowrap">6–12 yrs</div>
                          <div>
                            <p className="font-bold text-gray-900 text-[0.9rem] leading-tight mb-1">SEL, classroom emotional regulation, peer relationships</p>
                            <p className="text-xs text-gray-600 leading-relaxed">School-based modules, teacher training, interactive group sessions</p>
                          </div>
                        </div>

                        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100/50 hover:bg-amber-100/50 transition-colors flex gap-4 items-center">
                          <div className="h-10 px-3 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-600 font-bold text-xs shrink-0 whitespace-nowrap">13–18 yrs</div>
                          <div>
                            <p className="font-bold text-gray-900 text-[0.9rem] leading-tight mb-1">Identity formation, digital wellness, career anxiety</p>
                            <p className="text-xs text-gray-600 leading-relaxed">School counsellor training, peer mentor programme, parent sessions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Flagship Programs */}
      <section className="py-24 relative bg-gray-50/30 overflow-hidden border-t border-gray-100">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_60%)] opacity-[0.03] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_60%)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 lg:mb-24"
          >
            <p className="inline-flex items-center gap-2 bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--womb-forest)]/20 mb-6 shadow-sm">
              Flagship Initiatives
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 mb-6 tracking-tight drop-shadow-sm leading-tight">
              Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-[#36c276]">Health & Immunity.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our award-winning programs designed to deliver comprehensive healthcare inside schools and ensure zero missed vaccinations across communities.
            </p>
          </motion.div>

          {/* Integrated School Health - Bento Grid */}
          <div className="mb-24 lg:mb-32 perspective-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, type: "spring", stiffness: 40 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col lg:flex-row gap-12 lg:gap-16 relative overflow-hidden group hover:shadow-[0_30px_80px_-15px_rgba(29,110,63,0.1)] transition-all duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--womb-forest)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="lg:w-1/3 flex flex-col justify-center relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--womb-forest)]/10 to-[var(--womb-forest)]/5 border border-[var(--womb-forest)]/20 shadow-inner flex items-center justify-center mb-8 shrink-0 relative">
                  <div className="absolute inset-0 bg-[var(--womb-forest)]/20 blur-xl rounded-full" />
                  <Stethoscope className="w-8 h-8 text-[var(--womb-forest)] relative z-10" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">Integrated <br className="hidden lg:block" />School Health</h3>
                <Badge className="w-max bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] border-none px-4 py-1.5 font-bold mb-6 text-xs uppercase tracking-wider">Flagship Programme</Badge>

                <p className="text-gray-600 leading-relaxed mb-8">
                  India's first integrated school health delivery model, designed for phased expansion across partner schools. Covering physical, mental, dental, nutritional, and environmental wellness across the entire school year.
                </p>

                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all"><Users className="w-4 h-4" /></div>
                    <span className="text-sm font-semibold text-gray-800">School Health Coordinator</span>
                  </div>
                  <div className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-[var(--womb-forest)] flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-[var(--womb-forest)] group-hover/item:text-white transition-all"><Activity className="w-4 h-4" /></div>
                    <span className="text-sm font-semibold text-gray-800">Live Wellness Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-purple-600 group-hover/item:text-white transition-all"><CheckCircle className="w-4 h-4" /></div>
                    <span className="text-sm font-semibold text-gray-800">Annual Health Report</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-2/3 grid md:grid-cols-2 gap-6 relative z-10">
                {/* Column 1 */}
                <div className="bg-gradient-to-b from-[#f0faf4]/50 to-white rounded-3xl p-6 md:p-8 border border-[#a7e8c3]/40 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 text-[var(--womb-forest)]"><Activity className="w-5 h-5" /></div>
                    <h4 className="font-extrabold text-gray-900 text-lg">On-Campus Health</h4>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Annual screenings: vision, dental, BMI, hearing, posture",
                      "Doctor-led health camps: paediatrics, dermatology, orthopaedics",
                      "WASH education: water, sanitation and hygiene awareness",
                      "Nutritional assessment & healthy eating campaigns",
                      "First aid and CPR training for staff and senior students",
                      "Daily health monitoring via Student Wellness App"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group/li">
                        <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover/li:bg-[var(--womb-forest)] transition-colors"><CheckCircle className="w-3 h-3 text-[var(--womb-forest)] group-hover/li:text-white transition-colors" /></div>
                        <span className="text-[0.9rem] text-gray-700 font-medium leading-snug group-hover/li:text-gray-900 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="bg-gradient-to-b from-[#f4f7fe]/50 to-white rounded-3xl p-6 md:p-8 border border-blue-200/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 mt-6 md:mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 text-blue-600"><Leaf className="w-5 h-5" /></div>
                    <h4 className="font-extrabold text-gray-900 text-lg">Wellness & Sustainability</h4>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Mental wellness and Social Emotional Learning (SEL)",
                      "Green Cohort: every student plants a geo-tagged tree",
                      "Emergency preparedness — NDRF, fire, earthquake drills",
                      "Adolescent health and menstrual hygiene workshops",
                      "Parent engagement sessions — quarterly health briefings",
                      "Annual School Health Report & Compliance Certificate"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group/li">
                        <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover/li:bg-blue-600 transition-colors"><CheckCircle className="w-3 h-3 text-blue-600 group-hover/li:text-white transition-colors" /></div>
                        <span className="text-[0.9rem] text-gray-700 font-medium leading-snug group-hover/li:text-gray-900 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Vaccine Reminder Programme - 9 Touchpoint Timeline */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 lg:mb-16"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 shadow-inner flex items-center justify-center mb-6 shrink-0 relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <Syringe className="w-8 h-8 text-indigo-600 relative z-10" />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Vaccine Reminder</span> Programme</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
                For every scheduled vaccine in a child's immunisation calendar (National Immunisation Schedule + IAP + ACVIP guidelines), parents receive <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold text-[0.95em]">9 reminders across 3 channels</strong> ensuring no critical dose is missed.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative z-10 perspective-[1000px]">
              {/* Channel 1: SMS */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -40, rotateY: -5 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 50 }}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(139,92,246,0.15)] hover:border-purple-200 transition-all duration-500 group relative overflow-hidden flex flex-col h-full transform-gpu hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-purple-600 font-black text-2xl tracking-tight">SMS</span>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-50 w-max px-2 py-0.5 rounded-md mt-1">3 Reminders</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-6 relative z-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-purple-100 before:via-purple-200 before:to-purple-100 mt-2">
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-purple-200 z-10 group-hover/item:border-purple-400 transition-colors" />
                    <p className="font-extrabold text-gray-900 text-[0.95rem] mb-0.5">2 days before due date</p>
                    <p className="text-gray-500 text-sm font-medium">Plan your visit</p>
                  </div>
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] border-4 border-white z-10 group-hover/item:scale-110 transition-transform" />
                    <p className="font-extrabold text-purple-700 text-[0.95rem] mb-0.5">On the due date</p>
                    <p className="text-gray-500 text-sm font-medium">Act today</p>
                  </div>
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-purple-200 z-10 group-hover/item:border-purple-400 transition-colors" />
                    <p className="font-extrabold text-gray-900 text-[0.95rem] mb-0.5">2 days after</p>
                    <p className="text-gray-500 text-sm font-medium">Follow-up if missed</p>
                  </div>
                </div>
              </motion.div>

              {/* Channel 2: WhatsApp */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -40, rotateY: 0 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 50 }}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(34,197,94,0.15)] hover:border-emerald-200 transition-all duration-500 group relative overflow-hidden flex flex-col h-full transform-gpu hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-emerald-600 font-black text-2xl tracking-tight">WhatsApp</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 w-max px-2 py-0.5 rounded-md mt-1">3 Reminders</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <Smartphone className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-6 relative z-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-emerald-100 before:via-emerald-200 before:to-emerald-100 mt-2">
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-emerald-200 z-10 group-hover/item:border-emerald-400 transition-colors" />
                    <p className="font-extrabold text-gray-900 text-[0.95rem] mb-0.5">2 days before due date</p>
                    <p className="text-gray-500 text-sm font-medium">Plan your visit</p>
                  </div>
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] border-4 border-white z-10 group-hover/item:scale-110 transition-transform" />
                    <p className="font-extrabold text-emerald-700 text-[0.95rem] mb-0.5">On the due date</p>
                    <p className="text-gray-500 text-sm font-medium">Act today</p>
                  </div>
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-emerald-200 z-10 group-hover/item:border-emerald-400 transition-colors" />
                    <p className="font-extrabold text-gray-900 text-[0.95rem] mb-0.5">2 days after</p>
                    <p className="text-gray-500 text-sm font-medium">Follow-up if missed</p>
                  </div>
                </div>
              </motion.div>

              {/* Channel 3: Email */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -40, rotateY: 5 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 50 }}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(245,158,11,0.15)] hover:border-amber-200 transition-all duration-500 group relative overflow-hidden flex flex-col h-full transform-gpu hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-amber-600 font-black text-2xl tracking-tight">Email</span>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 w-max px-2 py-0.5 rounded-md mt-1">3 Reminders</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-6 relative z-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-amber-100 before:via-amber-200 before:to-amber-100 mt-2">
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-amber-200 z-10 group-hover/item:border-amber-400 transition-colors" />
                    <p className="font-extrabold text-gray-900 text-[0.95rem] mb-0.5">2 days before due date</p>
                    <p className="text-gray-500 text-sm font-medium">Plan your visit</p>
                  </div>
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)] border-4 border-white z-10 group-hover/item:scale-110 transition-transform" />
                    <p className="font-extrabold text-amber-700 text-[0.95rem] mb-0.5">On the due date</p>
                    <p className="text-gray-500 text-sm font-medium">Act today</p>
                  </div>
                  <div className="relative pl-8 group/item">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-amber-200 z-10 group-hover/item:border-amber-400 transition-colors" />
                    <p className="font-extrabold text-gray-900 text-[0.95rem] mb-0.5">2 days after</p>
                    <p className="text-gray-500 text-sm font-medium">Follow-up if missed</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== EMERGENCY PREPAREDNESS & RESILIENCE ==================== */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white via-orange-50/30 to-rose-50/40 relative overflow-hidden">
        {/* Light background accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#f97316_0%,_transparent_70%)] opacity-[0.04] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_#ef4444_0%,_transparent_70%)] opacity-[0.03] blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top: Header + Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="border-orange-300 text-orange-600 mb-5 bg-orange-50 px-4 py-1.5 tracking-widest font-bold text-[10px] uppercase shadow-sm inline-flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> FEATURED PROGRAM
            </Badge>
            <h2 className="text-3xl lg:text-[2.75rem] text-gray-900 mb-4 font-black leading-[1.1] tracking-tight">
              Emergency Preparedness &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-rose-500">Resilience</span>
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We prepare children, schools, and families to respond confidently to natural disasters, health emergencies, and unforeseen crises. Aligned with <strong className="text-gray-900 font-semibold">NDMA guidelines</strong>, <strong className="text-gray-900 font-semibold">UN DRR goals</strong>, and India's national school safety protocols.
            </p>
          </motion.div>

          {/* Main Grid: 4 Feature Cards + Delivered By Panel */}
          <div className="grid lg:grid-cols-5 gap-6 items-stretch">
            {/* Left: 4 Feature Cards in 2x2 grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="lg:col-span-3 grid sm:grid-cols-2 gap-4"
            >
              {[
                { icon: ShieldAlert, title: "First Aid & Emergency Response", desc: "First aid and emergency response training for students and school staff.", color: "bg-red-50", border: "border-red-100", iconBg: "bg-red-100", iconColor: "text-red-500", hoverBorder: "hover:border-red-300" },
                { icon: Flame, title: "Evacuation Drills", desc: "School-wide drills for fire, flood, earthquake, and pandemic scenarios.", color: "bg-orange-50", border: "border-orange-100", iconBg: "bg-orange-100", iconColor: "text-orange-500", hoverBorder: "hover:border-orange-300" },
                { icon: Brain, title: "Post-Crisis Mental Health", desc: "Mental health support modules for post-crisis trauma and stress management.", color: "bg-purple-50", border: "border-purple-100", iconBg: "bg-purple-100", iconColor: "text-purple-500", hoverBorder: "hover:border-purple-300" },
                { icon: Radio, title: "Media Literacy & Digital Safety", desc: "Responsible digital behaviour and media literacy training during emergencies.", color: "bg-blue-50", border: "border-blue-100", iconBg: "bg-blue-100", iconColor: "text-blue-500", hoverBorder: "hover:border-blue-300" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  className="group"
                >
                  <div className={`h-full ${item.color} border ${item.border} ${item.hoverBorder} rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] group-hover:-translate-y-1`}>
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center mb-3 shadow-sm`}
                    >
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </motion.div>
                    <h4 className="font-bold text-gray-900 text-[0.95rem] mb-1.5 tracking-tight group-hover:text-orange-600 transition-colors duration-300">{item.title}</h4>
                    <p className="text-[0.8rem] text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: Delivered by Real Heroes Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="lg:col-span-2"
            >
              <div className="h-full bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_-15px_rgba(249,115,22,0.1)] transition-all duration-500 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 border border-orange-200 flex items-center justify-center shadow-sm"
                  >
                    <Shield className="w-6 h-6 text-orange-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-gray-900 font-extrabold text-lg tracking-tight leading-tight">Delivered by Real Heroes</h3>
                    <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">On Campus Training</p>
                  </div>
                </div>

                {/* Partners */}
                <div className="space-y-3 flex-1">
                  {[
                    { name: "NDRF Teams", role: "National Disaster Response Force" },
                    { name: "Ex-Armed Forces Officers", role: "Defence & Strategic Operations" },
                    { name: "Fire Officers", role: "Fire Safety & Evacuation" },
                    { name: "Civil Authorities", role: "District Administration" },
                  ].map((partner, i) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.08, type: "spring" }}
                      className="flex items-start gap-2.5 group/p"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-400 shrink-0 mt-1.5 group-hover/p:scale-[2] transition-transform duration-300" />
                      <div>
                        <span className="text-gray-900 font-bold text-sm group-hover/p:text-orange-600 transition-colors duration-300">{partner.name}</span>
                        <p className="text-gray-400 text-xs font-medium leading-tight">{partner.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Future Readiness */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-gray-100">
                  {[
                    { title: "Scalable", label: "Architecture" },
                    { title: "NDMA", label: "Aligned" },
                    { title: "Holistic", label: "Safety" },
                  ].map((stat) => (
                    <div key={stat.title} className="text-center bg-orange-50/50 rounded-lg py-2.5 border border-orange-100/50 hover:bg-orange-100/50 transition-colors">
                      <p className="text-gray-900 font-black text-[0.85rem] leading-none mb-1">{stat.title}</p>
                      <p className="text-orange-500 text-[8px] font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Go Green & Climate Action */}
      <section className="py-12 lg:py-16 bg-[#0a1410] border-t border-[var(--womb-forest)]/20 relative overflow-hidden min-h-[auto] lg:min-h-[min(90vh,800px)] flex items-center justify-center">
        {/* Animated Background Textures */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_60%)] opacity-[0.08] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_#36c276_0%,_transparent_60%)] opacity-[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                <Badge variant="outline" className="border-[#36c276]/30 text-[#36c276] mb-5 bg-[#36c276]/10 px-4 py-1.5 backdrop-blur-sm tracking-widest font-bold text-[10px] uppercase shadow-[0_0_15px_rgba(54,194,118,0.15)] inline-flex items-center gap-2">
                  <Leaf className="w-3.5 h-3.5" /> SDG 13: CLIMATE ACTION
                </Badge>
              </motion.div>

              <motion.h2
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="text-[2rem] sm:text-4xl lg:text-5xl text-white mb-5 font-extrabold leading-[1.1] tracking-tight drop-shadow-md"
              >
                Green Cohort & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#36c276] to-[var(--womb-forest)]">Emergency Safe-Zones</span>
              </motion.h2>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-[1.05rem] text-gray-300 mb-8 leading-relaxed font-light max-w-xl"
              >
                Health and climate are inextricably linked. Our Go Green Initiative trains rural communities in disaster preparedness while planting trees to offset carbon footprints, creating India's first <strong className="text-white font-bold bg-[#36c276]/20 px-2 py-0.5 rounded-md border border-[#36c276]/30">Carbon-Neutral Child Cohort</strong>.
              </motion.p>

              <div className="space-y-4 mb-8">
                {[
                  { title: "Disaster Ready", desc: "First-aid training and emergency protocol drills for community leaders.", icon: CheckCircle },
                  { title: "Carbon Offset", desc: "1 tree planted for every Rs. 5000 donated. Receive your official Go Green Certificate.", icon: Leaf }
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#36c276]/10 border border-[#36c276]/20 flex items-center justify-center shrink-0 group-hover:bg-[#36c276]/20 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(54,194,118,0.1)]">
                      <item.icon className="w-5 h-5 text-[#36c276]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-[1.1rem] mb-0.5 group-hover:text-[#36c276] transition-colors duration-300">{item.title}</h4>
                      <p className="text-[0.9rem] text-gray-400 leading-snug max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Certificate Presentation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, type: "spring", stiffness: 40 }}
              className="relative perspective-[1200px]"
            >
              {/* Premium Glow Behind Certificate */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#36c276]/30 to-[var(--womb-forest)]/40 blur-[80px] rounded-full scale-90" />

              <div className="relative w-full max-w-[400px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 sm:p-4 shadow-[0_30px_70px_rgba(0,0,0,0.6)] group transform-gpu transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(54,194,118,0.2)] mx-auto lg:ml-auto">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-white/30 via-transparent to-[#36c276]/30 rounded-[2rem] pointer-events-none opacity-50" />

                <div className="overflow-hidden rounded-[1.2rem] relative bg-[#f8f9fa] w-full border border-gray-200 shadow-inner group-hover:border-[#36c276]/50 transition-colors duration-500 min-h-[320px] sm:min-h-[420px] lg:min-h-[480px]">
                  <iframe
                    src="/Go%20Green%20Certificate.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                    className="hidden sm:block w-full h-[420px] lg:h-[500px] border-none pointer-events-auto mix-blend-multiply scale-100 lg:scale-[1.05]"
                    title="Go Green Official Certificate"
                  />
                  <a
                    href="/Go%20Green%20Certificate.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:hidden absolute inset-0 block bg-[#f8f9fa]"
                  >
                    <div className="absolute inset-x-0 top-0 bottom-[68px] overflow-hidden">
                      <MobilePdfPreview
                        pdfUrl="/Go%20Green%20Certificate.pdf"
                        title="Go Green Official Certificate mobile preview"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-gray-200 bg-[#184f34] px-4 py-3">
                      <div>
                        <p className="text-white font-bold text-[1.02rem] leading-tight">Official Go Green Certificate</p>
                        <p className="text-[#7ce0a6] text-xs font-medium">Awarded to major donors & partners</p>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white shadow-sm">
                        <ArrowRight className="h-4 w-4 -rotate-45" />
                      </span>
                    </div>
                  </a>

                  {/* Glass Overlay on Hover to prompt interaction */}
                  <a href="/Go%20Green%20Certificate.pdf" target="_blank" rel="noopener noreferrer" className="absolute inset-0 hidden sm:flex bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex-col items-center justify-center cursor-pointer z-10">
                    <div className="w-14 h-14 rounded-full bg-[#36c276]/90 shadow-[0_0_30px_rgba(54,194,118,0.6)] flex items-center justify-center mb-4 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out border border-[#36c276]/50">
                      <ArrowRight className="w-6 h-6 text-white transform -rotate-45" />
                    </div>
                    <p className="text-white font-bold tracking-widest uppercase text-xs transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-out shadow-black">View Full PDF</p>
                  </a>
                </div>

                <div className="mt-5 hidden sm:flex items-start justify-between px-2 gap-3">
                  <div>
                    <p className="text-white font-bold text-[1.05rem] leading-tight mb-1">Official Go Green Certificate</p>
                    <p className="text-[#36c276] text-xs font-medium">Awarded to major donors & partners</p>
                  </div>
                  <a href="/Go%20Green%20Certificate.pdf" download="WombTo18_Go_Green_Certificate.pdf" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#36c276] flex items-center justify-center transition-all duration-300 border border-white/10 backdrop-blur-md shrink-0 focus:ring-2 ring-[#36c276]/50 outline-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </a>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Vision for Impact */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
        {/* Animated Background Elements for Cinematic Feel */}
        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--journey-saffron)]/20 mb-6 shadow-sm">
              Future Readiness
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 tracking-tight drop-shadow-sm">Vision for Impact</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">Laying the groundwork for scalable, transformative change across our core focus areas.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting subtle line behind cards */}
            <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0" />

            {[
              { title: "Comprehensive Reach", desc: "Designed to scale across multiple underserved districts, targeting 4 key focus areas for complete child development.", icon: Shield },
              { title: "Sustainable Model", desc: "Building a transparent, milestone-driven financial framework ensuring long-term operational stability.", icon: Target },
              { title: "Measurable Outcomes", desc: "Setting up rigorous data-driven frameworks to track, verify, and report every life changed along the journey.", icon: HeartPulse },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, type: "spring", stiffness: 60, damping: 15 }}
                className="relative z-10 group perspective-[1000px] h-full"
              >
                {/* Subtle glow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[var(--womb-forest)]/10 to-[var(--journey-saffron)]/10 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <Card className="bg-white/95 backdrop-blur-xl border border-white/50 text-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(29,110,63,0.1)] transition-all duration-500 rounded-3xl h-full overflow-hidden transform-gpu group-hover:-translate-y-1.5 relative flex flex-col">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--womb-forest)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100 origin-center ease-out" />

                  <CardContent className="pt-10 pb-8 px-6 relative flex-1 flex flex-col items-center">
                    {/* Animated Icon Container */}
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f0faf4] to-white border border-[#a7e8c3]/40 flex items-center justify-center mb-6 shrink-0 group-hover:scale-110 group-hover:bg-[var(--womb-forest)]/10 group-hover:border-[var(--womb-forest)]/30 group-hover:shadow-[0_10px_20px_rgba(29,110,63,0.1)] transition-all duration-500"
                    >
                      <item.icon className="w-8 h-8 text-[var(--womb-forest)]" />
                    </motion.div>

                    <h3 className="text-[1.35rem] text-gray-900 font-extrabold mb-4 group-hover:text-[var(--womb-forest)] transition-colors duration-300 tracking-tight">
                      {item.title}
                    </h3>

                    <div className="w-10 h-[3px] bg-gray-200 rounded-full mb-4 group-hover:w-16 group-hover:bg-[var(--womb-forest)]/40 transition-all duration-500" />

                    <p className="text-[0.95rem] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_60%)] opacity-[0.05] rounded-full blur-[80px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[var(--womb-forest)] to-[#155e33] rounded-[3rem] p-12 md:p-16 lg:p-20 shadow-[0_20px_50px_-15px_rgba(29,110,63,0.4)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl text-white mb-6 font-extrabold tracking-tight">Want to Support a Program?</h2>
              <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto leading-relaxed">
                Choose a program close to your heart and make a targeted donation that creates lasting impact. Donations are eligible for tax benefits under Section 80G, as per applicable rules.
              </p>
              <Link to="/donate">
                <Button size="lg" className="bg-white hover:bg-green-50 text-[var(--womb-forest)] h-14 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-base font-extrabold group">
                  Donate to a Program <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
