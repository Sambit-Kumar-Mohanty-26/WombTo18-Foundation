import { useState } from "react";
import { useContent, BlogPost } from "../../context/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, Pencil, Trash2, X, Check, Newspaper, Search } from "lucide-react";

import { toast } from "sonner";

const CATEGORIES = ["Health", "Education", "Stories", "Reports", "Community"];
const READ_TIMES = ["3 min read", "4 min read", "5 min read", "6 min read", "8 min read", "10 min read"];

const categoryColors: Record<string, string> = {
  Health: "bg-red-50 text-red-700",
  Education: "bg-blue-50 text-blue-700",
  Stories: "bg-purple-50 text-purple-700",
  Reports: "bg-amber-50 text-amber-700",
  Community: "bg-green-50 text-green-700",
};

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-gray-50 text-gray-600",
};

const emptyForm = (): Omit<BlogPost, "id"> => ({
  title: "",
  excerpt: "",
  category: "Health",
  date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  readTime: "5 min read",
  image: "",
  status: "published",
});

export function AdminBlog() {
  const { posts, addPost, updatePost, deletePost } = useContent();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Omit<BlogPost, "id">>(emptyForm());
  const [search, setSearch] = useState("");

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditTarget(post);
    const { id, ...rest } = post;
    setForm(rest);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      toast.error("Title and Excerpt are required.");
      return;
    }
    if (editTarget) {
      updatePost({ ...form, id: editTarget.id });
      toast.success("Post updated successfully.");
    } else {
      addPost(form);
      toast.success("Post published successfully.");
    }
    setShowModal(false);
  };

  const handleDelete = (post: BlogPost) => {
    deletePost(post.id);
    toast.success(`"${post.title}" deleted.`);
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground font-bold">Blog Posts</h1>
          <p className="text-muted-foreground text-sm">Manage articles shown on the public Blog page.</p>
        </div>
        <Button onClick={openAdd} className="font-bold shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background border-border text-foreground"
        />
      </div>

      {/* Table Card */}
      <Card className="bg-card border-border shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="border-b border-border bg-card">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg">
            <Newspaper className="h-5 w-5 text-muted-foreground" />
            All Posts ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Title</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Category</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Date</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="h-10 w-14 object-cover rounded bg-muted border border-border shrink-0" 
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x40?text=Blog"; }} 
                        />
                        <p className="font-bold text-foreground line-clamp-2 max-w-xs">{post.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className={`${categoryColors[post.category] ?? "bg-slate-50 text-slate-700"} px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter shadow-none border-none`}>{post.category}</Badge>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground font-medium">{post.date}</td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className={`${statusColors[post.status]} px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter border-none shadow-none`}>{post.status}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => openEdit(post)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(post)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground font-medium">No posts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal / Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">{editTarget ? "Edit Post" : "New Blog Post"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter post title" className="bg-muted/30 border-border focus:bg-background transition-all" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Excerpt *</Label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Brief description of this post..."
                  className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-background transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-background transition-all">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Read Time</Label>
                  <select value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-background transition-all">
                    {READ_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="bg-muted/30 border-border focus:bg-background transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Date</Label>
                  <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-muted/30 border-border focus:bg-background transition-all" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground font-bold text-xs uppercase tracking-wider">Status</Label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })} className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-background transition-all">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">Cancel</Button>
              <Button onClick={handleSave} className="font-bold px-6 shadow-sm">
                <Check className="h-4 w-4 mr-2" />
                {editTarget ? "Save Changes" : "Publish Post"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

