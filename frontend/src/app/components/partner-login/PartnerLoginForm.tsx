import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Lock, Mail, Loader2, ArrowRight, FileText, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../lib/auth";

const loginSchema = z.object({
  email: z.string().email("A valid institutional email is required"),
  password: z.string().min(6, "Security password must be at least 6 characters"),
});

const inquirySchema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("A valid institutional email is required"),
  purpose: z.string().min(10, "Please describe the purpose of partnership"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type InquiryFormData = z.infer<typeof inquirySchema>;

interface PartnerLoginFormProps {
  onSuccess: (role: string, name: string) => void;
}

export function PartnerLoginForm({ onSuccess }: PartnerLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [identifier, setIdentifier] = useState("");
  const { login } = useAuth();
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const inquiryForm = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const otpForm = useForm<{ otp: string }>({
    defaultValues: { otp: "" }
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      setIdentifier(data.email);
      const response = await auth.login(data.email, { password: data.password });

      if (response.authenticated && response.token) {
        // Direct password login
        const role = (response as any).role || 'ADMIN';
        login(data.email, true, response.name ?? undefined, role);
        onSuccess(role, response.name || data.email);
        toast.success(`Access Authorized: Welcome ${response.name || 'Staff'}`);
      } else if (response.otpSent) {
        setStep('OTP');
        if (response.devOtp) setDevOtp(response.devOtp);
        toast.success("Identity verification required. OTP dispatched.");
      } else {
        toast.error("Invalid institutional credentials");
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
        login(identifier, true, response.name ?? undefined, response.role as any);
        onSuccess(response.role, response.name || identifier);
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

  const onInquirySubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Mission Application Submitted", {
        description: "Our desk will review your organization's credentials.",
      });
      inquiryForm.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#051c0d]/40 backdrop-blur-3xl border-white/5 shadow-2xl overflow-hidden rounded-[3.5rem] relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-white/40 to-emerald-600 opacity-80" />
      
      <Tabs defaultValue="login" className="w-full">
        <div className="p-4 md:p-6 pb-0">
          <TabsList className="bg-white/5 border border-white/5 p-1.5 h-16 rounded-[2rem] flex items-center gap-2">
            <TabsTrigger 
              value="login" 
              onClick={() => setStep('LOGIN')}
              className="flex-1 h-12 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-white/30 data-[state=active]:bg-white/10 data-[state=active]:text-blue-400 data-[state=active]:shadow-xl transition-all duration-500 flex items-center justify-center gap-2 group"
            >
              <Lock className="h-3.5 w-3.5 opacity-40 group-data-[state=active]:opacity-100" />
              Portal Entry
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="flex-1 h-12 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-white/30 data-[state=active]:bg-white/10 data-[state=active]:text-emerald-400 data-[state=active]:shadow-xl transition-all duration-500 flex items-center justify-center gap-2 group"
            >
              <Building2 className="h-3.5 w-3.5 opacity-40 group-data-[state=active]:opacity-100" />
              Join Network
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="login" className="p-8 md:p-12 focus:outline-none focus-visible:ring-0">
          {step === 'LOGIN' ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-2 text-center">
                <h3 className="text-white font-black text-2xl tracking-tighter">Identity Gate</h3>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-black">Authorized Personnel Only</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    placeholder="Institutional Email" 
                    {...loginForm.register("email")}
                    className="bg-white/5 border-white/5 text-white placeholder:text-white/20 pl-14 h-16 rounded-2xl focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-bold"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    type="password"
                    placeholder="Security Password" 
                    {...loginForm.register("password")}
                    className="bg-white/5 border-white/5 text-white placeholder:text-white/20 pl-14 h-16 rounded-2xl focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-bold"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Request Signature <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2 text-center">
                <button 
                  onClick={() => setStep('LOGIN')}
                  className="mb-4 text-white/20 hover:text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Correction Needed?
                </button>
                <h3 className="text-white font-black text-2xl tracking-tighter">Enter Auth Code</h3>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-black">2FA Dispatched to {identifier}</p>
              </div>

              <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-6">
                <Input 
                  placeholder="6-Digit Verification Code" 
                  {...otpForm.register("otp")}
                  maxLength={6}
                  className="bg-white/5 border-white/10 text-white text-center text-3xl h-20 rounded-2xl focus:ring-blue-500/40 transition-all font-black tracking-[0.5em]"
                />
                
                {devOtp && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Dev Protocol Bypass</p>
                    <p className="text-white font-black text-xl tracking-widest mt-1">{devOtp}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Confirm Identity</>}
                </Button>
              </form>
            </div>
          )}
        </TabsContent>

        <TabsContent value="register" className="p-8 md:p-12 focus:outline-none focus-visible:ring-0 space-y-8 animate-in fade-in duration-500">
          <div className="space-y-2 text-center">
            <h3 className="text-white font-black text-2xl tracking-tighter">Strategic Inquiry</h3>
            <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-black">Network Partnership Portal</p>
          </div>

          <form onSubmit={inquiryForm.handleSubmit(onInquirySubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="Legal Entity Name" 
                {...inquiryForm.register("orgName")}
                className="bg-white/5 border-white/5 text-white placeholder:text-white/20 h-14 rounded-xl focus:ring-emerald-500/40 font-bold"
              />
              <Input 
                placeholder="Direct Contact" 
                {...inquiryForm.register("contactPerson")}
                className="bg-white/5 border-white/5 text-white placeholder:text-white/20 h-14 rounded-xl focus:ring-emerald-500/40 font-bold"
              />
            </div>
            <Input 
              placeholder="Institutional Endpoint (Email)" 
              {...inquiryForm.register("email")}
              className="bg-white/5 border-white/5 text-white placeholder:text-white/20 h-14 rounded-xl focus:ring-emerald-500/40 font-bold"
            />
            <textarea 
              placeholder="Core mission alignment context..." 
              {...inquiryForm.register("purpose")}
              rows={3}
              className="w-full bg-white/5 border border-white/5 text-white placeholder:text-white/20 p-5 rounded-xl focus:ring-emerald-500/40 transition-all text-sm font-bold resize-none"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Send Application <Send className="h-5 w-5" /></>}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="bg-white/5 border-t border-white/5 p-6 text-center">
        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">Authorized Deployment Shell v4.2.1 • Encryption Active</p>
      </div>
    </Card>
  );
}

const ArrowLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
