import { useParams, Link } from "react-router";
import { useBlogs } from "../hooks/useBlogs";
import { blogApi } from "../lib/api/blog";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await blogApi.getBlogBySlug(slug);
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Failed to load the article.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <ArticleSkeleton />;

  if (error || !post) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <p className="text-red-500 mb-4">{error || "Article not found"}</p>
      <Link to="/blog">
        <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-4xl px-6">
        <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 group transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
        
        <article className="space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {post.readTime || "5 min read"}</span>
            </div>
          </div>

          <div className="aspect-video relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
            <img 
              src={post.image || "https://images.unsplash.com/photo-1584376003963-e1aa9a61c0ac?q=80&w=2000"} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary pl-6 py-2">
              {post.excerpt}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-4xl px-6 space-y-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
