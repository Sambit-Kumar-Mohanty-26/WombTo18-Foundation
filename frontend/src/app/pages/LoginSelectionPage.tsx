import { useNavigate } from "react-router";
import { Building2, Heart, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export function LoginSelectionPage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#051c0d] relative overflow-hidden px-4 md:px-6">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/20 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-orange-500/10 blur-[100px]" />
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Brand Identity */}
      <div className="text-center mb-16 z-20 animate-in fade-in zoom-in duration-1000">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
          <img src="/Wombto18 foundation logo.svg" alt="logo" className="h-16 w-auto relative drop-shadow-2xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
          <span className="text-emerald-400">Womb</span>
          <span className="text-orange-400">To</span>
          <span className="text-blue-400">18</span>
          <span className="ml-2 font-light opacity-90">Portal</span>
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 mx-auto rounded-full mb-4" />
        <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em]">Access Your Mission Dashboard</p>
      </div>

      {/* Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-20">
        
        {/* Supporter Portal Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/40 to-emerald-900/0 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative flex flex-col h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 transition-all duration-500 hover:translate-y-[-8px] hover:bg-white/[0.08] shadow-2xl">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-500">
                <Heart className="h-8 w-8 text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Supporters</h2>
                <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Donors & Volunteers</p>
              </div>
            </div>

            <p className="text-white/50 text-base leading-relaxed mb-10">
              Your hub for managing contributions, downloading certificates, and tracking your real-world impact.
            </p>

            <div className="mt-auto space-y-4">
              <Button
                onClick={() => navigate("/donor/login")}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white border-none font-black text-lg rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Enter Dashboard <ArrowRight className="h-5 w-5" />
              </Button>
              <button
                onClick={() => navigate("/donor/login")}
                className="w-full text-center text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Inaugurate Account
              </button>
            </div>
          </div>
        </div>

        {/* Partner Portal Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/40 to-blue-900/0 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative flex flex-col h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 transition-all duration-500 hover:translate-y-[-8px] hover:bg-white/[0.08] shadow-2xl">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-500">
                <Building2 className="h-8 w-8 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Authority</h2>
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Staff & Institutions</p>
              </div>
            </div>

            <p className="text-white/50 text-base leading-relaxed mb-10">
              Advanced management portal for NGO operations, program oversight, and institutional health data.
            </p>

            <div className="mt-auto space-y-4">
            <Button
                onClick={() => navigate("/partner/login")}
                className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white border-none font-black text-lg rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Staff & Partner Portal <ArrowRight className="h-5 w-5" />
              </Button>
              <button
                onClick={() => navigate("/partner/login")}
                className="w-full text-center text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Inquiries & Registration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance / Security Footer */}
      <div className="mt-16 z-20 max-w-xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Military-Grade Security
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
            256-bit Encryption
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
            Real-time Audit
          </div>
        </div>
        
        <p className="mt-10 text-white/20 text-[10px] font-bold uppercase tracking-widest">
          © 2026 WombTo18 Foundation · Integrated Health Delivery System
        </p>
      </div>
    </section>
  );
}
