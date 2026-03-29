import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Heart, TrendingUp, Calendar, Award, Users, GraduationCap, HeartPulse, Star, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";

// ---- Static demo data (used while real data loads or as fallbacks) ----
const upcomingEvents = [
  { title: "Annual Donor Meet 2026", date: "Apr 15, 2026", time: "10:00 AM", location: "Mumbai Convention Center", type: "In-person" },
  { title: "Virtual Impact Review Q1", date: "Apr 5, 2026", time: "3:00 PM", location: "Zoom", type: "Virtual" },
  { title: "School Visit - Raigad", date: "Apr 22, 2026", time: "9:00 AM", location: "Raigad, Maharashtra", type: "Field Visit" },
  { title: "Fundraising Gala Dinner", date: "May 10, 2026", time: "7:00 PM", location: "Taj Mahal Palace, Mumbai", type: "In-person" },
];

const progressReports = [
  { program: "Education Support", progress: 85, goal: "Educate 50 children", current: "42 children enrolled" },
  { program: "Nutrition Program", progress: 72, goal: "5,000 meals/month", current: "3,600 meals/month" },
  { program: "Prenatal Care", progress: 90, goal: "Support 10 mothers", current: "9 mothers supported" },
];

interface DonorProfile {
  name: string | null;
  donorId: string;
  tier: string;
  totalDonated: number;
}

interface DonationRecord {
  id?: string;
  amount: number;
  program: string;
  date: string;
  status: string;
}

export function DonorDashboard() {
  const { state } = useAuth();
  const session = state.user;

  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.identifier) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const identifier = encodeURIComponent(session.identifier);
        const [dashRes, donaRes] = await Promise.allSettled([
          client.get<{ donor: DonorProfile }>(`/donors/dashboard?donorId=${identifier}`),
          client.get<DonationRecord[]>(`/donors/donations?donorId=${identifier}`),
        ]);

        if (dashRes.status === "fulfilled") {
          setProfile(dashRes.value.donor);
        }
        if (donaRes.status === "fulfilled") {
          setDonations(donaRes.value ?? []);
        }
      } catch (e: any) {
        console.error("[DonorDashboard] fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.identifier]);

  // Derived display values
  const displayName = profile?.name || state.user?.name || state.user?.identifier || "Donor";
  const totalDonated = profile?.totalDonated ?? 0;
  const donorId = profile?.donorId ?? state.user?.identifier ?? "—";
  const tier = profile?.tier ?? "DONOR";

  // Build monthly chart data from real donations (last 6 months grouping)
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

  const tierColor: Record<string, string> = {
    CHAMPION: "bg-amber-100 text-amber-800",
    PATRON: "bg-blue-100 text-blue-800",
    DONOR: "bg-emerald-100 text-emerald-800",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-gray-500 font-medium">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Donor ID: <span className="font-mono font-semibold text-gray-700">{donorId}</span>
            &nbsp;·&nbsp;
            <Badge className={`text-xs font-bold ${tierColor[tier] ?? tierColor.DONOR}`}>{tier}</Badge>
          </p>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Heart, label: "Total Donated", value: `₹${totalDonated.toLocaleString("en-IN")}`, sub: `as ${tier} tier`, color: "text-primary", bg: "bg-primary/10" },
          { icon: TrendingUp, label: "Donations Made", value: donations.length.toString(), sub: "lifetime transactions", color: "text-accent", bg: "bg-accent/10" },
          { icon: Calendar, label: "Last Donation", value: donations[0]?.date ? new Date(donations[0].date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "—", sub: donations[0]?.program ?? "No donations yet", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Award, label: "Joined", value: "2026", sub: "WombTo18 family", color: "text-amber-600", bg: "bg-amber-50" },
        ].map(stat => (
          <Card key={stat.label} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-5 pb-4">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl text-gray-900 mt-0.5" style={{ fontWeight: 700 }}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart & Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold">Donation History (₹)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {donations.length === 0 && (
              <p className="text-center text-sm text-gray-400 mt-2">No donations recorded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 font-bold">Program Progress</CardTitle>
              <Link to="/dashboard/reports">
                <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/5">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {progressReports.map(r => (
              <div key={r.program}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm" style={{ fontWeight: 600 }}>{r.program}</span>
                  <span className="text-sm text-primary" style={{ fontWeight: 600 }}>{r.progress}%</span>
                </div>
                <Progress value={r.progress} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{r.current}</span>
                  <span>Goal: {r.goal}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 font-bold">Recent Donations</CardTitle>
            <Link to="/dashboard/donations">
              <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/5">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-8 w-8 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No donations recorded yet.</p>
              <Link to="/donate" className="mt-3 inline-block">
                <Button size="sm" className="bg-primary text-primary-foreground font-bold mt-2">Make Your First Donation</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-700">
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Amount</th>
                    <th className="text-left py-3 px-2 font-medium">Program</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-gray-900">
                      <td className="py-3 px-2 text-gray-500">{d.date}</td>
                      <td className="py-3 px-2 text-gray-900" style={{ fontWeight: 600 }}>₹{d.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-2 text-gray-700">{d.program}</td>
                      <td className="py-3 px-2">
                        <Badge variant="secondary" className="bg-[#f0faf4] text-[#1D6E3F]">{d.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 font-bold">Foundation Impact (Overall)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Children Impacted", value: "150+", color: "text-primary", bg: "bg-primary/10" },
              { icon: GraduationCap, label: "Schools Reached", value: "12", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: HeartPulse, label: "Health Checkups", value: "89", color: "text-accent", bg: "bg-accent/10" },
              { icon: Star, label: "Programs Active", value: "3", color: "text-amber-600", bg: "bg-amber-50" },
            ].map(m => (
              <div key={m.label} className="text-center p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className={`h-10 w-10 rounded-lg ${m.bg} flex items-center justify-center mx-auto mb-2`}>
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <p className="text-2xl text-gray-900" style={{ fontWeight: 800 }}>{m.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 font-bold">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <div key={event.title} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{event.title}</h4>
                  <Badge variant="outline" className="text-xs shrink-0 ml-2 bg-white text-gray-600 border-gray-200">{event.type}</Badge>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{event.date}</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{event.time}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{event.location}</div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 h-7 text-xs w-full" onClick={() => toast.success("RSVP Successful", { description: `RSVP registered for ${event.title}` })}>
                  RSVP
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-amber-50 shadow-sm">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-gray-900" style={{ fontWeight: 700 }}>Download Your 80G Tax Certificate</h4>
                <p className="text-sm text-gray-600 font-medium">
                  {totalDonated > 0
                    ? `FY 2025-26 certificate for ₹${totalDonated.toLocaleString("en-IN")} is available.`
                    : "Make a donation to generate your tax certificate."}
                </p>
              </div>
            </div>
            <Link to="/dashboard/certificates">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold shrink-0 shadow-md">
                View Certificates
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}