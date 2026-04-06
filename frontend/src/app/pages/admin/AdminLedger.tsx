import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  ChevronDown,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown
} from "lucide-react";
import { Link } from "react-router";
import { client } from "../../lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLedger() {
  const [donations, setDonations] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    programId: "",
    donorSearch: "",
    status: "ALL"
  });

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const data = await client.get<any[]>(`/admin/donations?${query}`);
      setDonations(data || []);
    } catch (err) {
      console.error("Error fetching ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDonations();
    
    // Fetch programs for filter
    client.get<any[]>("/admin/programs")
      .then(setPrograms)
      .catch(console.error);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonations();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESS': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'FAILED': return "bg-rose-50 text-rose-600 border-rose-100";
      case 'REJECTED': return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle2 size={12} />;
      case 'FAILED': return <XCircle size={12} />;
      case 'REJECTED': return <XCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const totalAmount = donations
    .filter(d => d.status === 'SUCCESS')
    .reduce((sum, d) => sum + d.amount, 0);

  const failedCount = donations.filter(d => d.status === 'FAILED' || d.status === 'REJECTED').length;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors mb-4 group font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
          </Link>
          <h1 className="text-4xl font-black text-black tracking-tighter">
            Transaction <span className="text-slate-400">Ledger</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-black transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Ledger Volume", value: `₹${totalAmount.toLocaleString()}`, sub: "Successful only", icon: Coins, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Total Rows", value: donations.length, sub: "Filtered records", icon: ArrowUpDown, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "Attempt Losses", value: failedCount, sub: "Failed or Rejected", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={stat.color} size={18} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-2xl font-black text-black tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Top Bar Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm overflow-hidden">
        <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px] space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Search Donor</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={16} />
              <input 
                type="text" 
                name="donorSearch"
                value={filters.donorSearch}
                onChange={handleFilterChange}
                placeholder="Search by name or email..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Program</label>
            <select 
              name="programId"
              value={filters.programId}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-100 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Programs</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-100 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Start Date</label>
            <input 
              type="date" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-slate-100 outline-none transition-all"
            />
          </div>

          <button type="submit" className="px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-200 hover:scale-105 transition-all active:scale-95">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Donor Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Program</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : donations.length > 0 ? (
                donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-black">{d.donor?.name || "Anonymous"}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{d.donor?.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-600">{d.program?.name || "General Fund"}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-black">₹{d.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusStyle(d.status)}`}>
                        {getStatusIcon(d.status)}
                        {d.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Filter className="mx-auto h-12 w-12 text-slate-100 mb-4" strokeWidth={1} />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No transactions found</p>
                    <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-wide">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
