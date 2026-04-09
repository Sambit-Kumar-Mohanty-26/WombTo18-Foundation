import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, CreditCard, Lock, CheckCircle2, X, Loader2 } from "lucide-react";
import { PROGRAMS, SCHOOLS } from "./donateData";
import { ProgramSelector } from "./ProgramSelector";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SNjaYRsZlPUZpp";
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
declare global { interface Window { Razorpay: any; } }

interface DonorFormData {
  name: string; email: string; mobile: string; pan: string;
  displayName: boolean; wantVolunteer: boolean; volunteerInfo: string;
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
  const { t } = useTranslation('donate');
  const { state } = useAuth();
  const [form, setForm] = useState<DonorFormData>({
    name: state.user?.name || "", 
    email: state.user?.identifier || "", 
    mobile: "", pan: "",
    displayName: true, wantVolunteer: false, volunteerInfo: "",
  });
  const [selectedPrograms, setSelectedPrograms] = useState<Record<string, { quantity: number; school?: string }>>({});
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (state.user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || state.user?.name || "",
        email: prev.email || state.user?.identifier || "",
      }));
    }
  }, [state.user]);

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


  const set = (key: keyof DonorFormData, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  function toggleProgram(progId: string) {
    setSelectedPrograms(prev => {
      const next = { ...prev };
      if (next[progId]) {
        delete next[progId];
      } else {
        next[progId] = { quantity: 1, school: "" };
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
    if (!form.email || !form.name) { toast.error(t('toasts.required')); return; }
    if (form.pan && !PAN_REGEX.test(form.pan.trim().toUpperCase())) {
      toast.error("Please enter a valid PAN number (e.g. ABCDE1234F).");
      return;
    }
    if (Object.keys(selectedPrograms).length === 0 && totalAmount < 100) { toast.error(t('toasts.selectProgram')); return; }
    if (totalAmount < 100) { toast.error(t('toasts.minAmount')); return; }
    setLoading(true);
    const refParam = new URLSearchParams(window.location.search).get("ref");
    try {
      const res = await fetch(`${API}/api/donations/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount, email: form.email, name: form.name,
          mobile: form.mobile, pan: form.pan, donorType: "INDIVIDUAL",
          programName: Object.keys(selectedPrograms).length > 0 ? Object.keys(selectedPrograms).map(id => t(`programs.${id}.name`)).join(", ") : t('forms.razorpay.general'),
          schoolName: Object.values(selectedPrograms).find(p => p.school)?.school || "", 
          displayName: form.displayName,
          notes: form.wantVolunteer ? `Volunteer Interest: ${form.volunteerInfo}` : "",
          referralCode: refParam || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");
      const options = {
        key: RAZORPAY_KEY, amount: data.amount, currency: data.currency || "INR",
        name: t('forms.razorpay.name'), 
        description: Object.keys(selectedPrograms).length > 0 
          ? t('forms.razorpay.descIndividual', { count: Object.keys(selectedPrograms).length }) 
          : t('forms.razorpay.general'),
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        theme: { color: "#1D6E3F" },
        handler: async (response: any) => {
          try {
            setVerifying(true);
            const verifyRes = await fetch(`${API}/api/donations/verify`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (result.success) {
              const volunteerParam = form.wantVolunteer 
                ? `&volunteer=true&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&mobile=${encodeURIComponent(form.mobile)}` 
                : "";
              const certParams = [
                result.certId ? `&certId=${encodeURIComponent(result.certId)}` : "",
                result.donationId ? `&donationId=${encodeURIComponent(result.donationId)}` : "",
                result.donorId ? `&donorId=${encodeURIComponent(result.donorId)}` : "",
                result.certificateUrl ? `&certificateUrl=${encodeURIComponent(result.certificateUrl)}` : "",
                result.email ? `&email=${encodeURIComponent(result.email)}` : `&email=${encodeURIComponent(form.email)}`,
                `&userExists=${result.userExists || false}`,
                `&isVolunteer=${result.isVolunteer || false}`,
              ].join("");
              window.location.href = `/donation-success?amount=${totalAmount}&paymentId=${response.razorpay_payment_id}${volunteerParam}${certParams}`;
            }
          } catch { 
            toast.error(t('toasts.verifyFailed')); 
          } finally {
            setVerifying(false);
          }
        },
        modal: { ondismiss: () => toast.info(t('toasts.paymentCancelled')) },
      };
      new window.Razorpay(options).open();
    } catch (err: any) { toast.error(err.message || t('toasts.errorGeneral')); }
    finally { setLoading(false); }
  }

  return (
    <>
      <AnimatePresence>
        {verifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-6 max-w-xs text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[var(--womb-forest)]/10 border-t-[var(--womb-forest)] animate-spin" />
                <Heart className="w-6 h-6 text-[var(--womb-forest)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Payment Processing</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Please do not refresh or close this window. We are securing your transaction and generating your receipt...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--journey-saffron)]/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-[var(--journey-saffron)]" />
              </div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">{t('forms.details')}</h3>
            </div>
            {state.user && (
              <div className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100/50 text-[10px] font-black tracking-widest text-emerald-700 uppercase">
                ID: {state.user.volunteerId || state.user.donorId || state.user.identifier}
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <PremiumInput id="donor-name" label={t('forms.fullName')} required value={form.name} onChange={(e: any) => set("name", e.target.value)} placeholder={t('forms.fullNamePlaceholder')} />
            <PremiumInput id="donor-email" label={t('forms.email')} required type="email" value={form.email} onChange={(e: any) => set("email", e.target.value)} placeholder={t('forms.emailPlaceholder')} readOnly={!!state.user} className={state.user ? "opacity-70 bg-gray-50 cursor-not-allowed w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none" : undefined} />
            <PremiumInput id="donor-mobile" label={t('forms.mobile')} value={form.mobile} onChange={(e: any) => set("mobile", e.target.value)} placeholder={t('forms.mobilePlaceholder')} />
            <PremiumInput id="donor-pan" label={t('forms.pan')} value={form.pan} onChange={(e: any) => set("pan", e.target.value.toUpperCase())} maxLength={10} placeholder={t('forms.panPlaceholder')} pattern={PAN_REGEX.source} title="PAN must match ABCDE1234F format" style={{ textTransform: "uppercase" }} />
          </div>
        </motion.div>

        <ProgramSelector
          selectedPrograms={selectedPrograms}
          onToggleProgram={toggleProgram}
          accentColor="var(--womb-forest)"
          sectionTitle={t('selector.title')}
          sectionSubtitle={t('selector.subtitle')}
        />

        <AnimatePresence>
          {Object.keys(selectedPrograms).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-[var(--womb-forest)]/20 bg-gradient-to-b from-[var(--womb-forest)]/[0.02] to-transparent p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">🛒 {t('forms.selected.title')}</h3>
              
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
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:border-[var(--womb-forest)] focus:ring-1 focus:ring-[var(--womb-forest)]/10 outline-none transition-all">
                            <option value="">{t('selector.chooseSchool')}</option>
                            {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t('forms.selected.qty')}</span>
                          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-0.5">
                            <button type="button" onClick={() => sp.quantity > 1 && updateProgram(progId, "quantity", sp.quantity - 1)}
                              className="w-6 h-6 rounded bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 transition-all shadow-sm">−</button>
                            <input type="number" min={1} value={sp.quantity} onChange={e => updateProgram(progId, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-10 text-center px-1 py-1 bg-transparent text-xs font-bold outline-none" />
                            <button type="button" onClick={() => updateProgram(progId, "quantity", sp.quantity + 1)}
                              className="w-6 h-6 rounded bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 transition-all shadow-sm">+</button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-[var(--womb-forest)]">₹{(prog.costPerUnit * sp.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--womb-forest)]/[0.04] to-emerald-50/50 border border-[var(--womb-forest)]/10 flex items-center justify-between mt-2">
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{t('forms.selected.total')}</p>
                  <p className="text-2xl font-black text-[var(--womb-forest)] tracking-tight">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--womb-forest)]/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[var(--womb-forest)]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          {[
            { key: "displayName" as const, label: t('forms.checkboxes.publicName'), checked: form.displayName },
            { key: "wantVolunteer" as const, label: t('forms.checkboxes.alsoVolunteer'), checked: form.wantVolunteer },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${opt.checked ? "bg-[var(--womb-forest)] border-[var(--womb-forest)]" : "border-gray-300 group-hover:border-gray-400"}`}>
                {opt.checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" className="sr-only" checked={opt.checked} onChange={e => set(opt.key, e.target.checked)} />
              <span className="text-[13px] text-gray-600 group-hover:text-gray-800 transition-colors">{opt.label}</span>
            </label>
          ))}

          <AnimatePresence>
            {form.wantVolunteer && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-2 pb-1 pl-10 pr-2">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-1.5 block">{t('forms.volunteerPrompt')}</label>
                  <textarea value={form.volunteerInfo} onChange={e => set("volunteerInfo", e.target.value)} rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-1 focus:ring-[var(--womb-forest)]/10 outline-none transition-all resize-none" placeholder={t('forms.volunteerPlaceholder')} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          type="submit" disabled={loading || totalAmount < 100 || Object.keys(selectedPrograms).length === 0}
          whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
          className="group w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--journey-saffron)] to-orange-500 text-white font-black shadow-[0_4px_15px_-3px_rgba(255,153,0,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(255,153,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Heart className="w-4.5 h-4.5" />
              <span className="text-[15px]">{t('forms.buttons.donate', { amount: totalAmount.toLocaleString("en-IN") })}</span>
            </>
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
          <Lock className="w-3 h-3" />
          <span>{t('sidebar.trust.razorpay')} • {t('sidebar.trust.eightyG')}</span>
        </div>
      </form>
    </>
  );
}
