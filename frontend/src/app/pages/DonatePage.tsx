import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Heart, Shield, CheckCircle, CreditCard, Smartphone, Building2, ArrowRight, IndianRupee, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const presetAmounts = [500, 1000, 2000, 5000, 10000, 25000];

const programs = [
  { id: "general", label: "Where Most Needed" },
  { id: "prenatal", label: "Prenatal Care" },
  { id: "education", label: "Education" },
  { id: "nutrition", label: "Nutrition" },
  { id: "youth", label: "Youth Empowerment" },
  { id: "protection", label: "Child Protection" },
];

const donationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid mobile number"),
  amount: z.number().min(100, "Minimum donation amount is ₹100"),
  program: z.string().min(1, "Please select a program"),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN (e.g., ABCDE1234F)")
    .or(z.literal("")),
  displayOnWall: z.boolean(),
  frequency: z.enum(["once", "monthly"]),
});

type DonationFormData = z.infer<typeof donationSchema>;

export function DonatePage() {
  const [presetSelected, setPresetSelected] = useState<number | null>(2000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      amount: 2000,
      program: "general",
      pan: "",
      displayOnWall: true,
      frequency: "once",
    },
  });

  const watchAmount = watch("amount");
  const watchFrequency = watch("frequency");
  const watchProgram = watch("program");

  const handlePresetClick = (amount: number) => {
    setPresetSelected(amount);
    setValue("amount", amount, { shouldValidate: true });
  };

  const simulateRazorpay = async (_data: DonationFormData) => {
    setIsProcessing(true);

    // Step 1: Simulate order creation via API
    toast.info("Creating payment order...");
    await new Promise((r) => setTimeout(r, 800));

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    toast.success(`Order ${orderId} created`);

    // Step 2: Simulate Razorpay checkout opening
    await new Promise((r) => setTimeout(r, 600));
    toast.info("Opening Razorpay payment gateway...");

    // Step 3: Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Step 4: Simulate verification
    toast.info("Verifying payment...");
    await new Promise((r) => setTimeout(r, 800));

    toast.success(`Payment ${paymentId} verified successfully!`);
    setIsProcessing(false);
    setShowSuccess(true);
  };

  const onSubmit = (_data: DonationFormData) => {
    simulateRazorpay(_data);
  };

  if (showSuccess) {
    return (
      <section className="py-20 bg-gradient-to-br from-background via-emerald-950/50 to-background min-h-[80vh] flex items-center text-white">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-white mb-4" style={{ fontWeight: 800 }}>
            Thank You for Your Generosity!
          </h1>
          <p className="text-lg text-emerald-200/70 mb-3">
            Your donation of <span className="text-white" style={{ fontWeight: 700 }}>₹{watchAmount?.toLocaleString("en-IN")}</span>{watchFrequency === "monthly" ? "/month" : ""} has been successfully processed.
          </p>
          <p className="text-sm text-emerald-200/50 mb-8">
            A confirmation email with your 80G tax receipt has been sent. You can also download it from your donor dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
              onClick={() => {
                setShowSuccess(false);
                setPresetSelected(2000);
                setValue("amount", 2000);
              }}
            >
              Donate Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-background via-emerald-950/50 to-background text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4 fill-current" />
            <h1 className="text-4xl sm:text-5xl text-white mb-4" style={{ fontWeight: 800, lineHeight: 1.1 }}>
              Make a Difference Today
            </h1>
            <p className="text-lg text-emerald-200/70">
              Your donation directly funds prenatal care, nutrition, education, and empowerment programs. 100% tax deductible under 80G.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Donation Form */}
              <div className="lg:col-span-3">
                <Card className="bg-emerald-950/20 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Donation Details</CardTitle>
                    <CardDescription className="text-emerald-200/50">Choose your preferred amount and frequency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Frequency */}
                    <div>
                      <Label className="mb-2 block text-white font-semibold">Donation Type</Label>
                      <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={field.value === "once" ? "default" : "outline"}
                              onClick={() => field.onChange("once")}
                              className={field.value === "once" ? "bg-primary text-primary-foreground font-bold" : "border-white/10 text-white hover:bg-white/5"}
                              size="sm"
                            >
                              One-time
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "monthly" ? "default" : "outline"}
                              onClick={() => field.onChange("monthly")}
                              className={field.value === "monthly" ? "bg-primary text-primary-foreground font-bold" : "border-white/10 text-white hover:bg-white/5"}
                              size="sm"
                            >
                              Monthly
                            </Button>
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block text-white font-semibold">Select Amount (₹)</Label>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {presetAmounts.map((a) => (
                          <Button
                            key={a}
                            type="button"
                            variant={presetSelected === a ? "default" : "outline"}
                            className={presetSelected === a ? "bg-primary text-primary-foreground font-bold" : "border-white/10 text-white hover:bg-white/5"}
                            onClick={() => handlePresetClick(a)}
                            size="sm"
                          >
                            ₹{a.toLocaleString("en-IN")}
                          </Button>
                        ))}
                      </div>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-200/50" />
                        <Input
                          type="number"
                          placeholder="Or enter custom amount"
                          {...register("amount", { valueAsNumber: true })}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setPresetSelected(presetAmounts.includes(val) ? val : null);
                            setValue("amount", val || 0, { shouldValidate: true });
                          }}
                          className="pl-9 bg-emerald-950/40 border-white/10 text-white placeholder:text-emerald-100/40"
                        />
                      </div>
                      {errors.amount && (
                        <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
                      )}
                    </div>

                    {/* Program */}
                    <div>
                      <Label className="mb-2 block text-white font-semibold">Allocate To</Label>
                      <Controller
                        name="program"
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-wrap gap-2">
                            {programs.map((p) => (
                              <Badge
                                key={p.id}
                                variant={field.value === p.id ? "default" : "outline"}
                                className={`cursor-pointer px-3 py-1.5 transition-all ${field.value === p.id ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-orange-500/20" : "border-white/10 text-white hover:bg-white/5"}`}
                                onClick={() => field.onChange(p.id)}
                              >
                                {p.label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      />
                      {errors.program && (
                        <p className="text-xs text-red-500 mt-1">{errors.program.message}</p>
                      )}
                    </div>

                    {/* Personal Details */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h4 className="text-white font-semibold">Your Details</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm mb-1.5 block text-emerald-100/70">Full Name *</Label>
                          <Input {...register("name")} placeholder="Your full name" className="bg-emerald-950/40 border-white/10 text-white placeholder:text-emerald-100/40" />
                          {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm mb-1.5 block text-emerald-100/70">Email *</Label>
                          <Input type="email" {...register("email")} placeholder="you@example.com" className="bg-emerald-950/40 border-white/10 text-white placeholder:text-emerald-100/40" />
                          {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm mb-1.5 block text-emerald-100/70">Mobile *</Label>
                          <Input {...register("mobile")} placeholder="+91 98765 43210" className="bg-emerald-950/40 border-white/10 text-white placeholder:text-emerald-100/40" />
                          {errors.mobile && (
                            <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm mb-1.5 block text-emerald-100/70">PAN Number (for 80G receipt)</Label>
                          <Input
                            {...register("pan")}
                            placeholder="ABCDE1234F"
                            style={{ textTransform: "uppercase" }}
                            className="bg-emerald-950/40 border-white/10 text-white placeholder:text-emerald-100/40"
                          />
                          {errors.pan && (
                            <p className="text-xs text-red-500 mt-1">{errors.pan.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Display on Donor Wall */}
                      <div className="flex items-center gap-3 pt-2">
                        <Controller
                          name="displayOnWall"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-white/10 bg-emerald-950 text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-emerald-100/70">
                                Display my name on the donor wall
                              </span>
                            </label>
                          )}
                        />
                      </div>
                    </div>

                    {/* Pay Button */}
                     <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.01] transition-transform text-primary-foreground font-bold shadow-lg shadow-orange-500/20 h-12"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-2 fill-current" />
                          Donate ₹{(watchAmount || 0).toLocaleString("en-IN")}
                          {watchFrequency === "monthly" ? "/month" : ""}
                        </>
                      )}
                    </Button>

                    {/* Payment Flow */}
                    <div className="bg-emerald-900/20 rounded-lg p-4 border border-white/5">
                      <p className="text-xs text-emerald-200/50 mb-2 font-bold uppercase tracking-wider">Payment Flow:</p>
                      <div className="flex items-center gap-2 text-[10px] text-emerald-100/70 flex-wrap">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20" style={{ fontWeight: 600 }}>1. Submit Form</span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-emerald-100/60" />
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20" style={{ fontWeight: 600 }}>2. Create Order</span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-emerald-100/60" />
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20" style={{ fontWeight: 600 }}>3. Razorpay Payment</span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-emerald-100/60" />
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20" style={{ fontWeight: 600 }}>4. Verify & Redirect</span>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex items-center justify-center gap-6 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-100/60">
                        <CreditCard className="h-3.5 w-3.5" /> Cards
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-100/60">
                        <Smartphone className="h-3.5 w-3.5" /> UPI
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-100/60">
                        <Building2 className="h-3.5 w-3.5" /> Net Banking
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-4">
                {/* Order Summary */}
                <Card className="border-orange-500/30 bg-orange-500/5 text-white">
                  <CardContent className="pt-6">
                    <h4 className="mb-4 text-orange-400 font-bold uppercase tracking-wider text-xs" style={{ fontWeight: 600 }}>Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-100/70">Amount</span>
                        <span style={{ fontWeight: 600 }}>₹{(watchAmount || 0).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100/70">Frequency</span>
                        <span style={{ fontWeight: 500 }}>{watchFrequency === "monthly" ? "Monthly" : "One-time"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100/70">Program</span>
                        <span style={{ fontWeight: 500 }}>{programs.find(p => p.id === watchProgram)?.label}</span>
                      </div>
                      <div className="border-t border-orange-500/20 my-2" />
                      <div className="flex justify-between">
                        <span className="text-emerald-100/70">Tax Deduction (80G)</span>
                        <span className="text-primary" style={{ fontWeight: 700 }}>₹{(watchAmount || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-emerald-900/20 text-white">
                  <CardContent className="pt-6">
                    <Shield className="h-8 w-8 text-primary mb-3" />
                    <h4 className="mb-2 font-bold text-white" style={{ fontWeight: 600 }}>100% Tax Deductible</h4>
                    <p className="text-sm text-emerald-200/50">
                      All donations are eligible for tax exemption under Section 80G of the Income Tax Act. Your 80G certificate will be emailed instantly.
                    </p>
                  </CardContent>
                </Card>


                <Card className="border-white/5 bg-emerald-950/40 text-emerald-200/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-[10px] uppercase tracking-widest mb-1">Powered by</p>
                    <p className="text-lg opacity-60 grayscale" style={{ fontWeight: 700 }}>Razorpay</p>
                    <p className="text-[10px] mt-1 opacity-50">256-bit SSL encrypted payment gateway</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
