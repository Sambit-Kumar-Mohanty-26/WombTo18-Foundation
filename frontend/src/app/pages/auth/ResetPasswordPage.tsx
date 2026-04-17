import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/\d/, "Must contain a number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Must contain a special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", valid: password.length >= 8 },
    { label: "A-Z", valid: /[A-Z]/.test(password) },
    { label: "a-z", valid: /[a-z]/.test(password) },
    { label: "0-9", valid: /\d/.test(password) },
    { label: "Symbol", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const strength = checks.filter((c) => c.valid).length;
  const strengthColor =
    strength <= 1 ? "bg-red-500" : strength <= 3 ? "bg-yellow-500" : strength <= 4 ? "bg-blue-500" : "bg-emerald-500";

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? strengthColor : "bg-gray-100"
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1">
            {check.valid ? (
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
            ) : (
              <XCircle className="h-2.5 w-2.5 text-gray-200" />
            )}
            <span className={`text-[9px] font-bold uppercase tracking-tight ${check.valid ? "text-emerald-600" : "text-gray-400"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const type = searchParams.get("type");

  useEffect(() => {
    if (!token || !email || !type) {
      toast.error("Invalid or missing reset token.");
      navigate("/login");
    }
  }, [token, email, type, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email || !type) return;
    
    setIsSubmitting(true);
    try {
      const response = await auth.resetPassword({
        email,
        token,
        type,
        newPassword: data.password,
      });

      if (response.success) {
        toast.success("Password updated successfully!");
        
        let loginPath = "/login";
        if (type === "VOLUNTEER") loginPath = "/volunteer/login";
        else if (type === "PARTNER") loginPath = "/partner/login";
        else if (type === "DONOR") loginPath = "/donor/login";
        else if (type === "ADMIN") loginPath = "/admin/login";
        
        navigate(`${loginPath}?email=${encodeURIComponent(email)}`, { replace: true });
      } else {
        toast.error(response.message || "Failed to reset password.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#FFFDF7] relative overflow-hidden py-10 px-4">
      {/* Ambient Premium Light Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--womb-forest)] opacity-[0.04] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[60%] rounded-full bg-[var(--future-sky)] opacity-[0.04] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-black/5 p-8 sm:p-10">
          
          <div className="flex items-center justify-between mb-8">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-[var(--womb-forest)]" />
            </div>
            <Sparkles className="h-5 w-5 text-emerald-300" />
          </div>

          <div className="mb-8">
            <h2 className="text-[28px] leading-tight font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Secure Password Reset
            </h2>
            <p className="text-[15px] text-gray-500 font-medium mt-2">
              Set a strong new password for your account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 ml-1">
                New Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-all duration-300" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="pl-12 pr-12 h-13 bg-white/50 border-gray-100 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/20 focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--womb-forest)] transition-all duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">
                  {errors.password.message}
                </p>
              )}
              <PasswordStrengthIndicator password={passwordValue} />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 ml-1">
                Confirm New Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-all duration-300" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="pl-12 h-13 bg-white/50 border-gray-100 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/20 focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:bg-white"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-gradient-to-br from-[var(--womb-forest)] via-emerald-700 to-emerald-800 text-white font-black h-14 rounded-2xl transition-all duration-500 hover:-translate-y-0.5"
            >
              <span className="relative flex items-center justify-center gap-3 text-base">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </form>

        </div>
      </motion.div>
    </section>
  );
}
