import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Download, Award, FileText, Calendar, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const certificates = [
  {
    id: "80G-2025-001",
    type: "80G Tax Certificate",
    financialYear: "FY 2025-26",
    amount: "₹1,00,000",
    date: "Mar 10, 2026",
    status: "Available",
  },
  {
    id: "80G-2024-001",
    type: "80G Tax Certificate",
    financialYear: "FY 2024-25",
    amount: "₹2,00,000",
    date: "Apr 15, 2025",
    status: "Available",
  },
  {
    id: "80G-2023-001",
    type: "80G Tax Certificate",
    financialYear: "FY 2023-24",
    amount: "₹1,50,000",
    date: "Apr 10, 2024",
    status: "Available",
  },
  {
    id: "DON-2025-001",
    type: "Donation Receipt",
    financialYear: "FY 2025-26",
    amount: "₹15,000",
    date: "Mar 5, 2026",
    status: "Available",
  },
  {
    id: "DON-2025-002",
    type: "Donation Receipt",
    financialYear: "FY 2025-26",
    amount: "₹20,000",
    date: "Feb 10, 2026",
    status: "Available",
  },
];

const appreciation = [
  { title: "Platinum Donor Certificate", year: "2025", description: "In recognition of cumulative donations exceeding ₹5,00,000" },
  { title: "Impact Champion Award", year: "2024", description: "For sponsoring the education of 10+ children" },
];

export function DonorCertificates() {
  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-700 mb-1 transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Certificates &amp; Receipts</h1>
        <p className="text-gray-600">Download your 80G certificates, donation receipts, and appreciation letters.</p>
      </div>

      {/* Appreciation */}
      <div className="grid sm:grid-cols-2 gap-4">
        {appreciation.map((a) => (
          <Card key={a.title} className="border-emerald-100 bg-emerald-50 mb-6">
            <CardContent className="pt-6">
              <Award className="h-8 w-8 text-primary mb-3" />
              <h4 className="text-lg text-gray-900" style={{ fontWeight: 600 }}>{a.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{a.description}</p>
              <div className="flex items-center justify-between mt-4">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{a.year}</Badge>
                <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700" onClick={() => toast.success("Download started", { description: `Downloading ${a.title}` })}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificates Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Tax Certificates & Receipts</CardTitle>
            <Button variant="outline" size="sm" className="bg-white text-gray-700 hover:bg-gray-50 border-gray-200" onClick={() => toast.success("Download started", { description: "Preparing ZIP file with all certificates" })}>
              <Download className="h-4 w-4 mr-2" /> Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 500 }}>Certificate ID</th>
                  <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 500 }}>Type</th>
                  <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 500 }}>Period</th>
                  <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 500 }}>Amount</th>
                  <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 500 }}>Issued</th>
                  <th className="text-left py-3 px-4 text-gray-500" style={{ fontWeight: 500 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900" style={{ fontWeight: 500 }}>{c.id}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        {c.type === "80G Tax Certificate" ? (
                          <Award className="h-4 w-4 text-amber-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-600" />
                        )}
                        {c.type}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{c.financialYear}</td>
                    <td className="py-3 px-4 text-gray-900" style={{ fontWeight: 600 }}>{c.amount}</td>
                    <td className="py-3 px-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {c.date}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary/80 hover:bg-primary/5" onClick={() => toast.success("Download started", { description: `Downloading ${c.id}.pdf` })}>
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
