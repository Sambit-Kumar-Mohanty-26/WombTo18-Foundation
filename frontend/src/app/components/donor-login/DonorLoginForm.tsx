import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2, Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

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
        <Label className="text-xs font-semibold uppercase tracking-wider text-[#d1f5e0]/60">Email or Donor ID</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-[#d1f5e0]/40" />
          <Input
            placeholder="donor@example.com or DNR1001"
            {...register("identifier")}
            className="pl-10 bg-[#0a3a1e]/60 border-white/10 text-white placeholder:text-[#d1f5e0]/30 focus-visible:ring-primary"
          />
        </div>
        {errors.identifier && <p className="text-xs text-red-400">{errors.identifier.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-[#d1f5e0]/60">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-[#d1f5e0]/40" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            {...register("password")}
            className="pl-10 pr-10 bg-[#0a3a1e]/60 border-white/10 text-white placeholder:text-[#d1f5e0]/30 focus-visible:ring-primary"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#d1f5e0]/40 hover:text-white transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 mt-2">
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</> : "Sign In"}
      </Button>
    </form>
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-[#d1f5e0]/60">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-[#d1f5e0]/40" />
          <Input placeholder="donor@example.com" {...register("email")} className="pl-10 bg-[#0a3a1e]/60 border-white/10 text-white placeholder:text-[#d1f5e0]/30 focus-visible:ring-primary" />
        </div>
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-[#d1f5e0]/60">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-[#d1f5e0]/40" />
            <Input placeholder="John Doe" {...register("name")} className="pl-10 bg-[#0a3a1e]/60 border-white/10 text-white placeholder:text-[#d1f5e0]/30 focus-visible:ring-primary" />
          </div>
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-[#d1f5e0]/60">Mobile (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-[#d1f5e0]/40" />
            <Input placeholder="+91 XXXXX XXXXX" {...register("mobile")} className="pl-10 bg-[#0a3a1e]/60 border-white/10 text-white placeholder:text-[#d1f5e0]/30 focus-visible:ring-primary" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-[#d1f5e0]/60">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-[#d1f5e0]/40" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password (min 6 chars)"
            {...register("password")}
            className="pl-10 pr-10 bg-[#0a3a1e]/60 border-white/10 text-white placeholder:text-[#d1f5e0]/30 focus-visible:ring-primary"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#d1f5e0]/40 hover:text-white transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-medium cursor-pointer transition-all ${isVolunteer ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-white/5 border-white/5 hover:border-white/10 text-white/50"}`}>
          <input type="checkbox" checked={isVolunteer} onChange={e => setIsVolunteer(e.target.checked)} className="accent-emerald-400" />
          Volunteer
        </label>
        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-medium cursor-pointer transition-all ${isNonDonor ? "bg-orange-500/10 border-orange-500/30 text-orange-300" : "bg-white/5 border-white/5 hover:border-white/10 text-white/50"}`}>
          <input type="checkbox" checked={isNonDonor} onChange={e => setIsNonDonor(e.target.checked)} className="accent-orange-400" />
          Non-Donor
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 mt-1">
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : "Create Account & Verify"}
      </Button>
      <p className="text-[10px] text-center text-[#a7e8c3]/30 leading-tight">An OTP will be sent to your email for verification.</p>
    </form>
  );
}

// ----- Main Shell -----
export function DonorLoginForm({ onSuccess }: DonorLoginFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md mx-auto bg-[#0a3a1e]/40 border-white/10 text-white backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-1 pb-4 text-center">
        <div className="flex justify-start mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-[#a7e8c3]/50 hover:text-white hover:bg-white/5 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          {isRegistering ? "Create Account" : "Donor Sign In"}
        </CardTitle>
        <CardDescription className="text-[#d1f5e0]/70">
          {isRegistering ? "Register to join the WombTo18 family." : "Sign in with your email/ID and password."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Tab Toggle */}
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${!isRegistering ? "bg-primary text-primary-foreground shadow-sm" : "text-white/50 hover:text-white"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${isRegistering ? "bg-primary text-primary-foreground shadow-sm" : "text-white/50 hover:text-white"}`}
          >
            Register
          </button>
        </div>

        {isRegistering
          ? <RegisterTab onSuccess={onSuccess} />
          : <LoginTab onSuccess={onSuccess} />
        }
      </CardContent>
    </Card>
  );
}
