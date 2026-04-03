import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, IndianRupee, TrendingUp, Heart, ArrowUp, ArrowDown, Tent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const monthlyRevenue = [
  { month: "Oct", revenue: 850000, donors: 45 },
  { month: "Nov", revenue: 920000, donors: 52 },
  { month: "Dec", revenue: 1450000, donors: 78 },
  { month: "Jan", revenue: 980000, donors: 55 },
  { month: "Feb", revenue: 1120000, donors: 63 },
  { month: "Mar", revenue: 860000, donors: 48 },
];

const programDistribution = [
  { name: "Education", value: 35, color: "#3b82f6" },
  { name: "Prenatal", value: 25, color: "#10b981" },
  { name: "Nutrition", value: 20, color: "#1D6E3F" },
  { name: "Youth", value: 12, color: "#8b5cf6" },
  { name: "Protection", value: 8, color: "#ec4899" },
];

const recentActivity = [
  { action: "New donation received", detail: "₹25,000 from Vikram Singh", time: "2 hours ago", type: "donation" },
  { action: "Donor onboarded", detail: "Meera Enterprises (CSR)", time: "5 hours ago", type: "donor" },
  { action: "Report published", detail: "Q4 2025 Impact Report", time: "1 day ago", type: "report" },
  { action: "Program milestone", detail: "Education: 8,000 students reached", time: "2 days ago", type: "milestone" },
  { action: "New donation received", detail: "₹50,000 from Patel Foundation", time: "3 days ago", type: "donation" },
];

const activityColors: Record<string, string> = {
  donation: "bg-green-50 text-green-700",
  donor: "bg-blue-50 text-blue-700",
  report: "bg-purple-50 text-purple-700",
  milestone: "bg-amber-50 text-amber-700",
};

export function AdminDashboard() {
  return (
    <div className="bg-gray-50 space-y-6">
      <div className="animate-in fade-in duration-500">
        <h1 className="text-2xl text-gray-900 font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of foundation operations and financials.</p>
      </div>

      {/* KPIs / Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { icon: IndianRupee, label: "Total Revenue", value: "₹13.8 Cr", change: "+24%", up: true },
          { icon: Users, label: "Active Donors", value: "1,245", change: "+12%", up: true },
          { icon: Heart, label: "Children Served", value: "15,234", change: "+15%", up: true },
          { icon: TrendingUp, label: "Fund Utilization", value: "98%", change: "+2%", up: true },
          { icon: Tent, label: "Active Camps", value: "8", change: "+3 this week", up: true },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-gray-500" />
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                  {kpi.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl text-gray-900 font-extrabold">{kpi.value}</p>
              <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider font-medium">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart Card */}
        <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900 text-lg">Monthly Revenue & Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: number, name: string) =>
                      name === "revenue" ? `₹${(value / 100000).toFixed(1)}L` : value
                    } 
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="revenue" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Program Distribution Card */}
        <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900 text-lg">Fund Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {programDistribution.map((entry, index) => (
                      <Cell key={`dist-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} itemStyle={{ color: 'var(--foreground)' }} formatter={(value: number) => `${value}%`} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: '20px', color: 'var(--foreground)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Card */}
      <Card className="bg-white border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-gray-900 text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className={`${activityColors[a.type]} px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter shadow-none border-none`}>{a.type}</Badge>
                  <div>
                    <p className="text-sm text-gray-900 font-semibold">{a.action}</p>
                    <p className="text-xs text-gray-600">{a.detail}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
