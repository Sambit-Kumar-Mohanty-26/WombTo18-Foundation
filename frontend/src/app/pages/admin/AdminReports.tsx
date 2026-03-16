import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { Download, FileBarChart, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const donorRetention = [
  { month: "Jul", rate: 72 },
  { month: "Aug", rate: 75 },
  { month: "Sep", rate: 74 },
  { month: "Oct", rate: 78 },
  { month: "Nov", rate: 80 },
  { month: "Dec", rate: 85 },
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 84 },
  { month: "Mar", rate: 86 },
];

const stateWise = [
  { state: "MH", children: 3200 },
  { state: "KA", children: 2400 },
  { state: "TN", children: 2100 },
  { state: "UP", children: 1800 },
  { state: "RJ", children: 1500 },
  { state: "MP", children: 1200 },
  { state: "GJ", children: 1100 },
  { state: "WB", children: 934 },
];

const kpis = [
  { label: "Donor Retention Rate", value: 86, target: 90, status: "on-track" },
  { label: "Cost per Beneficiary", value: 75, target: 80, status: "on-track" },
  { label: "Program Completion Rate", value: 82, target: 95, status: "needs-attention" },
  { label: "Volunteer Engagement", value: 68, target: 80, status: "needs-attention" },
  { label: "Fund Utilization Efficiency", value: 98, target: 95, status: "exceeding" },
];

const generatedReports = [
  { title: "Annual Impact Report 2025", type: "Annual", status: "Published", date: "Jan 15, 2026" },
  { title: "Q4 2025 Financial Report", type: "Quarterly", status: "Published", date: "Jan 10, 2026" },
  { title: "Donor Engagement Analysis", type: "Special", status: "Draft", date: "Mar 1, 2026" },
  { title: "State-wise Performance Report", type: "Special", status: "Review", date: "Feb 20, 2026" },
  { title: "CSR Partnership Summary", type: "Annual", status: "Published", date: "Dec 15, 2025" },
];

const statusColors: Record<string, string> = {
  Published: "bg-green-50 text-green-700",
  Draft: "bg-gray-50 text-gray-700",
  Review: "bg-amber-50 text-amber-700",
};

export function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive analytics and downloadable reports.</p>
        </div>
        <Button size="sm" className="font-bold shadow-sm">
          <FileBarChart className="h-4 w-4 mr-2" /> Generate Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-2">
                {kpi.status === "exceeding" && <CheckCircle className="h-4 w-4 text-green-600" />}
                {kpi.status === "on-track" && <TrendingUp className="h-4 w-4 text-blue-600" />}
                {kpi.status === "needs-attention" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{kpi.target}% target</span>
              </div>
              <p className="text-2xl text-gray-900 font-extrabold">{kpi.value}%</p>
              <p className="text-xs text-gray-600 mt-1 font-medium">{kpi.label}</p>
              <Progress value={kpi.value} className="h-1.5 mt-3 bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Donor Retention */}
        <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-gray-900 text-lg">Donor Retention Rate (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donorRetention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} itemStyle={{ color: 'var(--foreground)' }} />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: 'var(--background)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* State-wise */}
        <Card className="bg-white border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-gray-900 text-lg">State-wise Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateWise} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="state" type="category" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} width={30} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} itemStyle={{ color: 'var(--foreground)' }} />
                  <Bar dataKey="children" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Reports Table Card */}
      <Card className="bg-white border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-gray-900 text-lg">Generated Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {generatedReports.map((r) => (
              <div
                key={r.title}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileBarChart className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-bold">{r.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 font-medium">{r.date}</span>
                      <Badge variant="outline" className="text-[10px] font-bold text-gray-500 border-gray-200 px-1.5 py-0">{r.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className={`${statusColors[r.status]} px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter shadow-none border-none`}>{r.status}</Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}