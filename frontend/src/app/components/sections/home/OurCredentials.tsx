import { motion } from "motion/react";
import { Landmark, FileText, Globe, Building2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const credentials = [
  {
    icon: Landmark,
    title: "80G Certified",
    subtitle: "Tax-Deductible Donations",
    description:
      "All contributions are eligible for income tax deduction under Section 80G",
    gradient: "from-emerald-500 to-emerald-600",
    badge: "Tax Benefit",
    stats: "Save up to 50% tax",
  },
  {
    icon: FileText,
    title: "12A Certified",
    subtitle: "Legally Recognised Non-Profit",
    description:
      "Registered and certified under Section 12A of the Income Tax Act",
    gradient: "from-amber-500 to-orange-500",
    badge: "Legal Status",
    stats: "Registered since 2015",
  },
  {
    icon: Globe,
    title: "TechSoup India",
    subtitle: "Validated NGO",
    description:
      "Verified by TechSoup India — the global standard for NGO technology access",
    gradient: "from-sky-500 to-blue-500",
    badge: "Global Standard",
    stats: "Tech Access Partner",
  },
  {
    icon: Building2,
    title: "Section 8",
    subtitle: "Registered Foundation",
    description:
      "Incorporated as a Section 8 Company under the Companies Act, 2013",
    gradient: "from-purple-500 to-violet-500",
    badge: "Company Status",
    stats: "CSR Eligible",
  },
];

export function OurCredentials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getGradientColor = (gradient: string) => {
    if (gradient.includes('emerald')) return '#10b981';
    if (gradient.includes('amber')) return '#f59e0b';
    if (gradient.includes('sky')) return '#0ea5e9';
    if (gradient.includes('purple')) return '#a855f7';
    return '#64748b';
  };

  return (
    <section className="relative py-28 lg:py-36 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-[100px] animate-pulse animation-delay-2000" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-custom-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            >
              <div className="w-1 h-1 bg-emerald-400/30 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Branding & Highlight */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-14"
              >
                {/* Animated Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 mb-8 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                    Transparency First
                  </span>
                </motion.div>
                
                <motion.h2 
                  className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Trusted & 
                  </span>
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                      Compliant
                    </span>
                    {/* Animated Underline */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                    />
                  </span>
                </motion.h2>
                
                <p className="mt-8 text-lg text-slate-600 leading-relaxed font-medium italic">
                  "Your trust is our greatest fuel"
                </p>
                <p className="mt-4 text-sm text-slate-500 max-w-sm leading-relaxed">
                  We maintain the highest standards of governance and legal compliance to ensure maximum impact.
                </p>
              </motion.div>

              {/* Smaller Impact Preview in Sticky Column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative mt-10 overflow-hidden group"
              >
                <img 
                  src="/images/19197952.jpg" 
                  alt="Financial Metrics" 
                  className="w-full h-auto rounded-xl object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            </div>
          </div>

          {/* Right Column: 2x2 Grid Layout */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {credentials.map((cred, idx) => (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
                >
                  {/* Glowing background on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${cred.gradient} rounded-2xl blur-3xl -z-10`} />
                  
                  <div className="relative z-10 h-full flex flex-col items-start">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden bg-gradient-to-br ${cred.gradient} mb-6`}
                      animate={hoveredIndex === idx ? { scale: 1.1, rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <cred.icon className="w-8 h-8 text-white relative z-10" />
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h3 className="text-xl font-black text-slate-900 leading-none">
                          {cred.title}
                        </h3>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r ${cred.gradient} text-white shadow-sm`}>
                          Verified
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
                        {cred.subtitle}
                      </p>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {cred.description}
                      </p>
                    </div>

                    {/* Revealable details */}
                    <motion.div 
                      className="mt-6 flex items-center justify-between w-full"
                      initial={{ opacity: 0.3 }}
                      animate={hoveredIndex === idx ? { opacity: 1 } : { opacity: 0.3 }}
                    >
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {cred.stats}
                      </span>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-2 transition-all duration-300" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-custom-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </section>
  );
}