import { useNavigate } from "react-router";
import { Building2, Heart, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export function LoginSelectionPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7] relative overflow-hidden px-4 md:px-6 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--womb-forest)] opacity-[0.03] blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--future-sky)] opacity-[0.03] blur-[100px]" />
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-[var(--journey-saffron)] opacity-[0.03] blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-6xl z-20 flex flex-col items-center">
        <motion.div variants={itemVariants} className="text-center mb-12 relative w-full">
          <div className="absolute -inset-10 bg-gradient-to-b from-white to-transparent opacity-80 blur-2xl -z-10 rounded-full" />
          <img src="/Wombto18 foundation logo.svg" alt="WombTo18 Logo" className="h-14 md:h-16 w-auto mx-auto mb-6 drop-shadow-xl" />
          
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
            <span className="text-[var(--womb-forest)]">Womb</span>
            <span className="text-[var(--journey-saffron)]">To</span>
            <span className="text-[var(--future-sky)]">18</span>
            <span className="ml-3 font-light text-gray-400">Portals</span>
          </h1>
          
          <div className="h-1.5 w-24 bg-gradient-to-r from-[var(--womb-forest)] via-[var(--journey-saffron)] to-[var(--future-sky)] mx-auto rounded-full mb-6 shadow-sm" />
          <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.25em]">Select Your Impact Pathway</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          
          {/* Donor Portal */}
          <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group relative h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--womb-forest)]/30 to-transparent rounded-[2.5rem] blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative flex flex-col h-full bg-white/70 backdrop-blur-xl border border-gray-100/80 rounded-[2.5rem] p-8 shadow-sm group-hover:shadow-2xl transition-all duration-500 hover:bg-white text-left">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--womb-forest)]/10 flex items-center justify-center border border-[var(--womb-forest)]/20 group-hover:bg-[var(--womb-forest)] transition-all duration-500 shrink-0">
                  <Heart className="h-6 w-6 text-[var(--womb-forest)] group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Donor Portal</h2>
                  <p className="text-[var(--womb-forest)] font-bold text-[10px] uppercase tracking-widest mt-1">Make an Impact</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Manage your donations, track lifetime impact, access 80G tax certificates, and view the global donor leaderboard.
              </p>
              <Button onClick={() => navigate("/donor/login")} className="w-full h-12 bg-[var(--womb-forest)] hover:bg-[#15532f] text-white font-black text-sm rounded-xl shadow-lg shadow-green-900/20">
                Enter Donor Portal <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Volunteer Portal */}
          <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group relative h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/30 to-transparent rounded-[2.5rem] blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative flex flex-col h-full bg-white/70 backdrop-blur-xl border border-amber-100/50 rounded-[2.5rem] p-8 shadow-sm group-hover:shadow-2xl transition-all duration-500 hover:bg-white text-left">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 transition-all duration-500 shrink-0">
                  <Zap className="h-6 w-6 text-amber-500 group-hover:text-white transition-colors duration-500 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Volunteer Hub</h2>
                  <p className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mt-1">Take Action</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Access your volunteer dashboard, track referral coins, discover upcoming camps, and climb the impact leaderboard.
              </p>
              <Button onClick={() => navigate("/volunteer/login")} className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 border-none">
                Enter Volunteer Hub <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Partner Portal */}
          <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group relative h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--future-sky)]/30 to-transparent rounded-[2.5rem] blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative flex flex-col h-full bg-white/70 backdrop-blur-xl border border-gray-100/80 rounded-[2.5rem] p-8 shadow-sm group-hover:shadow-2xl transition-all duration-500 hover:bg-white text-left">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--future-sky)]/10 flex items-center justify-center border border-[var(--future-sky)]/20 group-hover:bg-[var(--future-sky)] transition-all duration-500 shrink-0">
                  <Building2 className="h-6 w-6 text-[var(--future-sky)] group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">CSR Partners</h2>
                  <p className="text-[var(--future-sky)] font-bold text-[10px] uppercase tracking-widest mt-1">Institutions & Orgs</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Advanced portal for corporate and institutional partners to manage CSR initiatives, track referrals, and download reports.
              </p>
              <Button onClick={() => navigate("/partner/login")} className="w-full h-12 bg-[var(--future-sky)] hover:bg-[#0096ce] text-white font-black text-sm rounded-xl shadow-lg shadow-blue-500/20 border-none">
                Enter Partner Portal <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>

        </div>

        <motion.div variants={itemVariants} className="mt-12 z-20 w-full text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck className="h-4 w-4 text-[var(--womb-forest)]" /> End-to-End Encrypted
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />
            <div className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">OTP Secured</div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />
            <div className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">Data Privacy Compliant</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
