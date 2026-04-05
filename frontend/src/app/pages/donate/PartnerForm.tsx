import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, Users, CreditCard, Lock, X } from "lucide-react";
import { PROGRAMS, SCHOOLS } from "./donateData";
import { ProgramSelector } from "./ProgramSelector";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SNjaYRsZlPUZpp";

interface PartnerFormData {
  organizationName: string; contactPerson: string; email: string;
  mobile: string; panNumber: string; csrCategory: string; notes: string;
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
  const { t } = useTranslation('donate');
  const [form, setForm] = useState<PartnerFormData>({
    organizationName: "", contactPerson: "", email: "", mobile: "",
    panNumber: "", csrCategory: "", notes: "",
  });
  const [selectedPrograms, setSelectedPrograms] = useState<Record<string, { quantity: number; school?: string }>>({});
  const [loading, setLoading] = useState(false);

  const totalAmount = useMemo(() => {
    let total = 0;
    Object.keys(selectedPrograms).forEach(id => {
      const prog = PROGRAMS.find(p => p.id === id);
      if (prog) {
        total += prog.costPerUnit * selectedPrograms[id].quantity;
      }
    });
    return total;
  }, [selectedPrograms]);

  const set = (key: keyof PartnerFormData, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  function toggleProgram(progId: string) {
    setSelectedPrograms(prev => {
      const next = { ...prev };
      if (next[progId]) {
        delete next[progId];
      } else {
        next[progId] = { quantity: 10, school: "" };
      }
      return next;
    });
  }

  function updateProgram(progId: string, key: 'quantity' | 'school', val: any) {
    setSelectedPrograms(prev => ({
      ...prev,
      [progId]: { ...prev[progId], [key]: val }
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.organizationName || !form.contactPerson) {
      toast.error(t('toasts.requiredPartner')); return;
    }
    if (Object.keys(selectedPrograms).length === 0 && totalAmount < 100) { toast.error(t('toasts.selectProgram')); return; }
    if (totalAmount < 100) { toast.error(t('toasts.minSponsorship')); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/donations/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount, email: form.email,
          name: form.contactPerson, organizationName: form.organizationName,
          mobile: form.mobile, donorType: "CSR_PARTNER",
          pan: form.panNumber,
          programName: Object.keys(selectedPrograms).length > 0 ? Object.keys(selectedPrograms).map(id => t(`programs.${id}.name`)).join(", ") : t('forms.razorpay.general'),
          schoolName: Object.values(selectedPrograms).find(p => p.school)?.school || "",
          displayName: true,
          notes: `CSR: ${form.csrCategory}. ${form.notes}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");
      const options = {
        key: RAZORPAY_KEY, amount: data.amount, currency: data.currency || "INR",
        name: t('forms.razorpay.name'), 
        description: Object.keys(selectedPrograms).length > 0 
          ? t('forms.razorpay.descCSR', { count: Object.keys(selectedPrograms).length }) 
          : t('forms.razorpay.general'),
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
          } catch { toast.error(t('toasts.verifyFailed')); }
        },
        modal: { ondismiss: () => toast.info(t('toasts.paymentCancelled')) },
      };
      new window.Razorpay(options).open();
    } catch (err: any) { toast.error(err.message || t('toasts.errorGeneral')); }
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
          <h3 className="text-sm font-black text-gray-900">{t('forms.partner.orgDetails')}</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <PInput id="partner-org" label={t('forms.partner.orgName')} required value={form.organizationName} onChange={(e: any) => set("organizationName", e.target.value)} placeholder={t('forms.partner.orgNamePlaceholder')} />
          </div>
          <PInput id="partner-contact" label={t('forms.partner.contactPerson')} required value={form.contactPerson} onChange={(e: any) => set("contactPerson", e.target.value)} placeholder={t('forms.partner.contactPersonPlaceholder')} />
          <PInput id="partner-email" label={t('forms.email')} required type="email" value={form.email} onChange={(e: any) => set("email", e.target.value)} placeholder={t('forms.emailPlaceholder')} />
          <PInput id="partner-mobile" label={t('forms.mobile')} value={form.mobile} onChange={(e: any) => set("mobile", e.target.value)} placeholder={t('forms.mobilePlaceholder')} />
          <PInput id="partner-pan" label={t('forms.pan')} value={form.panNumber} onChange={(e: any) => set("panNumber", e.target.value.toUpperCase())} placeholder={t('forms.panPlaceholder')} maxLength={10} style={{ textTransform: "uppercase" }} />
        </div>
        <div className="mt-4">
          <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">{t('forms.partner.csrFocus')}</label>
          <div className="flex flex-wrap gap-1.5">
            {CSR_CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => set("csrCategory", c)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-200 ${form.csrCategory === c
                  ? "bg-[var(--future-sky)] text-white border-[var(--future-sky)] shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[var(--future-sky)]/30"}`}>
                {t(`forms.partner.csrCategories.${c}`)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <ProgramSelector
        selectedPrograms={selectedPrograms}
        onToggleProgram={toggleProgram}
        accentColor="var(--future-sky)"
        sectionTitle={t('forms.partner.sponsorshipTitle')}
        sectionSubtitle={t('forms.partner.sponsorshipSubtitle')}
      />

      <AnimatePresence>
        {Object.keys(selectedPrograms).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-[var(--future-sky)]/20 bg-gradient-to-b from-[var(--future-sky)]/[0.02] to-transparent p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">🏢 {t('forms.partner.selectedTitle')}</h3>
            
            <div className="space-y-4 mb-4">
              {Object.keys(selectedPrograms).map(progId => {
                const prog = PROGRAMS.find(p => p.id === progId);
                if (!prog) return null;
                const sp = selectedPrograms[progId];
                return (
                  <div key={progId} className="p-4 bg-white rounded-xl border border-gray-100 relative shadow-sm">
                    <button type="button" onClick={() => toggleProgram(progId)} className="absolute top-3 right-3 p-1 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2.5 mb-3 pr-6">
                      <span className="text-xl">{prog.icon}</span>
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-900">{t(`programs.${prog.id}.name`)}</h4>
                        <p className="text-[10px] text-gray-400">₹{prog.costPerUnit.toLocaleString("en-IN")} {t('selector.pricePer', 'per {{unit}}', { unit: t(`units.${prog.unit.split("/")[0]}`) || prog.unit.split("/")[0] })}</p>
                      </div>
                    </div>

                    {prog.hasSchoolDropdown && (
                      <div className="mb-3">
                        <select value={sp.school || ""} onChange={e => updateProgram(progId, "school", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:border-[var(--future-sky)] focus:ring-1 focus:ring-[var(--future-sky)]/10 outline-none transition-all">
                          <option value="">{t('selector.chooseSchool')}</option>
                          {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 pt-3 border-t border-gray-50 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3" /> {t('selector.quantity', { unit: t(`units.${prog.unit.split("/")[0]}`) || prog.unit.split("/")[0] })}:
                        </label>
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-0.5 w-fit">
                          <button type="button" onClick={() => sp.quantity > 10 && updateProgram(progId, "quantity", sp.quantity - 10)}
                            className="w-8 h-6 rounded bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 transition-all shadow-sm">−10</button>
                          <input type="number" min={1} value={sp.quantity} onChange={e => updateProgram(progId, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 text-center px-1 py-1 bg-transparent text-xs font-bold outline-none" />
                          <button type="button" onClick={() => updateProgram(progId, "quantity", sp.quantity + 10)}
                            className="w-8 h-6 rounded bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 transition-all shadow-sm">+10</button>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-[10px] text-gray-400 mb-0.5">{sp.quantity} × ₹{prog.costPerUnit.toLocaleString("en-IN")}</p>
                        <p className="text-lg font-black text-[var(--future-sky)]">₹{(prog.costPerUnit * sp.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--future-sky)]/[0.04] to-blue-50/50 border border-[var(--future-sky)]/10 flex items-center justify-between mt-2">
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{t('forms.partner.totalSponsorship')}</p>
                <p className="text-2xl font-black text-[var(--future-sky)] tracking-tight">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--future-sky)]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[var(--future-sky)]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">{t('forms.partner.additionalNotes')}</label>
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[var(--future-sky)] focus:ring-2 focus:ring-[var(--future-sky)]/10 outline-none transition-all resize-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]" placeholder={t('forms.partner.notesPlaceholder')} />
      </motion.div>

      <motion.button type="submit" disabled={loading || totalAmount < 100 || Object.keys(selectedPrograms).length === 0}
        whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
        className="group w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--future-sky)] to-blue-500 text-white font-black shadow-[0_4px_15px_-3px_rgba(0,174,239,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(0,174,239,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
          <><Building2 className="w-4.5 h-4.5" /><span className="text-[15px]">{t('forms.buttons.sponsor', { amount: totalAmount.toLocaleString("en-IN") })}</span></>
        )}
      </motion.button>
      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
        <Lock className="w-3 h-3" /><span>{t('sidebar.trust.razorpay')} • {t('forms.partner.trust')}</span>
      </div>
    </form>
  );
}
