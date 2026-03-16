import { useSearchParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, Download, LayoutDashboard, Mail, Heart, Lock } from "lucide-react";
import { toast } from "sonner";

export function DonationSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const amount = Number(searchParams.get("amount") || "0");
  const paymentId = searchParams.get("paymentId") || "N/A";
  const isDashboardEligible = amount >= 5000;

  function downloadReceipt() {
    toast.info("Receipt download will be available once backend integration is completed.");
  }

  return (
    <section className="min-h-[80vh] py-20 bg-emerald-50 flex items-center text-gray-900">
      <div className="mx-auto max-w-2xl px-4 w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-md">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontWeight: 800 }}>
            Donation Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your donation of{" "}
            <span className="font-bold text-gray-900">₹{amount.toLocaleString("en-IN")}</span>{" "}
            has been successfully received.
          </p>
        </div>

        {/* Payment ID Card */}
        <Card className="mb-4 border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Transaction ID</p>
                <p className="font-mono text-sm font-semibold text-gray-800">{paymentId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt & Certificate Card */}
        <Card className="mb-4 border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-5 pb-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Your receipt is available for download.</p>
              <p className="text-sm text-gray-600">
                A copy of your donation receipt and 80G certificate has been sent to your registered email address.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700">
                <strong>80G Certificate</strong> — Your tax exemption certificate has been sent to your registered email.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Access Card */}
        {!isDashboardEligible && (
          <Card className="mb-6 border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="pt-5 pb-5 flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Donor Dashboard Locked</p>
                <p className="text-sm text-amber-700 mt-1">
                  To unlock the full Donor Dashboard, your cumulative donation should be ₹5,000 or more.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={downloadReceipt}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" /> Download Receipt
          </Button>

          {isDashboardEligible ? (
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" /> Go to Donor Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/dashboard-preview")}
              variant="outline"
              className="flex-1 border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" /> View Dashboard Preview
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
