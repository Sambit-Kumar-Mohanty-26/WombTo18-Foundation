import { motion, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";
import { Quote, MapPin, Mail } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export function AboutSection() {
  const { t } = useTranslation('home');

  const letterParagraphs = [
    {
      type: "greeting",
      text: t('about.dear'),
    },
    {
      type: "dropcap",
      text: t('about.p1'),
    },
    {
      type: "body",
      text: t('about.p2'),
    },
    {
      type: "highlight",
      text: t('about.p3'),
    },
    {
      type: "body",
      text: t('about.p4'),
    },
    {
      type: "body",
      text: t('about.p5'),
    },
    {
      type: "emphasis",
      text: t('about.p6'),
    },
    {
      type: "body",
      text: t('about.p7'),
    },
    {
      type: "body",
      text: t('about.p8'),
    },
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
      className="relative bg-[#FAF9F6] overflow-hidden text-gray-900 border-t border-gray-100"
      style={{ minHeight: "100vh" }}
    >
      {/* Background Decor */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full" />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 flex flex-col" style={{ minHeight: "100vh" }}>
        
        {/* Compact Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-10 sm:mb-14"
        >
          <p className="inline-flex items-center gap-2 text-[var(--womb-forest)] text-xs font-black tracking-[0.2em] uppercase mb-4">
            {t('about.badge')} <span className="w-8 h-[2px] bg-gradient-to-r from-[var(--womb-forest)] to-transparent rounded-full ml-2" />
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 tracking-tight" style={{ fontWeight: 900, lineHeight: 1.1 }}>
            {t('about.heading1')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400">{t('about.heading2')}</span>
          </h2>
        </motion.div>

        {/* Two-column layout — fits remaining viewport */}
        <div className="flex-1 grid lg:grid-cols-12 gap-8 lg:gap-12 min-h-0">
          
          {/* Left Column: Compact Image Card */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col gap-5"
          >
            {/* Founder Image */}
            <div className="relative rounded-[1.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(29,110,63,0.25)] group flex-shrink-0">
              <img
                src="/Sowjanya.png"
                alt="Sowjanya Reddy - Founder"
                className="w-full aspect-[4/3] object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />

              

            </div>

            {/* Compact Founder Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white p-5 rounded-2xl shadow-[0_8px_24px_-12px_rgba(0,0,0,0.06)] border border-gray-100"
            >
              <p className="font-extrabold text-gray-900 text-base tracking-tight mb-0.5">Sowjanya Reddy</p>
              <p className="text-xs font-bold text-[var(--womb-forest)] mb-2">{t('about.founderRole')}</p>
              <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[var(--journey-saffron)]" /> {t('about.founderLocation')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Scrollable Letter */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 relative min-h-0 flex flex-col"
          >
            {/* Decorative vertical line */}
            <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent hidden lg:block" />
            
            {/* Letter Paper Container */}
            <div className="relative flex-1 min-h-0 rounded-[1.5rem] bg-white shadow-[0_15px_50px_-15px_rgba(0,0,0,0.06)] border border-gray-100/80 overflow-hidden">
              {/* Paper texture header */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--womb-forest)] via-[var(--journey-saffron)] to-[var(--womb-forest)]" />

              {/* Scrollable content inside */}
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
                className="h-full overflow-y-auto overscroll-contain px-6 py-8 scroll-smooth sm:px-10 sm:py-10"
                style={{ 
                  maxHeight: "calc(100vh - 18rem)",
                  overscrollBehavior: "contain",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(29,110,63,0.2) transparent",
                }}
              >
                <div
                  ref={scrollContentRef}
                  className="prose prose-lg max-w-none text-gray-700 font-serif leading-[1.8] tracking-tight"
                >
                  {letterParagraphs.map((para, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, root: scrollContainerRef, margin: "-20px" }}
                      transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                    >
                      {para.type === "greeting" && (
                        <p className="text-lg sm:text-xl font-black text-gray-900 mb-5 font-sans">{para.text}</p>
                      )}
                      {para.type === "dropcap" && (
                        <p className="text-gray-800 mb-5 relative z-10">
                          <span className="float-left text-5xl sm:text-6xl leading-[0.8] font-black text-[var(--womb-forest)] mr-3 mb-1 mt-1" style={{ fontFamily: "Georgia, serif" }}>W</span>
                          {para.text.substring(1)}
                        </p>
                      )}
                      {para.type === "body" && (
                        <p className="mb-5">{para.text}</p>
                      )}
                      {para.type === "highlight" && (
                        <p className="text-xl font-black text-[var(--womb-forest)] italic font-sans py-3 border-l-4 border-[var(--journey-saffron)] pl-5 bg-[var(--womb-forest)]/[0.03] rounded-r-xl my-6">
                          {para.text}
                        </p>
                      )}
                      {para.type === "emphasis" && (
                        <p className="font-sans font-bold text-gray-900 text-lg py-2 mb-5">{para.text}</p>
                      )}
                    </motion.div>
                  ))}

                  {/* Sign-off */}
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    whileInView={{ opacity: 1 }} 
                    viewport={{ once: true, root: scrollContainerRef }}
                    transition={{ duration: 0.8 }}
                    className="mt-8 pt-6 border-t border-gray-100 font-sans"
                  >
                    <p className="text-base font-bold text-gray-800 italic">{t('about.closing')}</p>
                    <span className="text-3xl sm:text-4xl text-[var(--womb-forest)]/70 block mt-4 mb-2" style={{ fontFamily: "'Cedarville Cursive', 'Brush Script MT', cursive", transform: "rotate(-3deg)", display: "inline-block" }}>
                      Sowjanya Reddy
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Bottom fade mask — scroll indicator */}
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
