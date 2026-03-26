import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Download, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

const allocationData = [
  { name: "Education", value: 35, color: "#3b82f6" },
  { name: "Prenatal Care", value: 25, color: "#10b981" },
  { name: "Nutrition", value: 20, color: "#1D6E3F" },
  { name: "General Fund", value: 15, color: "#8b5cf6" },
  { name: "Youth", value: 5, color: "#ec4899" },
];

const impactMetrics = [
  { label: "Children educated through your donations", value: 12, target: 15, unit: "children" },
  { label: "Mothers who received prenatal care", value: 8, target: 10, unit: "mothers" },
  { label: "Meals funded through nutrition program", value: 4800, target: 5000, unit: "meals" },
  { label: "Youth enrolled in skill programs", value: 3, target: 5, unit: "youth" },
];

const reports = [
  { title: "Annual Impact Report 2025", date: "Jan 2026", type: "Annual" },
  { title: "Q4 2025 Financial Summary", date: "Jan 2026", type: "Quarterly" },
  { title: "Q3 2025 Financial Summary", date: "Oct 2025", type: "Quarterly" },
  { title: "Mid-Year Impact Report 2025", date: "Jul 2025", type: "Annual" },
  { title: "Q2 2025 Financial Summary", date: "Jul 2025", type: "Quarterly" },
];

export function DonorReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Impact Reports</h1>
        <p className="text-gray-600">See how your donations are creating real-world impact.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Your Donation Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`alloc-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Your Personal Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {impactMetrics.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-gray-900 font-medium">{m.label}</span>
                  <span className="text-sm text-gray-500">
                    {m.value.toLocaleString()} / {m.target.toLocaleString()} {m.unit}
                  </span>
                </div>
                <Progress value={(m.value / m.target) * 100} className="h-2 bg-gray-100" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Downloadable Reports */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Downloadable Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.title}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#1D6E3F]" />
                  <div>
                    <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{r.title}</p>
                    <p className="text-xs text-gray-500">{r.date} &middot; {r.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900" onClick={() => toast.success("Download started", { description: `Downloading ${r.title}` })}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}