import { Heart, Globe, Users, Target, CheckCircle, ArrowRight, Zap, Building2, MonitorSmartphone, MapPin } from "lucide-react";
import { motion, useTransform, useSpring, useMotionValue, useMotionTemplate, useScroll } from "motion/react";
import Lenis from "lenis";
import React, { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

function ValueCard({ val, index }: { val: { letter: string; title: string; desc: string }, index: number }) {
  const { t } = useTranslation('about');
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
        viewport={{ once: false, margin: "-50px" }}
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
        className="relative group w-full will-change-transform sm:h-full sm:min-h-[210px] lg:min-h-[230px]"
      >
        {/* Cinematic Ambient Glow */}
        <div className="absolute -inset-0.5 rounded-[1.2rem] bg-gradient-to-br from-[var(--womb-forest)]/40 via-transparent to-[var(--journey-saffron)]/40 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 pointer-events-none" />

        {/* Main Card */}
        <div className="relative bg-[#fdfcfb] rounded-[1rem] p-4 sm:p-5 lg:p-6 xl:p-8 pt-6 sm:pt-7 xl:pt-8 pb-6 sm:pb-7 xl:pb-8 border border-gray-200/50 shadow-sm overflow-hidden flex flex-col items-center justify-start text-center transition-all duration-700 group-hover:bg-white group-hover:border-[var(--womb-forest)]/20 group-hover:shadow-[0_20px_40px_-15px_rgba(29,110,63,0.15)] z-10 w-full sm:h-full">

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
    name: "Eshwar Reddy",
    role: "President • WOMBTO18 Foundation",
    image: "/Eshwar Reddy.jpg",
    bio: [
      "Currently advising an AI SaaS startup in New Jersey",
      "18+ years of enterprise operations leadership across India and the US",
      "Leads the Foundation's institutional strategy",
      "Applies scalable systems thinking to school-based health delivery"
    ]
  },
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
    body: "WOMBTO18 Foundation operates as India's first integrated child health non-profit platform — uniting <strong>32 services</strong> across pregnancy, infancy, childhood, and adolescence. Delivered through schools, hospitals, and communities. Serving 25 schools today. Scaling to 300.",
    highlight: "32 services united"
  }
];

const instrumentsOfChange = [
  {
    title: "The Foundation",
    icon: Building2,
    accentClass: "text-[var(--womb-forest)]",
    glowClass: "bg-[var(--womb-forest)]/18",
    description:
      "Drives access, equity, school partnerships, and on-ground delivery so preventive care reaches the children who need it most.",
    label: "Public Impact",
  },
  {
    title: "The Platform",
    icon: MonitorSmartphone,
    accentClass: "text-[var(--journey-saffron)]",
    glowClass: "bg-[var(--journey-saffron)]/18",
    description:
      "Builds the connected health record, reminders, dashboards, and intelligence layer that keeps every intervention visible and accountable.",
    label: "Systems Layer",
  },
];

function PresidentLetterSection() {
  const { t } = useTranslation('about');

  const presidentLetterParagraphs = [
    { type: "quote", text: t('presidentLetter.p1') },
    { type: "body", text: t('presidentLetter.p2') },
    { type: "body", text: t('presidentLetter.p3') },
    { type: "body", text: t('presidentLetter.p4') },
    { type: "highlight", text: t('presidentLetter.p5.text') },
    { type: "body", text: t('presidentLetter.p6') },
    { type: "body", text: t('presidentLetter.p7') },
    { type: "emphasis", text: t('presidentLetter.p8.text') },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const canConsumeInnerScroll = (deltaY: number) => {
    const wrapper = scrollContainerRef.current;

    if (!wrapper) {
      return false;
    }

    const maxScrollTop = wrapper.scrollHeight - wrapper.clientHeight;
    if (maxScrollTop <= 0) {
      return false;
    }

    const atTop = wrapper.scrollTop <= 1;
    const atBottom = wrapper.scrollTop >= maxScrollTop - 1;

    if (deltaY < 0 && !atTop) {
      return true;
    }

    if (deltaY > 0 && !atBottom) {
      return true;
    }

    return false;
  };

  const handOffScrollToPage = (deltaY: number) => {
    if (deltaY === 0) {
      return;
    }

    window.scrollBy({
      top: deltaY,
      left: 0,
      behavior: "auto",
    });
  };

  useEffect(() => {
    const wrapper = scrollContainerRef.current;
    const content = scrollContentRef.current;

    if (!wrapper || !content) {
      return;
    }

    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: wrapper,
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden text-gray-900"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full" />
      </motion.div>

      <div className="relative z-10 px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-12 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-8 sm:mb-10"
        >
          <p className="inline-flex items-center gap-2 text-[var(--womb-forest)] text-xs font-black tracking-[0.2em] uppercase mb-4">
            {t('presidentLetter.badge')} <span className="w-8 h-[2px] bg-gradient-to-r from-[var(--womb-forest)] to-transparent rounded-full ml-2" />
          </p>
          <h2 className="max-w-5xl text-3xl sm:text-4xl lg:text-[3.5rem] text-gray-900 tracking-tight" style={{ fontWeight: 900, lineHeight: 1.05 }}>
            {t('presidentLetter.heading1')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400">{t('presidentLetter.heading2')}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start min-h-0">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <div className="relative rounded-[1.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(29,110,63,0.25)] group flex-shrink-0">
              <img
                src="/Eshwar Reddy.jpg"
                alt="Eshwar Reddy - President"
                className="w-full aspect-[4/3] object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white p-5 rounded-2xl shadow-[0_8px_24px_-12px_rgba(0,0,0,0.06)] border border-gray-100"
            >
              <p className="font-extrabold text-gray-900 text-base tracking-tight mb-0.5">Eshwar Reddy</p>
              <p className="text-xs font-bold text-[var(--womb-forest)] mb-2">{t('presidentLetter.coFounder')}</p>
              <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[var(--journey-saffron)]" /> {t('presidentLetter.location')}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 relative min-h-0 flex flex-col"
          >
            <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent hidden lg:block" />

            <div className="relative min-h-0 rounded-[1.5rem] bg-white shadow-[0_15px_50px_-15px_rgba(0,0,0,0.06)] border border-gray-100/80 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--womb-forest)] via-[var(--journey-saffron)] to-[var(--womb-forest)]" />

              <div
                ref={scrollContainerRef}
                onWheelCapture={(event) => {
                  if (canConsumeInnerScroll(event.deltaY)) {
                    event.stopPropagation();
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();
                  handOffScrollToPage(event.deltaY);
                }}
                onTouchStart={(event) => {
                  touchStartYRef.current = event.touches[0]?.clientY ?? null;
                }}
                onTouchMoveCapture={(event) => {
                  const currentY = event.touches[0]?.clientY;
                  const previousY = touchStartYRef.current;

                  if (currentY == null || previousY == null) {
                    return;
                  }

                  const deltaY = previousY - currentY;

                  if (canConsumeInnerScroll(deltaY)) {
                    event.stopPropagation();
                  } else {
                    event.preventDefault();
                    event.stopPropagation();
                    handOffScrollToPage(deltaY);
                  }

                  touchStartYRef.current = currentY;
                }}
                onTouchEnd={() => {
                  touchStartYRef.current = null;
                }}
                className="overflow-y-auto px-6 py-7 scroll-smooth sm:px-8 sm:py-8 lg:px-10"
                style={{
                  maxHeight: "min(60vh, 520px)",
                  overscrollBehavior: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(29,110,63,0.2) transparent",
                }}
              >
                <div
                  ref={scrollContentRef}
                  className="prose prose-lg max-w-none text-gray-700 font-serif leading-[1.8] tracking-tight"
                >
                  {presidentLetterParagraphs.map((para, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, root: scrollContainerRef, margin: "-20px" }}
                      transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                    >
                      {para.type === "quote" && (
                        <p className="text-lg sm:text-xl lg:text-[1.9rem] font-black text-gray-900 mb-6 font-sans leading-[1.35]">
                          "{para.text}"
                        </p>
                      )}
                      {para.type === "body" && (
                        <p className="mb-5">{para.text}</p>
                      )}
                      {para.type === "highlight" && (
                        <p className="text-lg font-black text-[var(--womb-forest)] italic font-sans py-3 border-l-4 border-[var(--journey-saffron)] pl-5 bg-[var(--womb-forest)]/[0.03] rounded-r-xl my-6">
                          {para.text}
                        </p>
                      )}
                      {para.type === "emphasis" && (
                        <p className="font-sans font-bold text-gray-900 text-lg py-2 mb-5">{para.text}</p>
                      )}
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, root: scrollContainerRef }}
                    transition={{ duration: 0.8 }}
                    className="mt-8 pt-6 border-t border-gray-100 font-sans"
                  >
                    <p className="text-base font-bold text-gray-800 italic">{t('presidentLetter.closing')}</p>
                    <span className="text-3xl sm:text-4xl text-[var(--womb-forest)]/70 block mt-4 mb-2" style={{ fontFamily: "'Cedarville Cursive', 'Brush Script MT', cursive", transform: "rotate(-3deg)", display: "inline-block" }}>
                      Eshwar Reddy
                    </span>
                    <p className="text-sm font-semibold text-gray-600">{t('presidentLetter.signatureTitle')}</p>
                    <p className="text-sm text-gray-500">{t('presidentLetter.legalInfo')}</p>
                  </motion.div>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(to top, white 0%, transparent 100%)"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AboutPage() {
  const { t } = useTranslation('about');

  const womboValues = useMemo(() => [
    { letter: t('wombo.w.letter'), title: t('wombo.w.title'), desc: t('wombo.w.desc') },
    { letter: t('wombo.o1.letter'), title: t('wombo.o1.title'), desc: t('wombo.o1.desc') },
    { letter: t('wombo.m.letter'), title: t('wombo.m.title'), desc: t('wombo.m.desc') },
    { letter: t('wombo.b.letter'), title: t('wombo.b.title'), desc: t('wombo.b.desc') },
    { letter: t('wombo.o2.letter'), title: t('wombo.o2.title'), desc: t('wombo.o2.desc') },
    { letter: t('wombo.i.letter'), title: t('wombo.i.title'), desc: t('wombo.i.desc') },
  ], [t]);

  const storyChapters = useMemo(() => [
    {
      number: "01",
      accent: "var(--womb-forest)",
      heading: t('story.ch1.heading'),
      body: t('story.ch1.body'),
      highlight: t('story.ch1.highlight')
    },
    {
      number: "02",
      accent: "var(--journey-saffron)",
      heading: t('story.ch2.heading'),
      body: t('story.ch2.body'),
      highlight: t('story.ch2.highlight')
    },
    {
      number: "03",
      accent: "var(--womb-forest)",
      heading: t('story.ch3.heading'),
      body: t('story.ch3.body'),
      highlight: t('story.ch3.highlight')
    },
    {
      number: "04",
      accent: "var(--journey-saffron)",
      heading: t('story.ch4.heading'),
      body: t('story.ch4.body'),
      highlight: t('story.ch4.highlight')
    }
  ], [t]);

  const advisoryBoard = useMemo(() => [
    {
      name: "Eshwar Reddy",
      role: t('advisoryBoard.m1.role'),
      image: "/Eshwar Reddy.jpg",
      bio: [
        t('advisoryBoard.m1.point1'),
        t('advisoryBoard.m1.point2'),
        t('advisoryBoard.m1.point3'),
        t('advisoryBoard.m1.point4')
      ]
    },
    {
      name: "Dr. Pramod Jog",
      role: t('advisoryBoard.m2.role'),
      image: "/Dr.-Pramod-Jog.jpg",
      bio: [
        t('advisoryBoard.m2.point1'),
        t('advisoryBoard.m2.point2'),
        t('advisoryBoard.m2.point3'),
        t('advisoryBoard.m2.point4')
      ]
    },
    {
      name: "Dr. Tanmay R. Amladi",
      role: t('advisoryBoard.m3.role'),
      image: "/Tanmay.webp",
      bio: [
        t('advisoryBoard.m3.point1'),
        t('advisoryBoard.m3.point2'),
        t('advisoryBoard.m3.point3'),
        t('advisoryBoard.m3.point4')
      ]
    },
  ], [t]);

  const instrumentsOfChange = useMemo(() => [
    {
      title: t('instruments.inst1.title'),
      icon: Building2,
      accentClass: "text-[var(--womb-forest)]",
      glowClass: "bg-[var(--womb-forest)]/18",
      description: t('instruments.inst1.desc'),
      label: t('instruments.inst1.label'),
    },
    {
      title: t('instruments.inst2.title'),
      icon: MonitorSmartphone,
      accentClass: "text-[var(--journey-saffron)]",
      glowClass: "bg-[var(--journey-saffron)]/18",
      description: t('instruments.inst2.desc'),
      label: t('instruments.inst2.label'),
    },
  ], [t]);

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
            className="flex flex-col items-center text-center w-full max-w-5xl mx-auto"
          >
            <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--journey-saffron)]/20 mb-4 sm:mb-6 shadow-sm">
              {t('hero.badge')}
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] text-gray-900 mb-6" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              {t('hero.title')} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400 drop-shadow-sm">{t('hero.subtitle')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-5xl leading-relaxed">
              {t('hero.desc')}
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
            viewport={{ once: false, margin: "-200px" }}
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
                    <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: chapter.accent }}>{t('chapter', 'Chapter')} {chapter.number}</span>
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

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf7_0%,#f8f4ea_100%)] py-16 text-gray-900 sm:py-18">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ opacity: [0.2, 0.34, 0.2], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-[18%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.18)_0%,rgba(29,110,63,0.12)_32%,transparent_70%)] blur-[90px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,transparent_35%,rgba(255,255,255,0.4)_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(29,110,63,0.9) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#1D6E3F]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] shadow-[0_36px_90px_-42px_rgba(0,0,0,0.18)] backdrop-blur-sm"
          >
            <div className="relative px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 96, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.18 }}
                className="mx-auto mb-7 h-px bg-gradient-to-r from-transparent via-[var(--journey-saffron)] to-transparent"
              />

              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] lg:gap-10">
                   <motion.div
                  initial={{ opacity: 0, x: -26 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.75, delay: 0.16 }}
                  className="text-center lg:text-left"
                >
                  <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-gray-500">
                    {t('strategy.badge')}
                  </p>
                  <h2
                    className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl md:text-[3.25rem]"
                    style={{ lineHeight: 0.98 }}
                  >
                    {t('strategy.heading1')}
                  </h2>
                  <p
                    className="mt-1 font-serif text-[1.75rem] italic text-[var(--journey-saffron)] sm:text-[2.3rem] md:text-[2.9rem]"
                    style={{ lineHeight: 1.04 }}
                  >
                    {t('strategy.heading2')}
                  </p>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                    {t('strategy.desc')}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 26 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.9, delay: 0.28 }}
                  className="relative"
                >
                  <div className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[var(--journey-saffron)]/40 to-transparent lg:block" />
                  <div className="pl-0 lg:pl-8">
                    <p className="text-base font-serif italic leading-[1.75] tracking-tight text-gray-700 sm:text-lg lg:text-[1.32rem]" dangerouslySetInnerHTML={{ __html: t('strategy.highlight') }} />
                    <motion.p
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.8, delay: 0.42 }}
                      className="mt-5 text-xl font-black leading-[1.45] tracking-tight text-gray-900 sm:text-2xl"
                    >
                      {t('strategy.impact')}
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 sm:py-40 bg-gradient-to-b from-[#FFFDF7] to-white overflow-hidden border-y border-gray-100">
        {/* Animated glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_60%)] opacity-[0.04] blur-[100px] rounded-full" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--womb-forest)]/10 border border-[var(--womb-forest)]/20 flex items-center justify-center mb-10">
              <span className="text-4xl text-[var(--womb-forest)] font-serif font-bold">"</span>
            </div>

            <blockquote className="text-3xl sm:text-4xl md:text-5xl text-gray-900 font-serif italic leading-[1.3] tracking-tight mb-12" style={{ fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: t('philosophy.quote1') }} />

            <div className="flex items-center justify-center gap-4">
              <div className="w-[60px] h-[1px] bg-gray-300" />
              <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">{t('philosophy.badge')}</p>
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
                viewport={{ once: false }}
                transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--journey-saffron)]/10 to-[var(--journey-saffron)]/5 flex items-center justify-center mb-6 border border-[var(--journey-saffron)]/20 shadow-inner"
              >
                <Target className="w-8 h-8 text-[var(--journey-saffron)]" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl font-extrabold text-gray-900 mb-4"
              >
                {t('mission.title')}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg text-gray-600 leading-relaxed mb-6"
              >
                {t('mission.desc')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-sm text-gray-500 bg-gray-50/50 p-5 rounded-xl border border-gray-100/80 shadow-inner"
                dangerouslySetInnerHTML={{ __html: t('mission.sub') }}
              />
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
                viewport={{ once: false }}
                transition={{ type: "spring", bounce: 0.6, duration: 1.2, delay: 0.5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--future-sky)]/10 to-[var(--future-sky)]/5 flex items-center justify-center mb-6 border border-[var(--future-sky)]/20 shadow-inner"
              >
                <Globe className="w-8 h-8 text-[var(--future-sky)]" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-3xl font-extrabold text-gray-900 mb-6"
              >
                {t('vision.title')}
              </motion.h2>

              <ul className="space-y-4">
                {[
                  t('vision.item1'),
                  t('vision.item2'),
                  t('vision.item3'),
                  t('vision.item4'),
                  t('vision.item5')
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
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
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{t('wombo.badge')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('wombo.desc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xl:gap-8 items-stretch">
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
              <CheckCircle className="w-3.5 h-3.5" /> {t('governance.badge')}
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4" style={{ lineHeight: 1.05 }}>
              {t('governance.heading1')}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-amber-300">
                {t('governance.heading2')}
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">{t('governance.desc')}</p>
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
                  viewport={{ once: false }}
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
                { cert: t('governance.cert1Title'), desc: t('governance.cert1Desc'), icon: "🏛️" },
                { cert: t('governance.cert2Title'), desc: t('governance.cert2Desc'), icon: "📜" },
                { cert: t('governance.cert3Title'), desc: t('governance.cert3Desc'), icon: "🚀" },
                { cert: t('governance.cert4Title'), desc: t('governance.cert4Desc'), icon: "🌐" },
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
                      {t('governance.section8Title')}
                    </h4>
                    <p className="text-gray-400 group-hover:text-gray-300 text-sm sm:text-base leading-relaxed transition-colors duration-500">
                      {t('governance.section8Desc')}
                    </p>
                  </div>
                  <div className="shrink-0 hidden sm:flex items-center gap-2 text-[var(--journey-saffron)] text-xs font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {t('instruments.inst1.label')} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 bg-[var(--future-sky)]/10 text-[var(--future-sky)] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border border-[var(--future-sky)]/20 mb-6">
              {t('advisoryBoard.badge')}
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{t('advisoryBoard.heading')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('advisoryBoard.desc')}
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

          <div className="mb-16">
            <PresidentLetterSection />
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
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">{t('cta.title')}</h3>
              <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                {t('cta.desc')}
              </p>
              <Link to="/advisory-board" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[var(--womb-forest)] font-extrabold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all h-14 px-8 text-base rounded-xl group">
                {t('cta.btn')} <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
