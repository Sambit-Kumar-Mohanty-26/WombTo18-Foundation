import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useContent } from "../context/ContentContext";

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
  const featured = publishedPosts[0];
  const rest = publishedPosts.slice(1);

  return (
    <>
      <section className="py-20 bg-emerald-50 text-gray-900">
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
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center text-gray-900">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-[300px] lg:h-[400px] object-cover rounded-2xl shadow-xl"
            />
            <div>
              <Badge className={`${categoryColors[featured.category]} mb-3`}>{featured.category}</Badge>
              <h2 className="text-2xl sm:text-3xl text-gray-900 mb-3" style={{ fontWeight: 700 }}>{featured.title}</h2>
              <p className="text-gray-600 mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{featured.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featured.readTime}</span>
              </div>
              <button className="flex items-center gap-2 text-primary text-sm font-bold" style={{ fontWeight: 600 }}>
                Read Full Article <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Card key={post.title} className="bg-white overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow border-gray-200 shadow-sm">
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-4">
                  <Badge className={`${categoryColors[post.category]} mb-2`}>{post.category}</Badge>
                  <h3 className="text-lg text-gray-900 mb-2 line-clamp-2" style={{ fontWeight: 600 }}>{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
