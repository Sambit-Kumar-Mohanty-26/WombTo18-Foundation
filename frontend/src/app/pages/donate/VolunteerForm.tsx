import { useState } from "react";
import { motion } from "motion/react";
import { Users, Mail, MapPin, Briefcase, Clock, Heart, Lock, ArrowRight, Zap } from "lucide-react";
import { VOLUNTEER_SKILLS } from "./donateData";
import { toast } from "sonner";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SNjaYRsZlPUZpp";
declare global { interface Window { Razorpay: any; } }

interface VolunteerFormData {
  name: string; email: string; mobile: string; city: string;
  profession: string; skills: string[]; availability: string;
  experience: string; motivation: string; linkedIn: string;
  pan: string;
}

const AVAILABILITY = ["Weekdays (9am-5pm)", "Weekday Evenings", "Weekends Only", "Flexible / Remote", "Full-time Volunteer"];

export function VolunteerForm() {
  const { t } = useTranslation('donate');
  const [searchParams] = useSearchParams();
  const session = JSON.parse(localStorage.getItem("donor_session") || "{}");
  const queryName = searchParams.get("name") || session.name || "";
  const queryEmail = searchParams.get("email") || session.identifier || "";
  const queryMobile = searchParams.get("mobile") || session.mobile || "";

  const [form, setForm] = useState<VolunteerFormData>({
    name: queryName, email: queryEmail, mobile: queryMobile, city: "", profession: "",
    skills: [], availability: "", experience: "", motivation: "", linkedIn: "",
    pan: "",
  });
  const [contributionAmount, setContributionAmount] = useState<number | "">(500);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key: keyof VolunteerFormData, val: any) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill],
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.city || !form.profession || !form.experience || !form.motivation) {
      toast.error(t('toasts.mandatoryFields')); return;
    }
    if (form.skills.length === 0) {
      toast.error(t('toasts.selectSkill')); return;
    }
    if (!form.availability) {
      toast.error(t('toasts.selectAvailability')); return;
    }

    if (!contributionAmount || Number(contributionAmount) < 500 || Number(contributionAmount) > 2000) {
      toast.error("Membership contribution must be between ₹500 and ₹2000"); return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/donations/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(contributionAmount), email: form.email, name: form.name,
          mobile: form.mobile, donorType: "INDIVIDUAL", pan: form.pan,
          programName: "Volunteer Membership",
          notes: `Volunteer Registration: ${form.motivation}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Contribution initialization failed");

      const options = {
        key: RAZORPAY_KEY, amount: data.amount, currency: "INR",
        name: t('forms.razorpay.name'), 
        description: "Impact Volunteer Membership",
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
            if (result.success) {
              // Update volunteer profile with extra info immediately after payment
              await fetch(`${API}/api/volunteers/profile/${encodeURIComponent(form.email)}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...form,
                  skills: form.skills,
                }),
              });
              
              toast.success(t('toasts.registrationSuccess'));
              toast.success(`🎁 Welcome Bonus: ${contributionAmount} credits added!`, {
                description: "Your 100% cashback is now in your Impact Wallet.",
                duration: 6000,
              });
              
              // Update local session status to prevent guard from kicking us back
              const currentSession = JSON.parse(localStorage.getItem("donor_session") || "{}");
              if (currentSession) {
                currentSession.profileCompleted = true;
                localStorage.setItem("donor_session", JSON.stringify(currentSession));
              }

              // Redirect using the email/ID we have
              const target = currentSession.volunteerId || currentSession.donorId || queryEmail;
              window.location.href = `/volunteer/${target}/dashboard`;
            }
          } catch { toast.error(t('toasts.verifyFailed')); }
        },
        modal: { ondismiss: () => toast.info(t('toasts.paymentCancelled')) },
      };
      new window.Razorpay(options).open();
    } catch (err: any) {
      toast.error(err.message || t('toasts.registrationFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      onSubmit={handleSubmit} className="space-y-6">

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--womb-forest)]" /> {t('forms.volunteer.personal')}
          </h3>
          <Link 
            to="/volunteer-policy"
            className="group flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors py-1 px-2 rounded-lg hover:bg-blue-50/50"
          >
            <span>{t('forms.volunteer.benefits')}</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
              <span>{t('forms.volunteer.fullName')} *</span>
              {queryName && <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> {t('forms.volunteer.locked')}</span>}
            </label>
            <input id="vol-name" value={form.name} onChange={e => set("name", e.target.value)} required readOnly={!!queryName}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${queryName ? 'bg-gray-100/80 border-transparent text-gray-500 shadow-inner cursor-not-allowed select-none' : 'bg-[#FAFAF8] border-gray-200 focus:bg-white focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20'}`} placeholder={t('forms.volunteer.fullNamePlaceholder')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
              <span>{t('forms.email')} *</span>
              {queryEmail && <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> {t('forms.volunteer.locked')}</span>}
            </label>
            <input id="vol-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} required readOnly={!!queryEmail}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${queryEmail ? 'bg-gray-100/80 border-transparent text-gray-500 shadow-inner cursor-not-allowed select-none' : 'bg-[#FAFAF8] border-gray-200 focus:bg-white focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20'}`} placeholder={t('forms.emailPlaceholder')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
              <span>{t('forms.mobile')} *</span>
              {queryMobile && <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> {t('forms.volunteer.locked')}</span>}
            </label>
            <input id="vol-mobile" value={form.mobile} onChange={e => set("mobile", e.target.value)} required readOnly={!!queryMobile}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${queryMobile ? 'bg-gray-100/80 border-transparent text-gray-500 shadow-inner cursor-not-allowed select-none' : 'bg-[#FAFAF8] border-gray-200 focus:bg-white focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20'}`} placeholder={t('forms.mobilePlaceholder')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {t('forms.volunteer.city')} *
            </label>
            <input id="vol-city" value={form.city} onChange={e => set("city", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder={t('forms.volunteer.cityPlaceholder')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> {t('forms.volunteer.profession')} *
            </label>
            <input id="vol-profession" value={form.profession} onChange={e => set("profession", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder={t('forms.volunteer.professionPlaceholder')} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">PAN Number (Optional)</label>
            <input id="vol-pan" value={form.pan} onChange={e => set("pan", e.target.value.toUpperCase())} maxLength={10}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all placeholder:uppercase" placeholder="ABCDE1234F" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">{t('forms.volunteer.linkedin')}</label>
            <input id="vol-linkedin" value={form.linkedIn} onChange={e => set("linkedIn", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder={t('forms.volunteer.linkedinPlaceholder')} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">🛠️ {t('forms.volunteer.skillsTitle')} *</h3>
        <p className="text-xs text-gray-500 mb-3">{t('forms.volunteer.skillsSubtitle')}</p>
        <div className="flex flex-wrap gap-2">
          {VOLUNTEER_SKILLS.map(skill => (
            <button key={skill} type="button" onClick={() => toggleSkill(skill)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${form.skills.includes(skill)
                ? "bg-[var(--womb-forest)] text-white border-[var(--womb-forest)] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[var(--womb-forest)]/30 hover:bg-[var(--womb-forest)]/5"}`}>
              {t(`forms.volunteer.skills.${skill}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--journey-saffron)]" /> {t('forms.volunteer.availabilityTitle')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map(opt => (
            <button key={opt} type="button" onClick={() => set("availability", opt)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border text-center transition-all duration-200 ${form.availability === opt
                ? "bg-[var(--journey-saffron)] text-white border-[var(--journey-saffron)] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[var(--journey-saffron)]/30"}`}>
              {t(`forms.volunteer.availabilityOptions.${opt}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">{t('forms.volunteer.experience')} *</label>
          <textarea id="vol-experience" value={form.experience} onChange={e => set("experience", e.target.value)} rows={2} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all resize-none" placeholder={t('forms.volunteer.experiencePlaceholder')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">{t('forms.volunteer.motivation')} *</label>
          <textarea id="vol-motivation" value={form.motivation} onChange={e => set("motivation", e.target.value)} rows={2} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all resize-none" placeholder={t('forms.volunteer.motivationPlaceholder')} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm z-10">
          100% Welcome Bonus
        </div>
        <div className="flex items-center gap-2.5 mb-5 pt-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-600 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">Active Membership One-time Contribution</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Min: ₹500 • Max: ₹2000</p>
          </div>
        </div>
        
        <div className="relative group/price">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-300 group-focus-within/price:text-amber-600 transition-colors">₹</span>
          <input 
            type="number"
            min="500"
            max="2000"
            value={contributionAmount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setContributionAmount("");
              } else {
                setContributionAmount(Number(val));
              }
            }}
            className="w-full pl-9 pr-4 py-4 rounded-xl border border-gray-100 bg-[#FAFAF8] text-xl font-black text-gray-900 outline-none transition-all focus:bg-white focus:border-amber-200 focus:ring-4 focus:ring-amber-50"
            placeholder="500"
          />
        </div>
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-900/60 uppercase">Instant Bonus Credits</span>
          <span className="text-lg font-black text-amber-600">{(Number(contributionAmount) || 0).toLocaleString()} Credits</span>
        </div>
      </div>

      <motion.button 
        type="submit" 
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.01 }} 
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`w-full py-4 rounded-2xl text-white text-lg font-black shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          loading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Zap className="w-5 h-5 fill-current" /> 
            Pay ₹{(Number(contributionAmount) || 0).toLocaleString()} & Complete Profile
          </>
        )}
      </motion.button>
      <p className="text-center text-[10px] text-gray-400">
        🏅 {t('forms.volunteer.certNotice')}
      </p>
    </motion.form>
  );
}
