import { useState, useEffect } from "react";
import { User, Shield, Bell, LayoutDashboard, Edit2, Save, Loader2, Zap, Briefcase, Linkedin, MapPin, Clock, Heart } from "lucide-react";
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
import { authApi } from "../../lib/api/auth";

const volunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  city: z.string().optional(),
  profession: z.string().optional(),
  availability: z.string().optional(),
  linkedIn: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  motivation: z.string().optional(),
  skills: z.string().optional(), 
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

export function VolunteerProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volData, setVolData] = useState<any>(null);
  const [securityStep, setSecurityStep] = useState<"initial" | "otp" | "password">("initial");
  const [otpValue, setOtpValue] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showDevOtp, setShowDevOtp] = useState<string | null>(null);

  const { state, dispatch } = useAuth();
  const volId = state.user?.volunteerId || state.user?.identifier || "";

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: "",
      mobile: "",
      city: "",
      profession: "",
      availability: "",
      linkedIn: "",
      motivation: "",
      skills: "",
    },
  });

  useEffect(() => {
    if (!volId) return;
    client.get<any>(`/volunteers/dashboard?volunteerId=${encodeURIComponent(volId)}`)
      .then(res => {
        const v = res.volunteer;
        setVolData(res);
        form.reset({
          name: v.name || "",
          mobile: v.mobile || "",
          city: v.city || "",
          profession: v.profession || "",
          availability: v.availability || "",
          linkedIn: v.linkedIn || "",
          motivation: v.motivation || "",
          skills: (v.skills || []).join(", "),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [volId, form]);

  async function onSubmit(values: VolunteerFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        skills: values.skills?.split(",").map(s => s.trim()).filter(Boolean) || [],
      };
      await client.post(`/volunteers/profile/${encodeURIComponent(volId)}`, payload);
      toast.success("Profile Updated", { description: "Your volunteer details have been saved." });
      
      dispatch({ type: "UPDATE_ROLE", payload: { name: values.name } });
      
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
        if (res.devOtp) setShowDevOtp(res.devOtp);
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

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  const initials = (volData?.volunteer?.name || "V").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 w-full animate-in fade-in duration-700">
      {/* Header Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-[2rem] shadow-sm border border-amber-100 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10">
          <div className="relative">
             <Avatar className="h-28 w-28 border-4 border-amber-50 relative shadow-xl z-10 bg-white">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-3xl font-black">
                  {initials}
                </AvatarFallback>
             </Avatar>
             <button className="absolute bottom-1 right-1 p-2 bg-amber-600 text-white rounded-full shadow-lg hover:scale-110 transition-all z-20 border-2 border-white" onClick={() => setActiveTab('edit')}>
               <Edit2 className="h-4 w-4" />
             </button>
          </div>
          <div className="text-center sm:text-left mt-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-amber-950 tracking-tight">{volData?.volunteer?.name}</h1>
              <Badge className="bg-amber-100 text-amber-700 font-bold px-3 py-1 border-none shadow-sm text-[10px] uppercase tracking-widest">
                Volunteer Member
              </Badge>
            </div>
            <div className="flex wrap items-center justify-center sm:justify-start gap-3 mt-1 text-sm text-amber-900/40 font-bold">
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-600" /> <span className="font-mono text-amber-950 font-bold">{volData?.volunteer?.volunteerId}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {volData?.volunteer?.city || "No City Set"}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-auto z-10">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center sm:text-left">
            <p className="text-[10px] font-black uppercase text-amber-700/50 tracking-widest mb-1">Impact Wallet</p>
            <p className="text-2xl font-black text-amber-950">{volData?.stats?.totalCoins || 0} <span className="text-sm font-bold text-amber-600">Credits</span></p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-md border border-amber-100 p-1.5 mb-8 w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex rounded-2xl shadow-sm">
          {[
            { value: "overview", label: "Overview", icon: LayoutDashboard },
            { value: "edit", label: "Edit Profile", icon: User },
            { value: "preferences", label: "Settings", icon: Bell },
            { value: "security", label: "Security", icon: Shield },
          ].map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="text-amber-900/40 data-[state=active]:bg-amber-600 data-[state=active]:text-white py-3 px-6 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-white border-amber-100 rounded-2xl p-6">
                    <Briefcase className="h-6 w-6 text-amber-600 mb-4" />
                    <h3 className="text-lg font-black text-amber-950">Profession</h3>
                    <p className="text-amber-700/60 font-bold">{volData?.volunteer?.profession || "Not specified"}</p>
                 </Card>
                 <Card className="bg-white border-amber-100 rounded-2xl p-6">
                    <Clock className="h-6 w-6 text-amber-600 mb-4" />
                    <h3 className="text-lg font-black text-amber-950">Availability</h3>
                    <p className="text-amber-700/60 font-bold">{volData?.volunteer?.availability || "Not specified"}</p>
                 </Card>
                 <Card className="bg-white border-amber-100 rounded-2xl p-6">
                    <Linkedin className="h-6 w-6 text-amber-600 mb-4" />
                    <h3 className="text-lg font-black text-amber-950">LinkedIn</h3>
                    {volData?.volunteer?.linkedIn ? (
                      <a href={volData.volunteer.linkedIn} target="_blank" className="text-amber-600 font-bold hover:underline truncate block">View Profile</a>
                    ) : (
                      <p className="text-amber-700/60 font-bold">Not linked</p>
                    )}
                 </Card>
              </div>

              <Card className="bg-white border-amber-100 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-amber-600 animate-pulse fill-current" />
                  <h3 className="text-xl font-black text-amber-950">My Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(volData?.volunteer?.skills || []).length > 0 ? (
                    (volData.volunteer.skills || []).map((skill: string) => (
                      <Badge key={skill} className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 font-bold">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-amber-900/40 font-bold italic">Add your skills in the Edit Profile tab.</p>
                  )}
                </div>
              </Card>

              <Card className="bg-white border-amber-100 rounded-2xl p-8">
                <h3 className="text-xl font-black text-amber-950 mb-4">My Motivation</h3>
                <p className="text-amber-800/70 font-semibold leading-relaxed">
                  {volData?.volunteer?.motivation || "Tell us what drives you to volunteer..."}
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="edit">
              <Card className="bg-white border-amber-100 rounded-2xl p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-amber-950">Full Name</FormLabel>
                          <FormControl><Input {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-amber-950">Mobile Number</FormLabel>
                          <FormControl><Input {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-amber-950">City</FormLabel>
                          <FormControl><Input {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="profession" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-amber-950">Profession</FormLabel>
                          <FormControl><Input {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="availability" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-amber-950">Availability</FormLabel>
                          <FormControl><Input placeholder="e.g. Weekends, Mon-Wed" {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="skills" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-amber-950">Skills</FormLabel>
                        <FormControl><Input placeholder="Design, Management, Coding..." {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500" /></FormControl>
                        <FormDescription className="text-amber-600/50 font-bold">Enter skills separated by commas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="linkedIn" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-amber-950">LinkedIn Profile URL</FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/username" {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="motivation" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-amber-950">Motivation</FormLabel>
                        <FormControl><Textarea placeholder="Why do you want to help us?" {...field} className="rounded-xl border-amber-100 focus-visible:ring-amber-500 min-h-[120px]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl px-8 h-12 shadow-lg shadow-amber-500/20">
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Profile
                      </Button>
                    </div>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
               <Card className="bg-white border-amber-100 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-amber-950">Public Leaderboard</Label>
                      <p className="text-xs text-amber-600 font-bold">Show your rank on the global leaderboard.</p>
                    </div>
                    <Switch checked={volData?.volunteer?.showOnLeaderboard} onCheckedChange={(v) => handlePreferenceChange("leaderboard", v)} className="data-[state=checked]:bg-amber-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-amber-950">Event Notifications</Label>
                      <p className="text-xs text-amber-600 font-bold">Get emails about new volunteering camps.</p>
                    </div>
                    <Switch checked={true} onCheckedChange={(v) => handlePreferenceChange("email", v)} className="data-[state=checked]:bg-amber-600" />
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="security">
               <Card className="bg-white border-amber-100 rounded-2xl p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/20">
                      <div className="space-y-1">
                        <Label className="text-base font-black text-amber-950">Account Password</Label>
                        <p className="text-xs text-amber-600 font-bold italic">Refresh your security credentials.</p>
                      </div>
                      {securityStep === "initial" && (
                        <Button variant="outline" onClick={handleRequestPasswordChange} disabled={isSubmitting} className="border-amber-200 text-amber-700 font-bold rounded-xl h-10 px-4">
                          Change Password
                        </Button>
                      )}
                    </div>
                    {securityStep === "otp" && (
                      <div className="p-6 rounded-xl border-2 border-amber-200 bg-amber-50/50 space-y-4">
                        <Label className="text-sm font-black text-amber-950">Verification Code</Label>
                        <div className="flex gap-4">
                          <Input value={otpValue} onChange={(e) => setOtpValue(e.target.value)} placeholder="6-digit OTP" maxLength={6} className="h-12 rounded-xl text-center font-mono text-xl tracking-widest border-amber-200" />
                          <Button onClick={handleVerifyOtp} className="h-12 bg-amber-600 text-white font-black rounded-xl px-6">Verify</Button>
                        </div>
                        {showDevOtp && <p className="text-xs text-amber-700 font-bold bg-amber-100 p-2 rounded">Dev OTP: {showDevOtp}</p>}
                      </div>
                    )}
                    {securityStep === "password" && (
                      <div className="p-6 rounded-xl border-2 border-emerald-500/20 bg-emerald-50/10 space-y-4">
                        <div className="grid gap-4">
                          <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" className="h-12 rounded-xl border-emerald-200" />
                          <Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm Password" className="h-12 rounded-xl border-emerald-200" />
                          <Button onClick={handleUpdatePassword} disabled={isSubmitting} className="bg-emerald-600 text-white font-black rounded-xl h-12">Update Password</Button>
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
