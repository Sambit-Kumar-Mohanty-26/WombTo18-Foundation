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
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and downloadable reports.</p>
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <FileBarChart className="h-4 w-4 mr-2" /> Generate Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                {kpi.status === "exceeding" && <CheckCircle className="h-4 w-4 text-green-600" />}
                {kpi.status === "on-track" && <TrendingUp className="h-4 w-4 text-blue-600" />}
                {kpi.status === "needs-attention" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                <span className="text-xs text-muted-foreground">{kpi.target}% target</span>
              </div>
              <p className="text-2xl" style={{ fontWeight: 800 }}>{kpi.value}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
              <Progress value={kpi.value} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Donor Retention */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Donor Retention Rate (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donorRetention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* State-wise */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>State-wise Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateWise} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} width={30} />
                  <Tooltip />
                  <Bar dataKey="children" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Reports */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {generatedReports.map((r) => (
              <div
                key={r.title}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <FileBarChart className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>{r.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                      <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[r.status]}>{r.status}</Badge>
                  <Button variant="ghost" size="sm">
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