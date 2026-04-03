import { useState } from "react";
import { User, Shield, Bell, Heart, LayoutDashboard, Receipt, FileText, Award, CalendarDays, LogOut, ChevronRight, Edit2, Save, X, Loader2, Sparkles, CheckCircle2, GraduationCap, HeartPulse } from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Separator } from "../../components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function DonorProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useAuth();
  const session = state.user;

  // Mock data for UI demonstration, typically fetched from backend
  const [donorData, setDonorData] = useState({
    name: session?.name || "Pratham Shah",
    displayName: session?.identifier.split("@")[0] || "Pratham S.",
    donorId: session ? "W18-5042" : "",
    email: session?.identifier || "pratham@example.com",
    mobile: "+91 98765 43210",
    joinedDate: "January 15, 2024",
    tier: session?.eligible ? "Premium Donor" : "Patron",
    stats: {
      totalDonated: "₹1,25,000",
      donationCount: 12,
      programsSupported: 4,
      lastDonationDate: "Feb 28, 2024"
    },
    impact: {
      childrenSupported: 45,
      healthCheckups: 120,
      schoolsReached: 12
    },
    preferences: {
      showOnWall: true,
      progressUpdates: true,
      eventInvites: false
    }
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: donorData.name,
      displayName: donorData.displayName,
      mobile: donorData.mobile,
    },
  });

  function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    setTimeout(() => {
      setDonorData(prev => ({ ...prev, ...values }));
      setIsSubmitting(false);
      toast.success("Profile updated successfully", { description: "Your changes have been saved to our records." });
      setActiveTab("overview");
    }, 1500);
  }

  const handlePreferenceChange = (key: keyof typeof donorData.preferences, value: boolean) => {
    setDonorData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
    toast.success("Preference updated", { description: "Your setting has been saved locally." });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#1D6E3F]" />
        <p className="text-gray-500 font-medium tracking-tight">Loading Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 w-full animate-in fade-in duration-700">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_rgba(29,110,63,0.05)_0%,_transparent_70%)] rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10">
          <div className="relative">
            {/* Glowing ring animation */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#1D6E3F] via-emerald-400 to-[#F29F05] rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-1000 animate-pulse" />
            <div className="absolute -inset-1 bg-white rounded-full z-0" />
            <Avatar className="h-28 w-28 border-4 border-white relative shadow-xl z-10 bg-white">
              <AvatarImage src="" alt={donorData.name} />
              <AvatarFallback className="bg-emerald-50 text-[#1D6E3F] text-3xl font-black">
                {donorData.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-1 right-1 p-2 bg-[#1D6E3F] text-white rounded-full shadow-lg hover:scale-110 hover:bg-emerald-700 transition-all z-20 border-2 border-white" onClick={() => setActiveTab('edit')}>
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center sm:text-left mt-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{donorData.name}</h1>
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-3 py-1 border-none shadow-[0_4px_10px_-2px_rgba(245,158,11,0.4)] text-[10px] uppercase tracking-widest">
                {donorData.tier}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"><Shield className="h-3.5 w-3.5 text-[#1D6E3F]" /> <span className="font-mono text-gray-900 font-bold">{donorData.donorId}</span></span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Joined {donorData.joinedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-auto z-10">
          <Link to="/donate" className="w-full">
            <Button className="w-full bg-gradient-to-r from-[#1D6E3F] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-black shadow-[0_10px_20px_-10px_rgba(29,110,63,0.5)] rounded-xl h-12 px-6 transition-all duration-300 hover:-translate-y-1">
              <Heart className="h-4 w-4 mr-2 fill-emerald-400/50" /> Make a Donation
            </Button>
          </Link>
          <Button variant="outline" className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl h-11" onClick={() => toast.info("Certificates are securely requested via the Financial Dashboard")}>
            <FileText className="h-4 w-4 mr-2 text-gray-400" /> Print Summary
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-md border border-gray-100 p-1.5 mb-8 w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          {[
            { value: "overview", label: "Overview", icon: LayoutDashboard },
            { value: "edit", label: "Details", icon: User },
            { value: "preferences", label: "Preferences", icon: Bell },
            { value: "security", label: "Security", icon: Shield },
          ].map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="text-gray-500 data-[state=active]:bg-[#1D6E3F] data-[state=active]:text-white py-3 px-6 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.value ? 'opacity-100' : 'opacity-50'}`} /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="overview" className="mt-0 space-y-6 outline-none">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Donated", val: donorData.stats.totalDonated, text: "text-[#1D6E3F]", bg: "bg-[#1D6E3F]/5" },
                  { label: "Donations", val: donorData.stats.donationCount, text: "text-blue-600", bg: "bg-blue-600/5" },
                  { label: "Programs", val: donorData.stats.programsSupported, text: "text-amber-600", bg: "bg-amber-600/5" },
                  { label: "Lives Touched", val: donorData.impact.childrenSupported, text: "text-indigo-600", bg: "bg-indigo-600/5" },
                ].map((stat, i) => (
                  <Card key={i} className="bg-white border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[1.5rem] group hover:-translate-y-1">
                    <CardHeader className="pb-2 pt-6 px-6">
                      <CardDescription className={`uppercase text-[10px] font-black tracking-widest ${stat.text} bg-white inline-block w-fit`}>{stat.label}</CardDescription>
                      <CardTitle className="text-3xl text-gray-900 font-black tracking-tight">{stat.val}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className={`h-1.5 w-12 ${stat.bg} rounded-full`}>
                        <div className={`h-full w-full bg-current ${stat.text} rounded-full`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] rounded-[1.5rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                   <Sparkles className="h-32 w-32 -mr-6 -mt-6 rotate-12" />
                </div>
                <CardHeader className="pt-8 px-8 border-b border-gray-50 pb-6 relative z-10">
                  <Badge variant="outline" className="bg-[#1D6E3F]/5 text-[#1D6E3F] border-[#1D6E3F]/20 font-bold px-3 py-1 mb-3 w-fit uppercase tracking-widest text-[9px]">Journey</Badge>
                  <CardTitle className="text-2xl text-gray-900 font-black tracking-tight">Your Direct Impact</CardTitle>
                  <CardDescription className="font-semibold text-gray-500">The human difference your contributions make.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-[#fafaf8] border border-gray-100 hover:bg-[#1D6E3F]/[0.02] hover:border-[#1D6E3F]/20 transition-all group">
                      <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-[#1D6E3F]">
                         <GraduationCap className="h-5 w-5" />
                      </div>
                      <p className="text-4xl font-black text-gray-900 mb-2">{donorData.impact.childrenSupported}</p>
                      <p className="text-sm text-[#1D6E3F] font-bold">Children educated</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#fafaf8] border border-gray-100 hover:bg-blue-600/[0.02] hover:border-blue-600/20 transition-all group">
                      <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                         <HeartPulse className="h-5 w-5" />
                      </div>
                      <p className="text-4xl font-black text-gray-900 mb-2">{donorData.impact.healthCheckups}</p>
                      <p className="text-sm text-blue-600 font-bold">Health checkups funded</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#fafaf8] border border-gray-100 hover:bg-amber-600/[0.02] hover:border-amber-600/20 transition-all group">
                      <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                         <LayoutDashboard className="h-5 w-5" />
                      </div>
                      <p className="text-4xl font-black text-gray-900 mb-2">{donorData.impact.schoolsReached}</p>
                      <p className="text-sm text-amber-600 font-bold">Schools equipped</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-0 outline-none">
              <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] rounded-[1.5rem]">
                <CardHeader className="pt-8 px-8 border-b border-gray-50 pb-6">
                  <CardTitle className="text-2xl text-gray-900 font-black tracking-tight">Personal Information</CardTitle>
                  <CardDescription className="font-semibold text-gray-500 mt-1">Make sure your receipt data is accurate.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-gray-700">Legal Name / Entity</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} className="h-12 rounded-xl bg-gray-50 border-gray-200 px-4 focus-visible:ring-[#1D6E3F]/20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-gray-700">Display Name (Public)</FormLabel>
                              <FormControl>
                                <Input placeholder="John D." {...field} className="h-12 rounded-xl bg-gray-50 border-gray-200 px-4 focus-visible:ring-[#1D6E3F]/20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-gray-700">Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 90000 00000" {...field} className="h-12 rounded-xl bg-gray-50 border-gray-200 px-4 focus-visible:ring-[#1D6E3F]/20" />
                            </FormControl>
                            <FormDescription className="text-xs font-semibold">Required for automated 80G SMS delivery.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => form.reset()} className="rounded-xl font-bold border-gray-200 hover:bg-gray-50 h-11 px-6">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="rounded-xl font-black bg-[#1D6E3F] hover:bg-emerald-700 text-white shadow-lg h-11 px-6">
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-0 outline-none">
              <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] rounded-[1.5rem]">
                <CardHeader className="pt-8 px-8 border-b border-gray-50 pb-6">
                  <CardTitle className="text-2xl text-gray-900 font-black tracking-tight">Ecosystem Preferences</CardTitle>
                  <CardDescription className="font-semibold text-gray-500 mt-1">Control your digital presence and communications.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8 max-w-2xl">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <Label className="text-base font-bold text-gray-900">Public Acknowledgment</Label>
                      <p className="text-sm text-gray-500 font-medium">Show my name on the public Impact Wall.</p>
                    </div>
                    <Switch
                      checked={donorData.preferences.showOnWall}
                      onCheckedChange={(c) => handlePreferenceChange("showOnWall", c)}
                      className="data-[state=checked]:bg-[#1D6E3F]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <Label className="text-base font-bold text-gray-900">Transparent Updates</Label>
                      <p className="text-sm text-gray-500 font-medium">Receive quarterly digital reports matching the disclosures map.</p>
                    </div>
                    <Switch
                      checked={donorData.preferences.progressUpdates}
                      onCheckedChange={(c) => handlePreferenceChange("progressUpdates", c)}
                      className="data-[state=checked]:bg-[#1D6E3F]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <Label className="text-base font-bold text-gray-900">VIP Invites</Label>
                      <p className="text-sm text-gray-500 font-medium">Get invites to offline foundation events in your city.</p>
                    </div>
                    <Switch
                      checked={donorData.preferences.eventInvites}
                      onCheckedChange={(c) => handlePreferenceChange("eventInvites", c)}
                      className="data-[state=checked]:bg-[#1D6E3F]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0 outline-none">
              <Card className="bg-white border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] rounded-[1.5rem]">
                <CardHeader className="pt-8 px-8 border-b border-gray-50 pb-6">
                  <CardTitle className="text-2xl text-gray-900 font-black tracking-tight flex items-center gap-2"><Shield className="h-6 w-6 text-gray-900" /> Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6 max-w-2xl">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-700 font-medium">Your account uses <span className="font-bold uppercase tracking-widest text-[#1D6E3F] text-[10px] ml-1">Passwordless OTP</span> via {donorData.email} for secure access.</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl h-11 shrink-0" onClick={() => toast.success("Secure session terminated")}>
                    <LogOut className="h-4 w-4 mr-2" /> Revoke Current Sessions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
