import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { Quote } from "lucide-react";

export function AnimatedQuoteSection() {
  const containerRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(quoteRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const textVariants = {
    hidden: { opacity: 0, filter: "blur(20px)", y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)", 
      y: 0,
      scale: 1,
      transition: { duration: 1.8, ease: "easeOut" as const }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative flex w-full min-h-[420px] items-center justify-center overflow-hidden border-t border-b border-[#1D6E3F]/10 bg-[#FFFDF7] py-14 sm:min-h-[500px] md:min-h-[620px] md:py-18 xl:min-h-[calc(100vh-64px)] xl:py-24 shadow-[inset_0_20px_40px_rgba(0,0,0,0.02)]"
    >
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-0 left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-10 blur-3xl rounded-full pointer-events-none"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-10 blur-3xl rounded-full pointer-events-none"
      />
      
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231D6E3F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center" ref={quoteRef}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 md:mb-12 flex justify-center"
        >
          <div className="p-4 rounded-full bg-[var(--womb-forest)]/10 text-[var(--journey-saffron)] shadow-[0_0_30px_rgba(255,153,0,0.15)] ring-1 ring-[#1D6E3F]/30 backdrop-blur-md">
            <Quote size={32} className="opacity-90 md:w-10 md:h-10" />
          </div>
        </motion.div>

        <motion.blockquote 
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight md:leading-tight lg:leading-[1.15] tracking-tight relative"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
            "The health of our children today dictates the{" "}
          </span>
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-[#155e33] font-bold drop-shadow-sm">
            strength of our nation
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-500">
            {" "}tomorrow.
          </span>
          <br className="hidden lg:block mt-4" />
          <span className="block mt-6 md:mt-8 text-2xl sm:text-3xl md:text-4xl text-[var(--journey-saffron)] font-medium italic drop-shadow-sm">
            Every intervention matters."
          </span>
        </motion.blockquote>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 md:mt-16 flex items-center justify-center gap-4"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--womb-forest)]"></div>
          <span className="text-sm md:text-base text-gray-500 font-bold tracking-[0.2em] uppercase">The Vision</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--womb-forest)]"></div>
        </motion.div>
      </div>
    </section>
  );
}
