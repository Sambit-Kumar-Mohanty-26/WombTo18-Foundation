import { useState } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  Activity,
  Filter
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from "recharts";
import { motion } from "motion/react";

const impactData = [
  { name: "Jan", impact: 4000 },
  { name: "Feb", impact: 3000 },
  { name: "Mar", impact: 2000 },
  { name: "Apr", impact: 2780 },
  { name: "May", impact: 1890 },
  { name: "Jun", impact: 2390 },
];

export function AdminReports() {
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
             <Sparkles className="w-3 h-3 text-slate-500" /> Global Audit
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tighter">
             Analytics <span className="text-slate-400">& Reports</span>
           </h1>
        </div>
        <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 hover:border-black flex items-center justify-center text-slate-600 hover:text-black shadow-sm transition-all group">
                <Search size={18} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="h-12 px-8 rounded-2xl bg-black hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center shadow-lg shadow-black/10 active:scale-95">
                <Download size={16} className="mr-2" /> Export Data
            </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-white border border-slate-200 shadow-sm rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group hover:border-black transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
                <div>
                    <h3 className="text-lg font-black text-black tracking-tighter uppercase mb-1">Impact Summary</h3>
                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">Annual growth and contribution tracking</p>
                </div>
                <div className="hidden sm:block p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 size={20} className="text-black" />
                </div>
            </div>
            
            <div className="h-[280px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} dy={10} />
                        <YAxis hide={false} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                        <RechartsTooltip 
                           cursor={{fill: '#f8fafc'}} 
                           contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px'}} 
                        />
                        <Bar 
                           dataKey="impact" 
                           radius={[6, 6, 0, 0]} 
                           fill="#0f172a" 
                           animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white border border-slate-200 shadow-sm rounded-[2.5rem] p-8 lg:p-10 flex flex-col hover:border-black transition-colors">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Filter size={18} className="text-black" />
                </div>
                <h3 className="text-lg font-black text-black tracking-tighter uppercase leading-none">Category Filter</h3>
              </div>
              
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {["All Programs", "Maternal Health", "Child Care", "Education", "Operations"].map((filter, i) => (
                    <button key={i} className={`w-full text-left p-4 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border ${i === 0 ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'}`}>
                        {filter}
                    </button>
                ))}
              </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-left font-bold text-[10px] text-slate-400 uppercase tracking-widest">Report Name</th>
                <th className="px-8 py-5 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest">Generated Date</th>
                <th className="px-8 py-5 text-right font-bold text-[10px] text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1,2,3,4].map((r) => (
                <tr key={r} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <FileText className="text-black" size={18} />
                        </div>
                        <div>
                           <p className="font-black text-black tracking-tight text-[15px] mb-0.5">Q{r} Impact Analysis 2024</p>
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                             <Activity size={10} /> Verified Data File
                           </p>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-bold text-[9px] uppercase tracking-widest">
                        Operations
                     </div>
                  </td>
                  <td className="px-8 py-6 text-center uppercase text-[11px] font-bold text-slate-500 tracking-wider">
                     {10 + r} March 2024
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button className="h-10 rounded-xl px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-black hover:text-white transition-all flex items-center justify-end group-hover:scale-105 inline-flex ml-auto border border-transparent hover:border-black">
                        Download PDF <ArrowRight size={14} className="ml-2" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}