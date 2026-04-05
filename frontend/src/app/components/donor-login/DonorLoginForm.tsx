import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2, Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

// --- Schemas ---
const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Donor ID is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/\d/, "Must contain a number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Must contain a special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Name too long"),
  mobile: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+91[\s-]?)?[6-9]\d{9}$/.test(val.replace(/[\s-]/g, "")),
      { message: "Enter a valid Indian mobile number (e.g. +91 9876543210)" }
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface DonorLoginFormProps {
  onSuccess: (eligible: boolean, identifier: string, otpSent?: boolean, requiresMobileOtp?: boolean) => void;
}

// Custom Input Animation Variants
const inputWrapperVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// --- Password Strength Indicator ---
function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", valid: password.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(password) },
    { label: "Lowercase", valid: /[a-z]/.test(password) },
    { label: "Number", valid: /\d/.test(password) },
    { label: "Special char", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const strength = checks.filter((c) => c.valid).length;
  const strengthLabel = strength <= 1 ? "Weak" : strength <= 3 ? "Fair" : strength <= 4 ? "Good" : "Strong";
  const strengthColor =
    strength <= 1 ? "bg-red-500" : strength <= 3 ? "bg-yellow-500" : strength <= 4 ? "bg-blue-500" : "bg-emerald-500";

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= strength ? strengthColor : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${
            strength <= 1
              ? "text-red-500"
              : strength <= 3
              ? "text-yellow-600"
              : strength <= 4
              ? "text-blue-500"
              : "text-emerald-600"
          }`}
        >
          {strengthLabel}
        </span>
      </div>

      {/* Individual checks */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            {check.valid ? (
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-300 shrink-0" />
            )}
            <span className={`text-[10px] font-medium ${check.valid ? "text-emerald-600" : "text-gray-400"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ----- Login Form -----
function LoginTab({ onSuccess }: DonorLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: prefillEmail },
  });

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await auth.login(data.identifier, data.password);

      if (response.token && !response.otpSent) {
        // Direct login — no OTP required
        const session = {
          identifier: data.identifier,
          eligible: response.eligible ?? false,
          token: response.token,
          name: response.name,
          donorId: response.donorId,
          volunteerId: response.volunteerId,
          role: response.role || 'DONOR',
        };
        localStorage.setItem("donor_session", JSON.stringify(session));
        authLogin(
          data.identifier,
          response.eligible ?? false,
          response.name || undefined,
          response.role || 'DONOR',
          { donorId: response.donorId, volunteerId: response.volunteerId },
        );
        toast.success("Welcome back!");
        const redirect = response.redirect || `/donor/${response.donorId}/dashboard`;
        navigate(redirect, { replace: true });
      } else if (response.otpSent) {
        // OTP flow (kept for volunteers logging in from donor form, or legacy)
        if (response.devOtp) {
          sessionStorage.setItem("dev_otp", response.devOtp);
        } else {
          sessionStorage.removeItem("dev_otp");
        }
        toast.success(response.message || "OTP sent to your email for verification.");
        onSuccess(response.eligible ?? false, data.identifier, true, response.requiresMobileOtp);
      } else {
        toast.error("Authentication failed. Please check your credentials.");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please verify your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.2 } }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mt-4"
    >
      <motion.div custom={0} variants={inputWrapperVariants} className="space-y-2">
        <Label className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 ml-1">
          Identity (Email or ID)
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-all duration-300" />
          <Input
            placeholder="e.g. donor@foundation.org"
            {...register("identifier")}
            className="pl-12 h-13 bg-white/50 border-gray-100 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/20 focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:bg-white hover:border-gray-200"
          />
        </div>
        {errors.identifier && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-red-500 font-bold ml-1 mt-1"
          >
            {errors.identifier.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div custom={1} variants={inputWrapperVariants} className="space-y-2">
        <Label className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 ml-1">
          Secure Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-all duration-300" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="pl-12 pr-12 h-13 bg-white/50 border-gray-100 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/20 focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:bg-white hover:border-gray-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--womb-forest)] transition-all duration-300 p-1 rounded-full hover:bg-gray-50"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-red-500 font-bold ml-1 mt-1"
          >
            {errors.password.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div custom={2} variants={inputWrapperVariants} className="pt-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative group overflow-hidden bg-gradient-to-br from-[var(--womb-forest)] via-emerald-700 to-emerald-800 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] text-white font-black h-14 rounded-2xl transition-all duration-500 hover:-translate-y-0.5 active:scale-[0.98] border-none"
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center justify-center gap-3 text-base">
            {isSubmitting ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </>
            )}
          </span>
        </Button>

        {/* Security note */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          <span className="text-[10px] text-gray-400 font-medium">
            Secure password-based authentication — no OTP required
          </span>
        </div>
      </motion.div>
    </motion.form>
  );
}

// ----- Register Form -----
function RegisterTab({ onSuccess }: DonorLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const response = await auth.register({
        email: data.email,
        password: data.password,
        name: data.name,
        mobile: data.mobile || undefined,
        isVolunteer: false,
        isNonDonor: false,
        referredById: refCode || undefined,
      });

      if (response.otpSent) {
        if (response.devOtp) {
          sessionStorage.setItem("dev_otp", response.devOtp);
        } else {
          sessionStorage.removeItem("dev_otp");
        }
        if (response.devMobileOtp) {
          sessionStorage.setItem("dev_mobile_otp", response.devMobileOtp);
        } else {
          sessionStorage.removeItem("dev_mobile_otp");
        }
        toast.success(response.message || "Account created! Check your email for the verification OTP.");
        onSuccess(false, data.email, true, response.requiresMobileOtp);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.2 } }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-2"
    >
      {/* Email */}
      <motion.div custom={0} variants={inputWrapperVariants} className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">
          Email Address *
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
          <Input
            placeholder="donor@example.com"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="pl-11 h-11 bg-white/60 border-gray-200/80 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/30 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:bg-white hover:border-gray-300"
          />
        </div>
        {errors.email && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 font-medium ml-1">
            {errors.email.message}
          </motion.p>
        )}
      </motion.div>

      {/* Name + Mobile */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div custom={1} variants={inputWrapperVariants} className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">
            Full Name *
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
            <Input
              placeholder="John Doe"
              autoComplete="name"
              {...register("name")}
              className="pl-11 h-11 bg-white/60 border-gray-200/80 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/30 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:bg-white hover:border-gray-300"
            />
          </div>
          {errors.name && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 font-medium ml-1">
              {errors.name.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div custom={2} variants={inputWrapperVariants} className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">
            Mobile
          </Label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
            <Input
              placeholder="+91 98765 43210"
              type="tel"
              autoComplete="tel"
              {...register("mobile")}
              className="pl-11 h-11 bg-white/60 border-gray-200/80 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/30 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:bg-white hover:border-gray-300"
            />
          </div>
          {errors.mobile && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 font-medium ml-1">
              {errors.mobile.message}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Password */}
      <motion.div custom={3} variants={inputWrapperVariants} className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">
          Password *
        </Label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            {...register("password")}
            className="pl-11 pr-11 h-11 bg-white/60 border-gray-200/80 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/30 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:bg-white hover:border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--womb-forest)] transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 font-medium ml-1">
            {errors.password.message}
          </motion.p>
        )}
        <AnimatePresence>
          <PasswordStrengthIndicator password={passwordValue} />
        </AnimatePresence>
      </motion.div>

      {/* Confirm Password */}
      <motion.div custom={4} variants={inputWrapperVariants} className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">
          Confirm Password *
        </Label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="pl-11 pr-11 h-11 bg-white/60 border-gray-200/80 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/30 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:bg-white hover:border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--womb-forest)] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 font-medium ml-1">
            {errors.confirmPassword.message}
          </motion.p>
        )}
      </motion.div>

      {/* Submit */}
      <motion.div custom={5} variants={inputWrapperVariants}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-[var(--womb-forest)] to-emerald-700 hover:to-emerald-600 text-white font-bold h-12 shadow-[0_8px_20px_-6px_var(--womb-forest)] hover:shadow-[0_12px_25px_-6px_var(--womb-forest)] mt-2 rounded-2xl transition-all duration-300 active:scale-[0.98] border-none"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl" />
          <span className="relative flex items-center justify-center gap-2">
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Create Account & Verify{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </Button>

        {/* Security note */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          <span className="text-[10px] text-gray-400 font-medium">
            An OTP will be sent to your email for verification
          </span>
        </div>
      </motion.div>
    </motion.form>
  );
}

// Main Shell
export function DonorLoginForm({ onSuccess }: DonorLoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[440px] relative mt-8 lg:mt-0"
    >
      {/* Decorative Glow Elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--womb-forest)]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-black/5">
        <div className="p-8 sm:p-10">

          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 -ml-3 rounded-2xl h-9 px-4 transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100/50 border border-emerald-100/50 flex items-center justify-center shadow-sm"
            >
              <Sparkles className="h-5 w-5 text-[var(--womb-forest)]" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <motion.h2
              key={isRegistering ? "register" : "login"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[28px] leading-tight font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {isRegistering ? "Join the Mission." : "Welcome Back."}
            </motion.h2>
            <motion.p
              key={isRegistering ? "register-sub" : "login-sub"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[15px] text-gray-500 font-medium mt-2"
            >
              {isRegistering
                ? "Register below to start making an impact."
                : "Sign in to your mission dashboard."}
            </motion.p>
          </div>

          {/* Premium Tab Toggle */}
          <div className="flex p-1.5 bg-gray-100/60 backdrop-blur-md rounded-2xl mb-8 border border-gray-200/50 shadow-inner relative">
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.04]"
              animate={{ x: isRegistering ? "calc(100% + 12px)" : "0%" }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            />
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`relative z-10 flex-1 py-2 text-[14px] font-bold rounded-2xl transition-colors duration-300 ${
                !isRegistering ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`relative z-10 flex-1 py-2 text-[14px] font-bold rounded-2xl transition-colors duration-300 ${
                isRegistering ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Container */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {isRegistering ? (
                <RegisterTab key="register" onSuccess={onSuccess} />
              ) : (
                <LoginTab key="login" onSuccess={onSuccess} />
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.div>
  );
}