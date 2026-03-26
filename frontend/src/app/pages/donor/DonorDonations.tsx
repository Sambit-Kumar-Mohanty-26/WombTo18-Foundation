import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Download, Filter, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const donations = [
  { id: "TXN001", date: "Mar 5, 2026", amount: 15000, program: "Education", method: "UPI", status: "Completed", receipt: true },
  { id: "TXN002", date: "Feb 10, 2026", amount: 20000, program: "Prenatal Care", method: "Card", status: "Completed", receipt: true },
  { id: "TXN003", date: "Jan 15, 2026", amount: 15000, program: "Nutrition", method: "UPI", status: "Completed", receipt: true },
  { id: "TXN004", date: "Dec 20, 2025", amount: 25000, program: "General", method: "Net Banking", status: "Completed", receipt: true },
  { id: "TXN005", date: "Nov 10, 2025", amount: 10000, program: "Youth", method: "UPI", status: "Completed", receipt: true },
  { id: "TXN006", date: "Oct 5, 2025", amount: 15000, program: "Education", method: "Card", status: "Completed", receipt: true },
  { id: "TXN007", date: "Sep 15, 2025", amount: 20000, program: "Health", method: "UPI", status: "Completed", receipt: true },
  { id: "TXN008", date: "Aug 1, 2025", amount: 50000, program: "General", method: "Net Banking", status: "Completed", receipt: true },
];

export function DonorDonations() {
  const [search, setSearch] = useState("");
  const filtered = donations.filter(
    (d) =>
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.program.toLowerCase().includes(search.toLowerCase())
  );

  const total = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1D6E3F] mb-1 transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>My Donations</h1>
          <p className="text-gray-600">Complete history of all your contributions.</p>
        </div>
        <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => toast.success("Export started", { description: "Preparing CSV of your donations..." })}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Donated</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>₹{total.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{donations.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Avg. Donation</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>₹{Math.round(total / donations.length).toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by ID or program..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
        />
      </div>

      {/* Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Program</th>
                  <th className="text-left py-3 px-4 font-medium">Method</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900" style={{ fontWeight: 500 }}>{d.id}</td>
                    <td className="py-3 px-4 text-gray-500">{d.date}</td>
                    <td className="py-3 px-4 text-gray-900" style={{ fontWeight: 600 }}>₹{d.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 text-gray-700">{d.program}</td>
                    <td className="py-3 px-4 text-gray-500">{d.method}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">{d.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={() => toast.success("Download started", { description: `Downloading receipt for ${d.id}` })}>
                        <Download className="h-3 w-3 mr-1" /> PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
