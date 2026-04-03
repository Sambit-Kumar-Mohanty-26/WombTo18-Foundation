import { Link } from "react-router";
import { Button } from "../ui/button";
import { Heart, LayoutDashboard, Handshake } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dashboard1 from "../../../../public/dashboard/657ae878-799e-44e7-a0e6-759a9b0420dc.jpeg"
import dashboard2 from "../../../../public/dashboard/WhatsApp Image 2025-11-14 at 12.30.17.jpeg"
import dashboard3 from "../../../../public/dashboard/ec9e78d6-4820-48e0-abfa-f6af927c9682.jpeg"



const HERO_IMAGES = [
  dashboard1,
  dashboard2,
  dashboard3,
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop", // Children learning
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop", // Education
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1920&auto=format&fit=crop", // Healthcare
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjaGlsZHJlbiUyMGhhcHB5JTIwSW5kaWF8ZW58MHx8fHwxNzczMTM0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1920", // Original Happy children India
  "/images/site-assets/hero_health.png",
];

export function HeroSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Carousel Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000); // Change image every 7 seconds
    return () => clearInterval(timer);
  }, []);

  // Parallax effect for the background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const cinematicReveal = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" as const } 
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative flex w-full min-h-[calc(100svh-64px)] items-center justify-center overflow-hidden bg-black md:min-h-[760px] xl:min-h-[calc(100vh-64px)]"
    >
      
      {/* Cinematic Background Image Carousel with Slow Zoom & Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full bg-black">
        {HERO_IMAGES.map((imgSrc, index) => (
          <motion.img
            key={imgSrc}
            src={imgSrc}
            alt={`Hero storytelling image ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
            initial={false}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1,
              zIndex: index === currentImageIndex ? 1 : 0
            }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 12, ease: "linear" } 
            }}
          />
        ))}
        
        {/* Sophisticated Dark Gradient Overlays for Readability & Drama */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A2A2A]/80 via-[#2A2A2A]/40 to-[#2A2A2A]/95 mix-blend-multiply z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D6E3F]/40 via-transparent to-transparent mix-blend-overlay z-1" />
        <div className="absolute inset-0 bg-black/30 z-1" />
      </motion.div>
      
      {/* Central Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-8 pb-10 text-center sm:px-6 sm:pt-14 sm:pb-24 lg:-translate-y-8 lg:px-8 lg:pt-20 lg:pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center space-y-3 sm:space-y-4 lg:space-y-6"
        >
          {/* Top Badge */}
          <motion.div variants={cinematicReveal}>
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/90 shadow-2xl backdrop-blur-md sm:px-5 sm:py-2 sm:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--journey-saffron)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--journey-saffron)]"></span>
              </span>
              {t('home.heroBadge')}
            </div>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            variants={cinematicReveal} 
            className="text-[clamp(2.45rem,12vw,5rem)] text-white tracking-tight drop-shadow-2xl"
            style={{ fontWeight: 800, lineHeight: 1.05 }}
          >
            {t('home.heroEveryChild')}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-[var(--womb-forest)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{t('home.heroPregnancy')}</span>
            {" "}
            <span className="text-[var(--journey-saffron)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{t('home.heroTo')} <span className="text-[var(--future-sky)]">{t('home.hero18')}</span></span>
            <br />
            <span className="text-white/90 font-bold">{t('home.heroHealthy')}</span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            variants={cinematicReveal} 
            className="max-w-3xl px-2 text-base leading-relaxed font-medium text-white/80 drop-shadow-md sm:px-0 sm:text-lg md:text-2xl"
          >
            {t('home.heroDesc')} 
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            variants={cinematicReveal} 
            className="flex w-full max-w-3xl flex-col justify-center gap-3 pt-3 sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-4"
          >
            <Link to="/donate" className="w-full sm:min-w-[200px] sm:flex-1">
              <Button size="lg" className="flex h-auto w-full flex-col items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-white shadow-[0_0_30px_rgba(29,110,63,0.5)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(29,110,63,0.8)] sm:py-3.5" style={{ backgroundColor: 'var(--womb-forest, #1D6E3F)' }}>
                <div className="mb-1 flex items-center text-sm font-black sm:text-base lg:text-lg">
                  <Heart className="h-5 w-5 mr-2 fill-current" /> {t('home.btnDonate')}
                </div>
                <span className="text-[10px] lg:text-xs font-bold opacity-90 tracking-widest uppercase">{t('home.btnDonateSub')}</span>
              </Button>
            </Link>
            
            <Link to="/dashboard" className="w-full sm:min-w-[200px] sm:flex-1">
              <Button size="lg" className="flex h-auto w-full flex-col items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-white shadow-[0_0_30px_rgba(255,153,0,0.3)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,153,0,0.6)] sm:py-3.5" style={{ backgroundColor: 'var(--journey-saffron, #FF9900)' }}>
                <div className="mb-1 flex items-center text-sm font-black sm:text-base lg:text-lg">
                  <LayoutDashboard className="h-5 w-5 mr-2" /> {t('home.btnDashboard')}
                </div>
                <span className="text-[10px] lg:text-xs font-bold opacity-90 tracking-widest uppercase">{t('home.btnDashboardSub')}</span>
              </Button>
            </Link>
            
            <Link to="/get-involved" className="w-full sm:min-w-[200px] sm:flex-1">
              <Button size="lg" className="flex h-auto w-full flex-col items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl sm:py-3.5">
                <div className="mb-1 flex items-center text-sm font-black sm:text-base lg:text-lg">
                  <Handshake className="h-5 w-5 mr-2" /> {t('home.btnPartner')}
                </div>
                <span className="text-[10px] lg:text-xs font-bold opacity-90 tracking-widest uppercase">{t('home.btnPartnerSub')}</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Trust Indicator pinned to bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 left-0 right-0 hidden sm:flex justify-center pointer-events-none"
      >
        <div className="flex flex-wrap justify-center gap-4 px-4 overflow-hidden mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)">
           <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[var(--future-sky)]"></span>
              Verified Section 8 NGO
           </div>
           <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[var(--journey-saffron)]"></span>
              12A & 80G Compliant
           </div>
        </div>
      </motion.div>
    </section>
  );
}
