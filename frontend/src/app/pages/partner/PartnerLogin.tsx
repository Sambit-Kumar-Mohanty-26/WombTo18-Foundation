import { useNavigate } from "react-router";
import { PartnerLoginForm } from "../../components/partner-login/PartnerLoginForm";
import { ShieldCheck, Building2, UserCircle2, Lock } from "lucide-react";
import { motion } from "motion/react";

export function PartnerLogin() {
  const navigate = useNavigate();

  const handleLoginSuccess = (role: string, partnerId?: string) => {
    if (role === 'PARTNER' && partnerId) {
      navigate(`/partner/${partnerId}/dashboard`, { replace: true });
    } else if (role === 'PARTNER') {
      // Fallback if ID is missing (shouldn't happen with updated logic)
      navigate("/partner/dashboard", { replace: true });
    } else if (role === 'ADMIN') {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <section className="min-h-screen py-12 flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-white to-[#f0f9ff] relative overflow-hidden px-4 md:px-6">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_rgba(2,132,199,0.05)_0%,_transparent_70%)] blur-[100px]" 
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.03)_0%,_transparent_70%)] blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_0.8px,transparent_0.8px)] [background-size:32px_32px] opacity-[0.3] pointer-events-none" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-sky-100/50 px-4 py-2 rounded-full mb-6 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
             <span className="text-[10px] font-black text-sky-600/80 uppercase tracking-[0.4em]">Secure Access Terminal</span>
          </div>

          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-sky-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-white shadow-2xl border border-sky-100 flex items-center justify-center group transition-all duration-700">
               <ShieldCheck className="h-8 w-8 text-sky-600 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Partner Login</h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.3em]">Staff & Strategic Partners</p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_100px_-30px_rgba(2,132,199,0.12)] border border-sky-100/40 relative overflow-hidden"
        >
          <PartnerLoginForm onSuccess={handleLoginSuccess} />
        </motion.div>
        
        {/* Footer Navigation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/partner/signup")}
              className="text-gray-400 hover:text-sky-600 transition-all text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group"
            >
              Don't have an account? <span className="text-sky-600 font-black">Join Us</span>
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <button 
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-rose-600 transition-all text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group"
            >
              Back to Home
            </button>
          </div>
          
          <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/60 border border-sky-50 backdrop-blur-md opacity-60">
            <Lock className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Protocol Connection: Encrypted</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
