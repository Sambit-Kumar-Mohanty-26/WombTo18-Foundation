import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { partnerApi, PartnerStats as IPartnerStats } from "../../lib/api/partner";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Download
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart, 
  Pie
} from 'recharts';
import { motion } from "motion/react";

const COLORS = ['#1D6E3F', '#FF9900', '#10B981', '#F59E0B'];

export function PartnerStats() {
  const { id } = useParams();
  const { state } = useAuth();
  const [data, setData] = useState<IPartnerStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const partnerId = (state.user as any)?.partnerId;
  const isAuthorized = state.isLoaded && state.user && partnerId && (!id || id === partnerId);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsId = id || partnerId;
        if (statsId) {
          const [stats, lb] = await Promise.all([
            partnerApi.getDashboard(statsId),
            partnerApi.getLeaderboard(5)
          ]);
          setData(stats);
          setLeaderboard(lb);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, partnerId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } as any }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Activity className="h-10 w-10 text-[#1D6E3F] animate-spin" strokeWidth={3} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Loading Stats...</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Sponsorships', value: data?.stats.totalSponsored || 0 },
    { name: 'Referrals', value: data?.stats.referralDonations || 0 },
    { name: 'Conversion', value: (data?.stats.conversionRate || 0) * 100 },
    { name: 'Impact', value: data?.partner.partnerScore || 0 },
  ];

  if (!isAuthorized) return null;

  const impactGoalReached = data?.partner.partnerScore || 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase underline decoration-[#FF9900]/40 decoration-4 underline-offset-[12px]">Performance Stats</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] pt-3">Your overall impact summary</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-[#1D6E3F] text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
            <Download size={14} /> Full Impact Report
          </button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
         <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Performance Distribution</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Resource allocation by impact channel</p>
               </div>
               <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400">
                  <BarChart3 size={20} />
               </div>
            </div>
            <div className="h-[340px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{top: 0, right: 0, left: -20, bottom: 0}}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 900, fill: '#9CA3AF', letterSpacing: '0.1em'}} 
                        dy={15}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{
                           borderRadius: '16px', 
                           border: '1px solid #F3F4F6', 
                           boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                           padding: '12px 18px',
                           fontSize: '10px',
                           fontWeight: 900,
                           textTransform: 'uppercase'
                        }} 
                        cursor={{fill: '#f9fafb', radius: 12}}
                     />
                     <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.9} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         <motion.div variants={itemVariants} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-2">Impact Goal</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">How much of your goal you have reached through your work.</p>
            </div>
            
            <div className="relative flex items-center justify-center py-10">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                     <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{impactGoalReached.toFixed(0)}%</p>
                     <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">Reached</p>
                  </div>
               </div>
               <div className="h-[180px] w-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={[{name: 'Achieved', value: impactGoalReached}, {name: 'Target', value: 100 - impactGoalReached}]}
                           innerRadius={65}
                           outerRadius={85}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           <Cell fill="#1D6E3F" stroke="none" />
                           <Cell fill="#F3F4F6" stroke="none" />
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <button className="w-full py-4 bg-gray-50 hover:bg-[#1D6E3F]/5 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 group transition-all">
               <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Adjust Targets</span>
               <ChevronRight size={14} className="text-[#FF9900] group-hover:translate-x-1 transition-transform" />
            </button>
         </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Update Speed", value: "Realtime", icon: Zap, trend: "Live", color: "#1D6E3F" },
           { label: "Total Impact", value: `₹${((data?.stats.totalImpact || 0) / 1000).toFixed(1)}k`, icon: Target, trend: "Verified", color: "#FF9900" },
           { label: "Conversion", value: `${data?.stats.conversionRate}%`, icon: Activity, trend: "Direct", color: "#10B981" },
           { label: "ESG Rank", value: data?.partner.esgRating || 'B', icon: ShieldCheck, trend: "Status", color: "#6366F1" },
         ].map((item, i) => (
           <motion.div key={i} variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center mb-6 text-gray-400 group-hover:text-gray-900 group-hover:border-[#FF9900]/30 transition-all">
                    <item.icon size={20} style={{ color: item.color }} />
                 </div>
                 <h4 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">{item.value}</h4>
                 <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.trend}</span>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      <motion.div variants={itemVariants} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Strategic Leaderboard</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Impact rankings across our partners</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#FF9900]" />
               <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Global Ranking</span>
            </div>
         </div>
         
         <div className="space-y-6">
            {leaderboard.length > 0 ? leaderboard.map((partner, i) => (
               <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:border-[#1D6E3F]/30 hover:bg-emerald-50/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xl text-[#1D6E3F] group-hover:bg-[#1D6E3F] group-hover:text-white transition-all">
                      {partner.rank}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-gray-900 uppercase tracking-tighter">{partner.name}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{partner.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-[#1D6E3F] tracking-widest">Impact: ₹{(partner.totalImpact / 1000).toFixed(1)}k</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{partner.livesImpacted} Lives</p>
                  </div>
               </div>
            )) : (
              <div className="text-center py-20 p-8 border-2 border-dashed border-gray-100 rounded-3xl">
                <Users className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Leaderboard is empty</p>
                <p className="text-[9px] text-gray-300 font-bold uppercase mt-2">Activity will appear here as impact is generated</p>
              </div>
            )}
         </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-12 p-8 rounded-3xl bg-[#FAFAF8] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                <Award size={32} className="text-[#FF9900]" />
            </div>
            <div>
                <h4 className="text-[15px] font-black text-gray-900 uppercase tracking-tighter">Impact Milestone</h4>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Reach your goals to unlock new partner certificates and benefits.</p>
            </div>
        </div>
        <button className="px-10 h-[52px] bg-white border border-emerald-100 hover:border-[#1D6E3F] text-[#1D6E3F] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex items-center gap-3">
            Upgrade Node <ArrowRight size={14} />
        </button>
      </motion.div>
    </motion.div>
  );
}
