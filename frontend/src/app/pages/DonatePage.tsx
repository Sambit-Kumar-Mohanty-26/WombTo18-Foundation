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
  const [donationType, setDonationType] = useState<"individual" | "organization">("individual");
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount: number, donorDetails: any) => {
    setIsProcessing(true);

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    toast.info("Initializing Razorpay checkout...");

    const options = {
      // @ts-ignore
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "WombTo18 Foundation",
      description: "Donation Payment",
      handler: function (response: any) {
        console.log("Payment successful:", response);
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);

        setIsProcessing(false);
        navigate(`/donation-success?amount=${amount}&paymentId=${response.razorpay_payment_id}`);
      },
      prefill: {
        name: donorDetails.name || donorDetails.organizationName || "",
        email: donorDetails.email || "",
        contact: donorDetails.mobile || donorDetails.contactNumber || ""
      },
      theme: {
        color: "#10b981"
      }
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      toast.error(`Payment failed: ${response.error.description}`);
      setIsProcessing(false);
    });

    rzp.open();
  };


  return (
    <>
      <section className="py-16 bg-emerald-50 text-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4 fill-current" />
            <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 800, lineHeight: 1.1 }}>
              Make a Difference Today
            </h1>
            <p className="text-lg text-gray-600">
              Your donation directly funds prenatal care, nutrition, education, and empowerment programs. 100% tax deductible under 80G.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
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
                  <IndividualDonationForm onSubmit={(data) => handlePayment(data.amount, data)} isProcessing={isProcessing} />
                }
                organizationForm={
                  <OrganizationDonationForm onSubmit={(data) => handlePayment(data.amount, data)} isProcessing={isProcessing} />
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



