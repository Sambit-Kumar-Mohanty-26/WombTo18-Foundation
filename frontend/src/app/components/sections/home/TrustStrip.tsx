import { motion } from "motion/react";
import { ShieldCheck, Receipt, Eye, Sparkles } from "lucide-react";

export function TrustStrip() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      desc: "Razorpay • PCI-DSS Level 1 Encryption",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      rotate: "-rotate-2",
      offsetY: "0",
      offsetX: "-lg:translate-x-12"
    },
    {
      icon: Receipt,
      title: "Instant 80G Certificate",
      desc: "Tax benefit certificate auto-emailed in 2 mins",
      color: "text-amber-600",
      bg: "bg-amber-50",
      rotate: "rotate-3",
      offsetY: "lg:-translate-y-8",
      offsetX: ""
    },
    {
      icon: Eye,
      title: "Full Fund Visibility",
      desc: "Personalised dashboard for real-time tracking",
      color: "text-sky-600",
      bg: "bg-sky-50",
      rotate: "-rotate-1",
      offsetY: "lg:translate-y-4",
      offsetX: "lg:translate-x-12"
    }
  ];

  return (
    <div className="relative pt-24 pb-0 overflow-hidden bg-white">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Transparency First</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight max-w-3xl mx-auto">
            Your Trust is <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Our Greatest Fuel
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
          </h2>
        </motion.div>

        {/* Scattered Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 relative mb-12">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.7 }}
              className={`relative z-20 ${card.offsetY} ${card.offsetX} px-4 sm:px-0`}
            >
              <motion.div
                whileHover={{ y: -10, rotate: 0, transition: { duration: 0.3 } }}
                className={`bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)] lg:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-500 lg:${card.rotate} group cursor-default max-w-sm mx-auto`}
              >

                <div className={`w-16 h-16 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight">{card.title}</h3>
                <p className="text-slate-500 font-medium leading-[1.6]">{card.desc}</p>
                
                {/* Decorative dots based on card index */}
                <div className="absolute top-6 right-8 flex gap-1">
                  {[...Array(3)].map((_, i) => (idx + i < 5 ? (
                    <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? "bg-slate-300" : "bg-slate-100"}`} />
                  ) : null))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Illustration Container */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mt-16 lg:-mt-32 w-full max-w-6xl mx-auto z-0 overflow-visible"
        >
          {/* Decorative Gradient fading into the illustration */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/40 to-transparent z-10" />
          
          <div className="flex justify-center overflow-hidden">
            <img 
              src="/images/7732595_5222.svg" 
              alt="Trust Illustration" 
              className="w-[200%] md:w-full min-w-[600px] md:min-w-0 h-auto transform lg:translate-y-12 transition-transform duration-1000"
            />
          </div>
          
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </motion.div>
      </div>


      {/* Extreme Bottom Decorative Element */}
      <div className="h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />
    </div>
  );
}
