import { client } from './client';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

export const blogApi = {
  getBlogs: () => 
    client.get<BlogPost[]>('/blogs'),
    
  getBlogBySlug: (slug: string) => 
    client.get<BlogPost>(`/blogs/${slug}`),
    
  createBlog: (data: any) =>
    client.post<BlogPost>('/blogs', data),
    
  updateBlog: (id: string, data: any) =>
    client.post<BlogPost>(`/blogs/${id}`, data),
    
  deleteBlog: (id: string) =>
    client.post(`/blogs/delete/${id}`, {}),
};
