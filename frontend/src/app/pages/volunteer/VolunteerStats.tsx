import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Loader2, TrendingUp, Users, Coins, Map, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from "recharts";
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "../../components/ui/chart";

// Mock data representing monthly impact growth
const impactData = [
  { month: "Oct", coins: 50, impact: 2 },
  { month: "Nov", coins: 120, impact: 5 },
  { month: "Dec", coins: 80, impact: 3 },
  { month: "Jan", coins: 200, impact: 8 },
  { month: "Feb", coins: 150, impact: 6 },
  { month: "Mar", coins: 300, impact: 11 },
];

const chartConfig = {
  coins: {
    label: "Coins Earned",
    color: "hsl(var(--chart-1))",
  },
  impact: {
    label: "Impact (People)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function VolunteerStats() {
  const { state } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const volId = state.user?.volunteerId || state.user?.identifier || "";

  useEffect(() => {
    if (!volId) return;
    Promise.all([
      client.get<any>(`/volunteers/dashboard?volunteerId=${encodeURIComponent(volId)}`),
      client.get<any[]>(`/volunteers/impact-history/${encodeURIComponent(volId)}`)
    ]).then(([res, hist]) => {
      setStats(res.stats);
      setHistory(hist || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [volId]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-amber-950 tracking-tight">Impact Statistics</h1>
        <p className="text-amber-700/50 text-sm font-bold mt-1">Visualize your lifetime contribution</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-amber-50 rounded-2xl">
          <CardContent className="p-6">
            <Coins className="h-6 w-6 text-amber-600 mb-4" />
            <p className="text-2xl font-black text-amber-950">{stats?.totalCoins || 0}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700/60 mt-1">Total Coins</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-blue-50 rounded-2xl">
          <CardContent className="p-6 text-blue-950">
            <Users className="h-6 w-6 text-blue-600 mb-4" />
            <p className="text-2xl font-black">{stats?.totalReferrals || 0}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700/60 mt-1">People Reached</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-emerald-50 rounded-2xl">
          <CardContent className="p-6 text-[#064e3b]">
            <TrendingUp className="h-6 w-6 text-emerald-600 mb-4" />
            <p className="text-2xl font-black">₹{(stats?.totalReferralDonations || 0).toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/60 mt-1">Referral Impact</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-purple-50 rounded-2xl">
          <CardContent className="p-6 text-purple-950">
            <Map className="h-6 w-6 text-purple-600 mb-4" />
            <p className="text-2xl font-black">{stats?.campsAttended || 0}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-700/60 mt-1">Camps Attended</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Premium Growth Chart */}
      <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-2 mb-1">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <CardTitle className="text-lg font-black text-gray-900 tracking-tight">Growth & Impact Trend</CardTitle>
          </div>
          <CardDescription className="font-bold text-gray-400">Monthly breakdown of coins earned and individual impact.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              data={history.length > 0 ? history : impactData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCoins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-coins)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-coins)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-impact)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-impact)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="coins"
                stroke="var(--color-coins)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCoins)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="impact"
                stroke="var(--color-impact)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorImpact)"
                animationDuration={2000}
              />
            </AreaChart>
          </ChartContainer>
          
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-50">
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[var(--color-coins)]" />
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Coins Earned</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[var(--color-impact)]" />
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Direct Impact</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}