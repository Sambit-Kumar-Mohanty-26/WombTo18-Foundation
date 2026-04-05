import { useState } from "react";
import { motion } from "motion/react";
import { Users, Mail, MapPin, Briefcase, Clock, Heart, Lock, ArrowRight } from "lucide-react";
import { VOLUNTEER_SKILLS } from "./donateData";
import { toast } from "sonner";
import { useNavigate, useSearchParams, Link } from "react-router";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SNjaYRsZlPUZpp";
declare global { interface Window { Razorpay: any; } }

interface VolunteerFormData {
  name: string; email: string; mobile: string; city: string;
  profession: string; skills: string[]; availability: string;
  experience: string; motivation: string; linkedIn: string;
}

const AVAILABILITY = ["Weekdays (9am-5pm)", "Weekday Evenings", "Weekends Only", "Flexible / Remote", "Full-time Volunteer"];

export function VolunteerForm() {
  const [searchParams] = useSearchParams();
  const queryName = searchParams.get("name") || "";
  const queryEmail = searchParams.get("email") || "";
  const queryMobile = searchParams.get("mobile") || "";
  const previousDonation = Number(searchParams.get("amount") || "0");
  const isPaymentRequired = previousDonation < 500;

  const [form, setForm] = useState<VolunteerFormData>({
    name: queryName, email: queryEmail, mobile: queryMobile, city: "", profession: "",
    skills: [], availability: "", experience: "", motivation: "", linkedIn: "",
  });
  const [contributionAmount, setContributionAmount] = useState(500);
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
      toast.error("Please fill all mandatory fields"); return;
    }
    if (form.skills.length === 0) {
      toast.error("Please select at least one skill area"); return;
    }
    if (!form.availability) {
      toast.error("Please select your availability schedule"); return;
    }

    if (isPaymentRequired && contributionAmount < 500) {
      toast.error("Minimum contribution is ₹500"); return;
    }

    setLoading(true);
    try {
      if (isPaymentRequired) {
        const res = await fetch(`${API}/api/donations/create`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: contributionAmount, email: form.email, name: form.name,
            mobile: form.mobile, donorType: "INDIVIDUAL",
            programName: "Volunteer Membership Contribution",
            notes: `Volunteer Registration: ${form.motivation}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Contribution initialization failed");

        const options = {
          key: RAZORPAY_KEY, amount: data.amount, currency: "INR",
          name: "WOMBTO18 Foundation", description: "Volunteer Membership Contribution",
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
                toast.success("Registration and contribution successful!");
                navigate("/volunteer-success");
              }
            } catch { toast.error("Verification failed. Please contact support."); }
          },
          modal: { ondismiss: () => toast.info("Payment cancelled") },
        };
        new window.Razorpay(options).open();
      } else {
        toast.success("Volunteer registration submitted!");
        navigate("/volunteer-success");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process registration");
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
            <Users className="w-4 h-4 text-[var(--womb-forest)]" /> Personal Information
          </h3>
          <Link 
            to="/volunteer-benefits"
            className="group flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors py-1 px-2 rounded-lg hover:bg-blue-50/50"
          >
            <span>View Volunteer Benefits</span>
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
              <span>Full Name *</span>
              {queryName && <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
            </label>
            <input id="vol-name" value={form.name} onChange={e => set("name", e.target.value)} required readOnly={!!queryName}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${queryName ? 'bg-gray-100/80 border-transparent text-gray-500 shadow-inner cursor-not-allowed select-none' : 'bg-[#FAFAF8] border-gray-200 focus:bg-white focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20'}`} placeholder="Dr. Priya Singh" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
              <span>Email *</span>
              {queryEmail && <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
            </label>
            <input id="vol-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} required readOnly={!!queryEmail}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${queryEmail ? 'bg-gray-100/80 border-transparent text-gray-500 shadow-inner cursor-not-allowed select-none' : 'bg-[#FAFAF8] border-gray-200 focus:bg-white focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20'}`} placeholder="priya@email.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
              <span>Mobile *</span>
              {queryMobile && <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
            </label>
            <input id="vol-mobile" value={form.mobile} onChange={e => set("mobile", e.target.value)} required readOnly={!!queryMobile}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${queryMobile ? 'bg-gray-100/80 border-transparent text-gray-500 shadow-inner cursor-not-allowed select-none' : 'bg-[#FAFAF8] border-gray-200 focus:bg-white focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20'}`} placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> City *
            </label>
            <input id="vol-city" value={form.city} onChange={e => set("city", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder="Bhubaneswar" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Profession *
            </label>
            <input id="vol-profession" value={form.profession} onChange={e => set("profession", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder="Paediatrician / Developer / Teacher" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">LinkedIn Profile</label>
            <input id="vol-linkedin" value={form.linkedIn} onChange={e => set("linkedIn", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder="linkedin.com/in/yourprofile" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">🛠️ Skills & Expertise *</h3>
        <p className="text-xs text-gray-500 mb-3">Select all areas where you can contribute:</p>
        <div className="flex flex-wrap gap-2">
          {VOLUNTEER_SKILLS.map(skill => (
            <button key={skill} type="button" onClick={() => toggleSkill(skill)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${form.skills.includes(skill)
                ? "bg-[var(--womb-forest)] text-white border-[var(--womb-forest)] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[var(--womb-forest)]/30 hover:bg-[var(--womb-forest)]/5"}`}>
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--journey-saffron)]" /> Availability
        </h3>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map(opt => (
            <button key={opt} type="button" onClick={() => set("availability", opt)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border text-center transition-all duration-200 ${form.availability === opt
                ? "bg-[var(--journey-saffron)] text-white border-[var(--journey-saffron)] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[var(--journey-saffron)]/30"}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Relevant Experience *</label>
          <textarea id="vol-experience" value={form.experience} onChange={e => set("experience", e.target.value)} rows={2} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all resize-none" placeholder="Brief description of relevant volunteering or professional experience..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Why do you want to volunteer? 💬 *</label>
          <textarea id="vol-motivation" value={form.motivation} onChange={e => set("motivation", e.target.value)} rows={2} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all resize-none" placeholder="What motivates you to join this mission..." />
        </div>
      </div>

      {isPaymentRequired && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Heart className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Membership Contribution</h3>
              <p className="text-[10px] text-gray-400 font-medium">A minimum of ₹500 is required to register</p>
            </div>
          </div>
          
          <div className="relative group/price">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-300 group-focus-within/price:text-blue-600 transition-colors">₹</span>
            <input 
              type="number"
              min="500"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(Number(e.target.value))}
              className="w-full pl-9 pr-4 py-4 rounded-xl border border-gray-100 bg-[#FAFAF8] text-xl font-black text-gray-900 outline-none transition-all focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50"
              placeholder="500"
            />
          </div>
        </div>
      )}

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
            <Users className="w-5 h-5" /> 
            {isPaymentRequired ? "Pay & Register as Volunteer" : "Complete Registration"}
          </>
        )}
      </motion.button>
      <p className="text-center text-[10px] text-gray-400">
        🏅 Every volunteer receives a Certificate of Contribution
      </p>
    </motion.form>
  );
}
