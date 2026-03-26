import { useState } from "react";
import { useContent, CaseStudy } from "../../context/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, Pencil, Trash2, X, Check, BookOpen, Search } from "lucide-react";
import { toast } from "sonner";

const REGIONS = ["Rajasthan", "Bihar", "Odisha", "Maharashtra", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Madhya Pradesh", "Pan-India"];

const statusColors: Record<string, string> = {
  published: "bg-[#f0faf4] text-[#1D6E3F]",
  draft: "bg-gray-50 text-gray-600",
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
          <h1 className="text-2xl text-gray-900 font-bold">Case Studies</h1>
          <p className="text-gray-600 text-sm">Manage impact case studies shown on the public pages.</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Case Study
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by title or region..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-gray-200 text-gray-900"
        />
      </div>

      {/* Table Card */}
      <Card className="bg-white border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-white">
          <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
            <BookOpen className="h-5 w-5 text-gray-400" />
            All Case Studies ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-[10px]">Title</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-[10px]">Region</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-[10px]">Impact</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-[10px]">Date</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((cs) => (
                  <tr key={cs.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={cs.image} 
                          alt={cs.title} 
                          className="h-10 w-14 object-cover rounded bg-gray-50 border border-gray-100 shrink-0" 
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x40?text=Impact"; }} 
                        />
                        <p className="font-bold text-gray-900 line-clamp-2 max-w-xs">{cs.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-slate-100 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter">{cs.region}</Badge>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-medium text-xs max-w-[160px] truncate">{cs.impact}</td>
                    <td className="py-4 px-6 text-gray-500 font-medium">{cs.date}</td>
                    <td className="py-4 px-6">
                      <Badge className={`${statusColors[cs.status]} px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter`}>{cs.status}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100" onClick={() => openEdit(cs)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-rose-500 hover:bg-rose-50" onClick={() => handleDelete(cs)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 font-medium">No case studies found.</td>
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
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">{editTarget ? "Edit Case Study" : "New Case Study"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter case study title" className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Excerpt *</Label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Brief description..."
                  className="w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Region</Label>
                  <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all">
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Date</Label>
                  <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Dec 2025" className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Impact Summary</Label>
                <Input value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} placeholder="e.g. 40% reduction in maternal mortality" className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Tags (comma-separated)</Label>
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. Health, Rural, Maternal" className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-bold text-xs uppercase tracking-wider">Status</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })} className="w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/30">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-900">Cancel</Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-sm">
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

