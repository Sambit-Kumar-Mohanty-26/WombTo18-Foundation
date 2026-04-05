import { useState } from "react";
import { 
  Target, 
  MapPin, 
  TrendingUp, 
  Activity, 
  Plus, 
  ArrowRight, 
  LayoutGrid, 
  List, 
  Sparkles,
  Users,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

const programs = [
  { id: 1, name: "Maternal Health", category: "Rural Health", status: "Active", progress: 85, color: "text-rose-500", icon: Heart },
  { id: 2, name: "Nutrition Drive", category: "Child Care", status: "Active", progress: 65, color: "text-emerald-500", icon: Users },
  { id: 3, name: "Primary Education", category: "Rural Education", status: "Active", progress: 92, color: "text-blue-500", icon: Target },
  { id: 4, name: "Clean Water", category: "Sanitation", status: "Active", progress: 45, color: "text-sky-500", icon: Activity },
];

export function AdminPrograms() {
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-10 font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-200/50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
             <Sparkles className="w-3 h-3 text-slate-500" /> Global Impact
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tighter">
             Strategic <span className="text-slate-400">Initiatives</span>
           </h1>
        </div>
        <button 
          onClick={() => navigate("/admin/camps/create")}
          className="h-12 px-8 rounded-2xl bg-black hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center shadow-lg shadow-black/10 active:scale-95"
        >
          <Plus size={16} className="mr-2" /> Launch Initiative
        </button>
      </div>

      <motion.div variants={itemVariants} className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] p-8 lg:p-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Target size={160} className="text-slate-900" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg">
               <h3 className="text-2xl font-black text-black tracking-tighter uppercase mb-3">Portfolio Assessment</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Tracking deployment execution and completion velocities across all active foundation sectors globally.</p>
            </div>
            <div className="flex gap-12 sm:gap-20">
               {[
                  { label: "Active Deployments", value: "24", icon: Activity },
                  { label: "Global Completion", value: "92%", icon: TrendingUp }
               ].map((m, i) => (
                  <div key={i} className="text-center group">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <m.icon size={20} className="text-black" />
                     </div>
                     <p className="text-3xl font-black text-black tracking-tighter mb-1">{m.value}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                  </div>
               ))}
            </div>
         </div>
      </motion.div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-black tracking-tighter uppercase">Operations Roster</h2>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
           <button onClick={() => setView("grid")} className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /></button>
           <button onClick={() => setView("list")} className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}><List size={18} /></button>
        </div>
      </div>

      <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
        {programs.map((prog, i) => (
          <motion.div key={prog.id} variants={itemVariants}>
            <div className={`bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden group hover:border-black transition-colors flex flex-col h-full ${view === 'list' ? 'flex-row items-center p-6' : 'p-8'}`}>
                {view === 'grid' && (
                    <div className="flex items-center justify-between mb-8">
                       <div className={`w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <prog.icon size={20} className={prog.color} />
                       </div>
                       <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-slate-200">
                           {prog.status}
                       </div>
                    </div>
                )}
                
                <div className={view === 'list' ? 'flex-1 flex items-center justify-between' : 'flex-1'}>
                    <div>
                        <h3 className="text-lg font-black text-black tracking-tight leading-none mb-3 group-hover:text-slate-700 transition-colors">{prog.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                           <MapPin size={12} className="text-slate-300" /> Focus: {prog.category}
                        </div>
                    </div>

                    <div className={view === 'list' ? 'w-64 px-8' : 'w-full space-y-3'}>
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                          <span className="text-slate-400">Execution</span>
                          <span className="text-black">{prog.progress}%</span>
                       </div>
                       <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${prog.progress}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="bg-black h-full"
                          />
                       </div>
                    </div>

                    <div className={view === 'grid' ? 'mt-8 pt-6 border-t border-slate-100 flex items-center justify-between' : 'pl-8 border-l border-slate-100'}>
                       {view === 'grid' && (
                           <div className="flex -space-x-2">
                              {[1,2,3].map(u => (
                                <div key={u} className="w-8 h-8 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500">U{u}</div>
                              ))}
                           </div>
                       )}
                       <button className="h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white text-slate-500 transition-colors flex items-center">
                          Configure <ArrowRight size={14} className="ml-2" />
                       </button>
                    </div>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
