import { useState } from "react";
import { useContent, CaseStudy } from "../../context/ContentContext";
import { Plus, Pencil, Trash2, X, Check, Search, Sparkles, MapPin, Target, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const REGIONS = ["Rajasthan", "Bihar", "Odisha", "Maharashtra", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Madhya Pradesh", "Pan-India"];

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

  const handleSave = () => {
    if (!form.title.trim() || !form.excerpt.trim()) return toast.error("Please fill in all fields");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, tags };

    if (editTarget) {
      updateCaseStudy({ ...payload, id: editTarget.id });
      toast.success("Case study updated");
    } else {
      addCaseStudy(payload);
      toast.success("Case study added");
    }
    setShowModal(false);
  };

  const filtered = caseStudies.filter(
    (cs) =>
      cs.title.toLowerCase().includes(search.toLowerCase()) ||
      cs.region.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-10 font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-200/50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
             <Sparkles className="w-3 h-3 text-slate-500" /> Program Impact Manager
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tighter">
             Impact <span className="text-slate-400">Stories</span>
           </h1>
           <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-3">
             Documenting {caseStudies.length} regional success stories
           </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
             <input
               type="text"
               placeholder="Search stories..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full h-12 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-700 placeholder:text-slate-400 transition-all outline-none focus:border-black"
             />
          </div>
          <button 
            onClick={() => { setEditTarget(null); setForm(emptyForm()); setTagsInput(""); setShowModal(true); }} 
            className="h-12 px-8 rounded-2xl bg-black hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center shadow-lg shadow-black/10 active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} className="mr-2" /> Publish Story
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((cs) => (
            <motion.div 
              key={cs.id} 
              variants={itemVariants}
              layout
              className="group"
            >
              <div className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden hover:border-black transition-all cursor-default h-full flex flex-col hover:-translate-y-1">
                 <div className="relative h-56 overflow-hidden border-b border-slate-200">
                    <img 
                      src={cs.image || "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={cs.title}
                    />
                    <div className="absolute top-4 left-4 bg-white text-black border border-slate-200 font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                       <MapPin size={10} className="text-black" /> {cs.region}
                    </div>
                 </div>
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                       <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-300" /> {cs.date}</span>
                       <span className="flex items-center gap-1.5"><Target size={12} className="text-slate-300" /> Ground Truthed</span>
                    </div>
                    <h3 className="text-[17px] font-black text-black tracking-tight leading-snug mb-3 group-hover:text-slate-700 transition-colors line-clamp-2">{cs.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-3 mb-6">{cs.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-6 flex-1">
                       {cs.tags.map(tag => (
                          <div key={tag} className="border border-slate-200 text-slate-500 px-2.5 py-1 rounded-md font-bold text-[9px] uppercase tracking-widest">
                            {tag}
                          </div>
                       ))}
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-8 flex items-start gap-4">
                       <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <Target size={14} className="text-black" />
                       </div>
                       <p className="text-[11px] font-bold text-slate-700 leading-tight mt-0.5 line-clamp-2">{cs.impact}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                       <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${cs.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {cs.status}
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-black hover:text-white hover:border-black transition-all" 
                            onClick={() => { setEditTarget(cs); const { id, ...rest } = cs; setForm(rest); setTagsInput(cs.tags.join(", ")); setShowModal(true); }}
                          >
                             <Pencil size={14} />
                          </button>
                          <button 
                            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all" 
                            onClick={() => { deleteCaseStudy(cs.id); toast.success("Story deleted"); }}
                          >
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setShowModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }} exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
            >
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Manager</div>
                    <h3 className="text-xl font-black text-black tracking-tight">{editTarget ? "Edit Impact Story" : "Document Impact Story"}</h3>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-black transition-colors" onClick={() => setShowModal(false)}>
                    <X size={16} className="text-slate-600" />
                  </button>
               </div>
               
               <div className="p-8 sm:p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Story Title *</p>
                     <input value={form.title} placeholder="Enter compelling title..." className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-300" onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Narrative Snippet *</p>
                     <textarea rows={3} placeholder="Provide a brief human-centric summary..." className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all resize-none placeholder:text-slate-300" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operational Region</p>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none focus:border-black transition-all appearance-none cursor-pointer" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                           {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Documentation Date</p>
                        <input placeholder="e.g. Dec 2025" className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-300" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key Impact Metric</p>
                     <input placeholder="e.g. 40% reduction in local malnutrition" className="w-full bg-slate-50 border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-400" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categorization Tags (comma separated)</p>
                     <input placeholder="e.g. Health, Rural" className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-300" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cover Media URL</p>
                     <input placeholder="https://..." className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-300" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  </div>

                  <div className="space-y-2 pb-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Publishing State</p>
                     <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none focus:border-black transition-all appearance-none cursor-pointer" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                        <option value="published">Active / Live</option>
                        <option value="draft">Archived Draft</option>
                     </select>
                  </div>
               </div>

               <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
                  <button className="h-12 px-6 rounded-xl text-slate-500 hover:text-black hover:bg-slate-50 text-xs font-bold uppercase tracking-widest transition-colors" onClick={() => setShowModal(false)}>
                    Discard
                  </button>
                  <button className="h-12 px-8 rounded-xl bg-black hover:bg-slate-800 text-white shadow-md font-bold text-xs uppercase tracking-widest transition-all flex items-center" onClick={handleSave}>
                     <Check size={16} className="mr-2" /> {editTarget ? "Update Metrics" : "Publish Record"}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
