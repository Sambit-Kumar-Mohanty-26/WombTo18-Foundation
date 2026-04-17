import { useState, useEffect } from "react";
import { User, Shield, Bell, LayoutDashboard, Edit2, Save, Loader2, Building2, Mail, Phone, FileText, Globe, Star, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api/client";
import { partnerApi } from "../../lib/api/partner";
import { authApi } from "../../lib/api/auth";

const partnerSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person name must be at least 2 characters"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  panNumber: z.string().length(10, "PAN must be exactly 10 characters").optional().or(z.literal("")),
  csrCategory: z.string().optional(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

export function PartnerProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [securityStep, setSecurityStep] = useState<"initial" | "otp" | "password">("initial");
  const [otpValue, setOtpValue] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showDevOtp, setShowDevOtp] = useState<string | null>(null);

  const { state, dispatch } = useAuth();
  const ptnUniqueId = state.user?.partnerId || state.user?.identifier || "";

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      organizationName: "",
      contactPerson: "",
      mobile: "",
      panNumber: "",
      csrCategory: "",
    },
  });

  useEffect(() => {
    if (!ptnUniqueId) return;
    partnerApi.getProfile(ptnUniqueId)
      .then(res => {
        setPartnerData(res);
        form.reset({
          organizationName: res.organizationName || "",
          contactPerson: res.contactPerson || "",
          mobile: res.mobile || "",
          panNumber: res.panNumber || "",
          csrCategory: res.csrCategory || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ptnUniqueId, form]);

  async function onSubmit(values: PartnerFormValues) {
    setIsSubmitting(true);
    try {
      await partnerApi.updateProfile(ptnUniqueId, values);
      toast.success("Profile Updated", { description: "Your organization details have been saved." });
      
      // Update local state
      dispatch({ 
        type: "UPDATE_ROLE", 
        payload: { 
          name: values.contactPerson,
          organizationName: values.organizationName 
        } 
      });
      
      setPartnerData({ ...partnerData, ...values });
      setActiveTab("overview");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    toast.success("Preference updated");
  };

  const handleRequestPasswordChange = async () => {
    if (!state.user?.identifier) return;
    setIsSubmitting(true);
    try {
      const res = await authApi.requestPasswordChange(state.user.identifier);
      if (res.success) {
        setSecurityStep("otp");
        toast.success("Verification code sent");
        if ((res as any).devOtp) setShowDevOtp((res as any).devOtp);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to request password change");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otpValue.length !== 6) {
      toast.error("Enter a valid 6-digit code");
      return;
    }
    setSecurityStep("password");
  };

  const handleUpdatePassword = async () => {
    if (newPass !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }
    if (!state.user?.identifier) return;
    
    setIsSubmitting(true);
    try {
      const res = await authApi.updatePassword({
        email: state.user.identifier,
        otp: otpValue,
        newPassword: newPass
      });
      if (res.success) {
        toast.success("Password Updated");
        setSecurityStep("initial");
        setOtpValue("");
        setNewPass("");
        setConfirmPass("");
        setShowDevOtp(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;

  const initials = (partnerData?.organizationName || "P").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 w-full animate-in fade-in duration-700">
      {/* Header Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-100 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10">
          <div className="relative">
             <Avatar className="h-28 w-28 border-4 border-emerald-50 relative shadow-xl z-10 bg-white">
                <AvatarFallback className="bg-gradient-to-br from-[#1D6E3F] to-emerald-600 text-white text-3xl font-black">
                  {initials}
                </AvatarFallback>
             </Avatar>
             <button className="absolute bottom-1 right-1 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:scale-110 transition-all z-20 border-2 border-white" onClick={() => setActiveTab('edit')}>
               <Edit2 className="h-4 w-4" />
             </button>
          </div>
          <div className="text-center sm:text-left mt-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{partnerData?.organizationName}</h1>
              <Badge className="bg-emerald-100 text-[#1D6E3F] font-bold px-3 py-1 border-none shadow-sm text-[10px] uppercase tracking-widest">
                {partnerData?.status || 'BRONZE'} Partner
              </Badge>
            </div>
            <div className="flex wrap items-center justify-center sm:justify-start gap-3 mt-1 text-sm text-gray-400 font-bold">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#FF9900]" /> <span className="font-mono text-gray-900 font-bold">{partnerData?.partnerId}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {partnerData?.csrCategory || "General Category"}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-auto z-10">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center sm:text-left">
            <p className="text-[10px] font-black uppercase text-emerald-700/50 tracking-widest mb-1">Impact Status</p>
            <p className="text-2xl font-black text-[#1D6E3F] uppercase tracking-tighter">
              {partnerData?.status || 'BRONZE'} 
              <span className="text-[#FF9900] ml-2 text-sm">TIER</span>
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* ... (TabsList remains same) ... */}
        <TabsList className="bg-white/50 backdrop-blur-md border border-emerald-100 p-1.5 mb-8 w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex rounded-2xl shadow-sm">
          {[
            { value: "overview", label: "Overview", icon: LayoutDashboard },
            { value: "edit", label: "Edit Profile", icon: User },
            { value: "preferences", label: "Settings", icon: Bell },
            { value: "security", label: "Security", icon: Shield },
          ].map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="text-gray-400 data-[state=active]:bg-[#1D6E3F] data-[state=active]:text-white py-3 px-6 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-white border-emerald-100 rounded-2xl p-6">
                    <User className="h-6 w-6 text-[#FF9900] mb-4" />
                    <h3 className="text-lg font-black text-gray-900">Contact Person</h3>
                    <p className="text-gray-500 font-bold">{partnerData?.contactPerson || "Not specified"}</p>
                 </Card>
                 <Card className="bg-white border-emerald-100 rounded-2xl p-6">
                    <Mail className="h-6 w-6 text-[#FF9900] mb-4" />
                    <h3 className="text-lg font-black text-gray-900">Email Address</h3>
                    <p className="text-gray-500 font-bold">{partnerData?.email || "Not specified"}</p>
                 </Card>
                 <Card className="bg-white border-emerald-100 rounded-2xl p-6">
                    <Phone className="h-6 w-6 text-[#FF9900] mb-4" />
                    <h3 className="text-lg font-black text-gray-900">Mobile</h3>
                    <p className="text-gray-500 font-bold">{partnerData?.mobile || "Not specified"}</p>
                 </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-emerald-100 rounded-2xl p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-[#FF9900]" />
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Registration Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs font-bold text-gray-400 uppercase">PAN Number</span>
                      <span className="text-sm font-black text-gray-900">{partnerData?.panNumber || "Not Linked"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs font-bold text-gray-400 uppercase">Category</span>
                      <span className="text-sm font-black text-gray-900">{partnerData?.csrCategory || "General"}</span>
                    </div>
                     <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">Partner Since</span>
                      <span className="text-sm font-black text-gray-900">{new Date(partnerData?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border-emerald-100 rounded-2xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Star size={80} className="fill-[#FF9900] text-[#FF9900]" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4">Organization Impact</h3>
                  <div className="space-y-6">
                    {(() => {
                      const totalImpact = partnerData?.totalImpact || 0;
                      let target = 25000;
                      let tierName = "SILVER";
                      
                      if (totalImpact >= 200000) {
                        target = 200000;
                        tierName = "PLATINUM REACHED";
                      } else if (totalImpact >= 100000) {
                        target = 200000;
                        tierName = "PLATINUM";
                      } else if (totalImpact >= 25000) {
                        target = 100000;
                        tierName = "GOLD";
                      }
                      
                      const progress = Math.min(100, (totalImpact / target) * 100);
                      
                      return (
                        <>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-[10px] font-black text-gray-400 uppercase">
                                PROGRESS TO {tierName}
                              </span>
                              <span className="text-[10px] font-black text-emerald-600 uppercase">₹{totalImpact.toLocaleString()} / ₹{target.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-[#1D6E3F]"
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            Your organization has contributed to providing healthcare and education to over <strong>{partnerData?.livesImpacted || 0}</strong> children across regional centers.
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="edit">
              <Card className="bg-white border-emerald-100 rounded-2xl p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="organizationName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-900">Organization Name</FormLabel>
                          <FormControl><Input {...field} className="rounded-xl border-emerald-100 focus-visible:ring-emerald-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="contactPerson" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-900">Contact Person</FormLabel>
                          <FormControl><Input {...field} className="rounded-xl border-emerald-100 focus-visible:ring-emerald-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-900">Mobile Number</FormLabel>
                          <FormControl><Input {...field} className="rounded-xl border-emerald-100 focus-visible:ring-emerald-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="panNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-900">PAN Number</FormLabel>
                          <FormControl><Input {...field} placeholder="ABCDE1234F" className="rounded-xl border-emerald-100 focus-visible:ring-emerald-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="csrCategory" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-900">CSR Category</FormLabel>
                          <FormControl><Input placeholder="e.g. Health, Education, Environment" {...field} className="rounded-xl border-emerald-100 focus-visible:ring-emerald-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSubmitting} className="bg-[#1D6E3F] hover:bg-[#155e33] text-white font-black rounded-xl px-8 h-12 shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-[11px]">
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
               <Card className="bg-white border-emerald-100 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-gray-900">Public Logo</Label>
                      <p className="text-xs text-gray-500 font-bold">Show organization logo on the partners wall.</p>
                    </div>
                    <Switch checked={true} onCheckedChange={(v) => handlePreferenceChange("logo", v)} className="data-[state=checked]:bg-[#1D6E3F]" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-gray-900">Impact Reports</Label>
                      <p className="text-xs text-gray-500 font-bold">Auto-generate and email monthly impact summaries.</p>
                    </div>
                    <Switch checked={true} onCheckedChange={(v) => handlePreferenceChange("reports", v)} className="data-[state=checked]:bg-[#1D6E3F]" />
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="security">
               <Card className="bg-white border-emerald-100 rounded-2xl p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/20">
                      <div className="space-y-1">
                        <Label className="text-base font-black text-gray-900">Account Password</Label>
                        <p className="text-xs text-gray-500 font-bold italic">Keep your portal access secure.</p>
                      </div>
                      {securityStep === "initial" && (
                        <Button variant="outline" onClick={handleRequestPasswordChange} disabled={isSubmitting} className="border-emerald-200 text-[#1D6E3F] font-bold rounded-xl h-10 px-4">
                          Change Password
                        </Button>
                      )}
                    </div>
                    {securityStep === "otp" && (
                      <div className="p-6 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 space-y-4">
                        <Label className="text-sm font-black text-gray-900">Verification Code</Label>
                        <div className="flex gap-4">
                          <Input value={otpValue} onChange={(e) => setOtpValue(e.target.value)} placeholder="6-digit OTP" maxLength={6} className="h-12 rounded-xl text-center font-mono text-xl tracking-widest border-emerald-200" />
                          <Button onClick={handleVerifyOtp} className="h-12 bg-[#1D6E3F] text-white font-black rounded-xl px-6">Verify</Button>
                        </div>
                        {showDevOtp && <p className="text-xs text-[#1D6E3F] font-bold bg-emerald-100 p-2 rounded">Dev OTP: {showDevOtp}</p>}
                      </div>
                    )}
                    {securityStep === "password" && (
                      <div className="p-6 rounded-xl border-2 border-[#FF9900]/20 bg-amber-50/10 space-y-4">
                        <div className="grid gap-4">
                          <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" className="h-12 rounded-xl border-[#FF9900]/20" />
                          <Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm Password" className="h-12 rounded-xl border-[#FF9900]/20" />
                          <Button onClick={handleUpdatePassword} disabled={isSubmitting} className="bg-[#FF9900] text-white font-black rounded-xl h-12 uppercase tracking-widest text-[11px]">Update Password</Button>
                        </div>
                      </div>
                    )}
                  </div>
               </Card>
            </TabsContent>

          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
