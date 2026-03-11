import { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  status: "published" | "draft";
}

export interface CaseStudy {
  id: string;
  title: string;
  excerpt: string;
  region: string;
  image: string;
  tags: string[];
  date: string;
  impact: string;
  status: "published" | "draft";
}

// ─── Initial seed data ──────────────────────────────────────────────────────

const initialPosts: BlogPost[] = [
  {
    id: "1",
    title: "How Prenatal Nutrition Shapes a Child's Future",
    excerpt: "New research shows that nutrition during pregnancy has lasting effects on cognitive development, immunity, and overall health outcomes well into adulthood.",
    category: "Health",
    date: "Mar 5, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1770261430761-192b0b72e4a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    featured: true,
    status: "published",
  },
  {
    id: "2",
    title: "Digital Classrooms: Bridging the Education Gap in Rural India",
    excerpt: "Our new digital literacy program has brought tablets and internet access to 50 remote villages, transforming how children learn.",
    category: "Education",
    date: "Feb 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "published",
  },
  {
    id: "3",
    title: "Meet Priya: From Beneficiary to Community Leader",
    excerpt: "Priya was enrolled in our program at age 6. Today, at 22, she leads a community health initiative in her village.",
    category: "Stories",
    date: "Feb 20, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1584376003963-e1aa9a61c0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "published",
  },
  {
    id: "4",
    title: "Annual Impact Report 2025: A Year of Milestones",
    excerpt: "With 15,000+ children reached and 98% fund utilization, 2025 was our most impactful year yet.",
    category: "Reports",
    date: "Feb 10, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1764072970350-2ce4f354a483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "published",
  },
  {
    id: "5",
    title: "The Science Behind Early Childhood Stimulation",
    excerpt: "Learn why the first 1,000 days of a child's life are crucial for brain development and how our programs leverage this window of opportunity.",
    category: "Health",
    date: "Jan 30, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1728494049079-c262d3facee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "published",
  },
  {
    id: "6",
    title: "Volunteer Spotlight: Doctors Who Give Back",
    excerpt: "Meet the team of volunteer pediatricians who travel to remote areas every month to provide free health screenings and vaccinations.",
    category: "Community",
    date: "Jan 18, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1586503452950-997923af27f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: "published",
  },
];

const initialCaseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "Transforming Maternal Health in Rural Rajasthan",
    excerpt: "A 3-year program that reduced maternal mortality by 40% through mobile health clinics and community health workers.",
    region: "Rajasthan",
    image: "https://images.unsplash.com/photo-1584376003963-e1aa9a61c0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tags: ["Maternal Health", "Rural", "Healthcare"],
    date: "Dec 2025",
    impact: "40% reduction in maternal mortality",
    status: "published",
  },
  {
    id: "2",
    title: "Digital Literacy for 10,000 Children in Bihar",
    excerpt: "How we equipped underprivileged children with digital skills that opened doors to higher education and employment.",
    region: "Bihar",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tags: ["Education", "Digital", "Empowerment"],
    date: "Oct 2025",
    impact: "10,000 children trained",
    status: "published",
  },
  {
    id: "3",
    title: "Nutrition Intervention Program: Odisha",
    excerpt: "A 2-year intensive nutrition program that eliminated acute malnutrition in targeted villages.",
    region: "Odisha",
    image: "https://images.unsplash.com/photo-1728494049079-c262d3facee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    tags: ["Nutrition", "Child Health", "Village"],
    date: "Sep 2025",
    impact: "Zero acute malnutrition cases",
    status: "published",
  },
];

// ─── Context ────────────────────────────────────────────────────────────────

interface ContentContextValue {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, "id">) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;

  caseStudies: CaseStudy[];
  addCaseStudy: (cs: Omit<CaseStudy, "id">) => void;
  updateCaseStudy: (cs: CaseStudy) => void;
  deleteCaseStudy: (id: string) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies);

  const addPost = (post: Omit<BlogPost, "id">) =>
    setPosts((prev) => [{ ...post, id: Date.now().toString() }, ...prev]);

  const updatePost = (post: BlogPost) =>
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));

  const deletePost = (id: string) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  const addCaseStudy = (cs: Omit<CaseStudy, "id">) =>
    setCaseStudies((prev) => [{ ...cs, id: Date.now().toString() }, ...prev]);

  const updateCaseStudy = (cs: CaseStudy) =>
    setCaseStudies((prev) => prev.map((c) => (c.id === cs.id ? cs : c)));

  const deleteCaseStudy = (id: string) =>
    setCaseStudies((prev) => prev.filter((c) => c.id !== id));

  return (
    <ContentContext.Provider value={{ posts, addPost, updatePost, deletePost, caseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
