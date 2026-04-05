import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Coins, Gift, Users, Tent, Star, Zap, Loader2, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "../../components/ui/pagination";

const ITEMS_PER_PAGE = 4;

export function VolunteerCoins() {
  const { state } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const volId = state.user?.volunteerId || state.user?.identifier || "";

  useEffect(() => {
    if (!volId) return;
    Promise.all([
      client.get<any[]>(`/volunteers/coins/${encodeURIComponent(volId)}`),
      client.get<any>(`/coins/balance/${encodeURIComponent(volId)}`),
    ]).then(([txns, bal]) => {
      setTransactions(txns || []);
      setBalance(bal);
    }).catch(console.error).finally(() => setLoading(false));
  }, [volId]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  const typeIcons: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    FIRST_LOGIN: { icon: Gift, label: "Welcome Bonus", color: "text-purple-600", bg: "bg-purple-50" },
    REFERRAL: { icon: Users, label: "Referral Bonus", color: "text-blue-600", bg: "bg-blue-50" },
    CAMP_JOIN: { icon: Tent, label: "Camp Join", color: "text-emerald-600", bg: "bg-emerald-50" },
    CAMP_ACTIVE: { icon: Star, label: "Active Participation", color: "text-amber-600", bg: "bg-amber-50" },
    BONUS: { icon: Zap, label: "Bonus", color: "text-orange-600", bg: "bg-orange-50" },
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-amber-950 tracking-tight">My Coins</h1>
        <p className="text-amber-700/50 text-sm font-bold mt-1">Your complete coin transaction history</p>
      </div>

      {/* Balance Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl col-span-1 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <Coins className="h-8 w-8 text-amber-200 mb-3" />
            <p className="text-3xl font-black">{balance?.totalCoins || 0}</p>
            <p className="text-amber-100/60 text-xs font-bold uppercase tracking-widest mt-1">Total Balance</p>
          </CardContent>
        </Card>
        {(balance?.breakdown || []).slice(0, 3).map((b: any, i: number) => {
          const cfg = typeIcons[b.type] || typeIcons.BONUS;
          return (
            <Card key={i} className="border-none shadow-sm bg-white rounded-2xl">
              <CardContent className="p-5">
                <div className={`h-9 w-9 rounded-xl ${cfg.bg} flex items-center justify-center mb-3`}>
                  <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <p className="text-xl font-black text-gray-900">{b.totalEarned}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cfg.label} ({b.count}x)</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transaction Log */}
      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="font-black flex items-center gap-2"><TrendingUp className="h-5 w-5 text-amber-500" /> Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {paginatedTransactions.length > 0 ? paginatedTransactions.map((tx: any, i: number) => {
              const cfg = typeIcons[tx.type] || typeIcons.BONUS;
              const Icon = cfg.icon;
              return (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{tx.description}</p>
                      <p className="text-[10px] text-gray-400">{cfg.label} • {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                  <Badge className={`text-sm font-black ${tx.amount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </Badge>
                </div>
              );
            }) : (
              <div className="py-16 text-center text-gray-400">
                <Coins className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                <p className="font-bold">No coin transactions yet</p>
                <p className="text-xs mt-1">Refer people, join camps, and participate actively to earn coins!</p>
              </div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-50">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={`cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-xs font-bold text-gray-400 px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={`cursor-pointer ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

