import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, IndianRupee, TrendingUp, Heart, ArrowUp, ArrowDown } from "lucide-react";
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
  { name: "Nutrition", value: 20, color: "#f59e0b" },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of foundation operations and financials.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: IndianRupee, label: "Total Revenue", value: "₹13.8 Cr", change: "+24%", up: true },
          { icon: Users, label: "Active Donors", value: "1,245", change: "+12%", up: true },
          { icon: Heart, label: "Children Served", value: "15,234", change: "+15%", up: true },
          { icon: TrendingUp, label: "Fund Utilization", value: "98%", change: "+2%", up: true },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
                <span className={`text-xs flex items-center gap-0.5 ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                  {kpi.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl text-foreground" style={{ fontWeight: 800 }}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Monthly Revenue & Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number, name: string) =>
                    name === "revenue" ? `₹${(value / 100000).toFixed(1)}L` : value
                  } />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Program Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Fund Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {programDistribution.map((entry, index) => (
                      <Cell key={`dist-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <Badge className={activityColors[a.type]}>{a.type}</Badge>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}