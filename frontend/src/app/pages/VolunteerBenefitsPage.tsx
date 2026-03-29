import { motion } from "motion/react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function VolunteerBenefitsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24 pb-12 sm:pt-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0faf4] via-[#fef6ed]/40 to-[#FFFDF7] pointer-events-none" />
      <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_65%)] opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[5%] w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_65%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[var(--womb-forest)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Registration
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-6 font-black tracking-tight">
            Volunteer <span className="text-[var(--womb-forest)]">Benefits</span>
          </h1>
          
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <ChevronRight className="w-8 h-8 text-emerald-600" />
             </div>
             <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
               (Benefits content will be updated here shortly...)
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
