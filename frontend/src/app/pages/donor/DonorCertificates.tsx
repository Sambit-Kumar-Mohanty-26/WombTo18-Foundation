import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Download, Award, FileText, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDonorData } from "../../lib/useDonorData";
import { useAuth } from "../../context/AuthContext";

export function DonorCertificates() {
  const { profile, donations, totalDonated, loading } = useDonorData();
  const { state } = useAuth();

  const donorName = profile?.name || state.user?.name || state.user?.identifier || "Donor";
  const donorId = profile?.donorId || "—";
  const tier = profile?.tier ?? "DONOR";

  // Generate receipt rows from real donation data
  const receipts = donations.map((d, i) => ({
    id: `RCT-${String(i + 1).padStart(3, "0")}`,
    type: "Donation Receipt",
    period: new Date(d.date).getFullYear().toString(),
    amount: d.amount,
    date: d.date,
  }));

  // Generate 80G certificate row (only if totalDonated > 0)
  const taxCerts = totalDonated > 0 ? [{
    id: `80G-${new Date().getFullYear()}-001`,
    type: "80G Tax Certificate",
    period: `FY ${new Date().getFullYear() - 1}-${String(new Date().getFullYear()).slice(-2)}`,
    amount: totalDonated,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  }] : [];

  const allDocuments = [...taxCerts, ...receipts];

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
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1D6E3F] mb-1 transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Certificates & Receipts</h1>
        <p className="text-gray-600">
          Documents for <span className="font-semibold text-gray-800">{donorName}</span>
          {" "}·{" "}
          <span className="font-mono text-gray-500">{donorId}</span>
        </p>
      </div>

      {/* Tier Badge Card */}
      {totalDonated > 0 ? (
        <Card className="border-[#d1f5e0] bg-[#f0faf4]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 font-bold">{tier} Tier Donor</h4>
                <p className="text-sm text-gray-600 mt-0.5">
                  Total donations: <span className="font-bold text-primary">₹{totalDonated.toLocaleString("en-IN")}</span>
                </p>
              </div>
              <Badge className="bg-[#d1f5e0] text-[#1D6E3F] font-bold">{tier}</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6 pb-6 text-center">
            <Award className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No certificates available yet. Make a donation to generate your first receipt & 80G certificate.</p>
            <Link to="/donate" className="mt-3 inline-block">
              <Button size="sm" className="bg-primary text-primary-foreground font-bold mt-2">Donate Now</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Documents Table */}
      {allDocuments.length > 0 && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Tax Certificates & Receipts</CardTitle>
              <Button
                variant="outline" size="sm"
                className="bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                onClick={() => toast.success("Download started", { description: "Preparing ZIP file with all your documents" })}
              >
                <Download className="h-4 w-4 mr-2" /> Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Document ID</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Period</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allDocuments.map((doc, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-900 font-medium font-mono text-xs">{doc.id}</td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          {doc.type === "80G Tax Certificate"
                            ? <Award className="h-4 w-4 text-amber-600" />
                            : <FileText className="h-4 w-4 text-blue-600" />}
                          {doc.type}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{doc.period}</td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">₹{doc.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 text-gray-500">{doc.date}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 text-xs text-primary hover:text-primary/80 hover:bg-primary/5"
                          onClick={() => toast.success("Download started", { description: `Preparing ${doc.id}.pdf` })}
                        >
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
      )}
    </div>
  );
}
