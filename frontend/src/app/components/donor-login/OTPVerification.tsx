import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { motion } from "motion/react";

interface OTPVerificationProps {
  identifier: string;
  onSuccess: (name?: string, role?: string, payload?: any) => void;
  onBack: () => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export function OTPVerification({ identifier, onSuccess, onBack }: OTPVerificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useAuth();

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    setError(null);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === OTP_LENGTH - 1) {
      const fullOtp = newDigits.join("");
      if (fullOtp.length === OTP_LENGTH) {
        handleSubmit(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpDigits(digits);
      setError(null);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      // Auto-submit
      setTimeout(() => handleSubmit(pastedData), 100);
    }
  };

  const handleSubmit = useCallback(async (otpString?: string) => {
    const otp = otpString || otpDigits.join("");
    if (otp.length !== OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await auth.verifyOtp(identifier, otp);
      if (response.success) {
        toast.success("Verification successful! Welcome to your dashboard.");
        login(identifier, true, response.name, response.role || 'DONOR', {
          volunteerId: response.volunteerId,
          donorId: response.donorId,
        });
        onSuccess(response.name ?? undefined, response.role, {
          volunteerId: response.volunteerId,
          donorId: response.donorId,
        });
      } else {
        setError("Invalid OTP. Please try again.");
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      const msg = error.message || "Verification failed. Please try again.";
      setError(msg);
      // Clear digits on error
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }, [otpDigits, identifier, login, onSuccess]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      const response = await auth.resendOtp(identifier);
      if (response.success) {
        toast.success("A new OTP has been sent to your email.");
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = identifier.includes("@")
    ? identifier.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : identifier;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md mx-auto relative"
    >
      {/* Decorative glows */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--womb-forest)]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-black/5">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 -ml-3 rounded-2xl h-9 px-4 transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100/50 border border-emerald-100/50 flex items-center justify-center shadow-sm"
            >
              <ShieldCheck className="h-6 w-6 text-[var(--womb-forest)]" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[28px] font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Verify Identity
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[14px] text-gray-500 font-medium mt-2"
            >
              Enter the 6-digit code sent to{" "}
              <span className="font-bold text-gray-700">{maskedEmail}</span>
            </motion.p>
          </div>

          {/* Dev OTP Display (only in dev mode) */}
          {sessionStorage.getItem("dev_otp") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-amber-50/80 border border-amber-200/60 rounded-2xl text-center"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                Development Mode — OTP
              </div>
              <div className="text-xl font-black tracking-[0.3em] text-amber-700 font-mono">
                {sessionStorage.getItem("dev_otp")}
              </div>
            </motion.div>
          )}

          {/* OTP Input Grid */}
          <div className="flex justify-center gap-2.5 sm:gap-3 mb-6">
            {otpDigits.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 bg-white/60 backdrop-blur-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] ${
                  digit
                    ? "border-[var(--womb-forest)] text-gray-900 ring-2 ring-[var(--womb-forest)]/20"
                    : error
                    ? "border-red-300 text-gray-900"
                    : "border-gray-200/80 text-gray-900 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20"
                }`}
                disabled={isSubmitting}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50/80 border border-red-200/60 rounded-2xl text-center"
            >
              <p className="text-[12px] text-red-600 font-bold">{error}</p>
            </motion.div>
          )}

          {/* Verify Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => handleSubmit()}
              disabled={isSubmitting || otpDigits.join("").length !== OTP_LENGTH}
              className="w-full relative group overflow-hidden bg-gradient-to-br from-[var(--womb-forest)] via-emerald-700 to-emerald-800 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] text-white font-black h-14 rounded-2xl transition-all duration-500 hover:-translate-y-0.5 active:scale-[0.98] border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-3 text-base">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Verify & Continue
                  </>
                )}
              </span>
            </Button>
          </motion.div>

          {/* Resend Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <span className="text-[13px] text-gray-400 font-medium">Didn't receive a code? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className={`text-[13px] font-bold transition-colors inline-flex items-center gap-1 ${
                resendCooldown > 0 || isResending
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-[var(--womb-forest)] hover:text-emerald-800 hover:underline"
              }`}
            >
              {isResending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </motion.div>

          {/* Security Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 opacity-60">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Encrypted & Secure Verification
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
