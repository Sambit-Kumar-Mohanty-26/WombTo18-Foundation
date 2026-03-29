import { useState } from "react";
import { motion } from "motion/react";
import { Users, Mail, MapPin, Briefcase, Clock, Heart } from "lucide-react";
import { VOLUNTEER_SKILLS } from "./donateData";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface VolunteerFormData {
  name: string; email: string; mobile: string; city: string;
  profession: string; skills: string[]; availability: string;
  experience: string; motivation: string; linkedIn: string;
}

const AVAILABILITY = ["Weekdays (9am-5pm)", "Weekday Evenings", "Weekends Only", "Flexible / Remote", "Full-time Volunteer"];

export function VolunteerForm() {
  const [form, setForm] = useState<VolunteerFormData>({
    name: "", email: "", mobile: "", city: "", profession: "",
    skills: [], availability: "", experience: "", motivation: "", linkedIn: "",
  });
  const navigate = useNavigate();

  const set = (key: keyof VolunteerFormData, val: any) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill],
    }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile) {
      toast.error("Name, email and mobile are required"); return;
    }
    if (form.skills.length === 0) {
      toast.error("Please select at least one skill area"); return;
    }
    toast.success("Volunteer registration submitted!");
    navigate("/volunteer-success");
  }

  return (
    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      onSubmit={handleSubmit} className="space-y-6">

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--womb-forest)]" /> Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name *</label>
            <input id="vol-name" value={form.name} onChange={e => set("name", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder="Dr. Priya Singh" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Email *</label>
            <input id="vol-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder="priya@email.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Mobile *</label>
            <input id="vol-mobile" value={form.mobile} onChange={e => set("mobile", e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> City
            </label>
            <input id="vol-city" value={form.city} onChange={e => set("city", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all" placeholder="Bhubaneswar" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Profession
            </label>
            <input id="vol-profession" value={form.profession} onChange={e => set("profession", e.target.value)}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Relevant Experience</label>
          <textarea id="vol-experience" value={form.experience} onChange={e => set("experience", e.target.value)} rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all resize-none" placeholder="Brief description of relevant volunteering or professional experience..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Why do you want to volunteer? 💬</label>
          <textarea id="vol-motivation" value={form.motivation} onChange={e => set("motivation", e.target.value)} rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAF8] text-sm focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/20 outline-none transition-all resize-none" placeholder="What motivates you to join this mission..." />
        </div>
      </div>

      <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500 text-white text-lg font-black shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-3">
        <Users className="w-5 h-5" /> Register as Volunteer
      </motion.button>
      <p className="text-center text-[10px] text-gray-400">
        🏅 Every volunteer receives a Certificate of Contribution
      </p>
    </motion.form>
  );
}
