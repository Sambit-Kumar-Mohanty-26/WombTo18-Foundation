import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { ExternalLink, Calendar, Download, Newspaper, Tv, Radio } from "lucide-react";
import { Button } from "../components/ui/button";

const pressItems = [
  {
    outlet: "The Times of India",
    type: "Print",
    icon: Newspaper,
    title: "WombTo18 Foundation's Prenatal Care Model Reduces Infant Mortality by 40%",
    date: "Feb 15, 2026",
    excerpt: "A groundbreaking study shows that WombTo18's community-based prenatal care model has significantly reduced infant mortality rates across 12 states in India.",
  },
  {
    outlet: "NDTV",
    type: "TV",
    icon: Tv,
    title: "How One NGO is Transforming Child Education in Rural India",
    date: "Jan 28, 2026",
    excerpt: "NDTV profiles WombTo18 Foundation's innovative digital classroom initiative that has brought quality education to over 50 remote villages.",
  },
  {
    outlet: "The Hindu",
    type: "Print",
    icon: Newspaper,
    title: "WombTo18 Receives National Award for Transparency in NGO Operations",
    date: "Jan 10, 2026",
    excerpt: "The foundation was recognized for its real-time transparency dashboard that allows donors to track every rupee of their contribution.",
  },
  {
    outlet: "All India Radio",
    type: "Radio",
    icon: Radio,
    title: "Interview: Dr. Ananya Bhatt on the Importance of First 1000 Days",
    date: "Dec 20, 2025",
    excerpt: "Founder Dr. Ananya Bhatt discusses why investment in the first 1000 days of life is the most effective development intervention.",
  },
  {
    outlet: "Economic Times",
    type: "Print",
    icon: Newspaper,
    title: "CSR Spotlight: Companies Partner with WombTo18 for Maximum Impact",
    date: "Dec 5, 2025",
    excerpt: "Leading corporations share why they chose WombTo18 as their CSR partner and the measurable impact they've seen in communities.",
  },
  {
    outlet: "India Today",
    type: "TV",
    icon: Tv,
    title: "WombTo18's Youth Empowerment Program Creates 500 First-Generation Graduates",
    date: "Nov 18, 2025",
    excerpt: "A heartwarming story of how the foundation's scholarship and mentorship programs have produced 500 first-generation college graduates.",
  },
];

const typeColors: Record<string, string> = {
  Print: "bg-blue-50 text-blue-700",
  TV: "bg-purple-50 text-purple-700",
  Radio: "bg-amber-50 text-amber-700",
};

export function PressPage() {
  return (
    <>
      <section className="py-20 bg-gradient-to-br from-background via-emerald-950/50 to-background text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Press & Media</p>
            <h1 className="text-4xl sm:text-5xl text-foreground mb-6" style={{ fontWeight: 800, lineHeight: 1.1 }}>
              In the News
            </h1>
            <p className="text-lg text-muted-foreground">
              Media coverage, press releases, and resources for journalists covering our work.
            </p>
          </div>
        </div>
      </section>

      {/* Press Kit Download */}
      <section className="bg-emerald-900/20 border-b border-white/5 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 style={{ fontWeight: 600 }}>Press Kit</h3>
            <p className="text-sm text-emerald-200/70">Download logos, brand guidelines, fact sheets, and high-res images.</p>
          </div>
          <Button variant="outline" className="shrink-0 border-white/10 hover:bg-white/5 text-white">
            <Download className="h-4 w-4 mr-2" /> Download Press Kit
          </Button>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-16 bg-background border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-white mb-8" style={{ fontWeight: 700 }}>Recent Coverage</h2>
          <div className="space-y-4 text-white">
            {pressItems.map((item) => (
              <Card key={item.title} className="bg-emerald-950/20 hover:shadow-md transition-shadow border-white/10">
                <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-start gap-3 sm:w-48 shrink-0">
                    <item.icon className="h-5 w-5 text-emerald-200/70 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white" style={{ fontWeight: 600 }}>{item.outlet}</p>
                      <Badge className={`${typeColors[item.type]} mt-1`}>{item.type}</Badge>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg text-white mb-1" style={{ fontWeight: 600 }}>{item.title}</h4>
                    <p className="text-sm text-emerald-200/50 mb-2">{item.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-emerald-200/50 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {item.date}
                      </span>
                      <button className="text-xs text-primary flex items-center gap-1 font-bold" style={{ fontWeight: 600 }}>
                        Read Article <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 bg-emerald-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl text-white mb-4" style={{ fontWeight: 700 }}>Media Inquiries</h2>
          <p className="text-emerald-200/70 mb-2">For press inquiries, interviews, or story pitches:</p>
          <p className="text-primary font-bold" style={{ fontWeight: 800 }}>press@wombto18.org</p>
          <p className="text-sm text-emerald-200/50 mt-1">+91 98765 43211</p>
        </div>
      </section>
    </>
  );
}
