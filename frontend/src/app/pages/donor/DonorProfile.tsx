import { useState } from "react";
import { User, Shield, Bell, Heart, LayoutDashboard, Receipt, FileText, Award, CalendarDays, LogOut, ChevronRight, Edit2, Save, X, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

  // Mock data
  const [donorData, setDonorData] = useState({
    name: "Pratham Shah",
    displayName: "Pratham S.",
    donorId: "W18-5042",
    email: "pratham.shah@example.com",
    mobile: "+91 98765 43210",
    joinedDate: "January 15, 2024",
    tier: "Champion",
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
    // Simulate API call
    setTimeout(() => {
      setDonorData(prev => ({
        ...prev,
        ...values
      }));
      setIsSubmitting(false);
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved to our records."
      });
      setActiveTab("overview");
    }, 1500);
  }

  const handlePreferenceChange = (key: keyof typeof donorData.preferences, value: boolean) => {
    setDonorData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
    toast.info("Preference updated", {
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} setting has been saved.`
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 col-span-1" />
          <Skeleton className="h-40 col-span-1" />
          <Skeleton className="h-40 col-span-1" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d1f5e0] to-[#f0faf4] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <Avatar className="h-24 w-24 border-2 border-white relative shadow-sm">
              <AvatarImage src="" alt={donorData.name} />
              <AvatarFallback className="bg-[#f0faf4] text-[#1D6E3F] text-2xl font-bold">
                {donorData.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white text-[#1D6E3F] rounded-full shadow-md border border-gray-200 hover:scale-110 transition-transform">
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{donorData.name}</h1>
              <Badge className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold px-3 py-1 border-none shadow-sm">
                {donorData.tier}
              </Badge>
            </div>
            <p className="text-[#1D6E3F] font-medium flex items-center gap-2 mt-1">
              Donor ID: <span className="text-gray-900 font-mono">{donorData.donorId}</span>
              <Separator orientation="vertical" className="h-3 bg-gray-300" />
              Joined {donorData.joinedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold bg-white shadow-sm" onClick={() => toast.success("Download started", { description: "Downloading your latest tax certificate." })}>
            Download Tax Certificate
          </Button>
          <Link to="/donate">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm">
              Make a Donation
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100/50 border border-gray-200 p-1 mb-8 w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex rounded-xl">
          <TabsTrigger value="overview" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2.5 px-6 font-semibold rounded-lg">
            Overview
          </TabsTrigger>
          <TabsTrigger value="edit" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2.5 px-6 font-semibold rounded-lg">
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2.5 px-6 font-semibold rounded-lg">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2.5 px-6 font-semibold rounded-lg">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden group hover:border-[#a7e8c3] transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#1D6E3F] uppercase text-[10px] font-bold tracking-widest">Total Donated</CardDescription>
                <CardTitle className="text-2xl text-gray-900 font-bold">{donorData.stats.totalDonated}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-full bg-[#d1f5e0] rounded-full mt-2">
                  <div className="h-full bg-primary rounded-full w-[70%]" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-sm group hover:border-[#a7e8c3] transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#1D6E3F] uppercase text-[10px] font-bold tracking-widest">Donations</CardDescription>
                <CardTitle className="text-2xl text-gray-900 font-bold">{donorData.stats.donationCount}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-500">
                Last: {donorData.stats.lastDonationDate}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm group hover:border-[#a7e8c3] transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#1D6E3F] uppercase text-[10px] font-bold tracking-widest">Programs</CardDescription>
                <CardTitle className="text-2xl text-gray-900 font-bold">{donorData.stats.programsSupported}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-500">
                Across 3 sectors
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm group hover:border-[#a7e8c3] transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#1D6E3F] uppercase text-[10px] font-bold tracking-widest">Lives Touched</CardDescription>
                <CardTitle className="text-2xl text-gray-900 font-bold">{donorData.impact.childrenSupported}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-500">
                Health & Education
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Impact Metrics */}
            <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 font-bold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary fill-primary" />
                  Your Impact Journey
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">Real-world change powered by your contributions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                    <p className="text-3xl font-bold text-gray-900">{donorData.impact.childrenSupported}</p>
                    <p className="text-sm text-[#1D6E3F] font-semibold leading-tight">Children supported through education</p>
                  </div>
                  <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                    <p className="text-3xl font-bold text-gray-900">{donorData.impact.healthCheckups}</p>
                    <p className="text-sm text-[#1D6E3F] font-semibold leading-tight">Health checkups funded in rural clinics</p>
                  </div>
                  <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                    <p className="text-3xl font-bold text-gray-900">{donorData.impact.schoolsReached}</p>
                    <p className="text-sm text-[#1D6E3F] font-semibold leading-tight">Schools reached with program materials</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Details */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-[#1D6E3F]" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Email Address</p>
                  <p className="text-gray-900 font-medium">{donorData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mobile Number</p>
                  <p className="text-gray-900 font-medium">{donorData.mobile}</p>
                </div>
                <div className="space-y-1 pt-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Display Preference</p>
                  <p className="text-gray-900 font-medium">{donorData.displayName}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="bg-white border-gray-200 shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 font-bold">Update Profile Information</CardTitle>
              <CardDescription className="text-gray-600 font-medium">Keep your contact details up to date</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-semibold">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-300 text-gray-900 focus:border-primary/50" />
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-semibold">Display Nickname</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-300 text-gray-900 focus:border-primary/50" />
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-semibold">Mobile Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-gray-300 text-gray-900 focus:border-primary/50" />
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <Label className="text-gray-900 font-semibold opacity-50 text-xs">Email Address (Read-only)</Label>
                      <Input 
                        value={donorData.email} 
                        disabled 
                        className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed h-10" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 pt-6 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setActiveTab("overview")} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm min-w-[120px]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="animate-in fade-in slide-in-from-right-4 duration-500">
          <Card className="bg-white border-gray-200 shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 font-bold">Communication & Visibility</CardTitle>
              <CardDescription className="text-gray-600 font-medium">Manage how you interact with the foundation platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-gray-900 font-bold">Public Recognition</Label>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-[#1D6E3F]/30 text-[#1D6E3F] bg-[#f0faf4]">Donor Wall</Badge>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Show my name on the donor recognition wall</p>
                </div>
                <Switch 
                  checked={donorData.preferences.showOnWall} 
                  onCheckedChange={(checked) => handlePreferenceChange("showOnWall", checked)}
                  className="data-[state=checked]:bg-primary" 
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-bold">Impact Updates</Label>
                  <p className="text-sm text-gray-500 font-medium">Receive monthly progress reports for your supported programs</p>
                </div>
                <Switch 
                  checked={donorData.preferences.progressUpdates} 
                  onCheckedChange={(checked) => handlePreferenceChange("progressUpdates", checked)}
                  className="data-[state=checked]:bg-primary" 
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="space-y-0.5">
                  <Label className="text-gray-900 font-bold">Event Invitations</Label>
                  <p className="text-sm text-gray-500 font-medium">Get notified about exclusive donor meetups and field visits</p>
                </div>
                <Switch 
                  checked={donorData.preferences.eventInvites} 
                  onCheckedChange={(checked) => handlePreferenceChange("eventInvites", checked)}
                  className="data-[state=checked]:bg-primary" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 font-bold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#1D6E3F]" />
                  Password Settings
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">Keep your account secure with a strong password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 font-semibold">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-white border-gray-300 text-gray-900" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 font-semibold">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-white border-gray-300 text-gray-900" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 font-semibold">Confirm New Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-white border-gray-300 text-gray-900" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 pt-6">
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold" onClick={() => toast.success("Password updated successfully!")}>Update Password</Button>
              </CardFooter>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm border-t-4 border-t-rose-500">
              <CardHeader>
                <CardTitle className="text-xl text-rose-600 font-bold flex items-center gap-2">
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-rose-600/60 font-medium">Session management and account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 font-bold">Current Session</p>
                      <p className="text-xs text-rose-600/80 font-medium">You are currently logged in on this Windows device</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-rose-200 bg-white text-rose-600 hover:bg-rose-50 h-8 font-bold" onClick={() => toast.success("Logged out successfully.")}>
                      <LogOut className="h-3 w-3 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <p className="text-xs text-gray-500 font-medium italic">
                    To delete your account or download your data, please contact donor.support@wombto18.org
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
