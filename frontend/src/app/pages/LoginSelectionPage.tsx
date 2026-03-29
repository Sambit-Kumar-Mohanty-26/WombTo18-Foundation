import { useNavigate } from "react-router";
import { Building2, Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export function LoginSelectionPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7] relative overflow-hidden px-4 md:px-6 py-8">
      {/* Ambient Light Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--womb-forest)] opacity-[0.03] blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--future-sky)] opacity-[0.03] blur-[100px]" />
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-[var(--journey-saffron)] opacity-[0.03] blur-[90px]" />
        
        {/* Subtle dot pattern grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl z-20 flex flex-col items-center"
      >
        {/* Brand Identity */}
        <motion.div variants={itemVariants} className="text-center mb-10 relative w-full">
          <div className="absolute -inset-10 bg-gradient-to-b from-white to-transparent opacity-80 blur-2xl -z-10 rounded-full" />
          
          <img src="/Wombto18 foundation logo.svg" alt="WombTo18 Logo" className="h-14 md:h-16 w-auto mx-auto mb-6 drop-shadow-xl" />
          
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <span className="text-[var(--womb-forest)]">Womb</span>
            <span className="text-[var(--journey-saffron)]">To</span>
            <span className="text-[var(--future-sky)]">18</span>
            <span className="ml-3 font-light text-gray-400">Portal</span>
          </h1>
          
          <div className="h-1.5 w-24 bg-gradient-to-r from-[var(--womb-forest)] via-[var(--journey-saffron)] to-[var(--future-sky)] mx-auto rounded-full mb-6 shadow-sm" />
          <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.25em]">Access Your Mission Dashboard</p>
        </motion.div>

        {/* Access Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          
          {/* Supporter Portal Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group relative h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--womb-forest)]/20 to-transparent rounded-[2.5rem] blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative flex flex-col h-full bg-white/70 backdrop-blur-xl border border-gray-100/80 rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_50px_-12px_rgba(29,110,63,0.15)] transition-all duration-500 hover:bg-white text-left">
              
              <div className="flex items-center gap-5 md:gap-6 mb-8">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--womb-forest)]/10 flex items-center justify-center border border-[var(--womb-forest)]/20 group-hover:scale-110 group-hover:bg-[var(--womb-forest)] transition-all duration-500 shadow-inner shrink-0">
                  <Heart className="h-7 w-7 md:h-8 md:w-8 text-[var(--womb-forest)] group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Supporters</h2>
                  <p className="text-[var(--womb-forest)] font-bold text-[10px] uppercase tracking-widest mt-1">Donors & Volunteers</p>
                </div>
              </div>

              <p className="text-gray-500/90 text-sm md:text-base leading-relaxed mb-10 font-medium">
                Your personal hub for managing impact contributions, downloading tax certificates, and tracking volunteer real-world milestones.
              </p>

              <div className="mt-auto space-y-4">
                <Button
                  onClick={() => navigate("/donor/login")}
                  className="w-full h-14 bg-[var(--womb-forest)] hover:bg-[#15532f] text-white border-none font-black text-lg rounded-2xl shadow-[0_8px_20px_-6px_rgba(29,110,63,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Enter Dashboard <ArrowRight className="h-5 w-5" />
                </Button>
                <button
                  onClick={() => navigate("/donor/login")}
                  className="w-full text-center text-gray-400 hover:text-[var(--womb-forest)] text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                >
                  Create New Account
                </button>
              </div>
            </div>
          </motion.div>

          {/* Partner Portal Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group relative h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--future-sky)]/20 to-transparent rounded-[2.5rem] blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative flex flex-col h-full bg-white/70 backdrop-blur-xl border border-gray-100/80 rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_50px_-12px_rgba(0,174,239,0.15)] transition-all duration-500 hover:bg-white text-left">
              
              <div className="flex items-center gap-5 md:gap-6 mb-8">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--future-sky)]/10 flex items-center justify-center border border-[var(--future-sky)]/20 group-hover:scale-110 group-hover:bg-[var(--future-sky)] transition-all duration-500 shadow-inner shrink-0">
                  <Building2 className="h-7 w-7 md:h-8 md:w-8 text-[var(--future-sky)] group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Authority</h2>
                  <p className="text-[var(--future-sky)] font-bold text-[10px] uppercase tracking-widest mt-1">Staff & Institutions</p>
                </div>
              </div>

              <p className="text-gray-500/90 text-sm md:text-base leading-relaxed mb-10 font-medium">
                Advanced management portal for NGO operations, ESG partner oversight, and real-time institutional health data analytics.
              </p>

              <div className="mt-auto space-y-4">
                <Button
                  onClick={() => navigate("/partner/login")}
                  className="w-full h-14 bg-[var(--future-sky)] hover:bg-[#0096ce] text-white border-none font-black text-lg rounded-2xl shadow-[0_8px_20px_-6px_rgba(0,174,239,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Staff & Partner Portal <ArrowRight className="h-5 w-5" />
                </Button>
                <button
                  onClick={() => navigate("/partner/login")}
                  className="w-full text-center text-gray-400 hover:text-[var(--future-sky)] text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                >
                  Inquiries & Registration
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Compliance / Security Footer */}
        <motion.div variants={itemVariants} className="mt-12 z-20 max-w-xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/60 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full border border-gray-200/60">
              <ShieldCheck className="h-4 w-4 text-[var(--womb-forest)]" />
              Military-Grade Security
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/60 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full border border-gray-200/60">
              256-bit Encryption
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/60 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full border border-gray-200/60">
              Real-time Audit
            </div>
          </div>
          
          <p className="mt-8 text-gray-400/80 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} WombTo18 Foundation · Integrated Health Delivery System
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
