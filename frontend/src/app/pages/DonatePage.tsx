import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Heart, Shield, CheckCircle, CreditCard, Smartphone, Building2, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { DonationTabs } from "../components/forms/DonationTabs";
import { IndividualDonationForm } from "../components/forms/IndividualDonationForm";
import { OrganizationDonationForm } from "../components/forms/OrganizationDonationForm";

export function DonatePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [donationType, setDonationType] = useState<"individual" | "organization">("individual");
  const [finalAmount, setFinalAmount] = useState(0);
  const navigate = useNavigate();

  const simulateRazorpay = async (data: any) => {
    setIsProcessing(true);
    setFinalAmount(data.amount);

    // Step 1: Simulate order creation via API
    toast.info("Creating payment order...");
    await new Promise((r) => setTimeout(r, 800));

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    toast.success(`Order ${orderId} created`);

    // Step 2: Simulate Razorpay checkout opening
    await new Promise((r) => setTimeout(r, 600));
    toast.info("Opening Razorpay payment gateway...");

    // Step 3: Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Step 4: Simulate verification
    toast.info("Verifying payment...");
    await new Promise((r) => setTimeout(r, 800));

    toast.success(`Payment ${paymentId} verified successfully!`);
    setIsProcessing(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <section className="py-20 bg-gradient-to-br from-background via-emerald-950/50 to-background min-h-[80vh] flex items-center text-white">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-white mb-4" style={{ fontWeight: 800 }}>
            Thank You for Your Generosity!
          </h1>
          <p className="text-lg text-emerald-200/70 mb-3">
            Your donation of <span className="text-white" style={{ fontWeight: 700 }}>₹{finalAmount?.toLocaleString("en-IN")}</span> has been successfully processed.
          </p>
          <p className="text-sm text-emerald-200/50 mb-8">
            A confirmation email with your 80G tax receipt has been sent. You can also download it from your donor dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => {
                setShowSuccess(false);
              }}
            >
              Donate Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-background via-emerald-950/50 to-background text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4 fill-current" />
            <h1 className="text-4xl sm:text-5xl text-white mb-4" style={{ fontWeight: 800, lineHeight: 1.1 }}>
              Make a Difference Today
            </h1>
            <p className="text-lg text-emerald-200/70">
              Your donation directly funds prenatal care, nutrition, education, and empowerment programs. 100% tax deductible under 80G.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Donation Form Section */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">Support Our Mission</h2>
                <p className="text-">Choose the donation type that suits you best.</p>
              </div>

              <DonationTabs 
                onTypeChange={setDonationType}
                individualForm={
                  <IndividualDonationForm onSubmit={simulateRazorpay} isProcessing={isProcessing} />
                }
                organizationForm={
                  <OrganizationDonationForm onSubmit={simulateRazorpay} isProcessing={isProcessing} />
                }
              />

              <div className="mt-8 space-y-4">
                {/* Payment Flow */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs text-primary mb-3 font-bold uppercase tracking-wider">Secure Payment Flow:</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-600 flex-wrap">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-semibold">1. Select Type</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-gray-300" />
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-semibold">2. Fill Details</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-gray-300" />
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-semibold">3. Razorpay Secure Payment</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-gray-300" />
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-semibold">4. Receipt Generation</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center justify-center gap-6 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CreditCard className="h-3.5 w-3.5" /> Cards
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Smartphone className="h-3.5 w-3.5" /> UPI
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Building2 className="h-3.5 w-3.5" /> Net Banking
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-4 pt-16">
              <Card className="border-primary/20 bg-white">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <h4 className="mb-2 font-bold text-gray-900">100% Tax Deductible</h4>
                  <p className="text-sm text-gray-600">
                    All donations are eligible for tax exemption under Section 80G. Your certificate will be issued instantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-100 bg-white">
                <CardContent className="pt-6">
                  <h4 className="mb-4 text-gray-900 font-bold text-sm">Why Donate?</h4>
                  <ul className="space-y-3">
                    {[
                      "Funds life-saving prenatal care",
                      "Supports education for rural children",
                      "Provides high-quality nutrition",
                      "Empowers local communities"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-gray-200 bg-transparent">
                <CardContent className="pt-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">Securely Powered by</p>
                  
                  <img src="/razorpay.svg" alt="razorpay" className="w-24 h-24 mx-auto -mt-4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}



