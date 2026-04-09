import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2, Download, LayoutDashboard, Heart, Lock, Sparkles, CreditCard, ChevronRight, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { certificateApi } from "../lib/api/certificates";
import { useAuth } from "../context/AuthContext";

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
  const userExists = searchParams.get("userExists") === "true";
  const isVolunteerAlready = searchParams.get("isVolunteer") === "true";
  
  const { state } = useAuth();
  const isLoggedIn = !!state.user;

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

  function getDashboardInfo() {
    if (isLoggedIn) {
      return {
        title: "Welcome Back!",
        description: "You're already logged in. Head over to your dashboard to see your updated impact and rewards.",
        buttonText: "Enter Dashboard",
        icon: LayoutDashboard,
        color: "var(--womb-forest)",
        target: state.user?.volunteerId ? "/volunteer/dashboard" : "/donor/dashboard"
      };
    }

    if (userExists) {
      return {
        title: "Access Your Profile",
        description: "An account with this email already exists. Please login to securely view your certificates and track your impact.",
        buttonText: "Login to Dashboard",
        icon: Lock,
        color: "var(--journey-saffron)",
        target: `/donor/login?email=${encodeURIComponent(email)}&from=donation`
      };
    }

    if (wantsToVolunteer) {
      return {
        title: "Finish Your Setup",
        description: "Since you expressed interest in volunteering, please complete your profile to start earning Impact Rewards.",
        buttonText: "Complete Volunteer Profile",
        icon: Users,
        color: "var(--womb-forest)",
        target: `/volunteer/onboarding?name=${encodeURIComponent(searchParams.get("name") || "")}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(searchParams.get("mobile") || "")}&amount=${amount}`
      };
    }

    return {
      title: "Track Your Impact",
      description: "Create a password to securely access your 80G receipts and see exactly how your donation is being used.",
      buttonText: "Register to Dashboard",
      icon: Sparkles,
      color: "var(--womb-forest)",
      target: `/donor/register?email=${encodeURIComponent(email)}&name=${encodeURIComponent(searchParams.get("name") || "")}`
    };
  }

  const dashInfo = getDashboardInfo();

  function enterDashboard() {
    navigate(dashInfo.target);
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
            <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm text-left transition-all duration-300`} 
                 style={{ backgroundColor: dashInfo.color === "var(--womb-forest)" ? "#f0faf450" : "#fff9f050", borderColor: `${dashInfo.color}20` }}>
               <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" 
                      style={{ backgroundColor: `${dashInfo.color}15` }}>
                   <dashInfo.icon className="w-7 h-7" style={{ color: dashInfo.color }} />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-xl font-black text-gray-900 mb-2">{dashInfo.title}</h3>
                   <p className="text-[14px] text-gray-600 leading-relaxed mb-5">
                     {dashInfo.description}
                   </p>
                   <button
                     onClick={enterDashboard}
                     className="group inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                     style={{ 
                       background: dashInfo.color === "var(--womb-forest)" 
                         ? "linear-gradient(to right, var(--womb-forest), #10b981)" 
                         : "linear-gradient(to right, var(--journey-saffron), #f97316)",
                       boxShadow: `0 8px 25px -8px ${dashInfo.color}70`
                     }}
                   >
                     <span>{dashInfo.buttonText}</span>
                     <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                   </button>
                 </div>
               </div>
            </div>
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
