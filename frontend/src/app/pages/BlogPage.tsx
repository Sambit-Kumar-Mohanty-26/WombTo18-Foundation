import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { motion } from "motion/react";

const posts = [
  {
    title: "How Prenatal Nutrition Shapes a Child's Future",
    excerpt: "New research shows that nutrition during pregnancy has lasting effects on cognitive development, immunity, and overall health outcomes well into adulthood.",
    category: "Health",
    date: "Mar 5, 2026",
    readTime: "5 min read",
    image: "https://images.pexels.com/photos/7351733/pexels-photo-7351733.jpeg",
    featured: true,
  },
  {
    title: "Digital Classrooms: Bridging the Education Gap in Rural India",
    excerpt: "Our new digital literacy program has brought tablets and internet access to 50 remote villages, transforming how children learn.",
    category: "Education",
    date: "Feb 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzczMTM0MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Meet Priya: From Beneficiary to Community Leader",
    excerpt: "Priya was enrolled in our program at age 6. Today, at 22, she leads a community health initiative in her village, inspiring a new generation.",
    category: "Stories",
    date: "Feb 20, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1584376003963-e1aa9a61c0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMEluZGlhJTIwTkdPfGVufDF8fHx8MTc3MzEzNDAyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Annual Impact Report 2025: A Year of Milestones",
    excerpt: "With 15,000+ children reached and 98% fund utilization, 2025 was our most impactful year yet. Explore the full report.",
    category: "Reports",
    date: "Feb 10, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1764072970350-2ce4f354a483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXIlMjBoZWxwaW5nJTIwY2hpbGRyZW58ZW58MXx8fHwxNzczMTM0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "The Science Behind Early Childhood Stimulation",
    excerpt: "Learn why the first 1,000 days of a child's life are crucial for brain development and how our programs leverage this window of opportunity.",
    category: "Health",
    date: "Jan 30, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1728494049079-c262d3facee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGhlYWx0aGNhcmUlMjBudXRyaXRpb258ZW58MXx8fHwxNzczMTM0MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    title: "Volunteer Spotlight: Doctors Who Give Back",
    excerpt: "Meet the team of volunteer pediatricians who travel to remote areas every month to provide free health screenings and vaccinations.",
    category: "Community",
    date: "Jan 18, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1586503452950-997923af27f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkcmVuJTIwcGxheWluZyUyMHNjaG9vbHxlbnwxfHx8fDE3NzMxMzQwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const categoryColors: Record<string, string> = {
  Health: "bg-red-50 text-red-700",
  Education: "bg-blue-50 text-blue-700",
  Stories: "bg-purple-50 text-purple-700",
  Reports: "bg-amber-50 text-amber-700",
  Community: "bg-green-50 text-green-700",
};

export function BlogPage() {
  const { posts: allPosts } = useContent();
  const publishedPosts = allPosts.filter((p) => p.status === "published");
  const activePosts = publishedPosts.length > 0 ? publishedPosts : posts;
  const featured = activePosts[0];
  const rest = activePosts.slice(1);

  return (
    <>
      <section className="py-20 bg-[#f0faf4] text-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Blog & Stories</p>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-6" style={{ fontWeight: 800, lineHeight: 1.1 }}>
            Stories of Hope & Impact
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Read about the lives we're changing, the research behind our programs, and the communities we serve.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-6 sm:gap-12 lg:grid-cols-2 items-center text-gray-900 group"
          >
            <div className="overflow-hidden rounded-[1.75rem] sm:rounded-3xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] h-[240px] sm:h-[350px] lg:h-[450px]">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover origin-center"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <Badge className={`${categoryColors[featured.category]} mb-4 sm:mb-6 self-start px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm`}>{featured.category}</Badge>
              <h2 className="text-[2rem] sm:text-[2.75rem] text-gray-900 mb-4 sm:mb-6 leading-[1.08] tracking-tight" style={{ fontWeight: 800 }}>{featured.title}</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed font-medium">{featured.excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-8 sm:mb-10 font-bold">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" />{featured.date}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" />{featured.readTime}</span>
              </div>
              <motion.button 
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center gap-3 text-primary text-base font-black uppercase tracking-wide group-hover:text-[#134957] transition-colors self-start"
              >
                Read Full Article <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, clipPath: 'inset(10% 0 10% 0)', scale: 0.95, y: 50 }}
                whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)', scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="bg-white overflow-hidden group cursor-pointer hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 border-none rounded-[2rem] h-full flex flex-col shadow-sm">
                  <div className="overflow-hidden h-56 relative">
                    <div className="absolute inset-0 bg-gray-900/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                    />
                  </div>
                  <CardContent className="pt-8 pb-8 px-8 flex-1 flex flex-col">
                    <Badge className={`${categoryColors[post.category]} mb-5 self-start rounded-lg font-bold px-3 py-1 shadow-sm text-xs`}>{post.category}</Badge>
                    <h3 className="text-[1.35rem] leading-snug text-gray-900 mb-3 line-clamp-2 tracking-tight" style={{ fontWeight: 800 }}>{post.title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 font-medium text-sm leading-relaxed flex-1">{post.excerpt}</p>
                    <div className="flex items-center gap-5 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
