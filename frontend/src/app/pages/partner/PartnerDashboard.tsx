import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  Copy, 
  Award, 
  ArrowUpRight,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Heart,
  Activity,
  ShieldCheck,
  CalendarDays
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { partnerApi, PartnerStats } from "../../lib/api/partner";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function PartnerDashboard() {
  const { state } = useAuth();
  const [data, setData] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const partnerId = (state.user as any)?.partnerId;
  const isAuthorized = state.isLoaded && state.user && partnerId;
  const referralLink = `${window.location.origin}/donate?ref=${partnerId || ""}`;

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await partnerApi.getDashboard(partnerId);
        if (statsRes) setData(statsRes);
      } catch (err) {
        console.warn("Using fallback/mock data for dashboard.");
      } finally {
        setTimeout(() => setLoading(false), 600); 
      }
    }
    loadData();
  }, [partnerId]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard");
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
         <motion.div 
           animate={{ rotate: 360 }} 
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="w-10 h-10 border-[3px] border-emerald-100 border-t-[#1D6E3F] rounded-full" 
         />
         <div className="text-center">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Authenticating Node</p>
            <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest">{partnerId}</p>
         </div>
       </div>
     );
  }

  const displayStats = data?.stats || { totalReferrals: 0, referralDonations: 0, totalSponsored: 0, conversionRate: 0, avgYield: 0, pendingAuth: 0 };
  const displayReferrals = data?.recentReferrals || [];
  const displayPartner = data?.partner || { organizationName: (state.user as any)?.organizationName || "Strategic Partner", totalSponsored: 0, status: 'BRONZE', esgRating: 'B', partnerScore: 0, trustScore: 100, livesImpacted: 0 };
  const displayTrends = data?.trends || { monthlyImpact: [0,0,0,0,0,0], labels: ['','','','','',''] };

  const chartData = displayTrends.labels.map((label, i) => ({
    month: label,
    impact: displayTrends.monthlyImpact[i]
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } }
  };

  if (!isAuthorized) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-end justify-between gap-6 pb-2 border-b border-gray-100">
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF9900]" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Partner Dashboard</span>
            </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none">
            Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D6E3F] to-emerald-500 underline decoration-[#FF9900]/30 underline-offset-8">Overview</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center gap-2">
                <CalendarDays size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Q2 FY2026</span>
            </div>
        </div>
      </motion.div>

      {/*HERO GRID*/}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Welcome Card*/}
        <motion.div variants={itemVariants} className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-white border border-emerald-100 shadow-[0_20px_50px_-20px_rgba(29,110,63,0.12)] p-10 group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#ede9fe_0%,_transparent_70%)] opacity-30 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_#f0fdf4_0%,_transparent_70%)] opacity-50 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1D6E3F] shadow-inner font-black text-xl">
                    {displayPartner.organizationName[0]}
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                        Welcome back,<br/>
                        <span className="text-[#1D6E3F]">{displayPartner.organizationName}</span>
                    </h2>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm">
                        You're logged in to your partner portal. See your live impact metrics and activity below.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={copyLink}
                        className="h-[52px] px-8 bg-[#1D6E3F] hover:bg-[#155e33] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                        <Copy size={16} /> Referral Link
                    </button>
                    <button className="h-[52px] w-[52px] bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#FF9900] hover:border-[#FF9900]/30 transition-all shadow-sm">
                        <Activity size={18} />
                    </button>
                </div>
             </div>

             <div className="flex flex-col items-center justify-center bg-[#FAFAF8] rounded-[2rem] p-8 border border-gray-100 shadow-inner group-hover:border-emerald-200/50 transition-colors">
                <div className="p-4 bg-white rounded-2xl shadow-xl border border-emerald-50 mb-6">
                    <QRCodeSVG value={referralLink} size={140} level="H" includeMargin={true} />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Partner ID</p>
                    <p className="text-sm font-black text-[#1D6E3F] tabular-nums tracking-widest">{partnerId}</p>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Impact Score */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-[#FFFFFF] rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#FF9900]/[0.02] group-hover:bg-[#FF9900]/[0.04] transition-colors" />
            <div className="relative z-10 space-y-6 w-full">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-[#FF9900]/20 blur-3xl animate-pulse" />
                    <div className="relative w-28 h-28 rounded-full border-4 border-emerald-50 bg-white flex flex-col items-center justify-center shadow-2xl">
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">{displayPartner.partnerScore || 0}</span>
                        <span className="text-[8px] font-black text-[#FF9900] uppercase tracking-widest mt-0.5">Partner Score</span>
                    </div>
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{displayPartner.status}</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Verified Partner</p>
                </div>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-center gap-6">
                    <div className="text-center">
                        <p className="text-lg font-black text-gray-900">{displayPartner.livesImpacted || 0}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Lives</p>
                    </div>
                    <div className="h-4 w-px bg-gray-100" />
                    <div className="text-center">
                        <p className="text-lg font-black text-gray-900">{displayPartner.esgRating}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ESG</p>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      {/*METRICS GRID*/}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Partner Referrals", value: displayStats.totalReferrals.toLocaleString(), icon: Users, accent: "from-blue-600 to-indigo-600" },
          { label: "Community Funds", value: `₹${(displayStats.referralDonations / 1000).toFixed(1)}k`, icon: TrendingUp, accent: "from-[#1D6E3F] to-emerald-600" },
          { label: "Conversion Rate", value: `${displayStats.conversionRate}%`, icon: Award, accent: "from-[#FF9900] to-orange-500" },
          { label: "Trust Score", value: `${displayPartner.trustScore}%`, icon: ShieldCheck, accent: "from-violet-600 to-fuchsia-600" },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <div className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accent}`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.accent} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <stat.icon size={20} className="text-white" />
                </div>
                <h4 className="text-3xl font-black text-gray-900 tracking-tighter mb-1 select-none">{stat.value}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/*ANALYTICS ROW */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Trajectory */}
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Impact Progress</h3>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Your growth over time</p>
            </div>
            <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
              {['6M', '1Y', 'ALL'].map((p) => (
                <button key={p} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${p === '1Y' ? 'bg-[#1D6E3F] text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}>
                    {p}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="impactEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D6E3F" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1D6E3F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 900, fill: '#9CA3AF', letterSpacing: '0.1em'}} 
                  dy={15}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: '1px solid #F3F4F6', 
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                    padding: '12px 18px',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }} 
                  cursor={{stroke: '#1D6E3F', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="impact" 
                  stroke="#1D6E3F" 
                  strokeWidth={3} 
                  fill="url(#impactEmerald)" 
                  activeDot={{ r: 6, fill: '#1D6E3F', stroke: '#fff', strokeWidth: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Protocols */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex-1">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-8">Quick Actions</h3>
            <div className="space-y-4">
              {[
                { label: "Download Impact Report", desc: "Get a summary of your work", icon: Target, color: "bg-emerald-50 text-[#1D6E3F]" },
                { label: "Check Donations", desc: "See your recent funds raised", icon: ShieldCheck, color: "bg-violet-50 text-violet-600" },
                { label: "Get Tax Receipts", desc: "Download official 80G receipts", icon: Award, color: "bg-amber-50 text-[#FF9900]" },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center gap-5 p-5 rounded-2xl border border-gray-50 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all text-left group">
                  <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-black text-gray-900 uppercase tracking-tighter">{action.label}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{action.desc}</p>
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1D6E3F] to-[#155e33] p-8 text-white shadow-2xl shadow-emerald-900/20 group cursor-pointer">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Heart size={24} className="text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-black uppercase tracking-tighter mb-1 leading-none">Sponsor a Program</h4>
                <p className="text-[10px] text-emerald-200/70 font-bold uppercase tracking-widest leading-relaxed">Increase your support today.</p>
              </div>
              <Zap size={20} className="text-[#FF9900]" />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/*ACTIVITY FEED */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Recent Activity</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live updates on your impact</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Sync Active
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Partner Name</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Date</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Amount</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayReferrals.length > 0 ? displayReferrals.slice(0, 5).map((r: any, i: number) => (
                <tr key={i} className="group hover:bg-emerald-50/30 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-400 text-[11px] group-hover:bg-white group-hover:text-emerald-600 transition-all border border-transparent group-hover:border-emerald-100">
                        {(r.email || r.donorEmail || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[13px] font-black text-gray-900 uppercase tracking-tighter">{(r.email || r.donorEmail || 'User').split('@')[0]}</span>
                        <p className="text-[10px] text-gray-400 font-bold tracking-tight uppercase mt-0.5">{r.email || r.donorEmail || 'Verified Partner'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    {new Date(r.date || r.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year:'numeric'})}
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[15px] font-black text-gray-900 tracking-tighter">₹{(r.amount || r.paymentAmount || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      (r.status || '').toLowerCase() === 'verified' || r.status === 'DONATED' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {(r.status || '').toLowerCase() === 'verified' || r.status === 'DONATED' ? 'PROCESSED' : 'AUTHORIZED'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <Activity size={48} strokeWidth={1} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">No Recent Activity</p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase mt-2">Start sharing your link to see impact tracking</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
