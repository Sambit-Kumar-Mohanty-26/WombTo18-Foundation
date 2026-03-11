import { useState } from "react";
import { useContent, BlogPost } from "../../context/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, Pencil, Trash2, X, Check, Newspaper } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Health", "Education", "Stories", "Reports", "Community"];
const READ_TIMES = ["3 min read", "4 min read", "5 min read", "6 min read", "8 min read", "10 min read"];

const categoryColors: Record<string, string> = {
  Health: "bg-red-100 text-red-700",
  Education: "bg-blue-100 text-blue-700",
  Stories: "bg-purple-100 text-purple-700",
  Reports: "bg-amber-100 text-amber-700",
  Community: "bg-green-100 text-green-700",
};

const statusColors: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-gray-100 text-gray-600",
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
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by title or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            All Posts ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={post.image} alt={post.title} className="h-10 w-14 object-cover rounded-md shrink-0 bg-muted" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x40"; }} />
                        <p className="font-medium line-clamp-2 max-w-xs">{post.title}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={categoryColors[post.category] ?? "bg-gray-100 text-gray-700"}>{post.category}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{post.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[post.status]}>{post.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => openEdit(post)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500" onClick={() => handleDelete(post)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground">No posts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">{editTarget ? "Edit Post" : "New Blog Post"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter post title" />
              </div>
              <div className="space-y-1">
                <Label>Excerpt *</Label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Brief description of this post..."
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Read Time</Label>
                  <select value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {READ_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
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
