import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { HeartHandshake, Sparkles, Mail, LayoutDashboard, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function VolunteerSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen lg:h-screen flex flex-col justify-center bg-[#FFFDF7] pt-16 pb-6 relative overflow-hidden overflow-y-auto place-content-center">
      {/*Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0faf4] via-[#fef6ed]/40 to-[#FFFDF7] pointer-events-none" />
      <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_65%)] opacity-[0.08] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--future-sky)_0%,_transparent_65%)] opacity-[0.05] blur-[80px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-5"
        >
          {/*Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
            className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[var(--womb-forest)] to-emerald-500 shadow-[0_4px_20px_-5px_rgba(29,110,63,0.4)] flex items-center justify-center mb-4 relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-[1.5rem] animate-pulse" />
            <HeartHandshake className="w-8 h-8 text-white relative z-10" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase mb-3 border shadow-sm backdrop-blur-sm bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] border-[var(--womb-forest)]/20"
          >
            <Sparkles className="w-3 h-3" /> Registration Received
          </motion.div>

          <h1 className="text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Welcome to the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-400 drop-shadow-sm">
              Community.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
            Thank you for offering your time and expertise. Volunteering is the heartbeat of our foundation.
          </p>
        </motion.div>

        {/* Next Steps Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl sm:rounded-3xl border border-[var(--womb-forest)]/20 bg-gradient-to-br from-white to-[#f0faf4] p-5 sm:p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] mb-5 text-left relative overflow-hidden"
        >
          {/* Subtle gradient border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--womb-forest)] via-emerald-400 to-transparent opacity-50" />
          
          <div className="flex items-start gap-5">
             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[var(--womb-forest)]/15 flex items-center justify-center shrink-0">
               <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--womb-forest)]" />
             </div>
             <div>
               <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1">What's Next?</h3>
               <p className="text-[12px] sm:text-[13px] text-gray-600 leading-relaxed mb-4">
                 Our team is reviewing your profile and skills. We will reach out to you within <b>48 hours</b> with specific volunteering opportunities that match your availability and expertise.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4">
                 <button
                   onClick={() => navigate("/about")}
                   className="group inline-flex items-center gap-2 bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_-3px_rgba(29,110,63,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(29,110,63,0.5)] transition-all duration-300"
                 >
                   Learn More About Us
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Home Button */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.6, delay: 0.5 }}
           className="text-center"
        >
          <button onClick={() => navigate("/")} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-2">
            ← Return to Homepage
          </button>
        </motion.div>
      </div>
    </div>
  );
}
