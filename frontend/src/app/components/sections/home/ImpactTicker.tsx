import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslation } from "react-i18next";

function AnimatedCounter({ from = 0, to, duration = 2, suffix = "" }: { from?: number, to: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        // easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeProgress * (to - from) + from));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
}

export function ImpactTicker() {
  const { t } = useTranslation('home');
  const stats = [
    { value: 12450, suffix: "+", label: t('impactTicker.metric1'), color: "var(--womb-forest, #1D6E3F)" },
    { value: 25, suffix: "", label: t('impactTicker.metric2'), color: "var(--journey-saffron, #FF9900)" },
    { value: 3210, suffix: "+", label: t('impactTicker.metric3'), color: "var(--future-sky, #00AEEF)" },
    { value: 6, suffix: "", label: t('impactTicker.metric4'), color: "#10b981" },
  ];

  return (
    <div className="bg-gray-900 py-6 border-y border-gray-800 relative z-20 shadow-2xl overflow-hidden">
      {/* Background gradient sweep */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundSize: "200% 200%",
          backgroundImage: "linear-gradient(90deg, var(--womb-forest) 0%, var(--journey-saffron) 50%, var(--future-sky) 100%)"
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-x divide-gray-800 text-center">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center justify-center p-2"
            >
              <div 
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 tabular-nums"
                style={{ color: stat.color }}
              >
                <AnimatedCounter to={stat.value} duration={2.5} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base font-medium text-gray-300 uppercase tracking-widest text-center">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
