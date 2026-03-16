import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { TrendingUp, IndianRupee, Users, ShieldCheck, Download, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const fundUtilization = [
  { name: "Programs", value: 72, color: "#10b981" },
  { name: "Healthcare", value: 12, color: "#3b82f6" },
  { name: "Education", value: 8, color: "#f59e0b" },
  { name: "Admin", value: 5, color: "#8b5cf6" },
  { name: "Fundraising", value: 3, color: "#ec4899" },
];

const expenseBreakdown = [
  { name: "Salaries & Benefits", value: 28, color: "#10b981" },
  { name: "Program Materials", value: 24, color: "#3b82f6" },
  { name: "Field Operations", value: 20, color: "#f59e0b" },
  { name: "Infrastructure", value: 12, color: "#8b5cf6" },
  { name: "Technology", value: 8, color: "#ec4899" },
  { name: "Travel & Logistics", value: 5, color: "#14b8a6" },
  { name: "Misc & Contingency", value: 3, color: "#6B7280" },
];

const yearlyImpact = [
  { year: "2021", children: 8200, mothers: 1800, communities: 80 },
  { year: "2022", children: 9800, mothers: 2200, communities: 110 },
  { year: "2023", children: 11500, mothers: 2700, communities: 140 },
  { year: "2024", children: 13200, mothers: 3100, communities: 170 },
  { year: "2025", children: 15234, mothers: 3500, communities: 200 },
];

const programSpend = [
  { program: "Prenatal", amount: 2.4, target: 2.5 },
  { program: "Early Child", amount: 1.8, target: 2.0 },
  { program: "Nutrition", amount: 3.2, target: 3.5 },
  { program: "Education", amount: 4.1, target: 4.5 },
  { program: "Youth", amount: 1.5, target: 2.0 },
  { program: "Protection", amount: 0.8, target: 1.0 },
];

const programProgress = [
  { program: "Prenatal & Maternal Care", utilized: 1875000, allocated: 2500000, beneficiaries: "3,500 mothers" },
  { program: "Early Childhood Development", utilized: 1350000, allocated: 1800000, beneficiaries: "4,200 children" },
  { program: "Nutrition Programs", utilized: 2720000, allocated: 3200000, beneficiaries: "12,000 meals/day" },
  { program: "Education Support", utilized: 3485000, allocated: 4100000, beneficiaries: "8,100 students" },
  { program: "Youth Empowerment", utilized: 900000, allocated: 1500000, beneficiaries: "2,500 youth" },
  { program: "Child Protection", utilized: 560000, allocated: 800000, beneficiaries: "500+ interventions" },
];

const outcomes = [
  { metric: "Infant Mortality Reduction", value: 40, target: 50, detail: "40% reduction in partner communities" },
  { metric: "School Enrollment Rate", value: 92, target: 100, detail: "92% enrollment in program districts" },
  { metric: "Nutrition Goals Met", value: 85, target: 100, detail: "85% of children meeting growth targets" },
  { metric: "Immunization Coverage", value: 96, target: 100, detail: "96% of infants fully immunized" },
  { metric: "Youth Employment Rate", value: 78, target: 90, detail: "78% of trained youth placed in jobs" },
];

function formatINR(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function ImpactPage() {
  const totalAllocated = programProgress.reduce((s, p) => s + p.allocated, 0);
  const totalUtilized = programProgress.reduce((s, p) => s + p.utilized, 0);
  const utilizationPercent = Math.round((totalUtilized / totalAllocated) * 100);

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-emerald-700 text-sm mb-2 font-semibold uppercase tracking-wider">Impact & Transparency</p>
            <h1 className="text-4xl sm:text-5xl text-gray-900 mb-6 font-extrabold leading-tight">
              Every Rupee Accounted For
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Real-time data on how your donations create impact. Full financial transparency — always.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50" onClick={() => toast.success("Download started", { description: "Downloading Annual Report 2025" })}>
                <Download className="h-4 w-4 mr-2" /> Annual Report 2025
              </Button>
              <Button variant="outline" size="sm" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50" onClick={() => toast.success("Download started", { description: "Downloading Audit Certificate" })}>
                <FileText className="h-4 w-4 mr-2" /> Audit Certificate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Financial Metrics */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: IndianRupee, label: "Total Funds Raised", value: "₹13.8 Cr", change: "+24% YoY", color: "text-emerald-600" },
              { icon: TrendingUp, label: "Total Funds Utilized", value: formatINR(totalUtilized), change: `${utilizationPercent}% utilization`, color: "text-blue-600" },
              { icon: Users, label: "Children Impacted", value: "15,234", change: "+15% YoY", color: "text-emerald-500" },
              { icon: ShieldCheck, label: "Cost per Child", value: "₹9,060", change: "-8% efficiency", color: "text-amber-500" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <m.icon className={`h-6 w-6 mx-auto mb-2 ${m.color}`} />
                <p className="text-2xl sm:text-3xl text-gray-900 font-extrabold">{m.value}</p>
                <p className="text-sm text-gray-600 mt-1">{m.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-semibold">{m.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fund Utilization & Expense Breakdown Charts */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Fund Utilization Pie */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900">Fund Utilization Breakdown</CardTitle>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none">{utilizationPercent}% utilized</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fundUtilization}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                      >
                        {fundUtilization.map((entry, index) => (
                          <Cell key={`util-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown Pie */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`expense-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Comparison Bar Chart */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Program-wise Spending vs Target (₹ Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={programSpend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="program" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => `₹${value} Cr`} />
                    <Legend />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} name="Spent" />
                    <Bar dataKey="target" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Target" opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Program Progress Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl text-gray-900 font-bold">Program Utilization</h2>
            <p className="text-gray-600">Real-time tracking of fund allocation vs utilization per program.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programProgress.map((p) => {
              const percent = Math.round((p.utilized / p.allocated) * 100);
              return (
                <Card key={p.program} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="pt-5">
                    <h4 className="text-sm mb-1 text-gray-900 font-semibold">{p.program}</h4>
                    <p className="text-xs text-gray-500 mb-3">{p.beneficiaries}</p>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-900 font-semibold">{formatINR(p.utilized)}</span>
                      <span className="text-gray-500">of {formatINR(p.allocated)}</span>
                    </div>
                    <Progress value={percent} className="h-2 mb-1 bg-gray-100" />
                    <p className="text-xs text-right text-gray-500">{percent}% utilized</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Growth Chart */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Year-over-Year Impact Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyImpact}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="children" stroke="#10b981" strokeWidth={2} name="Children" dot={false} />
                    <Line type="monotone" dataKey="mothers" stroke="#3b82f6" strokeWidth={2} name="Mothers" dot={false} />
                    <Line type="monotone" dataKey="communities" stroke="#f59e0b" strokeWidth={2} name="Communities" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Outcome Metrics */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl text-gray-900 font-bold">Program Outcomes</h2>
            <p className="text-gray-600">Measurable results against our annual targets.</p>
          </div>
          <div className="space-y-5">
            {outcomes.map((o) => (
              <Card key={o.metric} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-sm text-gray-900 font-semibold">{o.metric}</span>
                      <p className="text-xs text-gray-500">{o.detail}</p>
                    </div>
                    <span className="text-sm text-emerald-600 shrink-0 font-bold">
                      {o.value}% / {o.target}%
                    </span>
                  </div>
                  <Progress value={o.value} className="h-2.5 bg-gray-100" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-emerald-50 border-t border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl text-gray-900 mb-2 font-bold">Verified & Audited</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our financials are independently audited annually. We maintain the highest standards of nonprofit accountability.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["FCRA Compliant", "80G Certified", "12A Registered", "GuideStar Platinum", "NITI Aayog Listed"].map((badge) => (
              <Badge key={badge} variant="outline" className="px-4 py-2 text-sm border-emerald-200 text-emerald-800 bg-white shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}