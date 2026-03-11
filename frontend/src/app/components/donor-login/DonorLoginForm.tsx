import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Loader2, Mail } from "lucide-react";
import { auth } from "../../lib/auth";
import { toast } from "sonner";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Donor ID is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface DonorLoginFormProps {
  onSuccess: (eligible: boolean, identifier: string) => void;
}

export function DonorLoginForm({ onSuccess }: DonorLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await auth.login(data.identifier);
      
      if (response.eligible) {
         toast.success("OTP sent to your registered contact details.");
      } else {
         auth.setReceiptOnlySession(data.identifier);
         toast.info("Logging in to Receipts & History...");
      }
      
      onSuccess(response.eligible, data.identifier);
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-emerald-950/40 border-white/10 text-white backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
           <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Donor Login</CardTitle>
        <CardDescription className="text-emerald-100/70">
          Enter your Email or Donor ID to access your dashboard and receipts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-sm font-medium text-emerald-100/90">
              Email or Donor ID
            </Label>
            <Input
              id="identifier"
              placeholder="e.g. donor@example.com"
              {...register("identifier")}
              className="bg-emerald-950/60 border-white/10 text-white placeholder:text-emerald-100/30 focus-visible:ring-primary"
            />
            {errors.identifier && (
              <p className="text-xs text-red-500">{errors.identifier.message}</p>
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
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-emerald-200/50">
              Donated less than ₹5,000? You will have direct access to your past receipts. Access to the full dashboard requires an OTP.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
