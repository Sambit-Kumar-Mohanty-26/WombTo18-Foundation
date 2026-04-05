import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, Loader2, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { partnerApi } from "../../lib/api/partner";
import { auth } from "../../lib/auth";
import { motion, AnimatePresence } from "motion/react";

const loginSchema = z.object({
  email: z.string().email("A valid institutional email is required"),
  password: z.string().min(6, "Security password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface PartnerLoginFormProps {
  onSuccess: (role: string, partnerId?: string) => void;
}

export function PartnerLoginForm({ onSuccess }: PartnerLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [identifier, setIdentifier] = useState("");
  const { login } = useAuth();
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const otpForm = useForm<{ otp: string }>({
    defaultValues: { otp: "" }
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      setIdentifier(data.email);
      const response = await partnerApi.login(data.email, data.password);

      if (response.success && response.token) {
        const partnerId = (response as any).partnerId;
        const organizationName = (response as any).organizationName || '';
        const role = (response as any).role || 'PARTNER';

        auth.savePartnerSession({
          email: data.email,
          partnerId,
          name: response.name || 'Partner',
          organizationName
        });

        login(data.email, true, response.name ?? undefined, role as any, { 
          partnerId,
          organizationName
        });
        onSuccess(role, partnerId);
        toast.success(`Access Authorized: Welcome ${response.name || 'Partner'}`);
      } else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (e: any) {
      toast.error(e.message || "Institutional access denied");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyOtp = async (data: { otp: string }) => {
    setIsSubmitting(true);
    try {
      const response = await auth.verifyOtp(identifier, data.otp);
      if (response.success && response.role) {
        const partnerId = (response as any).partnerId;
        login(identifier, true, response.name ?? undefined, response.role as any, { partnerId });
        onSuccess(response.role, partnerId);
        toast.success("Security verification complete.");
      } else {
        toast.error("Invalid verification code");
      }
    } catch (e: any) {
      toast.error("Verification protocol failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium";
  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {step === 'LOGIN' ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit(onLoginSubmit)}
            className="space-y-6"
          >
            <div>
              <label className={labelStyle}>Institutional Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="email"
                  placeholder="name@organization.com" 
                  {...register("email")}
                  className={`${inputStyle} pl-12 ${errors.email ? 'border-red-200 bg-red-50/30' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 mt-1.5 ml-1 font-bold">{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelStyle}>Security Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="password"
                  placeholder="••••••••" 
                  {...register("password")}
                  className={`${inputStyle} pl-12 ${errors.password ? 'border-red-200 bg-red-50/30' : ''}`}
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 mt-1.5 ml-1 font-bold">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-sky-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="h-5 w-5 animate-spin" /> : <>Request Signature <ArrowRight className="h-4 w-4" /></>}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <button 
                onClick={() => setStep('LOGIN')}
                className="mb-6 text-gray-400 hover:text-sky-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors group"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Login
              </button>
              <h3 className="text-gray-900 font-black text-2xl tracking-tighter">Identity Verify</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black mt-1">Auth Code sent to session endpoint</p>
            </div>

            <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-6">
              <div className="flex justify-center">
                <input 
                  placeholder="••••••" 
                  {...otpForm.register("otp")}
                  maxLength={6}
                  className="w-48 bg-gray-50/50 border-2 border-gray-100 text-gray-900 text-center text-3xl py-4 rounded-2xl focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-black tracking-[0.3em] outline-none"
                  autoFocus
                />
              </div>
              
              {devOtp && (
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-center">
                  <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest">Protocol Bypass Active</p>
                  <p className="text-sky-600 font-black text-xl tracking-widest mt-1">{devOtp}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-sky-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="h-5 w-5 animate-spin" /> : <>Confirm Access</>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
