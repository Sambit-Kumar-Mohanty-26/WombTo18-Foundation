import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  Trophy, Loader2, ChevronLeft, ChevronRight, Calendar, 
  TrendingUp, Star, Filter
} from "lucide-react";
import { useParams } from "react-router";
import { client } from "../../lib/api/client";

interface LeaderboardEntry {
  rank: number;
  name: string;
  donorId: string;
  totalDonated: number;
  tier: string;
}

interface MetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function DonorLeaderboard() {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all");
  const [page, setPage] = useState(1);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await client.get<{ data: LeaderboardEntry[]; meta: MetaData }>(
        `/donors/leaderboard?page=${page}&limit=10&timeframe=${timeframe}`
      );
      setLeaderboard(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [page, timeframe]);

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    setPage(1); // Reset to first page on filter change
  };

  const timeframes = [
    { id: "all", label: "All Time", icon: Star },
    { id: "year", label: "This Year", icon: Calendar },
    { id: "month", label: "This Month", icon: TrendingUp },
    { id: "recent", label: "Recent", icon: Filter },
  ];

  return (
    <div className="space-y-10 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold px-3 py-1 mb-3 uppercase tracking-widest text-[10px] shadow-sm">
            Global Rankings
          </Badge>
          <h1 className="text-3xl sm:text-[2.5rem] text-gray-900 font-black tracking-tight leading-none mb-2">
            Supporter <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Leaderboard</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Celebrating our top contributors and their incredible impact.
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {timeframes.map((tf) => (
          <Button
            key={tf.id}
            variant={timeframe === tf.id ? "default" : "outline"}
            onClick={() => handleTimeframeChange(tf.id)}
            className={`rounded-xl px-6 h-11 font-bold transition-all duration-300 ${
              timeframe === tf.id 
                ? "bg-gray-900 text-white shadow-lg shadow-gray-200" 
                : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <tf.icon className={`h-4 w-4 mr-2 ${timeframe === tf.id ? "text-amber-400" : "text-gray-400"}`} />
            {tf.label}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] bg-white rounded-[1.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Rank</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Donor</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Contribution</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.tr 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Updating Standings...</p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : leaderboard.length > 0 ? (
                    leaderboard.map((entry, index) => (
                      <motion.tr 
                        key={entry.donorId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform ${
                            entry.rank === 1 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white' : 
                            entry.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : 
                            entry.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' : 
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {entry.rank}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div>
                            <p className="text-[15px] font-bold text-gray-900 leading-none mb-1">{entry.name || "Anonymous Supporter"}</p>
                            <p className="text-[11px] text-gray-400 font-mono tracking-wider">{entry.donorId}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <p className="text-[15px] font-black text-[#1D6E3F]">₹{entry.totalDonated.toLocaleString("en-IN")}</p>
                          <div className="flex justify-end mt-1">
                            <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-emerald-400" 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (entry.totalDonated / (leaderboard[0]?.totalDonated || 1)) * 100)}%` }} 
                                transition={{ duration: 1 }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Badge className={`uppercase tracking-widest text-[9px] px-2 border-none shadow-sm ${
                            entry.tier === 'CHAMPION' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' :
                            entry.tier === 'PATRON' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white' :
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {entry.tier}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr key="empty">
                      <td colSpan={4} className="py-24 text-center text-gray-400 font-medium">
                        No donors found for this timeframe.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Showing {((page - 1) * 10) + 1} - {Math.min(page * 10, meta.total)} of {meta.total} Supporters
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => setPage(p => p - 1)}
              className="rounded-xl h-10 w-10 p-0 border-gray-100 hover:bg-gray-50 text-gray-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(meta.totalPages)].map((_, i) => {
                const p = i + 1;
                // Simple logic to show current, first, last, and neighbors
                if (p === 1 || p === meta.totalPages || (p >= page - 1 && p <= page + 1)) {
                  return (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "ghost"}
                      onClick={() => setPage(p)}
                      className={`h-10 w-10 rounded-xl text-xs font-black ${
                        page === p ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </Button>
                  );
                } else if (p === page - 2 || p === page + 2) {
                  return <span key={p} className="text-gray-300 px-1">...</span>;
                }
                return null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === meta.totalPages || loading}
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl h-10 w-10 p-0 border-gray-100 hover:bg-gray-50 text-gray-500"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
