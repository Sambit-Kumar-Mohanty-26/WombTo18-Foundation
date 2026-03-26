import { Link } from "react-router";
import { Button } from "../ui/button";
import { Heart, LayoutDashboard, Handshake } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjaGlsZHJlbiUyMGhhcHB5JTIwSW5kaWF8ZW58MHx8fHwxNzczMTM0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1920", // Original Happy children India
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1920&auto=format&fit=crop", // Mother holding infant, health
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1920&auto=format&fit=crop", // Children studying/learning
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop", // Hands together, community protection
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop"  // Classroom, hopeful look
];

export function HeroSection() {
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
    <section ref={containerRef} className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      
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
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-12 sm:mt-20 pb-24 sm:pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center space-y-4 lg:space-y-6"
        >
          {/* Top Badge */}
          <motion.div variants={cinematicReveal}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold border border-white/20 shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--journey-saffron)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--journey-saffron)]"></span>
              </span>
              The Child Who Grows Healthy Changes the World
            </div>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            variants={cinematicReveal} 
            className="text-5xl sm:text-6xl lg:text-[5rem] text-white tracking-tight drop-shadow-2xl" 
            style={{ fontWeight: 800, lineHeight: 1.05 }}
          >
            Every Child, From{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-[var(--womb-forest)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Pregnancy</span>
            {" "}
            <span className="text-[var(--journey-saffron)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">To <span className="text-[var(--future-sky)]">18</span></span>
            <br />
            <span className="text-white/90 font-bold">— Healthy & Counted.</span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            variants={cinematicReveal} 
            className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed drop-shadow-md font-medium"
          >
            Delivering 32 health services across India. Support the journey of a child today and track your impact live on our verified donor dashboard.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            variants={cinematicReveal} 
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 pt-4 w-full max-w-3xl"
          >
            <Link to="/donate" className="flex-1 min-w-[200px]">
              <Button size="lg" className="w-full h-auto py-3.5 px-4 flex flex-col items-center justify-center text-white rounded-xl shadow-[0_0_30px_rgba(29,110,63,0.5)] hover:shadow-[0_0_40px_rgba(29,110,63,0.8)] transition-all hover:-translate-y-1 border border-white/10 backdrop-blur-sm" style={{ backgroundColor: 'var(--womb-forest, #1D6E3F)' }}>
                <div className="flex items-center text-base lg:text-lg font-black mb-1">
                  <Heart className="h-5 w-5 mr-2 fill-current" /> DONATE NOW
                </div>
                <span className="text-[10px] lg:text-xs font-bold opacity-90 tracking-widest uppercase">80G Benefit • Instant Cert</span>
              </Button>
            </Link>
            
            <Link to="/dashboard" className="flex-1 min-w-[200px]">
              <Button size="lg" className="w-full h-auto py-3.5 px-4 flex flex-col items-center justify-center text-white rounded-xl shadow-[0_0_30px_rgba(255,153,0,0.3)] hover:shadow-[0_0_40px_rgba(255,153,0,0.6)] transition-all hover:-translate-y-1 border border-white/10 backdrop-blur-sm" style={{ backgroundColor: 'var(--journey-saffron, #FF9900)' }}>
                <div className="flex items-center text-base lg:text-lg font-black mb-1">
                  <LayoutDashboard className="h-5 w-5 mr-2" /> DASHBOARD
                </div>
                <span className="text-[10px] lg:text-xs font-bold opacity-90 tracking-widest uppercase">See funds working live</span>
              </Button>
            </Link>
            
            <Link to="/get-involved" className="flex-1 min-w-[200px]">
              <Button size="lg" className="w-full h-auto py-3.5 px-4 flex flex-col items-center justify-center text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20">
                <div className="flex items-center text-base lg:text-lg font-black mb-1">
                  <Handshake className="h-5 w-5 mr-2" /> PARTNER
                </div>
                <span className="text-[10px] lg:text-xs font-bold opacity-90 tracking-widest uppercase">CSR • Institutional</span>
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
        className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"
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
