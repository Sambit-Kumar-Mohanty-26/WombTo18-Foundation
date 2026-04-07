import { motion } from "motion/react";
import { 
  Globe, 
  Sparkles, 
  Ban, 
  Building2, 
  Scale, 
  HeartHandshake, 
  ArrowLeft 
} from "lucide-react";
import { useNavigate } from "react-router";

export function VolunteerBenefitsPage() {
  const navigate = useNavigate();

  const policies = [
    {
      icon: <Globe className="w-6 h-6" />,
      text: "Volunteers participate voluntarily in awareness and outreach initiatives",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      text: "Impact Points are awarded for engagement and contribution",
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      icon: <Ban className="w-6 h-6" />,
      text: "These points are non-monetary and hold no cash value",
      color: "bg-rose-50 text-rose-600 border-rose-100"
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      text: "Certain services may be offered by WombTo18 Integrated Care Pvt Ltd",
      color: "bg-sky-50 text-sky-600 border-sky-100"
    },
    {
      icon: <Scale className="w-6 h-6" />,
      text: "Any incentives related to such services are governed by the Pvt Ltd entity",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      text: "Volunteers are not employees and are not entitled to wages or commissions from the Foundation",
      color: "bg-violet-50 text-violet-600 border-violet-100"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24 pb-20 sm:pt-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0faf4] via-[#fef6ed]/40 to-[#FFFDF7] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_65%)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_65%)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[var(--womb-forest)] transition-all mb-10 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Registration
        </motion.button>

        <header className="mb-12">
          <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" />
            Official Guidelines
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-6xl text-gray-900 font-black tracking-tight"
          >
            Volunteer <span className="text-[var(--womb-forest)]">Policy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-500 mt-4 max-w-2xl font-medium"
          >
            Please review our foundational principles and policy framework for volunteering with WOMBTO18 Foundation.
          </motion.p>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:gap-6"
        >
          {policies.map((policy, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="group bg-white/40 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all duration-500 overflow-hidden relative"
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-2xl border ${policy.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`}>
                {policy.icon}
              </div>
              <p className="text-gray-700 font-bold text-base sm:text-lg leading-relaxed">
                {policy.text}
              </p>
              
              {/* Subtle hover effect light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            © 2026 WOMBTO18 Foundation • All rights reserved
          </p>
        </motion.div>
      </div>
    </div>
  );
}
