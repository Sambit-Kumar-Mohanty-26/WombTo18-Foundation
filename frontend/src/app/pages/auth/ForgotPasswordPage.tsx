import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Loader2, Mail, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Detect user type from URL or default to DONOR
  const userType = (searchParams.get("type") as 'DONOR' | 'PARTNER' | 'VOLUNTEER') || 'DONOR';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      const response = await auth.forgotPassword(data.email, userType);
      if (response.success) {
        setIsSent(true);
        toast.success("Reset link sent!");
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link.");
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 -ml-3 rounded-2xl h-9 px-4 transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[var(--womb-forest)]" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-[28px] leading-tight font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Forgot Password?
                  </h2>
                  <p className="text-[15px] text-gray-500 font-medium mt-2">
                    Enter your email to receive a secure reset link for your <span className="text-[var(--womb-forest)] font-bold">{userType.toLowerCase()}</span> account.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 ml-1">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--womb-forest)] transition-all duration-300" />
                      <Input
                        placeholder="e.g. your@email.com"
                        {...register("email")}
                        className="pl-12 h-13 bg-white/50 border-gray-100 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus-visible:ring-[var(--womb-forest)]/20 focus-visible:ring-offset-0 focus-visible:ring-4 focus-visible:border-[var(--womb-forest)] rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] transition-all duration-300"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">
                        {errors.email.message}
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
                          <span>Sending Link...</span>
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Link Sent!
                  </h2>
                  <p className="text-[15px] text-gray-500 font-medium mt-3 leading-relaxed">
                    We've sent a secure password reset link to your email. Please check your inbox and follow the instructions.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="w-full h-13 rounded-2xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Return to Login
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </section>
  );
}
