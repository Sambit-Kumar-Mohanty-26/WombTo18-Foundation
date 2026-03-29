import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ChevronDown, ChevronRight, Search, Info, CreditCard, Lock } from "lucide-react";
import { PROGRAMS, PROGRAM_CATEGORIES, SCHOOLS } from "./donateData";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SNjaYRsZlPUZpp";
declare global { interface Window { Razorpay: any; } }

interface DonorFormData {
  name: string; email: string; mobile: string; pan: string;
  programId: string; school: string; quantity: number;
  customAmount: number; displayName: boolean; wantVolunteer: boolean;
}

function PremiumInput({ id, label, required, ...props }: any) {
  return (
    <div className="group">
      <label htmlFor={id} className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block group-focus-within:text-[var(--womb-forest)] transition-colors">
        {label} {required && <span className="text-[var(--journey-saffron)]">*</span>}
      </label>
      <input id={id} {...props} required={required}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 focus:bg-white outline-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-gray-300" />
    </div>
  );
}

export function DonorForm() {
  const [form, setForm] = useState<DonorFormData>({
    name: "", email: "", mobile: "", pan: "",
    programId: "", school: "", quantity: 1,
    customAmount: 0, displayName: true, wantVolunteer: false,
  });
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedProgram = useMemo(() => PROGRAMS.find(p => p.id === form.programId), [form.programId]);
  const totalAmount = useMemo(() => {
    if (form.customAmount > 0) return form.customAmount;
    if (!selectedProgram) return 0;
    return selectedProgram.costPerUnit * form.quantity;
  }, [selectedProgram, form.quantity, form.customAmount]);

  const filteredPrograms = useMemo(() => {
    if (!search.trim()) return PROGRAMS;
    const q = search.toLowerCase();
    return PROGRAMS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [search]);

  const set = (key: keyof DonorFormData, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.name) { toast.error("Name and email are required"); return; }
    if (totalAmount < 100) { toast.error("Minimum donation is ₹100"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/donations/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount, email: form.email, name: form.name,
          mobile: form.mobile, pan: form.pan, donorType: "INDIVIDUAL",
          programName: selectedProgram?.name || "General Donation",
          schoolName: form.school, displayName: form.displayName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");
      const options = {
        key: RAZORPAY_KEY, amount: data.amount, currency: data.currency || "INR",
        name: "WOMBTO18 Foundation", description: selectedProgram?.name || "Donation",
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        theme: { color: "#1D6E3F" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API}/api/donations/verify`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (result.success) window.location.href = `/donation-success?amount=${totalAmount}&paymentId=${response.razorpay_payment_id}`;
          } catch { toast.error("Verification failed. Please contact support."); }
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
          <div className="w-8 h-8 rounded-lg bg-[var(--journey-saffron)]/10 flex items-center justify-center">
            <Heart className="w-4 h-4 text-[var(--journey-saffron)]" />
          </div>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">Personal Details</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <PremiumInput id="donor-name" label="Full Name" required value={form.name} onChange={(e: any) => set("name", e.target.value)} placeholder="Rahul Sharma" />
          <PremiumInput id="donor-email" label="Email Address" required type="email" value={form.email} onChange={(e: any) => set("email", e.target.value)} placeholder="rahul@email.com" />
          <PremiumInput id="donor-mobile" label="Mobile Number" value={form.mobile} onChange={(e: any) => set("mobile", e.target.value)} placeholder="+91 98765 43210" />
          <PremiumInput id="donor-pan" label="PAN (for 80G)" value={form.pan} onChange={(e: any) => set("pan", e.target.value.toUpperCase())} maxLength={10} placeholder="ABCDE1234F" style={{ textTransform: "uppercase" }} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[var(--womb-forest)]/10 flex items-center justify-center">
            <span className="text-sm">📋</span>
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">Choose a Program</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Select from 32 impact programs</p>
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          <input id="program-search" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Search programs..." />
        </div>

        <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 scroll-hide">
          {PROGRAM_CATEGORIES.map(cat => {
            const items = filteredPrograms.filter(p => p.category === cat);
            if (items.length === 0) return null;
            const isOpen = expandedCat === cat;
            return (
              <div key={cat}>
                <button type="button" onClick={() => setExpandedCat(isOpen ? null : cat)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group">
                  <span className="text-[13px] font-bold text-gray-700 group-hover:text-gray-900">{cat}</span>
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
                        {items.map(prog => {
                          const isSelected = form.programId === prog.id;
                          return (
                            <button key={prog.id} type="button"
                              onClick={() => { set("programId", prog.id); set("customAmount", 0); set("quantity", 1); set("school", ""); }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-200 ${isSelected
                                ? "bg-[var(--womb-forest)]/6 border border-[var(--womb-forest)]/15 shadow-sm"
                                : "hover:bg-gray-50 border border-transparent"}`}>
                              <span className="text-base shrink-0">{prog.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-semibold truncate ${isSelected ? "text-[var(--womb-forest)]" : "text-gray-700"}`}>{prog.name}</p>
                                <p className="text-[10px] text-gray-400 truncate">{prog.description}</p>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md">₹{prog.costPerUnit.toLocaleString("en-IN")}</span>
                            </button>
                          );
                        })}
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
              <div>
                <h3 className="text-sm font-black text-gray-900">{selectedProgram.name}</h3>
                <p className="text-[10px] text-gray-400">{selectedProgram.description}</p>
              </div>
            </div>

            {selectedProgram.hasSchoolDropdown && (
              <div className="mb-4">
                <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">Select School</label>
                <select id="donor-school" value={form.school} onChange={e => set("school", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <option value="">Choose a school...</option>
                  {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">
                Number of {selectedProgram.unit}s
              </label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => form.quantity > 1 && set("quantity", form.quantity - 1)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 transition-all active:scale-95">−</button>
                <input type="number" min={1} value={form.quantity} onChange={e => set("quantity", Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center px-2 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none" />
                <button type="button" onClick={() => set("quantity", form.quantity + 1)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 transition-all active:scale-95">+</button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--womb-forest)]/[0.04] to-emerald-50/50 border border-[var(--womb-forest)]/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Amount</p>
                <p className="text-2xl font-black text-[var(--womb-forest)] tracking-tight">
                  ₹{(selectedProgram.costPerUnit * form.quantity).toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{form.quantity} × ₹{selectedProgram.costPerUnit.toLocaleString("en-IN")} per {selectedProgram.unit}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--womb-forest)]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[var(--womb-forest)]" />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">Custom Amount (₹)</label>
              <input type="number" min={0} value={form.customAmount || ""} onChange={e => set("customAmount", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Override calculated amount" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2.5">
        {[
          { key: "displayName" as const, label: "Display my name publicly as a donor", checked: form.displayName },
          { key: "wantVolunteer" as const, label: "I'd also like to volunteer with WOMBTO18 🙋", checked: form.wantVolunteer },
        ].map(opt => (
          <label key={opt.key} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${opt.checked ? "bg-[var(--womb-forest)] border-[var(--womb-forest)]" : "border-gray-300 group-hover:border-gray-400"}`}>
              {opt.checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <input type="checkbox" className="sr-only" checked={opt.checked} onChange={e => set(opt.key, e.target.checked)} />
            <span className="text-[13px] text-gray-600 group-hover:text-gray-800 transition-colors">{opt.label}</span>
          </label>
        ))}
      </motion.div>

      <motion.button
        type="submit" disabled={loading || totalAmount < 100}
        whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
        className="group w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--journey-saffron)] to-orange-500 text-white font-black shadow-[0_4px_15px_-3px_rgba(255,153,0,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(255,153,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Heart className="w-4.5 h-4.5" />
            <span className="text-[15px]">Donate ₹{totalAmount.toLocaleString("en-IN")}</span>
          </>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
        <Lock className="w-3 h-3" />
        <span>Secured by Razorpay • 80G Tax Benefit Available</span>
      </div>
    </form>
  );
}