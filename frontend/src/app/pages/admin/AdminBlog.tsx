import { useState } from "react";
import { useContent, BlogPost } from "../../context/ContentContext";
import { Plus, Pencil, Trash2, X, Check, Search, Sparkles, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = ["Health", "Education", "Stories", "Reports", "Community"];
const READ_TIMES = ["3 min read", "4 min read", "5 min read", "6 min read", "8 min read", "10 min read"];

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

  const handleSave = () => {
    if (!form.title.trim() || !form.excerpt.trim()) return toast.error("Please fill in all fields");
    if (editTarget) {
      updatePost({ ...form, id: editTarget.id });
      toast.success("Post updated successfully");
    } else {
      addPost(form);
      toast.success("Post published successfully");
    }
    setShowModal(false);
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
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
             <Sparkles className="w-3 h-3 text-slate-500" /> Content Manager
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tighter">
             Platform <span className="text-slate-400">Journal</span>
           </h1>
           <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-3">
             Managing {posts.length} published articles and insights
           </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
             <input
               type="text"
               placeholder="Search articles..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full h-12 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-700 placeholder:text-slate-400 transition-all outline-none focus:border-black"
             />
          </div>
          <button 
            onClick={() => { setEditTarget(null); setForm(emptyForm()); setShowModal(true); }} 
            className="h-12 px-8 rounded-2xl bg-black hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center shadow-lg shadow-black/10 active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} className="mr-2" /> Publish Post
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((post) => (
            <motion.div 
              key={post.id} 
              variants={itemVariants}
              layout
              className="group"
            >
              <div className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden hover:border-black transition-all cursor-default h-full flex flex-col hover:-translate-y-1">
                 <div className="relative h-56 overflow-hidden border-b border-slate-200">
                    <img 
                      src={post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={post.title}
                    />
                    <div className="absolute top-4 left-4 bg-white text-black border border-slate-200 font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                       {post.category}
                    </div>
                 </div>
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                       <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-300" /> {post.date}</span>
                       <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-300" /> {post.readTime}</span>
                    </div>
                    <h3 className="text-[17px] font-black text-black tracking-tight leading-snug mb-3 group-hover:text-slate-700 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-3 mb-8 flex-1">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                       <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${post.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {post.status}
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-black hover:text-white hover:border-black transition-all" 
                            onClick={() => { setEditTarget(post); const { id, ...rest } = post; setForm(rest); setShowModal(true); }}
                          >
                             <Pencil size={14} />
                          </button>
                          <button 
                            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all" 
                            onClick={() => { deletePost(post.id); toast.success("Post deleted"); }}
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
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Content Manager</div>
                    <h3 className="text-xl font-black text-black tracking-tight">{editTarget ? "Edit Article" : "Compose Article"}</h3>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-black transition-colors" onClick={() => setShowModal(false)}>
                    <X size={16} className="text-slate-600" />
                  </button>
               </div>
               
               <div className="p-8 sm:p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Headline *</p>
                     <input value={form.title} placeholder="Enter article headline..." className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-300" onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Article Snippet *</p>
                     <textarea rows={3} placeholder="Brief executive summary..." className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all resize-none placeholder:text-slate-300" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</p>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none focus:border-black transition-all appearance-none cursor-pointer" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                           {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration</p>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none focus:border-black transition-all appearance-none cursor-pointer" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })}>
                           {READ_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cover Media URL</p>
                     <input placeholder="https://..." className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-300" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Publish Date</p>
                        <input className="w-full bg-white border border-slate-200 focus:border-black rounded-xl py-3 px-5 text-sm font-bold text-black outline-none transition-all placeholder:text-slate-300" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">State</p>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-5 text-xs font-bold text-slate-700 outline-none focus:border-black transition-all appearance-none cursor-pointer" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                           <option value="published">Active</option>
                           <option value="draft">Archived Draft</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
                  <button className="h-12 px-6 rounded-xl text-slate-500 hover:text-black hover:bg-slate-50 text-xs font-bold uppercase tracking-widest transition-colors" onClick={() => setShowModal(false)}>
                    Discard
                  </button>
                  <button className="h-12 px-8 rounded-xl bg-black hover:bg-slate-800 text-white shadow-md font-bold text-xs uppercase tracking-widest transition-all flex items-center" onClick={handleSave}>
                     <Check size={16} className="mr-2" /> {editTarget ? "Update Entry" : "Publish to Web"}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
