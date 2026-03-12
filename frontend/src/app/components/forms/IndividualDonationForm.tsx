import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { IndianRupee, Heart, Loader2 } from "lucide-react";

const individualSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").max(10, "Mobile number must be 10 digits").regex(/^\d+$/, "Enter digits only"),
  amount: z.number().min(100, "Minimum donation amount is ₹100"),
  program: z.string().min(1, "Please select a program"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").or(z.literal("")),
  displayOnWall: z.boolean(),
  frequency: z.enum(["once", "monthly"]),
});

type IndividualFormData = z.infer<typeof individualSchema>;

const presetAmounts = [500, 1000, 2000, 5000, 10000, 25000];
const programs = [
  { id: "general", label: "Where Most Needed" },
  { id: "prenatal", label: "Prenatal Care" },
  { id: "education", label: "Education" },
  { id: "nutrition", label: "Nutrition" },
  { id: "youth", label: "Youth Empowerment" },
  { id: "protection", label: "Child Protection" },
];

interface IndividualDonationFormProps {
  onSubmit: (data: IndividualFormData) => void;
  isProcessing: boolean;
}

export function IndividualDonationForm({ onSubmit, isProcessing }: IndividualDonationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IndividualFormData>({
    resolver: zodResolver(individualSchema),
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

  const handlePresetClick = (amount: number) => {
    setValue("amount", amount, { shouldValidate: true });
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm rounded-lg p-6">
      <CardContent className="p-0 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Frequency */}
          <div className="space-y-3">
            <Label className="text-gray-900 font-bold">Donation Frequency</Label>
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={field.value === "once" ? "default" : "outline"}
                    onClick={() => field.onChange("once")}
                    className={field.value === "once" ? "bg-emerald-600 text-white font-bold" : "bg-gray-100 text-gray-700"}
                    size="sm"
                  >
                    One-time
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === "monthly" ? "default" : "outline"}
                    onClick={() => field.onChange("monthly")}
                    className={field.value === "monthly" ? "bg-emerald-600 text-white font-bold" : "bg-gray-100 text-gray-700"}
                    size="sm"
                  >
                    Monthly
                  </Button>
                </div>
              )}
            />
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <Label className="text-gray-900 font-bold">Select Amount (₹)</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((a) => (
                <Button
                  key={a}
                  type="button"
                  variant={watchAmount === a ? "default" : "outline"}
                  className={watchAmount === a ? "bg-emerald-600 text-white font-bold" : "bg-gray-100 text-gray-700"}
                  onClick={() => handlePresetClick(a)}
                  size="sm"
                >
                  ₹{a.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Or enter custom amount"
                {...register("amount", { valueAsNumber: true })}
                className="pl-9 bg-white border-gray-200 text-gray-900"
              />
            </div>
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Program */}
          <div className="space-y-3">
            <Label className="text-gray-900 font-bold">Allocate To</Label>
            <Controller
              name="program"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {programs.map((p) => (
                    <Badge
                      key={p.id}
                      variant={field.value === p.id ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1.5 transition-all ${
                        field.value === p.id 
                          ? "bg-emerald-600 text-white font-bold" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => field.onChange(p.id)}
                    >
                      {p.label}
                    </Badge>
                  ))}
                </div>
              )}
            />
            {errors.program && <p className="text-xs text-red-500 mt-1">{errors.program.message}</p>}
          </div>

          {/* Personal Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-gray-900 font-bold">Personal Details</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">Full Name *</Label>
                <Input {...register("name")} placeholder="John Doe" className="bg-white border-gray-200 text-gray-900" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">Email *</Label>
                <Input type="email" {...register("email")} placeholder="john@example.com" className="bg-white border-gray-200 text-gray-900" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">Mobile Number *</Label>
                <Input {...register("mobile")} placeholder="9876543210" className="bg-white border-gray-200 text-gray-900" />
                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">PAN Number (Optional)</Label>
                <Input {...register("pan")} placeholder="ABCDE1234F" className="bg-white border-gray-200 text-gray-900 uppercase" />
                {errors.pan && <p className="text-xs text-red-500">{errors.pan.message}</p>}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="flex items-center gap-2">
            <Controller
              name="displayOnWall"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="displayOnWall"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              )}
            />
            <Label htmlFor="displayOnWall" className="text-sm text-gray-600 cursor-pointer">
              Display my name on the donor wall
            </Label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2 fill-current" />
                Donate ₹{(watchAmount || 0).toLocaleString("en-IN")}
                {watchFrequency === "monthly" ? "/month" : ""}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
