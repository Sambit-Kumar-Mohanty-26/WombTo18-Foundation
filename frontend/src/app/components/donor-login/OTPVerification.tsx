import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OTPVerificationProps {
  identifier: string;
  onSuccess: (name?: string) => void;
  onBack: () => void;
}

export function OTPVerification({ identifier, onSuccess, onBack }: OTPVerificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true);
    try {
      console.log("[OTPVerification] Verifying OTP for identifier:", identifier, "OTP:", data.otp);
      const response = await auth.verifyOtp(identifier, data.otp);
      console.log("[OTPVerification] Verification response:", response);
      
      if (response.success) {
        toast.success("Verification successful!");
        login(identifier, true, response.name);
        onSuccess(response.name ?? undefined);
      } else {
        toast.error("Invalid OTP. Please try again. (Hint: use 123456)");
      }
    } catch (error: any) {
      console.error("[OTPVerification] Verification error:", {
        message: error.message,
        status: error.status,
        data: error.data
      });
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-[#0a3a1e]/40 border-white/10 text-white backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-between items-start">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-[#a7e8c3]/50 hover:text-white hover:bg-white/5 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
            </Button>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center -ml-8">
               <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="w-16" /> {/* Spacer */}
        </div>
        <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white mb-2">Verify OTP</CardTitle>
            <CardDescription className="text-[#d1f5e0]/70">
            We've sent a 6-digit one-time password to <span className="font-semibold text-[#d1f5e0]">{identifier}</span>.
            </CardDescription>
            {sessionStorage.getItem("dev_otp") && (
              <div className="mt-4 p-2 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary-foreground font-mono">
                Development OTP: <span className="font-bold tracking-widest">{sessionStorage.getItem("dev_otp")}</span>
              </div>
            )}
        </div>

      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-[#d1f5e0]/90 text-center block">
              Enter 6-Digit Code
            </Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="000000"
              {...register("otp")}
              className="text-center text-3xl tracking-[0.5em] font-mono bg-[#0a3a1e]/60 border-white/10 text-white placeholder:text-[#d1f5e0]/30 focus-visible:ring-primary h-14"
            />
            {errors.otp && (
              <p className="text-xs text-red-500 text-center">{errors.otp.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Securely"
            )}
          </Button>
          
          <div className="mt-4 text-center text-sm">
             <span className="text-[#d1f5e0]/60">Didn't receive a code? </span>
             <button type="button" className="text-primary hover:underline font-medium">Resend OTP</button>
             <p className="text-xs text-muted-foreground mt-2">(Use 123456 as a mock OTP for this demo)</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
