import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, ChevronRight, Search, Users, CreditCard, Lock } from "lucide-react";
import { PROGRAMS, PROGRAM_CATEGORIES, SCHOOLS } from "./donateData";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SNjaYRsZlPUZpp";

interface PartnerFormData {
  organizationName: string; contactPerson: string; email: string;
  mobile: string; gstNumber: string; programId: string;
  school: string; studentCount: number; customAmount: number;
  csrCategory: string; notes: string;
}

const CSR_CATEGORIES = ["Education", "Healthcare", "Environment & Sustainability", "Skill Development", "Rural Development", "Women Empowerment"];

function PInput({ id, label, required, ...props }: any) {
  return (
    <div className="group">
      <label htmlFor={id} className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block group-focus-within:text-[var(--future-sky)] transition-colors">
        {label} {required && <span className="text-[var(--future-sky)]">*</span>}
      </label>
      <input id={id} {...props} required={required}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:border-[var(--future-sky)] focus:ring-2 focus:ring-[var(--future-sky)]/10 outline-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-gray-300" />
    </div>
  );
}

export function PartnerForm() {
  const [form, setForm] = useState<PartnerFormData>({
    organizationName: "", contactPerson: "", email: "", mobile: "",
    gstNumber: "", programId: "", school: "", studentCount: 50,
    customAmount: 0, csrCategory: "", notes: "",
  });
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedProgram = useMemo(() => PROGRAMS.find(p => p.id === form.programId), [form.programId]);
  const totalAmount = useMemo(() => {
    if (form.customAmount > 0) return form.customAmount;
    if (!selectedProgram) return 0;
    return selectedProgram.costPerUnit * form.studentCount;
  }, [selectedProgram, form.studentCount, form.customAmount]);

  const filteredPrograms = useMemo(() => {
    if (!search.trim()) return PROGRAMS;
    const q = search.toLowerCase();
    return PROGRAMS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [search]);

  const set = (key: keyof PartnerFormData, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.organizationName || !form.contactPerson) {
      toast.error("Organization name, contact person and email are required"); return;
    }
    if (totalAmount < 100) { toast.error("Minimum sponsorship is ₹100"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/donations/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount, email: form.email,
          name: form.contactPerson, organizationName: form.organizationName,
          mobile: form.mobile, donorType: "CSR_PARTNER",
          programName: selectedProgram?.name || "CSR Sponsorship",
          schoolName: form.school, displayName: true,
          notes: `CSR: ${form.csrCategory}. ${form.notes}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");
      const options = {
        key: RAZORPAY_KEY, amount: data.amount, currency: data.currency || "INR",
        name: "WOMBTO18 Foundation", description: `CSR: ${selectedProgram?.name || "Sponsorship"}`,
        order_id: data.orderId,
        prefill: { name: form.contactPerson, email: form.email, contact: form.mobile },
        theme: { color: "#00AEEF" },
        handler: async (response: any) => {
          try {
            const v = await fetch(`${API}/api/donations/verify`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await v.json();
            if (result.success) window.location.href = `/donation-success?amount=${totalAmount}&paymentId=${response.razorpay_payment_id}`;
          } catch { toast.error("Verification failed."); }
        },
        modal: { ondismiss: () => toast.info("Payment cancelled") },
      };
      new window.Razorpay(options).open();
    } catch (err: any) { toast.error(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[var(--future-sky)]/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[var(--future-sky)]" />
          </div>
          <h3 className="text-sm font-black text-gray-900">Organization Details</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <PInput id="partner-org" label="Organization Name" required value={form.organizationName} onChange={(e: any) => set("organizationName", e.target.value)} placeholder="Tata Consultancy Services" />
          </div>
          <PInput id="partner-contact" label="Contact Person" required value={form.contactPerson} onChange={(e: any) => set("contactPerson", e.target.value)} placeholder="Ananya Patel" />
          <PInput id="partner-email" label="Email Address" required type="email" value={form.email} onChange={(e: any) => set("email", e.target.value)} placeholder="csr@company.com" />
          <PInput id="partner-mobile" label="Mobile" value={form.mobile} onChange={(e: any) => set("mobile", e.target.value)} placeholder="+91 98765 43210" />
          <PInput id="partner-gst" label="GST Number" value={form.gstNumber} onChange={(e: any) => set("gstNumber", e.target.value.toUpperCase())} placeholder="29ABCDE1234F1Z5" style={{ textTransform: "uppercase" }} />
        </div>
        <div className="mt-4">
          <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">CSR Focus Area</label>
          <div className="flex flex-wrap gap-1.5">
            {CSR_CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => set("csrCategory", c)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-200 ${form.csrCategory === c
                  ? "bg-[var(--future-sky)] text-white border-[var(--future-sky)] shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[var(--future-sky)]/30"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[var(--future-sky)]/10 flex items-center justify-center"><span className="text-sm">📋</span></div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Sponsor a Program</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Choose from 32 programs to sponsor</p>
          </div>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[var(--future-sky)] focus:ring-2 focus:ring-[var(--future-sky)]/10 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Search programs..." />
        </div>
        <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1 scroll-hide">
          {PROGRAM_CATEGORIES.map(cat => {
            const items = filteredPrograms.filter(p => p.category === cat);
            if (!items.length) return null;
            const isOpen = expandedCat === cat;
            return (
              <div key={cat}>
                <button type="button" onClick={() => setExpandedCat(isOpen ? null : cat)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-[13px] font-bold text-gray-700">{cat}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{items.length}</span>
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="py-1 space-y-0.5 pl-1">
                        {items.map(prog => (
                          <button key={prog.id} type="button"
                            onClick={() => { set("programId", prog.id); set("customAmount", 0); set("studentCount", 50); set("school", ""); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 ${form.programId === prog.id
                              ? "bg-[var(--future-sky)]/6 border border-[var(--future-sky)]/15 shadow-sm"
                              : "hover:bg-gray-50 border border-transparent"}`}>
                            <span className="text-base shrink-0">{prog.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] font-semibold truncate ${form.programId === prog.id ? "text-[var(--future-sky)]" : "text-gray-700"}`}>{prog.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{prog.description}</p>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md">₹{prog.costPerUnit.toLocaleString("en-IN")}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProgram && (
          <motion.div initial={{ opacity: 0, y: 12, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-xl">{selectedProgram.icon}</span>
              <h3 className="text-sm font-black text-gray-900">{selectedProgram.name}</h3>
            </div>
            {selectedProgram.hasSchoolDropdown && (
              <div className="mb-4">
                <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">Select School</label>
                <select value={form.school} onChange={e => set("school", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-[var(--future-sky)] focus:ring-2 focus:ring-[var(--future-sky)]/10 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <option value="">Choose a school...</option>
                  {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3" /> Number of {selectedProgram.unit}s
              </label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => form.studentCount > 10 && set("studentCount", form.studentCount - 10)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 transition-all active:scale-95">−10</button>
                <input type="number" min={1} value={form.studentCount} onChange={e => set("studentCount", Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center px-2 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:border-[var(--future-sky)] focus:ring-2 focus:ring-[var(--future-sky)]/10 outline-none" />
                <button type="button" onClick={() => set("studentCount", form.studentCount + 10)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 transition-all active:scale-95">+10</button>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--future-sky)]/[0.04] to-blue-50/50 border border-[var(--future-sky)]/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Sponsorship</p>
                <p className="text-2xl font-black text-[var(--future-sky)] tracking-tight">₹{(selectedProgram.costPerUnit * form.studentCount).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{form.studentCount} × ₹{selectedProgram.costPerUnit.toLocaleString("en-IN")}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--future-sky)]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[var(--future-sky)]" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">Custom Amount (₹)</label>
              <input type="number" min={0} value={form.customAmount || ""} onChange={e => set("customAmount", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[var(--future-sky)] focus:ring-2 focus:ring-[var(--future-sky)]/10 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Override calculated amount" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">Additional Notes</label>
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[var(--future-sky)] focus:ring-2 focus:ring-[var(--future-sky)]/10 outline-none transition-all resize-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Specific CSR requirements or preferences..." />
      </motion.div>

      <motion.button type="submit" disabled={loading || totalAmount < 100}
        whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
        className="group w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--future-sky)] to-blue-500 text-white font-black shadow-[0_4px_15px_-3px_rgba(0,174,239,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(0,174,239,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
          <><Building2 className="w-4.5 h-4.5" /><span className="text-[15px]">Sponsor ₹{totalAmount.toLocaleString("en-IN")}</span></>
        )}
      </motion.button>
      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
        <Lock className="w-3 h-3" /><span>Secured by Razorpay • CSR Invoice & 80G Available</span>
      </div>
    </form>
  );
}
