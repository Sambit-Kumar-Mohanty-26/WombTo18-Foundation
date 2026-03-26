import { motion } from "motion/react";
import { Leaf, Award, CheckCircle } from "lucide-react";

export function GoGreenCertificate() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full max-w-2xl mx-auto rounded-[2rem] p-1.5 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--journey-saffron) 0%, var(--future-sky) 100%)"
      }}
    >
      {/* Animated Shine */}
      <motion.div 
        animate={{ 
          x: ["-100%", "200%"],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "easeInOut",
          repeatDelay: 2
        }}
        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      />

      {/* Inner Certificate content */}
      <div className="bg-white rounded-[1.8rem] p-8 sm:p-12 relative overflow-hidden h-full border border-white/20">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply pointer-events-none"></div>
        
        {/* Top header */}
        <div className="flex justify-between items-start mb-10 relative z-20">
          <div>
            <h4 className="text-[var(--journey-saffron)] font-bold tracking-widest uppercase text-xs sm:text-sm mb-1">
              WombTo18 Foundation
            </h4>
            <div className="w-12 h-1 bg-[var(--journey-saffron)] rounded-full"></div>
          </div>
          <div className="w-16 h-16 bg-[#f0faf4] rounded-full flex items-center justify-center border border-[#d1f5e0] shadow-sm">
            <Leaf className="w-8 h-8 text-[#1D6E3F]" />
          </div>
        </div>

        {/* Certificate Body */}
        <div className="text-center relative z-20 mb-10">
          <p className="text-lg text-gray-500 uppercase tracking-widest font-medium mb-3">
            Certificate of Excellence
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 font-serif">
            Go Green Initiative
          </h2>
          <p className="text-gray-600 italic mt-6 max-w-md mx-auto text-lg leading-relaxed">
            Proudly presented to <span className="font-bold text-gray-900 border-b-2 border-[#a7e8c3]">Our Donor Partners</span> for outstanding contribution to the Carbon-Neutral Child Cohort, pledging 100+ trees in rural India.
          </p>
        </div>

        {/* Seal and Signatures */}
        <div className="flex items-end justify-between relative z-20 mt-12 pt-8 border-t border-gray-100">
          <div className="text-center">
            <div className="h-10 mb-2 border-b-2 border-gray-300 w-32 mx-auto">
              <span className="font-[signature] text-3xl text-gray-700 opacity-80">Sowjanya</span>
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Founder, WombTo18</p>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <Award className="w-16 h-16 text-amber-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <div className="text-center">
            <div className="h-10 mb-2 border-b-2 border-gray-300 w-32 mx-auto flex items-end justify-center pb-1">
              <span className="text-sm font-bold text-gray-700 font-mono">2026-GG-4091</span>
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Official Registry</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
