import { useNavigate } from "react-router";
import { PartnerLoginForm } from "../../components/partner-login/PartnerLoginForm";
import { ShieldCheck } from "lucide-react";

export function PartnerLogin() {
  const navigate = useNavigate();

  const handleLoginSuccess = (role: string, name: string) => {
    if (role === 'PARTNER') {
      navigate("/partner", { replace: true });
    } else if (role === 'ADMIN') {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <section className="min-h-screen py-20 flex flex-col items-center justify-center bg-[#051c0d] relative overflow-hidden px-4 md:px-6">
      {/* Immersive Background Architecture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-15%] w-[700px] h-[700px] rounded-full bg-emerald-600/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-orange-400/5 blur-[120px]" />
        
        {/* Particle Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Authority Indicator */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 animate-in fade-in duration-1000">
        <div className="h-[1px] w-12 bg-emerald-500/20" />
        <span className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.4em]">Integrated Compliance Shell v4.0</span>
        <div className="h-[1px] w-12 bg-emerald-500/20" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center shadow-2xl group transition-all duration-700">
               <ShieldCheck className="h-10 w-10 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Institutional Entry</h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em]">Staff & Strategic Partners</p>
        </div>

        <PartnerLoginForm onSuccess={handleLoginSuccess} />
        
        <div className="text-center mt-12 flex flex-col items-center gap-6">
          <button 
            onClick={() => navigate("/")}
            className="text-white/30 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 group"
          >
            <div className="h-px w-6 bg-white/10 group-hover:w-10 group-hover:bg-white/40 transition-all" />
            Terminate Terminal Access
          </button>
          
          <div className="flex items-center gap-4 py-3 px-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md opacity-40 hover:opacity-100 transition-all cursor-default">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Protocol Connection: Encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
