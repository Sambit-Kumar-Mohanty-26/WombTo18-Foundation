import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { partnerApi } from "../../lib/api/partner";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  Mail, 
  Phone,
  Calendar,
  Activity,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";

export function PartnerReferrals() {
  const { id } = useParams();
  const { state } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const partnerId = (state.user as any)?.partnerId;
  const isAuthorized = state.isLoaded && state.user && partnerId;

  useEffect(() => {
    async function fetchReferrals() {
      try {
        if (id) {
          const data = await partnerApi.getReferrals(id);
          setReferrals(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, [id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } as any }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Activity className="h-8 w-8 text-[#1D6E3F] animate-pulse" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Querying Network Nodes...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase underline decoration-[#FF9900]/40 decoration-4 underline-offset-[12px]">Your Referrals</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] pt-3">Tracking your partnership connections</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
             className="h-12 w-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1D6E3F] transition-all"
          >
            {view === 'grid' ? <List size={18} /> : <LayoutGrid size={18} />}
          </button>
          <button className="h-12 px-6 bg-white border border-gray-100 text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Download size={14} className="text-[#1D6E3F]" /> Export Data
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#1D6E3F] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, email or protocol ID..." 
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-black text-gray-900 outline-none focus:border-[#1D6E3F]/30 focus:shadow-lg focus:shadow-[#1D6E3F]/5 transition-all"
          />
        </div>
        <button className="h-[52px] px-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 text-gray-400 hover:text-gray-900 transition-all font-black text-[10px] uppercase tracking-widest">
          <Filter size={14} /> Filter 
        </button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Nodes", value: referrals.length, icon: Users, color: "text-blue-600 bg-blue-50" },
            { label: "Conversion Rate", value: "84%", icon: TrendingUp, color: "text-[#1D6E3F] bg-emerald-50" },
            { label: "Pending Auth", value: referrals.filter(r => r.status === 'PENDING').length, icon: Activity, color: "text-amber-600 bg-amber-50" },
            { label: "Avg Yield", value: "₹4.2k", icon: Mail, color: "text-violet-600 bg-violet-50" },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={20} />
                </div>
                <div>
                   <p className="text-[14px] font-black text-gray-900 tracking-tighter">{stat.value}</p>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </div>
            </motion.div>
          ))}
      </div>

      <AnimatePresence mode="wait">
        {referrals.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-inner"
          >
            <div className="relative inline-block mb-10">
                <div className="absolute inset-0 bg-[#FF9900]/10 blur-3xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-[#FAFAF8] border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <Users size={32} className="text-gray-300" />
                </div>
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Initialize Your Network</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-2 max-w-sm mx-auto">No referral protocols detected in your institutional ledger.</p>
            <button className="mt-8 px-10 py-5 bg-[#1D6E3F] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#1D6E3F]/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto">
               Generate Lead <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : view === 'list' ? (
          <motion.div key="list" variants={itemVariants} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Referral Name</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Contact Info</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Date Joined</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Current Status</th>
                  <th className="px-10 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {referrals.map((r, i) => (
                  <tr key={i} className="group hover:bg-[#FAFAFA] transition-all duration-300">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 flex items-center justify-center text-[#1D6E3F] font-black text-sm group-hover:scale-105 transition-transform shadow-inner uppercase">
                          {r.referredName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-gray-900 tracking-tighter uppercase">{r.referredName || 'Authorized User'}</p>
                          <p className="text-[9px] font-bold text-emerald-600/60 tracking-widest uppercase mt-0.5">Verified Institutional Grade</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400">
                             <Mail size={12} className="text-[#1D6E3F]" />
                             <span className="text-[11px] font-bold text-gray-600">{r.referredEmail}</span>
                          </div>
                          {r.referredPhone && (
                            <div className="flex items-center gap-2 text-gray-400">
                               <Phone size={12} className="text-[#FF9900]" />
                               <span className="text-[10px] font-bold text-gray-400">{r.referredPhone}</span>
                            </div>
                          )}
                       </div>
                    </td>
                    <td className="px-10 py-7">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Calendar size={13} className="text-gray-300" />
                          {new Date(r.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                       </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        r.status === 'DONATED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        r.status === 'JOINED' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {r.status === 'DONATED' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                       <button className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#1D6E3F] hover:border-[#1D6E3F]/30 hover:shadow-lg hover:shadow-[#1D6E3F]/5 transition-all">
                          <ArrowUpRight size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div key="grid" variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {referrals.map((r, i) => (
              <motion.div key={i} variants={itemVariants} className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none ${
                    r.status === 'DONATED' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <div className="flex items-center justify-between mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-[#FAFAF8] border border-gray-50 flex items-center justify-center font-black text-gray-400 group-hover:bg-[#1D6E3F]/5 transition-colors uppercase">
                      {r.referredName?.[0] || 'U'}
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        r.status === 'DONATED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                   }`}>
                      {r.status}
                   </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{r.referredName || 'Authorized User'}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{r.referredEmail}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Raised</p>
                        <p className="text-[14px] font-black text-gray-900 tracking-tighter">₹{r.paymentAmount?.toLocaleString() || '0'}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Joined</p>
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</p>
                     </div>
                  </div>
                </div>
                <button className="mt-8 w-full py-4 bg-gray-50 group-hover:bg-[#1D6E3F] text-gray-400 group-hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-inner group-hover:shadow-xl group-hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                   View Details <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
