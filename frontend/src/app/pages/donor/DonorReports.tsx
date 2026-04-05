import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Download, FileText, Loader2, HeartHandshake } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router";
import { toast } from "sonner";
import { useDonorData } from "../../lib/useDonorData";

const COLORS = ["#3b82f6", "#10b981", "#1D6E3F", "#8b5cf6", "#ec4899", "#f59e0b"];

const publicReports = [
  { title: "Annual Impact Report 2025", date: "Jan 2026", type: "Annual" },
  { title: "Q4 2025 Financial Summary", date: "Jan 2026", type: "Quarterly" },
  { title: "Q3 2025 Financial Summary", date: "Oct 2025", type: "Quarterly" },
  { title: "Mid-Year Impact Report 2025", date: "Jul 2025", type: "Annual" },
];

export function DonorReports() {
  const { donations, totalDonated, loading, profile } = useDonorData();

  // Build allocation pie from actual programs
  const programMap: Record<string, number> = {};
  donations.forEach(d => {
    programMap[d.program] = (programMap[d.program] ?? 0) + d.amount;
  });
  const allocationData = Object.entries(programMap).map(([name, value], i) => ({
    name,
    value: Math.round((value / totalDonated) * 100),
    color: COLORS[i % COLORS.length],
  }));

  // Generate personal impact metrics proportional to donation amount
  // Simple formula: every ₹2000 → 1 child, every ₹5000 → 1 mother, etc.
  const personalMetrics = totalDonated > 0 ? [
    { label: "Children supported through your donations", value: Math.floor(totalDonated / 2000), target: Math.ceil(totalDonated / 1500), unit: "children" },
    { label: "Mothers who received prenatal care support", value: Math.floor(totalDonated / 5000), target: Math.ceil(totalDonated / 4000), unit: "mothers" },
    { label: "Meals funded through nutrition program", value: Math.floor(totalDonated / 10), target: Math.ceil(totalDonated / 8), unit: "meals" },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Impact Reports</h1>
        <p className="text-gray-600">
          {totalDonated > 0
            ? `See the real-world impact of your ₹${totalDonated.toLocaleString("en-IN")} in contributions.`
            : "Your impact reports will appear here once you make your first donation."}
        </p>
      </div>

      {totalDonated === 0 ? (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="text-center py-16">
            <HeartHandshake className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-700 font-semibold">No impact data yet</h3>
            <p className="text-gray-400 text-sm mt-1">Make a donation to start tracking your real-world impact.</p>
            <Link to="/donate" className="mt-4 inline-block">
              <Button size="sm" className="bg-primary text-primary-foreground font-bold">Donate Now</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Allocation Pie */}
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
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={90}
                      paddingAngle={3}
                      dataKey="value" nameKey="name"
                    >
                      {allocationData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {allocationData.length === 0 && (
                <p className="text-center text-sm text-gray-400">No program-specific allocations yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Personal Impact */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Your Personal Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {personalMetrics.map(m => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-900 font-medium">{m.label}</span>
                    <span className="text-sm text-gray-500">{m.value} {m.unit}</span>
                  </div>
                  <Progress value={Math.min((m.value / m.target) * 100, 100)} className="h-2 bg-gray-100" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Public Downloadable Reports */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Foundation Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {publicReports.map(r => (
              <div key={r.title} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#1D6E3F]" />
                  <div>
                    <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{r.title}</p>
                    <p className="text-xs text-gray-500">{r.date} · {r.type}</p>
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