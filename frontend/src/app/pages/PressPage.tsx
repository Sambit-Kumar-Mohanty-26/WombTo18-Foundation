import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { ExternalLink, Calendar, Download, Newspaper, Tv, Radio } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion } from "motion/react";

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
      <section className="py-20 bg-slate-50/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-primary text-sm mb-2 font-bold uppercase tracking-wider">Press & Media</p>
            <h1 className="text-4xl sm:text-5xl text-slate-900 mb-6 font-extrabold leading-tight">
              In the News
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Media coverage, press releases, and resources for journalists covering our work.
            </p>
          </div>
        </div>
      </section>

      {/* Press Kit Download */}
      <section className="bg-white border-y border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-gray-900 font-extrabold">Press Kit</h3>
            <p className="text-sm text-gray-600 font-medium">Download logos, brand guidelines, fact sheets, and high-res images.</p>
          </div>
          <Button variant="outline" className="shrink-0 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm font-bold" onClick={() => toast.success("Download started", { description: "Downloading Press Kit..." })}>
            <Download className="h-4 w-4 mr-2" /> Download Press Kit
          </Button>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-24 bg-gray-50/30 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[2.5rem] tracking-tight text-gray-900 mb-12 font-black"
          >
            Recent Coverage
          </motion.h2>
          <div className="space-y-6">
            {pressItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, rotateX: -15, y: 50, transformPerspective: 1000 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.015, y: -5 }}
              >
                <Card className="bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-transparent shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-500 rounded-3xl overflow-hidden group">
                  <CardContent className="p-8 flex flex-col sm:flex-row gap-6 relative">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1D6E3F]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
                    />
                    <div className="flex items-start gap-4 sm:w-56 shrink-0 relative z-10">
                      <div className={`p-3 rounded-2xl ${typeColors[item.type]} bg-opacity-20 shadow-sm`}>
                        <item.icon className={`h-6 w-6 ${typeColors[item.type].split(' ')[1]}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 font-extrabold mb-1.5">{item.outlet}</p>
                        <Badge className={`${typeColors[item.type]} flex items-center justify-center shadow-none border-none font-black uppercase tracking-wider text-[0.65rem] px-2.5 py-0.5 rounded-lg`}>{item.type}</Badge>
                      </div>
                    </div>
                    <div className="flex-1 relative z-10">
                      <h4 className="text-xl text-gray-900 mb-2 font-black leading-snug group-hover:text-[#1D6E3F] transition-colors duration-300">{item.title}</h4>
                      <p className="text-gray-600 mb-6 leading-relaxed font-medium">{item.excerpt}</p>
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-400 flex items-center gap-2 font-bold">
                          <Calendar className="h-4 w-4" /> {item.date}
                        </span>
                        <motion.button 
                          whileHover={{ x: 5 }}
                          className="text-sm text-[#FF9900] flex items-center gap-1.5 font-black hover:text-[#d48100] transition-colors"
                        >
                          Read Article <ExternalLink className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-20 bg-white text-center border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-slate-900 mb-4 font-extrabold">Media Inquiries</h2>
          <p className="text-slate-600 mb-4 max-w-md mx-auto font-medium">For press inquiries, interviews, or story pitches, our team is ready to help.</p>
          <div className="inline-flex flex-col items-center">
            <p className="text-2xl font-black text-primary tracking-tight">press@wombto18.org</p>
            <div className="h-1 w-12 bg-primary/30 mt-2 rounded-full" />
          </div>
          <p className="text-sm text-slate-400 mt-6 font-bold uppercase tracking-widest">+91 98765 43211</p>
        </div>
      </section>
    </>
  );
}
