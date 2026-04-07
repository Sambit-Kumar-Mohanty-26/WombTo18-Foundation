import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Coins, Users, Tent, Trophy, Zap, Copy, Check, ArrowRight, Loader2,
  TrendingUp, QrCode, Star, Gift, Award
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router";
import { toast } from "sonner";

interface VolDashData {
  volunteer: any;
  stats: { totalCoins: number; totalReferrals: number; totalReferralDonations: number; campsAttended: number; leaderboardRank: number };
  recentReferrals: any[];
  recentTransactions: any[];
  recentCamps: any[];
}

export function VolunteerDashboardHome() {
  const { state } = useAuth();
  const [data, setData] = useState<VolDashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loginCoinClaimed, setLoginCoinClaimed] = useState(false);

  // Use volunteerId if available, otherwise fall back to email (backend accepts both)
  const volId = state.user?.volunteerId || state.user?.identifier || "";
  const referralLink = `${window.location.origin}/donate?ref=${volId}&type=VOLUNTEER`;

  useEffect(() => {
    if (!volId) return;
    (async () => {
      try {
        const res = await client.get<VolDashData>(`/volunteers/dashboard?volunteerId=${encodeURIComponent(volId)}`);
        setData(res);
      } catch (e: any) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [volId]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <p className="text-amber-700/60 font-bold text-sm">Loading your volunteer hub...</p>
      </div>
    );
  }

  const stats = data?.stats || { totalCoins: 0, totalReferrals: 0, totalReferralDonations: 0, campsAttended: 0, leaderboardRank: 0 };
  const vol = data?.volunteer || {};

  const statCards = [
    { icon: Coins, label: "Total Impact Credits", value: stats.totalCoins.toLocaleString(), color: "text-amber-600", bg: "bg-amber-50", glow: "shadow-amber-500/10" },
    { icon: Users, label: "People Referred", value: stats.totalReferrals.toString(), color: "text-blue-600", bg: "bg-blue-50", glow: "shadow-blue-500/10" },
    { icon: Tent, label: "Camps Attended", value: stats.campsAttended.toString(), color: "text-emerald-600", bg: "bg-emerald-50", glow: "shadow-emerald-500/10" },
    { icon: Trophy, label: "Leaderboard Rank", value: `#${stats.leaderboardRank}`, color: "text-purple-600", bg: "bg-purple-50", glow: "shadow-purple-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-amber-950 tracking-tight">
            Welcome back, {vol.name || "Volunteer"} 👋
          </h1>
          <p className="text-amber-700/50 text-sm mt-1 flex items-center gap-2 font-bold">
            <span className="font-mono text-amber-600">{vol.volunteerId}</span>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] font-black uppercase tracking-widest">
              <Zap className="h-2.5 w-2.5 mr-1 fill-current" /> Volunteer
            </Badge>
          </p>
        </div>
        <Link to={`/volunteer/${volId}/leaderboard`}>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black shadow-lg shadow-amber-500/20 rounded-xl">
            <Trophy className="h-4 w-4 mr-2" /> View Leaderboard
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className={`border-none shadow-lg ${s.glow} hover:translate-y-[-2px] transition-all duration-300 bg-white rounded-2xl overflow-hidden`}>
            <CardContent className="p-5">
              <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{s.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR Code + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* QR Code Card */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden relative group rounded-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <QrCode className="h-24 w-24 -mr-4 -mt-4 rotate-12 text-amber-900" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2 text-amber-900">
              <QrCode className="h-5 w-5" /> Your Referral QR
            </CardTitle>
            <CardDescription className="text-amber-700/50 font-bold">Share to earn credits when they donate</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-xl mb-5 transform group-hover:scale-105 transition-transform duration-500 ring-4 ring-amber-500/5">
              <QRCodeCanvas value={referralLink} size={150} level="H" includeMargin={false} />
            </div>
            <Button onClick={copyLink} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black h-11 rounded-xl shadow-lg shadow-amber-200">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Referral Link"}
            </Button>

            {/* Recent Referrals */}
            <div className="w-full pt-4 mt-4 border-t border-amber-200/30">
              <p className="text-[10px] uppercase tracking-widest font-black text-amber-800/40 mb-2 text-center">Recent Referrals</p>
              {(data?.recentReferrals || []).length > 0 ? (
                <div className="space-y-1.5">
                  {data!.recentReferrals.slice(0, 2).map((r: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded-xl text-[11px] border border-amber-100">
                      <span className="font-bold text-gray-700 truncate max-w-[90px]">{r.referredName || r.referredEmail}</span>
                      <Badge className={`text-[9px] border-none shadow-none ${r.status === 'DONATED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {r.status === 'DONATED' ? `₹${r.paymentAmount}` : r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-amber-600/40 text-center italic font-medium">Share your QR to start earning credits!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Coin Activity */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden rounded-2xl">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-500" /> Credit Activity
                </CardTitle>
                <CardDescription>Your recent credit history</CardDescription>
              </div>
              <Link to={`/volunteer/${volId}/coins`}>
                <Button variant="ghost" size="sm" className="text-amber-600 text-xs font-bold">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {(data?.recentTransactions || []).length > 0 ? (
                data!.recentTransactions.slice(0, 5).map((tx: any, i: number) => {
                  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
                    FIRST_LOGIN: { icon: Gift, color: "text-purple-600", bg: "bg-purple-50" },
                    REFERRAL: { icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    CAMP_JOIN: { icon: Tent, color: "text-emerald-600", bg: "bg-emerald-50" },
                    CAMP_ACTIVE: { icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                    BONUS: { icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
                  };
                  const cfg = typeConfig[tx.type] || typeConfig.BONUS;
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                          <Icon className={`h-4 w-4 ${cfg.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {tx.description.replace(/\bcoins\b/gi, "credits")}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {tx.type.replace(/_/g, " ")} • {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-black ${tx.amount > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount} <Coins className="h-3 w-3 inline-block" />
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <Coins className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-bold">No impact credits yet</p>
                  <p className="text-xs">Earn credits by referring people, attending camps, and more!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Camps + Impact Peek */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camps */}
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 font-black flex items-center gap-2">
              <Tent className="h-5 w-5 text-emerald-500" /> Recent Camp Activity
            </CardTitle>
            <Link to={`/volunteer/${volId}/camps`}>
              <Button variant="ghost" size="sm" className="text-emerald-600 text-xs font-bold">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {(data?.recentCamps || []).length > 0 ? (
              <div className="space-y-3">
                {data!.recentCamps.map((cp: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100/50">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{cp.camp?.name || "Camp"}</p>
                      <p className="text-[10px] text-gray-400">{cp.camp?.location} • {new Date(cp.camp?.date).toLocaleDateString()}</p>
                    </div>
                    <Badge className={`text-[9px] font-bold ${cp.participationType === 'ACTIVE' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {cp.volunteerResponse === 'NOT_JOINING'
                        ? 'Not joining'
                        : cp.volunteerResponse === 'JOINING'
                          ? 'Joining'
                          : cp.shareSelected
                            ? 'Shared'
                            : 'Waiting'} • +{cp.coinsAwarded}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Tent className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-bold">No camps yet</p>
                <p className="text-xs">Join upcoming camps to earn credits!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Impact Card */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-amber-900 to-orange-900 text-white rounded-2xl overflow-hidden relative">
          <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] rounded-full bg-amber-500/20 blur-3xl" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <TrendingUp className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Your Impact</h3>
                <p className="text-amber-200/50 text-xs font-bold">Measuring what matters</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-black text-amber-300">{stats.totalCoins}</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Credits Earned</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-black text-emerald-300">₹{stats.totalReferralDonations.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Raised via Referrals</p>
              </div>
            </div>
            <Link to={`/volunteer/${volId}/certificates`}>
              <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black h-12 rounded-xl backdrop-blur-sm">
                <Award className="h-4 w-4 mr-2" /> Download Certificates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
