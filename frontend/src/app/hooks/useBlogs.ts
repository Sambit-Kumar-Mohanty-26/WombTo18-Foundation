import { useState, useEffect } from 'react';
import { blogApi, BlogPost } from '../lib/api/blog';

export function useBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogApi.getBlogs();
      setPosts(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return { posts, loading, error, refresh: fetchBlogs };
}
