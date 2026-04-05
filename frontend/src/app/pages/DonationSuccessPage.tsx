import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2, Download, LayoutDashboard, Heart, Lock, Sparkles, CreditCard, ChevronRight, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { certificateApi } from "../lib/api/certificates";

export function DonationSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const amount = Number(searchParams.get("amount") || "0");
  const paymentId = searchParams.get("paymentId") || "N/A";
  const wantsToVolunteer = searchParams.get("volunteer") === "true";
  const isDashboardEligible = amount >= 5000;
  const certId = searchParams.get("certId") || "";
  const donationId = searchParams.get("donationId") || "";
  const donorId = searchParams.get("donorId") || "";
  const email = searchParams.get("email") || "";
  const certificateUrl = searchParams.get("certificateUrl") || "";

  const [countdown, setCountdown] = useState(5);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!wantsToVolunteer) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/volunteer-onboarding?name=${encodeURIComponent(searchParams.get("name") || "")}&email=${encodeURIComponent(searchParams.get("email") || "")}&mobile=${encodeURIComponent(searchParams.get("mobile") || "")}&amount=${amount}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [wantsToVolunteer, navigate]);

  async function downloadReceipt() {
    if (downloading) return;
    setDownloading(true);
    
    try {
      // Prioritize the dedicated API download endpoint rather than static file fetch
      if (certId) {
        await certificateApi.download80G(certId);
        toast.success("80G Certificate downloaded!");
        return;
      }

      // Fallback: Generate on-the-fly by donationId
      if (donationId) {
        await certificateApi.download80GByDonation(donationId);
        toast.success("80G Certificate downloaded!");
        return;
      }

      toast.error("Certificate is not available yet. Please try from your dashboard.");
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error("Download failed. Please try again from your dashboard.");
    } finally {
      setDownloading(false);
    }
  }

  function enterDashboard() {
    // If donor has a donorId, navigate to donor login with their email pre-filled
    if (email) {
      navigate(`/donor/login?email=${encodeURIComponent(email)}&from=donation`);
    } else {
      navigate("/donor/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24 pb-12 sm:pt-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0faf4] via-[#fef6ed]/40 to-[#FFFDF7] pointer-events-none" />
      <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_65%)] opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_65%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
            className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[var(--womb-forest)] to-emerald-500 shadow-[0_8px_30px_-5px_rgba(29,110,63,0.4)] flex items-center justify-center mb-8 relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-pulse" />
            <CheckCircle2 className="w-12 h-12 text-white relative z-10" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase mb-4 border shadow-sm backdrop-blur-sm bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] border-[var(--womb-forest)]/20"
          >
            <Sparkles className="w-3.5 h-3.5" /> Payment Successful
          </motion.div>

          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Thank you for your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-400 drop-shadow-sm">
              Generosity.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Your donation of <span className="font-black text-gray-900">₹{amount.toLocaleString("en-IN")}</span> has been securely processed. It's already making an impact.
          </p>
        </motion.div>

        {/* Transaction Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] mb-6 text-left relative overflow-hidden"
        >
          {/* Subtle gradient border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--womb-forest)] via-[var(--journey-saffron)] to-transparent opacity-50" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--womb-forest)]/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-[var(--womb-forest)]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="font-mono text-sm sm:text-base font-semibold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{paymentId}</p>
                </div>
             </div>
             
             <button
                onClick={downloadReceipt}
                disabled={downloading}
                className="group flex items-center gap-2 text-sm font-bold text-[var(--womb-forest)] hover:text-emerald-700 transition-colors w-full sm:w-auto bg-[var(--womb-forest)]/5 hover:bg-[var(--womb-forest)]/10 px-4 py-2.5 rounded-xl text-center justify-center disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {downloading ? "Downloading..." : "Download 80G Receipt"}
              </button>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="mb-8"
        >
          {wantsToVolunteer ? (
            <div className="rounded-3xl border border-[var(--womb-forest)]/20 bg-gradient-to-br from-[#f0faf4] to-emerald-50/50 p-6 sm:p-8 shadow-sm text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--womb-forest)]/10 flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-[var(--womb-forest)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-2">Volunteer Registration</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-5">
                    Thank you for offering your time. You are being securely redirected to complete your volunteer profile in{" "}
                    <span className="font-bold text-[var(--womb-forest)]">{countdown}s</span>...
                  </p>
                  <button
                    onClick={() => navigate(`/volunteer-onboarding?name=${encodeURIComponent(searchParams.get("name") || "")}&email=${encodeURIComponent(searchParams.get("email") || "")}&mobile=${encodeURIComponent(searchParams.get("mobile") || "")}&amount=${amount}`)}
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_-3px_rgba(29,110,63,0.3)] hover:shadow-lg transition-all duration-300"
                  >
                    <span>Continue to Profile Now</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : isDashboardEligible ? (
             <div className="rounded-3xl border border-[var(--journey-saffron)]/20 bg-gradient-to-br from-white to-[#fff9f0] p-6 sm:p-8 shadow-sm text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--journey-saffron)]/15 flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-[var(--journey-saffron)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">Donor Dashboard Unlocked!</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      Because your contribution is ₹5,000 or above, you have exclusive access to view real-time tracking of your funds and impact reports.
                    </p>
                    <button
                      onClick={enterDashboard}
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-[var(--journey-saffron)] to-orange-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_-3px_rgba(255,153,0,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(255,153,0,0.5)] transition-all duration-300"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Enter Dashboard
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
             </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8 text-left">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-gray-200/60 flex items-center justify-center shrink-0">
                   <Lock className="w-5 h-5 text-gray-500" />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-base font-black text-gray-900 mb-1">Impact Dashboard Preview</h3>
                   <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                     You can view a sample of our transparency dashboard. Cumulative donations of ₹5,000+ unlock full personalized access.
                   </p>
                   <button
                     onClick={() => navigate("/dashboard-preview")}
                     className="group inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200"
                   >
                     <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> View Preview
                   </button>
                 </div>
               </div>
            </div>
          )}
        </motion.div>

        {/* Home Button */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.6, delay: 0.6 }}
           className="text-center"
        >
          <button onClick={() => navigate("/")} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-2">
            ← Return to Homepage
          </button>
        </motion.div>
      </div>
    </div>
  );
}
