import { motion } from "motion/react";
import { Link2, Users, ArrowUpRight, Copy, CheckCircle2, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export function PartnerReferrals() {
  const { state } = useAuth();
  const partnerId = state.user?.partnerId || state.user?.donorId || 'PARTNER';

  const [copied, setCopied] = useState(false);

  const referralLink = `https://wombto18.org/donate?ref=${partnerId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Corporate Referral Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const referrals = [
    { id: '1', name: 'Employee A', amount: 5000, date: '2026-03-31', status: 'COMPLETED' },
    { id: '2', name: 'Partner Org B', amount: 25000, date: '2026-03-30', status: 'COMPLETED' },
    { id: '3', name: 'Employee C', amount: null, date: '2026-03-29', status: 'PENDING' },
  ];

  const totalImpact = referrals.reduce((sum, r) => sum + (r.amount || 0), 0);
  const successRate = Math.round((referrals.filter(r => r.status === 'COMPLETED').length / referrals.length) * 100);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Corporate Referrals</h1>
          <p className="text-gray-500 font-medium">Drive employee giving and amplify your corporate CSR impact.</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Users, label: 'Total Referrals', value: referrals.length, trend: '+12% this month' },
          { icon: ArrowUpRight, label: 'Capital Raised', value: `₹${totalImpact.toLocaleString()}`, trend: 'Matched by Foundation' },
          { icon: CheckCircle2, label: 'Success Rate', value: `${successRate}%`, trend: 'Conversion rate' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            <p className="text-sm font-bold text-gray-500 mt-1">{stat.label}</p>
            <p className="text-xs font-semibold text-sky-600 mt-2">{stat.trend}</p>
          </motion.div>
        )})}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-gradient-to-br from-sky-600 to-blue-800 rounded-3xl p-6 text-white text-center flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <QrCode className="h-16 w-16 mb-4 text-sky-200" />
          <h3 className="text-xl font-black mb-2">Your CSR Code</h3>
          <p className="text-sky-100 text-sm mb-6">Share this code internally. Donations made through this link count towards your CSR goal.</p>
          
          <div className="bg-black/20 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-3 w-full border border-white/10">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="bg-transparent border-none text-sky-100 text-sm w-full outline-none font-mono"
            />
            <button 
              onClick={copyToClipboard}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors shrink-0"
            >
              {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <Copy className="h-5 w-5 text-sky-200" />}
            </button>
          </div>
        </motion.div>

        {/* List Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Employee Pledges</h3>
          </div>

          <div className="space-y-4">
            {referrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-sky-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ref.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{ref.name}</h4>
                    <p className="text-xs text-gray-500">{new Date(ref.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">{ref.amount ? `₹${ref.amount.toLocaleString()}` : 'Pending'}</p>
                  <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    ref.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ref.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
