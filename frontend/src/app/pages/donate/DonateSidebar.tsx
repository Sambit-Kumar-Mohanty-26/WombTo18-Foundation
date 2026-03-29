import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, Users as UsersIcon } from "lucide-react";
import { WHY_SUPPORT_ITEMS } from "./donateData";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";

interface DonorStat {
  name: string;
  amount: number;
  createdAt: string;
}

interface WebStats {
  childrenRegistered: number;
  treesPlanted: number;
  schoolsOnboarded: number;
  monthlyRaised: number;
  activePrograms: number;
  monthlyGoal: number;
  recentDonors: DonorStat[];
}

export function DonateSidebar({ activeColor = "#1D6E3F" }: { activeColor?: string }) {
  const [stats, setStats] = useState<WebStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/donations/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load donation stats:", err);
        setLoading(false);
      });
  }, []);

  const goalPercent = stats ? Math.min(100, Math.round((stats.monthlyRaised / stats.monthlyGoal) * 100)) : 0;

  function getTimeAgo(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  function formatAmount(amount: number) {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  }

  return (
    <div className="space-y-5 lg:sticky lg:top-24">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="h-1 w-full bg-gradient-to-r from-[var(--womb-forest)] via-[var(--journey-saffron)] to-[var(--future-sky)]" />
        <div className="p-5">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
            💚 Why Your Support Matters ✨
          </h3>
          <div className="space-y-3">
            {WHY_SUPPORT_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-3 group cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--womb-forest)]/8 to-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm">{item.icon}</span>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed pt-0.5 group-hover:text-gray-800 transition-colors">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--womb-forest)]" /> Real Impact So Far
          </h3>
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--womb-forest)] bg-[var(--womb-forest)]/8 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--womb-forest)] animate-pulse" /> Live
          </span>
        </div>
        
        {loading || !stats ? (
          <div className="grid grid-cols-2 gap-2">
             {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse border border-gray-50" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <StatsCard icon="👶" value={`${stats.childrenRegistered.toLocaleString()}+`} label="Children Registered" color="#F59E0B" />
            <StatsCard icon="🌲" value={`${stats.treesPlanted.toLocaleString()}+`} label="Trees Planted" color="#10B981" />
            <StatsCard icon="🏫" value={`${stats.schoolsOnboarded}+`} label="Schools Onboarded" color="#3B82F6" />
            <StatsCard icon="💰" value={`₹${formatAmount(stats.monthlyRaised).replace('₹', '')}`} label="Raised This Month" color="#f97316" />
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-sm font-black text-gray-900 mb-3.5 flex items-center gap-2">🎯 Monthly Goal</h3>
        
        {loading || !stats ? (
           <div className="space-y-2">
             <div className="flex justify-between"><div className="w-20 h-6 bg-gray-200 animate-pulse rounded" /><div className="w-16 h-4 bg-gray-100 animate-pulse rounded" /></div>
             <div className="w-full h-2.5 bg-gray-100 animate-pulse rounded-full" />
             <div className="w-24 h-3 bg-gray-100 animate-pulse rounded mt-1" />
           </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-lg font-black" style={{ color: activeColor }}>₹{stats.monthlyRaised.toLocaleString("en-IN")}</span>
              <span className="text-xs text-gray-400">/ ₹{stats.monthlyGoal.toLocaleString("en-IN")}</span>
            </div>
            <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goalPercent}%` }}
                transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${activeColor}, ${activeColor}99)` }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${goalPercent}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", backgroundSize: "200% 100%" }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 2 }}
              />
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <span className="text-xs font-black" style={{ color: activeColor }}>{goalPercent}%</span>
              <span className="text-[10px] text-gray-400">of monthly goal reached</span>
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-[var(--journey-saffron)]" /> Recent Donors
          </h3>
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--womb-forest)] bg-[var(--womb-forest)]/8 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--womb-forest)] animate-pulse" /> Live
          </span>
        </div>
        
        {loading || !stats ? (
           <div className="space-y-3">
             {[1,2,3].map(i => (
               <div key={i} className="flex gap-3 items-center">
                 <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full shrink-0" />
                 <div className="flex-1 space-y-1"><div className="w-24 h-3 bg-gray-200 animate-pulse rounded" /><div className="w-16 h-2 bg-gray-100 animate-pulse rounded" /></div>
               </div>
             ))}
           </div>
        ) : (
          <div className="space-y-2.5">
            {stats.recentDonors.map((donor, i) => {
              const initial = donor.name.charAt(0).toUpperCase();
              const tagColor = ['#1D6E3F', '#F59E0B', '#3B82F6', '#8B5CF6'][i % 4];
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-default"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ background: tagColor }}>
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">{donor.name}</p>
                    <p className="text-[10px] text-gray-400">{getTimeAgo(donor.createdAt)}</p>
                  </div>
                  <span className="text-[13px] font-black" style={{ color: tagColor }}>{formatAmount(donor.amount)}</span>
                </motion.div>
              );
            })}
          </div>
        )}
        <button className="w-full mt-3 pt-3 border-t border-gray-100 text-center text-[12px] font-bold text-[var(--womb-forest)] hover:text-[var(--journey-saffron)] transition-colors flex items-center justify-center gap-1 group">
          View All Donors <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center justify-center gap-3 py-3"
      >
        {["🔒 Razorpay Secured", "📄 80G Available", "🏅 Registered NGO"].map((badge, i) => (
          <span key={i} className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
            {badge}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function StatsCard({ icon, value, label, color }: { icon: string, value: string, label: string, color: string }) {
  return (
    <div
      className="group relative p-3 rounded-xl border border-gray-50 hover:border-gray-100 hover:shadow-sm transition-all duration-300 cursor-default"
      style={{ background: `${color}04` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-base font-black" style={{ color }}>{value}</span>
      </div>
      <p className="text-[10px] text-gray-400 font-semibold leading-tight">{label}</p>
    </div>
  )
}
