import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Lock, Heart, TrendingUp, FileText, Award, CalendarDays } from "lucide-react";

const previewSections = [
  { icon: TrendingUp, label: "Impact Stats", desc: "See how your donations are creating impact." },
  { icon: Heart, label: "Donation History", desc: "Full history of all your donations." },
  { icon: Award, label: "Certificates", desc: "Download your 80G tax certificates." },
  { icon: FileText, label: "Reports", desc: "Access detailed annual impact reports." },
  { icon: CalendarDays, label: "Events", desc: "RSVP and attend exclusive donor events." },
];

export function DashboardPreviewPage() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen py-16 bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-sm mb-1" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Donor Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2" style={{ fontWeight: 800 }}>
            Dashboard Preview
          </h1>
          <p className="text-gray-600">Unlock the full dashboard by donating ₹5,000 or more.</p>
        </div>

        {/* Blurred Sections */}
        <div className="relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 select-none pointer-events-none" aria-hidden="true">
            {previewSections.map((section) => (
              <Card key={section.label} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{section.label}</h3>
                  <p className="text-sm text-gray-500">{section.desc}</p>
                  {/* Blurred mock content */}
                  <div className="mt-4 space-y-2 blur-sm">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overlay Lock Card */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl">
            <Card className="max-w-sm w-full mx-4 border-gray-200 shadow-2xl bg-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
                  <Lock className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Donor Dashboard Access</h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  To access the full Donor Dashboard features, your donation should be{" "}
                  <strong className="text-gray-900">₹5,000 or more</strong>.
                </p>
                <Button
                  onClick={() => navigate("/donate")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20"
                >
                  <Heart className="h-4 w-4 mr-2 fill-current" />
                  Donate ₹5,000 to Unlock Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-gray-500 hover:text-gray-700"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
