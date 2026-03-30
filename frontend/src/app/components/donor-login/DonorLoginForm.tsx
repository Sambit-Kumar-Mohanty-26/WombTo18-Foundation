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
import { useNavigate, useSearchParams } from "react-router";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Email or Donor ID</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-600/30" />
          <Input
            placeholder="donor@example.com or DNR1001"
            {...register("identifier")}
            className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-emerald-500 rounded-xl h-11"
          />
        </div>
        {errors.identifier && <p className="text-xs text-red-500 font-bold">{errors.identifier.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-600/30" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            {...register("password")}
            className="pl-10 pr-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-emerald-500 rounded-xl h-11"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600 transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black h-12 mt-2 rounded-xl shadow-lg shadow-emerald-100">
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</> : "Authorize Access"}
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
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

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
        referredById: refCode || undefined,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-600/30" />
          <Input placeholder="donor@example.com" {...register("email")} className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-emerald-500 rounded-xl h-11" />
        </div>
        {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-emerald-600/30" />
            <Input placeholder="John Doe" {...register("name")} className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-emerald-500 rounded-xl h-11" />
          </div>
          {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Mobile</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-emerald-600/30" />
            <Input placeholder="+91 XXXXX XXXXX" {...register("mobile")} className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-emerald-500 rounded-xl h-11" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-emerald-800/40">Secure Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-600/30" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            {...register("password")}
            className="pl-10 pr-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-emerald-500 rounded-xl h-11"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600 transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${isVolunteer ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
          <input type="checkbox" checked={isVolunteer} onChange={e => setIsVolunteer(e.target.checked)} className="accent-emerald-600" />
          Volunteer
        </label>
        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${isNonDonor ? "bg-orange-500/10 border-orange-500/30 text-orange-700" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
          <input type="checkbox" checked={isNonDonor} onChange={e => setIsNonDonor(e.target.checked)} className="accent-orange-600" />
          Non-Donor
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black h-12 mt-1 rounded-xl shadow-lg shadow-emerald-100">
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registering...</> : "Create Identity"}
      </Button>
      <p className="text-[10px] text-center text-gray-400 font-medium leading-tight">Verification OTP will be dispatched to your email endpoint.</p>
    </form>
  );
}

// ----- Main Shell -----
export function DonorLoginForm({ onSuccess }: DonorLoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 border-emerald-100 text-gray-900 backdrop-blur-md shadow-2xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="space-y-1 pb-4 text-center">
        <div className="flex justify-start mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-emerald-800/40 hover:text-emerald-600 hover:bg-emerald-50 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Return
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
        <CardTitle className="text-3xl font-black tracking-tighter text-gray-900">
          {isRegistering ? "Supporter Entry" : "Portal Access"}
        </CardTitle>
        <CardDescription className="text-gray-500 font-medium">
          {isRegistering ? "Join our mission-driven network." : "Secure entry via institutional credentials."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Tab Toggle */}
        <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${!isRegistering ? "bg-white text-emerald-600 shadow-sm border border-emerald-50" : "text-gray-400 hover:text-gray-900"}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${isRegistering ? "bg-white text-emerald-600 shadow-sm border border-emerald-50" : "text-gray-400 hover:text-gray-900"}`}
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

