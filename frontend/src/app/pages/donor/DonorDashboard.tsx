import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { 
  Heart, TrendingUp, Calendar, Award, Users, GraduationCap, 
  HeartPulse, Star, MapPin, Clock, ArrowRight, Loader2,
  Trophy, QrCode, Copy, Check, UserPlus, Zap, FileText
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { auth } from "../../lib/auth";
import { QRCodeCanvas } from "qrcode.react";

// ---- Static demo data ----
const upcomingEvents = [
  { title: "Annual Donor Meet 2026", date: "Apr 15, 2026", time: "10:00 AM", location: "Mumbai Convention Center", type: "In-person" },
  { title: "Virtual Impact Review Q1", date: "Apr 5, 2026", time: "3:00 PM", location: "Zoom", type: "Virtual" },
  { title: "School Visit - Raigad", date: "Apr 22, 2026", time: "9:00 AM", location: "Raigad, Maharashtra", type: "Field Visit" },
];

const progressReports = [
  { program: "Education Support", progress: 85, goal: "Educate 50 children", current: "42 children enrolled" },
  { program: "Nutrition Program", progress: 72, goal: "5,000 meals/month", current: "3,600 meals/month" },
  { program: "Prenatal Care", progress: 90, goal: "Support 10 mothers", current: "9 mothers supported" },
];

interface DonorProfile {
  id: string; // database id for recruits lookup
  name: string | null;
  donorId: string;
  tier: string;
  totalDonated: number;
  leaderboardRank?: number;
  isVolunteer: boolean;
}

interface DonationRecord {
  id?: string;
  amount: number;
  program: string;
  date: string;
  status: string;
}

interface LeaderboardEntry {
  name: string | null;
  donorId: string;
  totalDonated: number;
  tier: string;
}

export function DonorDashboard() {
  const { state, dispatch } = useAuth();
  const session = state.user;
  const navigate = useNavigate();

  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session?.identifier) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const identifier = encodeURIComponent(session.identifier);
        
        // Parallel fetch for dashboard, donations, and leaderboard
        const [dashRes, donaRes, leadRes] = await Promise.allSettled([
          client.get<{ donor: DonorProfile }>(`/donors/dashboard?donorId=${identifier}`),
          client.get<DonationRecord[]>(`/donors/donations?donorId=${identifier}`),
          client.get<LeaderboardEntry[]>("/donors/leaderboard"),
        ]);

        if (dashRes.status === "fulfilled") {
          const fetchedProfile = dashRes.value.donor;
          setProfile(fetchedProfile);
          
          // Sync tier with session if it's missing or different to update sidebar instantly
          if (fetchedProfile.tier && fetchedProfile.tier !== session?.tier) {
            const currentSession = auth.getSession();
            if (currentSession) {
              const updatedSession = { ...currentSession, tier: fetchedProfile.tier };
              localStorage.setItem("donor_session", JSON.stringify(updatedSession));
              dispatch({ type: "UPDATE_ROLE", payload: { tier: fetchedProfile.tier } });
            }
          }
        }
        if (donaRes.status === "fulfilled") setDonations(donaRes.value ?? []);
        if (leadRes.status === "fulfilled") {
          // The new API returns { data, meta }
          const res = leadRes.value as any;
          setLeaderboard(res.data ?? []);
        }


      } catch (e: any) {
        console.error("[DonorDashboard] fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.identifier]);

  const handleBecomeVolunteer = async () => {
    if (!profile) return;
    try {
      setUpgrading(true);
      const result = await client.post<any>(`/donors/apply-volunteer?donorId=${profile.donorId}`);

      const currentSession = auth.getSession();
      if (currentSession) {
        auth.saveVolunteerSession({
          identifier: currentSession.identifier,
          donorId: result?.donorId || profile.donorId,
          name: currentSession.name || profile.name || "Volunteer",
          mobile: currentSession.mobile,
          volunteerId: result?.volunteerId || undefined,
          profileCompleted: result?.profileCompleted ?? false,
        });
        dispatch({
          type: "UPDATE_ROLE",
          payload: {
            role: "VOLUNTEER",
            donorId: result?.donorId || profile.donorId,
            profileCompleted: result?.profileCompleted ?? false,
          },
        });
      }

      toast.success("Volunteer access unlocked!");
      if (result?.profileCompleted) {
        navigate(`/volunteer/${result?.volunteerId || profile.donorId}/dashboard`, { replace: true });
      } else {
        navigate("/volunteer-onboarding", { replace: true });
      }
    } catch (e: any) {
      toast.error("Application failed. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const copyReferral = () => {
    if (!profile) return;
    const refLink = `${window.location.origin}/login?ref=${profile.donorId}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success("Referral Link Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-gray-500 font-medium">Synchronizing Supporter Ecosystem…</p>
      </div>
    );
  }

  const isVolunteer = profile?.isVolunteer || false;
  const referralLink = profile ? `${window.location.origin}/login?ref=${profile.donorId}` : "";

  // Build monthly chart data from real donations
  const monthlyMap: Record<string, number> = {};
  donations.forEach(d => {
    const month = new Date(d.date).toLocaleString("en", { month: "short" });
    monthlyMap[month] = (monthlyMap[month] ?? 0) + d.amount;
  });
  const chartData = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }));
  const displayChartData = chartData.length > 0
    ? chartData
    : [
        { month: "Oct", amount: 0 },
        { month: "Nov", amount: 0 },
        { month: "Dec", amount: 0 },
        { month: "Jan", amount: 0 },
        { month: "Feb", amount: 0 },
        { month: "Mar", amount: 0 },
      ];


  return (
    <div className="space-y-10 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, type: "spring" }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <Badge variant="outline" className="bg-[#1D6E3F]/5 text-[#1D6E3F] border-[#1D6E3F]/20 font-bold px-3 py-1 mb-3 uppercase tracking-widest text-[10px] shadow-sm">
            Overview
          </Badge>
          <h1 className="text-3xl sm:text-[2.5rem] text-gray-900 font-black tracking-tight leading-none mb-2">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D6E3F] to-emerald-500">Hub</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            ID: <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{profile?.donorId}</span>
            <Badge className="bg-gradient-to-r from-orange-400 to-amber-500 text-white border-none shadow-sm uppercase tracking-widest text-[9px] px-2">{profile?.tier}</Badge>
            {isVolunteer && <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none shadow-sm uppercase tracking-widest text-[9px] px-2 flex items-center gap-1"><Zap className="h-2.5 w-2.5 fill-current" /> Volunteer</Badge>}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/donate">
            <Button size="lg" className="bg-gradient-to-r from-[#1D6E3F] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-black shadow-[0_10px_20px_-10px_rgba(29,110,63,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(29,110,63,0.6)] rounded-xl h-12 px-6 transition-all duration-300 hover:-translate-y-1 border border-emerald-500/20">
              New Donation
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { icon: Heart, label: "Total Contribution", value: `₹${(profile?.totalDonated ?? 0).toLocaleString("en-IN")}`, color: "text-[#1D6E3F]", bg: "bg-[#1D6E3F]/10", border: 'border-[#1D6E3F]/20' },
          { icon: TrendingUp, label: "Impact Events", value: donations.length.toString(), color: "text-blue-600", bg: "bg-blue-600/10", border: 'border-blue-600/20' },
          { icon: Trophy, label: "Leaderboard Rank", value: `#${profile?.leaderboardRank || " -"}`, color: "text-amber-600", bg: "bg-amber-500/10", border: 'border-amber-500/20' },
          { icon: Award, label: "Impact Factor", value: profile?.tier === "CHAMPION" ? "1.5x" : profile?.tier === "PATRON" ? "1.25x" : "1.0x", color: "text-indigo-600", bg: "bg-indigo-600/10", border: 'border-indigo-600/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 80 }}
          >
            <Card className="relative overflow-hidden border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] transition-all duration-500 bg-white rounded-[1.5rem] group hover:-translate-y-1 cursor-default">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
                <stat.icon className={`h-24 w-24 -mr-6 -mt-6 rotate-12 ${stat.color}`} />
              </div>
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.15em] font-black text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight drop-shadow-sm">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Stats (Bar Chart & Program Progress) */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 rounded-[1.5rem] h-full flex flex-col">
            <CardHeader className="border-b border-gray-50 pb-5 pt-6 px-6 sm:px-8">
              <CardTitle className="text-xl font-black text-gray-900 tracking-tight">Donation Momentum</CardTitle>
              <CardDescription className="font-semibold text-gray-400 mt-1">Financial history across FY 2026</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 px-4 pb-6 flex-1 flex flex-col justify-center">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1D6E3F" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#155e33" stopOpacity={0.8}/>
                      </linearGradient>
                      <filter id="barShadowDashboard" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.15" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} dy={8} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-8} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)', fontWeight: 'bold' }} 
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="url(#barGradient)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={28} 
                      filter="url(#barShadowDashboard)"
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {donations.length === 0 && <p className="text-center text-sm text-gray-400 mt-2 font-medium">No donations recorded yet.</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 rounded-[1.5rem] h-full flex flex-col">
            <CardHeader className="border-b border-gray-50 pb-5 pt-6 px-6 sm:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-gray-900 tracking-tight">Foundation Outreach</CardTitle>
                  <CardDescription className="font-semibold text-gray-400 mt-1">Impact metrics of supported programs</CardDescription>
                </div>
                <Link to="/donations"><Button variant="ghost" size="sm" className="text-[#1D6E3F] hover:text-[#155e33] hover:bg-[#1D6E3F]/5 font-bold rounded-xl h-9">Details <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6 px-6 sm:px-8 pb-6 flex-1 flex flex-col justify-center space-y-6">
              {progressReports.map((r, i) => (
                <div key={r.program} className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <span className="text-xs uppercase tracking-[0.1em] font-bold text-gray-500">{r.program}</span>
                    <span className="text-sm font-black text-[#1D6E3F]">{r.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#1D6E3F] to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${r.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 italic font-semibold">{r.current} • Goal: {r.goal}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Supporter Ecosystem (Leaderboard & QR) */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="lg:col-span-2 flex">
          <Card className="w-full border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] bg-white rounded-[1.5rem] overflow-hidden flex flex-col">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-5 pt-6 px-6 sm:px-8">
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle className="text-xl font-black flex items-center gap-2 tracking-tight">
                    <div className="p-1.5 bg-amber-100 rounded-lg"><Trophy className="h-5 w-5 text-amber-600" /></div> Supporter Standings
                  </CardTitle>
                  <CardDescription className="font-semibold text-gray-400 mt-1 text-xs">Global contribution leaderboard for FY 2026</CardDescription>
                </div>
                <Link to={`/donor/${profile?.donorId}/leaderboard`}>
                  <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-bold rounded-xl h-9">
                    See All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="divide-y divide-gray-50 flex-1">
                {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((l, i) => (
                  <div key={i} className="flex items-center justify-between p-4 px-6 sm:px-8 hover:bg-gray-50/80 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform ${i === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white' : i === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : i === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-900 leading-none mb-1">{l.name || "Anonymous Supporter"}</p>
                        <p className="text-[11px] text-gray-400 font-mono tracking-wider">{l.donorId} • {l.tier}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-[15px] font-black text-[#1D6E3F]">₹{l.totalDonated.toLocaleString("en-IN")}</p>
                      <div className="h-1 w-16 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <motion.div 
                          className="h-full bg-emerald-400" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (l.totalDonated / (leaderboard[0]?.totalDonated || 1)) * 100)}%` }} 
                          transition={{ duration: 1, delay: 0.8 + (i*0.1) }}
                        />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-16 text-center text-gray-400 font-medium text-sm">Loading standings...</div>
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100/50">
                 <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest leading-relaxed">
                   "True impact is measured by the lives we touch"
                 </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Volunteer QR recruitment section */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.5 }} className="flex">
          {isVolunteer ? (
            <Card className="w-full border-emerald-100 shadow-[0_15px_40px_-15px_rgba(29,110,63,0.08)] bg-gradient-to-b from-[#f8fdfa] to-white rounded-[1.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                 <QrCode className="h-32 w-32 -mr-8 -mt-6 rotate-12 text-[#1D6E3F]" />
              </div>
              <CardHeader className="px-6 pt-8 pb-4 relative z-10">
                <CardTitle className="text-xl font-black flex items-center gap-2 text-[#1D6E3F] tracking-tight">
                  <div className="p-1.5 bg-[#1D6E3F]/10 rounded-lg"><QrCode className="h-5 w-5" /></div> Recruiting Hub
                </CardTitle>
                <CardDescription className="text-emerald-700/60 font-bold text-xs mt-1">Your personal network portal</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center px-6 pb-8 relative z-10 w-full">
                <div className="bg-white p-4 rounded-3xl shadow-[0_10px_25px_-5px_rgba(29,110,63,0.1)] mb-8 transform group-hover:scale-105 transition-transform duration-500 ring-4 ring-emerald-50 border border-emerald-100">
                  <QRCodeCanvas value={referralLink} size={150} level="H" includeMargin={false} />
                </div>
                
                <div className="w-full space-y-4">
                  <Button onClick={copyReferral} className="w-full bg-gradient-to-r from-[#1D6E3F] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-black h-12 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 rounded-xl transition-all hover:-translate-y-0.5 outline-none border border-emerald-500/30">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied Link!" : "Copy Referral URL"}
                  </Button>
                  
                  <div className="pt-5 border-t border-gray-100">
                     <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 text-center">Impact Network</p>
                     <p className="text-[11px] text-gray-400 text-center font-bold px-2">Share your personal QR to spread the word and invite others to join our cause!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] bg-gradient-to-b from-gray-50 to-white rounded-[1.5rem] overflow-hidden flex flex-col items-center justify-center p-8 text-center relative group">
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
               <div className="relative z-10 flex flex-col items-center w-full">
                  <div className="h-20 w-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm ring-4 ring-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
                     <Heart className="h-10 w-10 text-[#1D6E3F] fill-[#1D6E3F]/20" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Become a Volunteer</h3>
                  <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed px-2">Scale your impact. Unlock your personal QR code and earn real rewards by recruiting others.</p>
                  <Button onClick={handleBecomeVolunteer} disabled={upgrading} className="bg-gray-900 hover:bg-black text-white font-black w-full h-12 shadow-xl shadow-gray-200 rounded-xl transition-all hover:-translate-y-1 text-base disabled:opacity-70 disabled:cursor-not-allowed">
                    {upgrading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Opening onboarding...
                      </>
                    ) : (
                      "Apply to Volunteer"
                    )}
                  </Button>
               </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Activity Log and Financial Report CTA */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="lg:col-span-1">
          <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] rounded-[1.5rem] overflow-hidden h-full">
             <CardHeader className="border-b border-gray-50 pb-5 pt-6 px-6 sm:px-8 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-black tracking-tight text-gray-900">Activity Log</CardTitle>
                <Link to="/donations"><Button variant="ghost" className="text-[10px] uppercase font-black text-gray-400 hover:text-gray-900 px-2 h-8 rounded-lg outline-none tracking-widest">See All</Button></Link>
             </CardHeader>
             <CardContent className="pt-5 px-6 sm:px-8 pb-6">
                {donations.length > 0 ? (
                   <div className="space-y-4">
                      {donations.slice(0, 4).map((d, di) => (
                          <div key={di} className="flex items-center justify-between group cursor-default">
                             <div className="flex items-center gap-3.5">
                                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 font-black shadow-sm border border-gray-100 group-hover:bg-[#1D6E3F] group-hover:text-white transition-colors duration-300 group-hover:border-[#1D6E3F]">
                                  <Check className="h-4 w-4" />
                                </div>
                                <div>
                                   <p className="text-[14px] font-bold text-gray-900 leading-none mb-1">₹{d.amount.toLocaleString("en-IN")}</p>
                                   <p className="text-[11px] text-gray-500 font-medium truncate max-w-[130px]">{d.program}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="text-[10px] text-gray-400 font-bold">{d.date}</span>
                             </div>
                          </div>
                      ))}
                   </div>
                ) : <div className="flex flex-col items-center justify-center py-8 text-gray-400"><p className="text-sm font-medium">No activity recorded.</p></div>}
             </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="lg:col-span-2">
          <Card className="border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-[#f0faf4] shadow-[0_15px_40px_-15px_rgba(29,110,63,0.08)] rounded-[1.5rem] h-full flex items-center relative overflow-hidden group">
            <div className="absolute -right-24 -bottom-24 opacity-10 drop-shadow-2xl mix-blend-multiply">
              <FileText className="w-[300px] h-[300px] text-[#1D6E3F] rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700" />
            </div>
            <CardContent className="p-8 sm:p-10 relative z-10 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center shrink-0 border border-gray-100">
                    <Award className="h-8 w-8 text-[#1D6E3F]" />
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-white text-[#1D6E3F] border-[#1D6E3F]/10 font-bold px-3 py-1 mb-2 uppercase tracking-widest text-[9px] shadow-sm">Legal & Compliance</Badge>
                    <h4 className="text-gray-900 font-black text-2xl tracking-tight leading-none mb-2">Financial Impact Report</h4>
                    <p className="text-sm text-gray-600 font-medium max-w-sm">Verify your contributions and download your 80G Tax Certificates safely.</p>
                  </div>
                </div>
                <Link to="/certificates" className="w-full sm:w-auto z-10">
                  <Button size="lg" className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-black rounded-xl px-8 h-12 shadow-xl shadow-gray-300 hover:-translate-y-1 transition-all duration-300 outline-none">
                    Access Records
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
