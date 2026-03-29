import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Download, ChevronLeft, Loader2, Heart } from "lucide-react";
import { toast } from "sonner";
import { useDonorData } from "../../lib/useDonorData";
import { useAuth } from "../../context/AuthContext";

export function DonorDonations() {
  const [search, setSearch] = useState("");
  const { state } = useAuth();
  const { donations, loading, totalDonated, donationCount, avgDonation } = useDonorData();

  const displayName = state.user?.name || state.user?.identifier || "Donor";

  const filtered = donations.filter(d =>
    (d.program ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (d.date ?? "").includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1D6E3F] mb-1 transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>My Donations</h1>
          <p className="text-gray-600">Complete history of all contributions by <span className="font-semibold text-gray-800">{displayName}</span>.</p>
        </div>
        <Button
          variant="outline" size="sm"
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => {
            if (donations.length === 0) { toast.info("No donations to export."); return; }
            const csv = ["Date,Amount,Program,Status", ...donations.map(d => `${d.date},${d.amount},${d.program},${d.status}`)].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "my_donations.csv"; a.click();
            toast.success("Export started", { description: "Preparing CSV of your donations..." });
          }}
        >
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Donated</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>₹{totalDonated.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{donationCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Avg. Donation</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>
              {avgDonation > 0 ? `₹${avgDonation.toLocaleString("en-IN")}` : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      {donations.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by program or date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          />
        </div>
      )}

      {/* Table or Empty State */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-0">
          {donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Heart className="h-10 w-10 text-gray-200 mb-3" />
              <h3 className="text-gray-700 font-semibold text-base">No donations yet</h3>
              <p className="text-gray-400 text-sm mt-1">Your donation history will appear here once you make your first contribution.</p>
              <Link to="/donate" className="mt-4">
                <Button size="sm" className="bg-primary text-primary-foreground font-bold">Make Your First Donation</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Program</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">No results for "{search}"</td></tr>
                  ) : filtered.map((d, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">{d.date}</td>
                      <td className="py-3 px-4 text-gray-900" style={{ fontWeight: 600 }}>₹{d.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 text-gray-700">{d.program}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="bg-green-50 text-green-700">{d.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={() => toast.success("Download started", { description: `Preparing receipt for ${d.date}` })}>
                          <Download className="h-3 w-3 mr-1" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
