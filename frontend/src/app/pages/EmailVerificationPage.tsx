import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, X, Mail } from "lucide-react";
import { motion } from "motion/react";

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const email = searchParams.get("email");

  useEffect(() => {
    // In a real backend, we'd hit exactly this: `await fetch('/api/verify/email?token=' + searchParams.get("token"))`
    // Since we are mocking the email JS verification link for "industry-readiness", we verify implicitly if email is present.
    
    if (!email) {
      setStatus("error");
      return;
    }

    // Simulate network delay for verification
    const timer = setTimeout(() => {
      // Announce verified status to any open tabs!
      localStorage.setItem("ADVISORY_EMAIL_VERIFIED", email);
      setStatus("success");
    }, 1500);

    return () => clearTimeout(timer);
  }, [email]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center shadow-[0_20px_40px_-15px_rgba(189,179,161,0.2)]">
        
        {status === "verifying" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6 relative">
              <Mail className="w-8 h-8 relative z-10" />
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin opacity-20" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 font-serif">Verifying Email</h2>
            <p className="text-sm font-medium text-slate-500">Checking secure token...</p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 font-serif">Email Verified!</h2>
            <p className="text-sm font-medium text-slate-500 mb-8">
              {email} has been successfully verified. You can safely close this tab and return to your application form.
            </p>
            <button onClick={() => window.close()} className="w-full h-12 rounded-xl bg-[var(--womb-forest)] text-white font-bold hover:-translate-y-0.5 transition-transform shadow-sm">
              Close Tab
            </button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6">
              <X className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 font-serif">Invalid Link</h2>
            <p className="text-sm font-medium text-slate-500 mb-8">
              This verification link is invalid, expired, or missing credentials.
            </p>
            <Link to="/" className="w-full flex items-center justify-center h-12 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">
              Return Home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
