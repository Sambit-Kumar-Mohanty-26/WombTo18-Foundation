import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { IndianRupee, Heart, Loader2 } from "lucide-react";

const organizationSchema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Please enter a valid official email"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").max(10, "Mobile number must be 10 digits").regex(/^\d+$/, "Enter digits only"),
  address: z.string().min(5, "Full address is required"),
  gst: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format").or(z.literal("")),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").or(z.literal("")),
  amount: z.number().min(100, "Minimum donation amount is ₹100"),
  program: z.string().min(1, "Please select a program"),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

const presetAmounts = [5000, 10000, 25000, 50000, 100000, 500000];
const programs = [
  { id: "general", label: "Where Most Needed" },
  { id: "prenatal", label: "Prenatal Care" },
  { id: "education", label: "Education" },
  { id: "nutrition", label: "Nutrition" },
  { id: "youth", label: "Youth Empowerment" },
  { id: "protection", label: "Child Protection" },
];

interface OrganizationDonationFormProps {
  onSubmit: (data: OrganizationFormData) => void;
  isProcessing: boolean;
}

export function OrganizationDonationForm({ onSubmit, isProcessing }: OrganizationDonationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      orgName: "",
      contactPerson: "",
      email: "",
      mobile: "",
      address: "",
      gst: "",
      pan: "",
      amount: 10000,
      program: "general",
    },
  });

  const watchAmount = watch("amount");

  const handlePresetClick = (amount: number) => {
    setValue("amount", amount, { shouldValidate: true });
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm rounded-lg p-6">
      <CardContent className="p-0 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount */}
          <div className="space-y-3">
            <Label className="text-gray-900 font-bold">Donation Amount (₹)</Label>
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
                placeholder="e.g. 50000"
                {...register("amount", { valueAsNumber: true })}
                className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Program */}
          <div className="space-y-3">
            <Label className="text-gray-900 font-bold">Support Program</Label>
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

          {/* Organization Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-gray-900 font-bold">Organization Details</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-gray-700 font-medium">Organization Name *</Label>
                <Input {...register("orgName")} placeholder="Enter legal organization name" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" />
                {errors.orgName && <p className="text-xs text-red-500">{errors.orgName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">Contact Person *</Label>
                <Input {...register("contactPerson")} placeholder="Enter contact person's name" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" />
                {errors.contactPerson && <p className="text-xs text-red-500">{errors.contactPerson.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">Official Email *</Label>
                <Input type="email" {...register("email")} placeholder="Enter official registered email" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">Mobile Number *</Label>
                <Input {...register("mobile")} placeholder="Enter primary contact number" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" />
                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">GST Number (Optional)</Label>
                <Input {...register("gst")} placeholder="Enter 15-digit GSTIN (e.g., 22AAAAA0000A1Z5)" className="bg-white border-gray-200 text-gray-900 uppercase placeholder:text-gray-400" />
                {errors.gst && <p className="text-xs text-red-500">{errors.gst.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">PAN Number (Optional)</Label>
                <Input {...register("pan")} placeholder="Enter 10-character organization PAN" className="bg-white border-gray-200 text-gray-900 uppercase placeholder:text-gray-400" />
                {errors.pan && <p className="text-xs text-red-500">{errors.pan.message}</p>}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-gray-700 font-medium">Organization Address *</Label>
                <textarea
                  {...register("address")}
                  placeholder="Enter full registered office address"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px] placeholder:text-gray-400"
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>
            </div>
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
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
