import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Loader2, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { motion } from "motion/react";

interface DualOtpVerificationProps {
  identifier: string; // The email used for login/registration
  mobile?: string; // The mobile number used for registration (if applicable)
  requiresMobileOtp?: boolean; // explicitly define if it requires mobile OTP
  role: 'VOLUNTEER' | 'PARTNER' | 'DONOR';
  onSuccess: (name?: string, role?: string, payload?: any) => void;
  onBack: () => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export function DualOtpVerification(props: DualOtpVerificationProps) {
  const { identifier, mobile, role, onSuccess, onBack } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // States for Email OTP
  const [emailOtpDigits, setEmailOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // States for Mobile OTP
  const [mobileOtpDigits, setMobileOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const mobileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  // Determine if mobile OTP is required based on presence of mobile prop or explicit flag
  const requireMobileOtp = props.requiresMobileOtp ?? !!mobile;

  useEffect(() => {
    emailInputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (
    index: number, 
    value: string, 
    type: 'email' | 'mobile',
    digits: string[],
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (value && !/^\d$/.test(value)) return;
    setError(null);
    const newDigits = [...digits];
    newDigits[index] = value;
    setFn(newDigits);

    if (value && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number, 
    e: React.KeyboardEvent<HTMLInputElement>,
    digits: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent,
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setFn(pastedData.split(""));
      setError(null);
      refs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = useCallback(async () => {
    const emailOtp = emailOtpDigits.join("");
    const mobileOtp = requireMobileOtp ? mobileOtpDigits.join("") : undefined;

    if (emailOtp.length !== OTP_LENGTH) {
      setError("Please complete the Email OTP.");
      return;
    }
    if (requireMobileOtp && mobileOtp?.length !== OTP_LENGTH) {
      setError("Please complete the Mobile OTP.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await auth.verifyDualOtp(identifier, emailOtp, mobileOtp);
      
      if (response.success) {
        toast.success("Identity verified successfully!");
        const finalRole = response.role || role;
        // Pass volunteerId/donorId as extra so AuthContext state has them
        const authPayload = {
          volunteerId: response.volunteerId,
          donorId: response.donorId,
        };
        login(identifier, true, response.name, finalRole, authPayload);
        onSuccess(response.name ?? undefined, finalRole, authPayload);
      } else {
        setError("Invalid OTP keys. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
      setEmailOtpDigits(Array(OTP_LENGTH).fill(""));
      if (requireMobileOtp) setMobileOtpDigits(Array(OTP_LENGTH).fill(""));
      emailInputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }, [emailOtpDigits, mobileOtpDigits, identifier, login, onSuccess, requireMobileOtp, role]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await auth.resendOtp(identifier);
      toast.success("Fresh OTPs have been dispatched.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setEmailOtpDigits(Array(OTP_LENGTH).fill(""));
      if (requireMobileOtp) setMobileOtpDigits(Array(OTP_LENGTH).fill(""));
      emailInputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.message || "Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const getThemeVars = () => {
    if (role === 'VOLUNTEER') return 'from-amber-600 via-yellow-500 to-amber-700 hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] ring-amber-500/20 focus:border-amber-500 bg-amber-50 text-amber-900 border-amber-200';
    if (role === 'PARTNER') return 'from-blue-600 via-sky-600 to-blue-800 hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)] ring-blue-500/20 focus:border-blue-500 bg-blue-50 text-blue-900 border-blue-200';
    return 'from-emerald-700 via-[var(--womb-forest)] to-emerald-900 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] ring-[var(--womb-forest)]/20 focus:border-[var(--womb-forest)] bg-emerald-50 text-emerald-900 border-emerald-200';
  };

  const themeVars = getThemeVars();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl mx-auto relative"
    >
      <div className="relative bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-black/5">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-500 hover:bg-gray-100 -ml-3 rounded-2xl h-9 px-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${themeVars.split(' ')[6]} ${themeVars.split(' ')[3]}`}>
              <ShieldCheck className={`h-6 w-6 ${themeVars.split(' ')[7]}`} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[28px] font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Dual Verification</h2>
            <p className="text-[14px] text-gray-500 font-medium mt-2">
              For security, please enter credentials dispatched to your linked endpoints.
            </p>
          </div>

          {/* Dev OTP Display (only in dev mode) */}
          {(sessionStorage.getItem("dev_otp") || sessionStorage.getItem("dev_mobile_otp")) && (
            <div className="mb-2 p-3 bg-amber-50/80 border border-amber-200/60 rounded-2xl text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                Development Mode — OTPs
              </div>
              {sessionStorage.getItem("dev_otp") && (
                <div className="text-sm font-black tracking-[0.3em] text-amber-700 font-mono">
                  ✉️ Email: {sessionStorage.getItem("dev_otp")}
                </div>
              )}
              {sessionStorage.getItem("dev_mobile_otp") && (
                <div className="text-sm font-black tracking-[0.3em] text-amber-700 font-mono">
                  📱 Mobile: {sessionStorage.getItem("dev_mobile_otp")}
                </div>
              )}
            </div>
          )}

          <div className="space-y-8">
            {/* Email OTP Group */}
            <div>
              <div className="flex items-center justify-between mb-3 text-sm">
                 <span className="font-bold text-gray-700">Email OTP</span>
                 <span className="text-gray-400 font-mono text-xs">{identifier}</span>
              </div>
              <div className="flex justify-center gap-2 sm:gap-3">
                {emailOtpDigits.map((digit, i) => (
                  <input
                    key={`email-${i}`}
                    ref={(el) => { emailInputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value, 'email', emailOtpDigits, setEmailOtpDigits, emailInputRefs)}
                    onKeyDown={(e) => handleKeyDown(i, e, emailOtpDigits, emailInputRefs)}
                    onPaste={(e) => i === 0 ? handlePaste(e, setEmailOtpDigits, emailInputRefs) : undefined}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-black rounded-2xl border-2 outline-none transition-all duration-200 shadow-sm ${digit ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-900'} focus:ring-2 focus:ring-opacity-20 ${themeVars.split(' ')[4]}`}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {/* Mobile OTP Group */}
            {requireMobileOtp && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 text-sm">
                   <span className="font-bold text-gray-700">Mobile SMS OTP</span>
                   <span className="text-gray-400 font-mono text-xs">{mobile || 'via SMS'}</span>
                </div>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {mobileOtpDigits.map((digit, i) => (
                    <input
                      key={`mob-${i}`}
                      ref={(el) => { mobileInputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value, 'mobile', mobileOtpDigits, setMobileOtpDigits, mobileInputRefs)}
                      onKeyDown={(e) => handleKeyDown(i, e, mobileOtpDigits, mobileInputRefs)}
                      onPaste={(e) => i === 0 ? handlePaste(e, setMobileOtpDigits, mobileInputRefs) : undefined}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-black rounded-2xl border-2 outline-none transition-all duration-200 shadow-sm ${digit ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-900'} focus:ring-2 focus:ring-opacity-20 ${themeVars.split(' ')[4]}`}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-8 p-3 bg-red-50 border border-red-200 rounded-2xl text-center">
              <p className="text-[12px] text-red-600 font-bold">{error}</p>
            </div>
          )}

          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || emailOtpDigits.join("").length !== OTP_LENGTH || (requireMobileOtp && mobileOtpDigits.join("").length !== OTP_LENGTH)}
              className={`w-full relative group overflow-hidden bg-gradient-to-br text-white font-black h-14 rounded-2xl transition-all duration-500 hover:-translate-y-0.5 active:scale-[0.98] border-none disabled:opacity-50 disabled:cursor-not-allowed ${themeVars.split(' ').slice(0, 4).join(' ')}`}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-3 text-base">
                {isSubmitting ? (
                  <><Loader2 className="h-6 w-6 animate-spin" /> Verifying...</>
                ) : (
                  <><CheckCircle2 className="h-5 w-5" /> Authenticate Token</>
                )}
              </span>
            </Button>
          </div>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className={`text-[13px] font-bold inline-flex items-center gap-1 ${resendCooldown > 0 ? "text-gray-300" : "text-gray-600 hover:text-gray-900 hover:underline"}`}
            >
              {isResending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              {resendCooldown > 0 ? `Fresh tokens in ${resendCooldown}s` : "Resend Verification Tokens"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
