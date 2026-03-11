import { useState } from "react";
import { useContent, CaseStudy } from "../../context/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, Pencil, Trash2, X, Check, BookOpen } from "lucide-react";
import { toast } from "sonner";

const REGIONS = ["Rajasthan", "Bihar", "Odisha", "Maharashtra", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Madhya Pradesh", "Pan-India"];

const statusColors: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-gray-100 text-gray-600",
};

const emptyForm = (): Omit<CaseStudy, "id"> => ({
  title: "",
  excerpt: "",
  region: "Rajasthan",
  image: "",
  tags: [],
  date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
  impact: "",
  status: "published",
});

export function AdminCaseStudies() {
  const { caseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy } = useContent();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<CaseStudy | null>(null);
  const [form, setForm] = useState<Omit<CaseStudy, "id">>(emptyForm());
  const [tagsInput, setTagsInput] = useState("");
  const [search, setSearch] = useState("");

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setTagsInput("");
    setShowModal(true);
  };

  const openEdit = (cs: CaseStudy) => {
    setEditTarget(cs);
    const { id, ...rest } = cs;
    setForm(rest);
    setTagsInput(cs.tags.join(", "));
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      toast.error("Title and Excerpt are required.");
      return;
    }
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, tags };

    if (editTarget) {
      updateCaseStudy({ ...payload, id: editTarget.id });
      toast.success("Case study updated.");
    } else {
      addCaseStudy(payload);
      toast.success("Case study published.");
    }
    setShowModal(false);
  };

  const handleDelete = (cs: CaseStudy) => {
    deleteCaseStudy(cs.id);
    toast.success(`"${cs.title}" deleted.`);
  };

  const filtered = caseStudies.filter(
    (cs) =>
      cs.title.toLowerCase().includes(search.toLowerCase()) ||
      cs.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground font-bold">Case Studies</h1>
          <p className="text-muted-foreground text-sm">Manage impact case studies shown on the public pages.</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-orange-500/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Case Study
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by title or region..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            All Case Studies ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Region</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Impact</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cs) => (
                  <tr key={cs.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={cs.image} alt={cs.title} className="h-10 w-14 object-cover rounded-md shrink-0 bg-muted" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x40"; }} />
                        <p className="font-medium line-clamp-2 max-w-xs">{cs.title}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{cs.region}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs max-w-[160px] truncate">{cs.impact}</td>
                    <td className="py-3 px-4 text-muted-foreground">{cs.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[cs.status]}>{cs.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => openEdit(cs)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500" onClick={() => handleDelete(cs)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">No case studies found.</td>
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
              <h3 className="font-bold text-lg text-foreground">{editTarget ? "Edit Case Study" : "New Case Study"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter case study title" />
              </div>
              <div className="space-y-1">
                <Label>Excerpt *</Label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Brief description..."
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Region</Label>
                  <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Dec 2025" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Impact Summary</Label>
                <Input value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} placeholder="e.g. 40% reduction in maternal mortality" />
              </div>
              <div className="space-y-1">
                <Label>Tags (comma-separated)</Label>
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. Health, Rural, Maternal" />
              </div>
              <div className="space-y-1">
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Check className="h-4 w-4 mr-2" />
                {editTarget ? "Save Changes" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
