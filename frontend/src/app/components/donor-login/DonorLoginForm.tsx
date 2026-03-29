import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2, Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

// --- Schemas ---
const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Donor ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Full name is required"),
  mobile: z.string().optional(),
  isVolunteer: z.boolean().optional(),
  isNonDonor: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface DonorLoginFormProps {
  onSuccess: (eligible: boolean, identifier: string, otpSent?: boolean) => void;
}

// ----- Login Form (Password-based) -----
function LoginTab({ onSuccess }: DonorLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await auth.login(data.identifier, { password: data.password });

      if (response.authenticated && response.token) {
        // Password verified → direct login, no OTP needed
        const session = {
          identifier: data.identifier,
          eligible: response.eligible ?? false,
          token: response.token,
          name: response.name ?? undefined,
          donorId: response.donorId ?? undefined,
        };
        localStorage.setItem("donor_session", JSON.stringify(session));
        login(data.identifier, response.eligible ?? false, response.name ?? undefined);
        toast.success(`Welcome back, ${response.name || data.identifier}!`);
        onSuccess(response.eligible ?? false, data.identifier, false);
      } else if (response.otpSent) {
        // Existing user but password was null (it's now set) or other cases requiring OTP
        if (response.devOtp) {
          sessionStorage.setItem("dev_otp", response.devOtp);
        } else {
          sessionStorage.removeItem("dev_otp");
        }
        toast.success("Security check: An OTP has been sent to your email.");
        onSuccess(response.eligible ?? false, data.identifier, true);
      } else {
        toast.error("Invalid credentials. Please check your email/ID and password.");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Email or Donor ID</Label>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
          <Input
            placeholder="donor@example.com or DNR1001"
            {...register("identifier")}
            className="pl-10 h-11 bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)] focus-visible:border-[var(--womb-forest)] rounded-xl shadow-sm transition-all"
          />
        </div>
        {errors.identifier && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.identifier.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Password</Label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            {...register("password")}
            className="pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)] focus-visible:border-[var(--womb-forest)] rounded-xl shadow-sm transition-all"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[var(--womb-forest)] transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--womb-forest)] hover:bg-[#15532f] text-white font-bold h-12 shadow-lg shadow-[var(--womb-forest)]/20 mt-4 rounded-xl transition-all active:scale-[0.98]">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Authenticating..." : "Sign In to Mission Dashboard"}
      </Button>
    </motion.form>
  );
}

// ----- Register Form (OTP-based) -----
function RegisterTab({ onSuccess }: DonorLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isNonDonor, setIsNonDonor] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const response = await auth.login(data.email, {
        password: data.password,
        name: data.name,
        mobile: data.mobile,
        isVolunteer,
        isNonDonor,
      });

      if (response.otpSent) {
        if (response.devOtp) {
          sessionStorage.setItem("dev_otp", response.devOtp);
        } else {
          sessionStorage.removeItem("dev_otp");
        }
        toast.success("Account created! Check your email for the verification OTP.");
        onSuccess(response.eligible ?? false, data.email, true);
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-3"
    >
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</Label>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
          <Input placeholder="donor@example.com" {...register("email")} className="pl-10 h-10 bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)] rounded-xl" />
        </div>
        {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
            <Input placeholder="John Doe" {...register("name")} className="pl-10 h-10 bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)] rounded-xl" />
          </div>
          {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Mobile</Label>
          <div className="relative group">
            <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
            <Input placeholder="+91 XXXXX XXXXX" {...register("mobile")} className="pl-10 h-10 bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)] rounded-xl" />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Password</Label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-colors" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            {...register("password")}
            className="pl-10 pr-10 h-10 bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)] rounded-xl"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[var(--womb-forest)] transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${isVolunteer ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300 text-gray-500"}`}>
          <input type="checkbox" checked={isVolunteer} onChange={e => setIsVolunteer(e.target.checked)} className="accent-emerald-500 w-3.5 h-3.5 rounded-sm bg-white" />
          Volunteer
        </label>
        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${isNonDonor ? "bg-orange-50 border-orange-200 text-orange-700 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300 text-gray-500"}`}>
          <input type="checkbox" checked={isNonDonor} onChange={e => setIsNonDonor(e.target.checked)} className="accent-orange-500 w-3.5 h-3.5 rounded-sm bg-white" />
          Non-Donor
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--womb-forest)] hover:bg-[#15532f] text-white font-bold h-11 shadow-lg shadow-[var(--womb-forest)]/20 mt-2 rounded-xl transition-all active:scale-[0.98]">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Creating Account..." : "Create Account & Verify"}
      </Button>
    </motion.form>
  );
}

// ----- Main Shell -----
export function DonorLoginForm({ onSuccess }: DonorLoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[420px] bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      <div className="p-8 sm:p-10">
        
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 -ml-3 rounded-full h-8 px-3">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-[var(--womb-forest)]" />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {isRegistering ? "Join the Mission" : "Welcome Back"}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1.5">
            {isRegistering ? "Register to start making an impact." : "Sign in to your mission dashboard."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-gray-100/50 backdrop-blur-sm rounded-xl mb-8 border border-gray-200/50 relative">
           <motion.div 
             className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
             animate={{ x: isRegistering ? "100%" : "0%" }}
             transition={{ type: "spring", stiffness: 400, damping: 30 }}
           />
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-colors duration-300 ${!isRegistering ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-colors duration-300 ${isRegistering ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Register
          </button>
        </div>

        {/* Form Container */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {isRegistering
              ? <RegisterTab key="register" onSuccess={onSuccess} />
              : <LoginTab key="login" onSuccess={onSuccess} />
            }
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
