import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Download, ChevronLeft, Loader2, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useDonorData } from "../../lib/useDonorData";
import { useAuth } from "../../context/AuthContext";

export function DonorDonations() {
  const [search, setSearch] = useState("");
  const { state } = useAuth();
  const { donations, loading, totalDonated, donationCount, avgDonation } = useDonorData();

  const displayName = state.user?.name || state.user?.identifier || "Donor";

  const filtered = donations.filter(d =>
    (d.program ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (d.date ?? "").includes(search)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#1D6E3F]" />
        <p className="text-gray-500 font-medium tracking-tight">Syncing Financial Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 w-full max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <Link to="/dashboard" className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1D6E3F] mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Overview
          </Link>
          <h1 className="text-3xl sm:text-[2.5rem] font-black text-gray-900 tracking-tight leading-none mb-2">
            Donation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D6E3F] to-emerald-500">History</span>
          </h1>
          <p className="text-gray-500 font-medium">Verified contributions securely logged for <span className="font-bold text-gray-800">{displayName}</span>.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline" size="lg"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold rounded-xl h-12 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 outline-none"
            onClick={() => {
              if (donations.length === 0) { toast.info("No donations to export."); return; }
              const csv = ["Date,Amount,Program,Status", ...donations.map(d => `${d.date},${d.amount},${d.program},${d.status}`)].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "wombto18_donations.csv"; a.click();
              toast.success("Export initiated", { description: "Your CSV record is downloading." });
            }}
          >
            <Download className="h-4 w-4 mr-2 text-gray-400" /> Export CSV Record
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-white border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 rounded-[1.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
               <Heart className="h-20 w-20 -mr-6 -mt-6 rotate-12 text-[#1D6E3F]" />
            </div>
            <CardContent className="p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Total Donated</p>
              <p className="text-3xl sm:text-4xl text-gray-900 font-black tracking-tight drop-shadow-sm">₹{totalDonated.toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-white border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 rounded-[1.5rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
               <ArrowRight className="h-20 w-20 -mr-6 -mt-6 rotate-12 text-blue-600" />
            </div>
            <CardContent className="p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Transacted Events</p>
              <p className="text-3xl sm:text-4xl text-gray-900 font-black tracking-tight drop-shadow-sm">{donationCount}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-[#1D6E3F]/5 to-transparent border-emerald-100/50 shadow-[0_10px_30px_-15px_rgba(29,110,63,0.1)] hover:shadow-[0_15px_40px_-15px_rgba(29,110,63,0.15)] transition-shadow duration-500 rounded-[1.5rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
               <CheckCircle2 className="h-20 w-20 -mr-6 -mt-6 rotate-12 text-emerald-600" />
            </div>
            <CardContent className="p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1D6E3F]/60 mb-2">Avg. Contribution</p>
              <p className="text-3xl sm:text-4xl text-[#1D6E3F] font-black tracking-tight drop-shadow-sm">
                {avgDonation > 0 ? `₹${avgDonation.toLocaleString("en-IN")}` : "—"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search & Grid list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="space-y-4">
        {donations.length > 0 && (
          <div className="relative max-w-md w-full mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by program, initiative, or date..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-14 rounded-2xl shadow-sm text-base font-medium focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 outline-none"
            />
          </div>
        )}

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden">
          {donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
              <div className="relative z-10 flex flex-col items-center">
                 <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-gray-100">
                    <Heart className="h-10 w-10 text-gray-300" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No contributions yet</h3>
                 <p className="text-gray-500 font-medium max-w-sm mb-8">Your verified impact journey starts with your first donation. All history will be permanently logged here.</p>
                 <Link to="/donate">
                   <Button size="lg" className="bg-[#1D6E3F] hover:bg-emerald-700 text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1">Launch First Impact</Button>
                 </Link>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-50 bg-gray-50/50 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
                 <div className="col-span-3">Transfer Date</div>
                 <div className="col-span-2">Value</div>
                 <div className="col-span-4">Designated Program</div>
                 <div className="col-span-2">Ledger Status</div>
                 <div className="col-span-1 text-right">Receipt</div>
              </div>
              <div className="divide-y divide-gray-50/80">
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 text-center text-gray-400 font-medium tracking-tight">
                       No records match your query "{search}"
                    </motion.div>
                  ) : filtered.map((d, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-[#fafaf8] transition-colors group cursor-default"
                    >
                      <div className="col-span-3">
                         <span className="text-sm font-bold text-gray-600">{d.date}</span>
                      </div>
                      <div className="col-span-2">
                         <span className="text-base font-black text-gray-900 tracking-tight">₹{d.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="col-span-4">
                         <span className="text-sm font-semibold text-gray-800">{d.program}</span>
                      </div>
                      <div className="col-span-2">
                         <Badge className="bg-emerald-50 text-[#1D6E3F] hover:bg-emerald-100 border-none px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm">
                           {d.status}
                         </Badge>
                      </div>
                      <div className="col-span-1 text-right">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={() => toast.success("Download started", { description: `Retrieving 80G certificate for ${d.date}` })}
                           className="text-gray-400 hover:text-[#1D6E3F] hover:bg-[#1D6E3F]/5 rounded-xl h-9 w-9 p-0 inline-flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all outline-none"
                         >
                           <Download className="h-4 w-4" />
                         </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
