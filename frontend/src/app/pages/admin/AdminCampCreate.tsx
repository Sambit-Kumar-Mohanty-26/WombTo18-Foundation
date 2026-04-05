import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tent, Loader2, ArrowLeft, Sparkles, MapPin, Calendar, Check, Info, Coins, HeartPulse, GraduationCap, Leaf, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { client } from "../../lib/api/client";
import { motion } from "motion/react";

export function AdminCampCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    totalCoinPool: 1000,
    purpose: "HEALTH"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post<any>('/camps/create', {
        ...form,
        totalCoinPool: Number(form.totalCoinPool) || 0,
      });
      navigate(`/admin/camps/${res?.id}`);
    } catch (err) {
      console.error(err);
      alert("Deployment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pb-20"
    >
      <div className="flex items-center gap-6 mb-10">
        <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl hover:bg-white hover:shadow-sm" onClick={() => navigate('/admin/camps')}>
          <ArrowLeft className="h-6 w-6 text-slate-400" />
        </Button>
        <div>
           <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-sm mb-2">
             <Sparkles className="w-3 h-3 mr-2" /> New Camp
           </Badge>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Create <span className="text-emerald-500">Camp</span></h1>
           <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Register a new volunteer camp event</p>
        </div>
      </div>

      <Card className="border-none bg-white shadow-2xl shadow-sky-900/[0.03] rounded-[3rem] overflow-hidden">
        <CardContent className="p-0">
           <div className="p-10 border-b border-slate-50 bg-emerald-50/20">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Tent className="text-emerald-500" size={20} />
                 </div>
                 <h2 className="text-lg font-black text-slate-800 tracking-tight">Camp Details</h2>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest opacity-60">Basic event information and location</p>
           </div>
           
           <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Camp Name *</p>
                <input 
                  required 
                  placeholder="e.g. Health Camp at Malad" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-700 outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Event Date *</p>
                  <div className="relative">
                     <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                     <input 
                       type="date" 
                       required 
                       value={form.date} 
                       onChange={e => setForm({...form, date: e.target.value})} 
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-black text-slate-700 outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner appearance-none"
                     />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Camp Location *</p>
                  <div className="relative">
                     <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                     <input 
                       required 
                       placeholder="e.g. Mumbai Center" 
                       value={form.location} 
                       onChange={e => setForm({...form, location: e.target.value})} 
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-black text-slate-700 outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner"
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Camp Description</p>
                <div className="relative">
                   <Info className="absolute left-5 top-6 text-slate-300" size={16} />
                   <textarea 
                     required
                     rows={4}
                     placeholder="Details for volunteers about this camp..."
                     value={form.description}
                     onChange={e => setForm({...form, description: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 text-sm font-black text-slate-700 outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner resize-none leading-relaxed"
                   />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Camp Purpose *</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { id: "HEALTH", label: "Medical/Health", icon: HeartPulse, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { id: "EDUCATION", label: "Education", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
                    { id: "ENVIRONMENT", label: "Environment", icon: Leaf, color: "text-green-500", bg: "bg-green-50" },
                    { id: "COMMUNITY", label: "Community", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
                    { id: "YOUTH", label: "Youth/Skills", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50" },
                  ].map((purpose) => (
                    <button
                      key={purpose.id}
                      type="button"
                      onClick={() => setForm({ ...form, purpose: purpose.id })}
                      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all group ${
                        form.purpose === purpose.id 
                          ? `border-${purpose.color.split('-')[1]}-500 ${purpose.bg} scale-105 shadow-lg` 
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <purpose.icon className={`${purpose.color} mb-3 group-hover:scale-110 transition-transform`} size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{purpose.label}</span>
                      {form.purpose === purpose.id && (
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-amber-50/40 border border-amber-100/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Coins className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Total Coin Pool</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Coins will be divided equally among volunteers who confirm attendance</p>
                  </div>
                </div>
                <div className="relative">
                   <Coins className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-400" size={16} />
                   <input 
                     type="number"
                     min={0}
                     placeholder="e.g. 1000" 
                     value={form.totalCoinPool} 
                     onChange={e => setForm({...form, totalCoinPool: Number(e.target.value) || 0})} 
                     className="w-full bg-white border border-amber-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-black text-slate-700 outline-none focus:border-amber-300 focus:bg-white transition-all shadow-inner"
                   />
                </div>
                <p className="text-[10px] text-amber-600/70 font-bold mt-3 ml-2">
                  💡 Set to 0 to use the default fixed reward (100 coins per volunteer)
                </p>
              </div>

              <div className="pt-6">
                 <Button 
                   type="submit" 
                   disabled={loading} 
                   className="w-full rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-[12px] uppercase tracking-[0.2em] h-14 shadow-xl shadow-sky-500/20 active:scale-95 group"
                 >
                   {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                     <span className="flex items-center gap-2">Create Camp <Check size={18} className="group-hover:scale-125 transition-transform" /></span>
                   )}
                 </Button>
              </div>
           </form>
        </CardContent>
      </Card>
      
      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mt-10">
        The camp will be visible to volunteers immediately after creation.
      </p>
    </motion.div>
  );
}

// Compact helper Button
function Button({ children, className, variant = "default", size = "md", ...props }: any) {
  const base = "inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 font-black";
  const variants: any = {
    default: "bg-sky-500 text-white",
    ghost: "text-slate-400 hover:bg-slate-100/50",
    outline: "border border-slate-100 text-slate-500 bg-white"
  };
  const sizes: any = {
    sm: "h-9 px-4 text-[10px] uppercase",
    md: "h-12 px-8 text-sm",
    lg: "h-14 px-10 text-base"
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
