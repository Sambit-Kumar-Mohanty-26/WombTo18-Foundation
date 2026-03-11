import { Baby, GraduationCap, HeartPulse, Apple, Users, Shield, ArrowRight, Heart } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router";

const programs = [
  {
    icon: Baby,
    title: "Prenatal & Maternal Care",
    age: "Pre-birth",
    status: "Active",
    description: "Comprehensive healthcare for expectant mothers including regular check-ups, nutrition counseling, birth preparedness, and postpartum support.",
    stats: "3,500+ mothers supported",
    features: ["Regular health check-ups", "Nutrition supplements", "Birth preparedness classes", "Postpartum counseling"],
    target: 2500000,
    raised: 1875000,
    image: "https://images.unsplash.com/photo-1770261430761-192b0b72e4a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBjaGlsZCUyMGNhcmUlMjBwcmVnbmFuY3l8ZW58MXx8fHwxNzczMTM0MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Health",
  },
  {
    icon: HeartPulse,
    title: "Early Childhood Development",
    age: "0-5 years",
    status: "Active",
    description: "Immunization drives, developmental screenings, growth monitoring, and early stimulation programs for infants and toddlers.",
    stats: "4,200 children monitored",
    features: ["Immunization tracking", "Developmental milestones", "Growth monitoring", "Parent education"],
    target: 1800000,
    raised: 1350000,
    image: "https://images.unsplash.com/photo-1728494049079-c262d3facee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGhlYWx0aGNhcmUlMjBudXRyaXRpb258ZW58MXx8fHwxNzczMTM0MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Health",
  },
  {
    icon: Apple,
    title: "Nutrition Programs",
    age: "0-18 years",
    status: "Active",
    description: "Mid-day meal programs, nutrition supplements, awareness campaigns, and kitchen gardens to combat malnutrition at every stage.",
    stats: "12,000 meals served daily",
    features: ["Mid-day meals", "Micronutrient supplements", "Community kitchens", "Nutrition awareness"],
    target: 3200000,
    raised: 2720000,
    image: "https://images.unsplash.com/photo-1586503452950-997923af27f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkcmVuJTIwcGxheWluZyUyMHNjaG9vbHxlbnwxfHx8fDE3NzMxMzQwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Nutrition",
  },
  {
    icon: GraduationCap,
    title: "Education Support",
    age: "6-18 years",
    status: "Active",
    description: "Scholarships, school supplies, after-school tutoring, digital literacy, and career guidance for school-age children.",
    stats: "8,100 students educated",
    features: ["Scholarships", "Digital literacy", "After-school tutoring", "Career guidance"],
    target: 4100000,
    raised: 3485000,
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzczMTM0MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Education",
  },
  {
    icon: Users,
    title: "Youth Empowerment",
    age: "14-18 years",
    status: "Active",
    description: "Skill development, mentorship, leadership training, and career counseling to prepare teenagers for independent adult life.",
    stats: "2,500 youth empowered",
    features: ["Skill development", "Mentorship", "Leadership programs", "Internship placements"],
    target: 1500000,
    raised: 900000,
    image: "https://images.unsplash.com/photo-1764072970350-2ce4f354a483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXIlMjBoZWxwaW5nJTIwY2hpbGRyZW58ZW58MXx8fHwxNzczMTM0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Community",
  },
  {
    icon: Shield,
    title: "Child Protection",
    age: "0-18 years",
    status: "Active",
    description: "Advocacy, community awareness, helplines, and support systems to protect children from abuse, exploitation, and trafficking.",
    stats: "500+ interventions",
    features: ["Helpline services", "Community awareness", "Legal support", "Rehabilitation"],
    target: 800000,
    raised: 560000,
    image: "https://images.unsplash.com/photo-1584376003963-e1aa9a61c0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMEluZGlhJTIwTkdPfGVufDF8fHx8MTc3MzEzNDAyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Community",
  },
];

function formatINR(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-background via-emerald-950/50 to-background text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Our Programs</p>
            <h1 className="text-4xl sm:text-5xl text-foreground mb-6" style={{ fontWeight: 800, lineHeight: 1.1 }}>
              Comprehensive Care at Every Stage of Childhood
            </h1>
            <p className="text-lg text-muted-foreground">
              From prenatal care to preparing young adults for life, our programs ensure no child is left behind. Choose a program to support and track your impact in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 bg-emerald-900/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-emerald-200/70" style={{ fontWeight: 500 }}>Categories:</span>
            {["All Programs", "Health", "Education", "Nutrition", "Community"].map((cat) => (
              <Badge
                key={cat}
                variant={cat === "All Programs" ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1.5 ${cat === "All Programs" ? "bg-primary text-primary-foreground" : "border-white/10 text-white hover:bg-white/5"}`}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => {
              const percentRaised = Math.round((program.raised / program.target) * 100);
              return (
                <Card key={program.title} className="border-border/50 overflow-hidden group hover:shadow-lg transition-shadow flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-white/90 text-emerald-950 backdrop-blur-sm text-xs font-bold">{program.category}</Badge>
                      <Badge className="bg-accent/90 text-white text-xs">{program.status}</Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full text-emerald-800 font-bold" style={{ fontWeight: 700 }}>
                        {program.age}
                      </span>
                    </div>
                  </div>

                  <CardContent className="pt-5 flex-1 flex flex-col">
                    {/* Title & Icon */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <program.icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg text-foreground" style={{ fontWeight: 700 }}>{program.title}</h3>
                        <p className="text-xs text-primary" style={{ fontWeight: 600 }}>{program.stats}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{program.description}</p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-1.5 mb-5">
                      {program.features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* Funding Progress */}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground" style={{ fontWeight: 600 }}>
                          {formatINR(program.raised)} raised
                        </span>
                        <span className="text-muted-foreground">
                          of {formatINR(program.target)}
                        </span>
                      </div>
                      <Progress value={percentRaised} className="h-2 mb-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{percentRaised}% funded</span>
                        <Link to="/donate">
                          <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 text-xs text-primary-foreground font-bold">
                            <Heart className="h-3 w-3 mr-1 fill-current" /> Donate Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4" style={{ fontWeight: 700 }}>Program Highlights</h2>
            <p className="text-emerald-200/70 max-w-2xl mx-auto">Our flagship initiatives that have created the most impact this year.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: "Active Programs", value: "6", sub: "Across 4 focus areas" },
              { label: "Total Target (FY 2025-26)", value: "₹1.39 Cr", sub: "Annual fundraising goal" },
              { label: "Overall Funded", value: "78%", sub: "₹1.09 Cr raised so far" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-emerald-950/30 border-white/10 text-center">
                <CardContent className="pt-6">
                  <p className="text-3xl text-primary" style={{ fontWeight: 800 }}>{stat.value}</p>
                  <p className="text-sm mt-1 text-white" style={{ fontWeight: 600 }}>{stat.label}</p>
                  <p className="text-xs text-emerald-200/50 mt-1">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-foreground mb-4" style={{ fontWeight: 700 }}>Want to Support a Program?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Choose a program close to your heart and make a targeted donation that creates lasting impact. Every contribution is 100% tax deductible under 80G.
          </p>
          <Link to="/donate">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Donate to a Program <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
