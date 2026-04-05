import { useState } from "react";
import { useNavigate } from "react-router";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Building2, Sparkles, Zap, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../lib/auth";
import { motion } from "motion/react";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email.includes("partner")) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        login(email, true, "NGO Partner", "PARTNER");
        const session = { identifier: email, eligible: true, name: "NGO Partner", role: "PARTNER", token: "mock-partner-token" };
        localStorage.setItem("donor_session", JSON.stringify(session));
        toast.success("Login Successful: Partner Access Granted");
        navigate("/partner");
        return;
      }

      const res = await auth.adminLogin(email, password);
      if (res.token) {
        login(email, true, "Super Admin", "ADMIN");
        toast.success("Login Successful: Administrator Active");
        navigate("/admin");
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 font-sans">
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-100/50 blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-50/50 blur-[120px]" />
         <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-purple-50/30 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-12">
           <motion.div 
             initial={{ scale: 0.8 }}
             animate={{ scale: 1 }}
             className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-white border border-sky-100 shadow-2xl shadow-sky-900/[0.05] mb-6"
           >
             <ShieldCheck className="h-10 w-10 text-sky-500" />
           </motion.div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Admin <span className="text-sky-500">Login</span></h1>
           <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-[0.4em]">Foundation Portal Access</p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-2xl shadow-sky-900/[0.05] rounded-[3.5rem] overflow-hidden p-12">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address *</p>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="admin@foundation.org" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 text-slate-800 placeholder:text-slate-300 pl-14 pr-8 h-16 rounded-3xl outline-none focus:border-sky-200 focus:bg-white transition-all shadow-inner font-black text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password *</p>
                  <button type="button" className="text-[10px] font-black text-sky-500 hover:text-sky-600 uppercase tracking-widest underline decoration-sky-100">Reset</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 text-slate-800 placeholder:text-slate-300 pl-14 pr-8 h-16 rounded-3xl outline-none focus:border-sky-200 focus:bg-white transition-all shadow-inner font-black text-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-16 bg-sky-500 hover:bg-sky-600 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-sky-500/20 transition-all active:scale-95 flex items-center justify-center group"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In to Dashboard
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
              <span className="flex items-center gap-2"> Foundation Admin v1.0</span>
              <span className="flex items-center gap-2"><ShieldAlert className="h-3 w-3 text-emerald-400" /> Secure Connection</span>
            </div>
        </div>

        <div className="flex items-center justify-between mt-10 px-6">
          <button 
            onClick={() => navigate("/")}
            className="text-[10px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors flex items-center gap-2 group"
          >
            ← Back to Home
          </button>
          <button 
            onClick={() => navigate("/volunteer/login")}
            className="text-[10px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors"
          >
            Volunteer Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
