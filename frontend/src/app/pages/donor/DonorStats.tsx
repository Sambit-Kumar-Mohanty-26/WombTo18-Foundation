import { motion } from "motion/react";
import { TrendingUp, Award, Calendar, Droplets, Target, ShieldCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from "../../context/AuthContext";

const donationData = [
  { name: '2022', amount: 5000 },
  { name: '2023', amount: 15000 },
  { name: '2024', amount: 28000 },
  { name: '2025', amount: 45000 },
  { name: '2026', amount: 62000 },
];

export function DonorStats() {
  const { state } = useAuth();
  const name = state.user?.name || "Donor";

  const totalDonated = 155000;
  const livesImpacted = Math.floor(totalDonated / 1200); // Rough metric logic

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Your Impact Journey</h1>
          <p className="text-gray-500 font-medium">See the difference you've made, {name.split(' ')[0]}.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Contribution', value: `₹${(totalDonated/100000).toFixed(1)}L`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Lives Impacted', value: `${livesImpacted}+`, icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Giving Streak', value: '4 Yrs', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-bl-full -z-10 transition-transform group-hover:scale-110 opacity-50`} />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              <p className="text-sm font-bold text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Donation History</h3>
            <span className="px-3 py-1 bg-[length:200%_auto] font-bold text-xs bg-gradient-to-r from-emerald-50 to-green-50 text-[var(--womb-forest)] rounded-xl border border-emerald-100 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Growth
            </span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--womb-forest)] rounded-3xl p-6 text-white text-center flex flex-col justify-center items-center relative overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <Target className="h-16 w-16 mb-4 text-emerald-300" />
          <h3 className="text-xl font-black mb-2">Next Milestone</h3>
          <p className="text-emerald-100 text-sm mb-6 max-w-[200px]">
            You're remarkably close to reaching Patron status!
          </p>
          <div className="w-full bg-black/20 rounded-full h-3 mb-2 backdrop-blur-sm border border-white/10 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full w-[85%]" />
          </div>
          <p className="text-xs font-bold text-emerald-200">₹15,000 away</p>
          
          <button className="mt-8 px-8 py-3 bg-white text-[var(--womb-forest)] rounded-xl font-black hover:bg-emerald-50 transition-colors hover:scale-105 active:scale-95 duration-200 w-full shadow-lg">
            Donate Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
