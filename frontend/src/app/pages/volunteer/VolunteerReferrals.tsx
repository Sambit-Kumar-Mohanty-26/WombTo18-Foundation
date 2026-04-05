import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Users, Copy, Check, Loader2, QrCode, TrendingUp, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "../../components/ui/pagination";

const ITEMS_PER_PAGE = 4;

export function VolunteerReferrals() {
  const { state } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const volId = state.user?.volunteerId || state.user?.identifier || "";
  const referralLink = `${window.location.origin}/donate?ref=${volId}&type=VOLUNTEER`;

  useEffect(() => {
    if (!volId) return;
    client.get<any[]>(`/volunteers/referrals/${encodeURIComponent(volId)}`)
      .then(setReferrals).catch(console.error).finally(() => setLoading(false));
  }, [volId]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  const totalDonated = referrals.filter(r => r.status === "DONATED").reduce((s, r) => s + (r.paymentAmount || 0), 0);
  const totalCoinsEarned = referrals.reduce((s, r) => s + (r.coinsAwarded || 0), 0);

  const totalPages = Math.ceil(referrals.length / ITEMS_PER_PAGE);
  const paginatedReferrals = referrals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-amber-950 tracking-tight">Referrals</h1>
        <p className="text-amber-700/50 text-sm font-bold mt-1">Track who you've referred and how much they've contributed</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Referrals", value: referrals.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Raised", value: `₹${totalDonated.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Coins Earned", value: totalCoinsEarned, icon: ArrowUpRight, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR + Link */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white p-3 rounded-2xl shadow-md">
            <QRCodeCanvas value={referralLink} size={120} level="H" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-amber-900 mb-2 flex items-center gap-2 justify-center sm:justify-start">
              <QrCode className="h-5 w-5" /> Share Your Referral
            </h3>
            <p className="text-sm text-amber-700/60 mb-4">When someone donates using your link, you earn coins based on their donation amount!</p>
            <div className="flex gap-2">
              <Button onClick={copyLink} className="bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral List */}
      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="font-black">All Referrals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {paginatedReferrals.length > 0 ? paginatedReferrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-black">
                    {(r.referredName || r.referredEmail || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{r.referredName || "Unknown"}</p>
                    <p className="text-[10px] text-gray-400">{r.referredEmail} • {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-[10px] font-bold ${r.status === 'DONATED' ? 'bg-emerald-50 text-emerald-700' : r.status === 'JOINED' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.status}
                  </Badge>
                  {r.paymentAmount > 0 && <p className="text-xs font-black text-emerald-600 mt-1">₹{r.paymentAmount.toLocaleString()} • +{r.coinsAwarded} coins</p>}
                </div>
              </div>
            )) : (
              <div className="py-16 text-center text-gray-400">
                <Users className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                <p className="font-bold">No referrals yet</p>
                <p className="text-xs mt-1">Share your QR code to get started!</p>
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

