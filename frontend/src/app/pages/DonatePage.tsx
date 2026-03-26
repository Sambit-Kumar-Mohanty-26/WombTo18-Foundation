import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Heart, Shield, CheckCircle, CreditCard, Smartphone, Building2, ArrowRight, Activity, BookOpen, Utensils, Award, Leaf } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { DonationTabs } from "../components/forms/DonationTabs";
import { IndividualDonationForm } from "../components/forms/IndividualDonationForm";
import { OrganizationDonationForm } from "../components/forms/OrganizationDonationForm";
import { motion } from "motion/react";

const impactTiers = [
  { id: 't1', icon: Utensils, title: "Nutrition Pack", amount: 1500, desc: "Monthly nutritional supplements for 1 expecting mother.", color: "border-orange-200 bg-orange-50 text-orange-600" },
  { id: 't2', icon: Activity, title: "Vaccine Lifeline", amount: 3000, desc: "Complete immunization schedule tracking for 5 infants.", color: "border-[var(--journey-saffron)]/30 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)]" },
  { id: 't3', icon: BookOpen, title: "School Health", amount: 5000, desc: "Full year of health screenings for 10 school children.", color: "border-[var(--future-sky)]/30 bg-[var(--future-sky)]/10 text-[var(--future-sky)]" },
  { id: 't4', icon: Heart, title: "Maternal Care", amount: 10000, desc: "End-to-end prenatal care and hospital transport for 2 drops.", color: "border-[var(--womb-forest)]/30 bg-[var(--womb-forest)]/10 text-[var(--womb-forest)]" },
  { id: 't5', icon: Award, title: "Youth Empowerment", amount: 25000, desc: "Vocational skills and mental wellness counseling for 10 adolescents.", color: "border-indigo-200 bg-indigo-50 text-indigo-600" },
  { id: 't6', icon: Leaf, title: "Green Cohort", amount: 50000, desc: "Sponsor a carbon-neutral village cluster (tree planting + care).", color: "border-[#a7e8c3] bg-[#f0faf4] text-[#1D6E3F]" }
];

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
        setIsProcessing(false);
        navigate(`/donation-success?amount=${amount}&paymentId=${response.razorpay_payment_id}`);
      },
      prefill: {
        name: donorDetails.name || donorDetails.organizationName || "",
        email: donorDetails.email || "",
        contact: donorDetails.mobile || donorDetails.contactNumber || ""
      },
      theme: { color: "#FF9900" }
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      toast.error(`Payment failed: ${response.error.description}`);
      setIsProcessing(false);
    });

    rzp.open();
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-[var(--journey-saffron)] text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Invest in a Generation</h1>
          <p className="text-lg text-teal-100 font-medium">
            Your donation powers India's most comprehensive 0-18 child health platform. <br className="hidden sm:block"/> 100% transparent. Donations are eligible for tax benefits under Section 80G.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactTiers.map(tier => (
            <motion.div whileHover={{ y: -4 }} key={tier.id} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#d1f5e0] text-[#155e33] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-[#a7e8c3]">
                Tax Saving
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${tier.color}`}>
                <tier.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.title}</h3>
              <p className="text-2xl font-black text-[var(--womb-forest)] mb-3">₹{tier.amount.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-500 flex-1 leading-relaxed">{tier.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Forms & Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Make Your Contribution</h2>
              <p className="text-gray-500">Select whether you are donating as an individual or an organization.</p>
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

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex justify-center items-center gap-6 opacity-60">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600"><CreditCard className="w-5 h-5" /> Cards</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600"><Smartphone className="w-5 h-5" /> UPI</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600"><Building2 className="w-5 h-5" /> Net Banking</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* 80G Illustrated Flow */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-[var(--journey-saffron)]" />
                Instant 80G Certificate Flow
              </h3>
              
              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--journey-saffron)] before:via-[var(--womb-forest)] before:to-gray-200">
                <div className="relative flex items-center gap-6">
                  <div className="!absolute left-0 w-8 h-8 -ml-[16px] flex items-center justify-center bg-white border-4 border-[var(--journey-saffron)] rounded-full z-10">
                    <span className="text-xs font-bold text-[var(--journey-saffron)]">1</span>
                  </div>
                  <div className="ml-6 flex-1">
                    <p className="font-bold text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-500">Complete transaction securely via Razorpay.</p>
                  </div>
                </div>

                <div className="relative flex items-center gap-6">
                  <div className="!absolute left-0 w-8 h-8 -ml-[16px] flex items-center justify-center bg-white border-4 border-[var(--womb-forest)] rounded-full z-10">
                    <span className="text-xs font-bold text-[var(--womb-forest)]">2</span>
                  </div>
                  <div className="ml-6 flex-1">
                    <p className="font-bold text-gray-900">Auto-Generation</p>
                    <p className="text-sm text-gray-500">System processes your PAN & details instantly.</p>
                  </div>
                </div>

                <div className="relative flex items-center gap-6">
                  <div className="!absolute left-0 w-8 h-8 -ml-[16px] flex items-center justify-center bg-white border-4 border-gray-300 rounded-full z-10">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="ml-6 flex-1">
                    <p className="font-bold text-gray-900">Delivered to Inbox</p>
                    <p className="text-sm text-gray-500">80G PDF and tax receipt emailed within 2 mins.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--womb-forest)]/5 p-8 rounded-3xl border border-[var(--womb-forest)]/20 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[var(--womb-forest)] font-bold mb-4">Securely Processed By</p>
              <img src="/razorpay.svg" alt="Razorpay" className="h-10 mx-auto opacity-80" />
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                We use industry-standard 256-bit encryption. Your payment details are never stored on our servers.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}



