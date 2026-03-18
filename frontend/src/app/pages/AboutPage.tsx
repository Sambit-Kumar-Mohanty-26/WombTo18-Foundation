import { Heart, Target, Eye, Users, Award, Globe, MapPin, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";


const values = [
  { icon: Heart, title: "Compassion", description: "Every decision is guided by our deep care for mothers and children." },
  { icon: Eye, title: "Transparency", description: "Every rupee is accounted for. Real-time dashboards for all stakeholders." },
  { icon: Users, title: "Community", description: "We work with communities, not just for them. Local ownership is key." },
  { icon: Award, title: "Excellence", description: "Evidence-based programs with measurable outcomes and continuous improvement." },
  { icon: Globe, title: "Inclusivity", description: "Every child deserves care regardless of gender, caste, or economic status." },
  { icon: Target, title: "Impact", description: "We measure success in changed lives, not just activities completed." },
];

const timeline = [
  {
    year: "2008",
    title: "The Beginning",
    event: "Dr. Ananya Bhatt founded WombTo18 in Mumbai with a single prenatal care center serving 50 mothers.",
    highlight: "50 mothers served",
  },
  {
    year: "2012",
    title: "Multi-State Expansion",
    event: "Expanded operations to 5 states, launched the first education support program for underprivileged children.",
    highlight: "5 states, 1,200 children",
  },
  {
    year: "2016",
    title: "Nutrition Revolution",
    event: "Reached 5,000 children milestone. Introduced community kitchen and nutrition supplement programs across rural India.",
    highlight: "5,000 children reached",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    event: "Pivoted to digital learning during COVID-19. Launched tele-health consultations and online tutoring for remote communities.",
    highlight: "10,000+ online sessions",
  },
  {
    year: "2024",
    title: "Scale & Innovation",
    event: "Present in 12 states with 15,000+ children enrolled. Launched the Youth Empowerment and vocational training track.",
    highlight: "12 states, 15,000+ children",
  },
  {
    year: "2026",
    title: "The Future",
    event: "Pioneering AI-powered health monitoring, expanding to 200+ communities, and targeting 25,000 children by year-end.",
    highlight: "200+ communities",
  },
];

const impactNumbers = [
  { value: "15,234", label: "Children Impacted", icon: Users },
  { value: "3,500+", label: "Mothers Supported", icon: Heart },
  { value: "12", label: "States Covered", icon: MapPin },
  { value: "18", label: "Years of Service", icon: Calendar },
  { value: "200+", label: "Communities", icon: Globe },
  { value: "98%", label: "Fund Utilization", icon: TrendingUp },
];

export function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 bg-background/50 overflow-hidden text-foreground border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>About Us</p>
              <h1 className="text-4xl sm:text-5xl text-foreground mb-6" style={{ fontWeight: 800, lineHeight: 1.1 }}>
                18 Years of Nurturing Lives
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2008, <span className="font-bold"><span style={{ color: '#b48fe0' }}>Womb</span><span style={{ color: '#3d6670' }}>To</span><span style={{ color: '#4bbde8' }}>18</span></span> Foundation has been on a relentless mission to ensure every child in India has access to healthcare, nutrition, and quality education from the womb through age 18.
              </p>
              <p className="text-muted-foreground">
                What started as a small prenatal care center in Mumbai has grown into a multi-state movement, touching the lives of over 15,000 children and 3,500 mothers across 200+ communities in India.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1692269725836-fbd72e98883f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBsYXlpbmclMjBzY2hvb2wlMjBJbmRpYSUyMHJ1cmFsfGVufDF8fHx8MTc3MzE0NjM0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Children playing at school"
                className="w-full h-[350px] lg:h-[420px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-4 -left-4 bg-card backdrop-blur-md rounded-xl shadow-lg p-4 hidden sm:block border border-border">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl text-primary font-extrabold leading-none">15,234</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Lives Changed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-14 bg-background text-foreground border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {impactNumbers.map((item) => (
              <div key={item.label}>
                <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl sm:text-3xl text-foreground" style={{ fontWeight: 800 }}>{item.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-card/30 text-foreground border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4" style={{ fontWeight: 700 }}>What Drives Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our mission and vision are the compass that guides every program, every rupee spent, and every life we touch.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:bg-card/80 transition-all">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl mb-4 text-foreground" style={{ fontWeight: 700 }}>Our Mission</h3>
              <p className="text-muted-foreground">
                To promote child and family well-being through prevention, awarness, preparedness, and community engagement ensuring care reaches children before challenges become crises.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:bg-card/80 transition-all">
              <Eye className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl mb-4 text-foreground" style={{ fontWeight: 700 }}>Our Vision</h3>
              <p className="text-muted-foreground">
                A world where every child, regardless of circumstance, has the foundation they need to thrive — starting from the very first heartbeat and continuing through every milestone until adulthood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Our Story</p>
              <h2 className="text-3xl sm:text-4xl text-foreground mb-6" style={{ fontWeight: 700 }}>
                Born From a Doctor's Promise
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In 2008, Dr. Ananya Bhatt, a pediatrician in Mumbai, watched helplessly as children in urban slums
                  suffered from preventable diseases and malnutrition. She made a promise — to build a system
                  that wouldn't just treat symptoms, but would nurture children from the very beginning of life.
                </p>
                <p>
                  Starting with a small rented room offering prenatal consultations to expectant mothers,
                  <span className="font-bold"><span style={{ color: '#b48fe0' }}>Womb</span><span style={{ color: '#3d6670' }}>To</span><span style={{ color: '#4bbde8' }}>18</span></span> grew organically. Mothers told other mothers. Communities started demanding our programs.
                  By 2012, we were in five states. By 2020, we'd survived a pandemic by going digital.
                </p>
                <p>
                  Today, we operate in 12 states with a team of 200+ field workers, 50 medical professionals,
                  and thousands of community volunteers. Our "womb to 18" model is now recognized as a best practice
                  by NITI Aayog and UNICEF India.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1708593343442-7595427ddf7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOR08lMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBJbmRpYSUyMHZpbGxhZ2V8ZW58MXx8fHwxNzczMTQ2MzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community gathering"
                className="w-full h-[200px] object-cover rounded-xl"
              />
              <img
                src="https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBjaGlsZWRyZW4lMjBjbGFzc3Jvb20lMjBlZHVjYXRpb24lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzMxNDYzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Children learning"
                className="w-full h-[200px] object-cover rounded-xl mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1586503452950-997923af27f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkcmVuJTIwcGxheWluZyUyMHNjaG9vbHxlbnwxfHx8fDE3NzMxMzQwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy children"
                className="w-full h-[200px] object-cover rounded-xl -mt-8"
              />
              <img
                src="https://images.pexels.com/photos/7351733/pexels-photo-7351733.jpeg"
                alt="Mother and child care"
                className="w-full h-[200px] object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4" style={{ fontWeight: 700 }}>Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">These six pillars guide everything we do — from boardroom decisions to field-level execution.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="bg-background border border-border shadow-sm hover:bg-background/80 transition-all">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg mb-2 text-foreground" style={{ fontWeight: 600 }}>{v.title}</h4>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Our Journey</p>
            <h2 className="text-3xl sm:text-4xl text-foreground mb-4" style={{ fontWeight: 700 }}>Milestones That Matter</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, i) => (
              <div key={item.year} className="flex gap-6 group">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0 shadow-lg" style={{ fontWeight: 700 }}>
                    '{item.year.slice(2)}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/60 to-transparent min-h-[60px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg text-foreground" style={{ fontWeight: 700 }}>{item.title}</h4>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{item.year}</span>
                  </div>
                  <p className="text-muted-foreground mb-2">{item.event}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20" style={{ fontWeight: 600 }}>
                    <TrendingUp className="h-3 w-3" />
                    {item.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}