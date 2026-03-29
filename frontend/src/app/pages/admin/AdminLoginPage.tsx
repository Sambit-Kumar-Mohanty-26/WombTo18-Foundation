import { useState } from "react";
import { useNavigate } from "react-router";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Building2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

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
      // Mock logic for demo/presentation 
      // In real app, this would call backend /staff/login
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (email.includes("admin") && password === "admin123") {
        login(email, true, "Super Admin", "ADMIN");
        const session = { identifier: email, eligible: true, name: "Super Admin", role: "ADMIN", token: "mock-admin-token" };
        localStorage.setItem("donor_session", JSON.stringify(session));
        toast.success("Welcome back, Administrator");
        navigate("/admin");
      } else if (email.includes("partner") && password === "partner123") {
        login(email, true, "NGO Partner", "PARTNER");
        const session = { identifier: email, eligible: true, name: "NGO Partner", role: "PARTNER", token: "mock-partner-token" };
        localStorage.setItem("donor_session", JSON.stringify(session));
        toast.success("Partner Dashboard Loaded");
        navigate("/partner");
      } else {
        toast.error("Invalid corporate credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a3a1e] relative overflow-hidden px-4">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/30 blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4 shadow-2xl">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Management Portal</h1>
          <p className="text-emerald-400/60 text-sm mt-2 font-medium tracking-wide">Staff & Partner Authentication</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden rounded-3xl">
          <CardContent className="pt-8 px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest ml-1">Corporate Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="name@foundation.org" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 pl-12 h-14 rounded-2xl focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Security Password</label>
                  <button type="button" className="text-[10px] text-white/40 hover:text-white transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 pl-12 h-14 rounded-2xl focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Authorize Access
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-white/30">
              <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Partner Protocol v2.4</span>
              <span>Secure Shell v3</span>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-8">
          <button 
            onClick={() => navigate("/")}
            className="text-white/30 hover:text-emerald-400 transition-colors text-xs font-medium"
          >
            ← Application Homepage
          </button>
        </p>
      </div>
    </div>
  );
}
