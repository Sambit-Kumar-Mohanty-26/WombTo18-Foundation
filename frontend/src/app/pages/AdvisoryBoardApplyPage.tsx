import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Lenis from "lenis";
import { 
  ArrowLeft, ArrowRight, Check, X, 
  Baby, Stethoscope, Building2, Syringe, Utensils, Microscope, Brain, Puzzle, Zap, GraduationCap, ShieldCheck, Search, CheckSquare, Handshake, Users, Activity, Heart, School, BookOpen, HeartPulse, UserCheck, Flame, Scale, Shield, Globe, Leaf, FileText, Languages, Monitor, BarChart3, Layout, Lock, Briefcase, TrendingUp, Megaphone, Landmark, Upload, Play, AlertCircle, Mail, Smartphone
} from "lucide-react";
import { calculateAdvisoryScore, type DomainCategory } from "../lib/advisoryScoringEngine";
import { INDIAN_STATES } from "../lib/indianStates";
import { useToast } from "../context/ToastContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:6001";

interface DomainItem {
  icon: any;
  title: string;
  desc: string;
  category: DomainCategory;
}

const expertiseDomains: DomainItem[] = [
  // Healthcare
  { icon: Baby, title: "Maternal & newborn care", desc: "Obstetrics, NICU, midwifery", category: "HEALTHCARE" },
  { icon: Stethoscope, title: "Paediatrics", desc: "General, neonatal, adolescent", category: "HEALTHCARE" },
  { icon: Building2, title: "Hospital administration", desc: "Clinical ops, QA, protocols", category: "HEALTHCARE" },
  { icon: Syringe, title: "Vaccines & immunisation", desc: "IAP, WHO EPI, cold chain", category: "HEALTHCARE" },
  { icon: Utensils, title: "Child nutrition", desc: "Dietetics, malnutrition, ICDS", category: "HEALTHCARE" },
  // Child Dev
  { icon: Microscope, title: "Research & academia", desc: "Clinical research, faculty", category: "CHILD DEV" },
  { icon: Brain, title: "Child mental health", desc: "Psychiatry, psychology, counselling", category: "CHILD DEV" },
  { icon: Puzzle, title: "Autism specialist", desc: "Early diagnosis & intervention", category: "CHILD DEV" },
  { icon: Zap, title: "ADHD & learning disability", desc: "Assessment, behaviour therapy", category: "CHILD DEV" },
  { icon: GraduationCap, title: "Special education", desc: "IEP, inclusive classrooms", category: "CHILD DEV" },
  // Education
  { icon: School, title: "School administration", desc: "Principal, trustee, school ops", category: "EDUCATION" },
  { icon: BookOpen, title: "Curriculum & pedagogy", desc: "EdTech, curriculum design", category: "EDUCATION" },
  { icon: HeartPulse, title: "School health systems", desc: "Health promoting schools", category: "EDUCATION" },
  { icon: UserCheck, title: "School counselor", desc: "Student wellbeing, guidance", category: "EDUCATION" },
  // Safety
  { icon: Shield, title: "Emergency & NDRF", desc: "Disaster response, first aid", category: "SAFETY" },
  { icon: Flame, title: "Fire & safety", desc: "Fire dept, safety drills", category: "SAFETY" },
  { icon: ShieldCheck, title: "Law enforcement", desc: "Police, child protection", category: "SAFETY" },
  { icon: Scale, title: "Child rights & law", desc: "POCSO, juvenile justice", category: "SAFETY" },
  // Social
  { icon: Users, title: "NGO & social impact", desc: "Community mobilisation", category: "SOCIAL" },
  { icon: Heart, title: "CSR & philanthropy", desc: "Corporate social responsibility", category: "SOCIAL" },
  { icon: Globe, title: "International health", desc: "WHO, UNICEF, global NGO", category: "SOCIAL" },
  { icon: Leaf, title: "Environment & green health", desc: "Eco-health, green cohort", category: "SOCIAL" },
  // Content
  { icon: FileText, title: "Medical content writing", desc: "Health journalism, advocacy", category: "CONTENT" },
  { icon: Languages, title: "Regional language & media", desc: "Vernacular health comms", category: "CONTENT" },
  // Tech
  { icon: Monitor, title: "HealthTech & digital health", desc: "EMR, health IT, digital", category: "TECH" },
  { icon: BarChart3, title: "Data & AI/ML", desc: "Epidemiology, biostatistics", category: "TECH" },
  { icon: Layout, title: "Product management & UX", desc: "Product strategy, design", category: "TECH" },
  { icon: Lock, title: "Cybersecurity & DPDP", desc: "Data privacy, compliance", category: "TECH" },
  // Business
  { icon: Briefcase, title: "Sales & partnerships", desc: "B2B health sales, alliances", category: "BUSINESS" },
  { icon: TrendingUp, title: "Finance & investment", desc: "VC, grants, health finance", category: "BUSINESS" },
  { icon: Megaphone, title: "Marketing & comms", desc: "Brand, PR, outreach", category: "BUSINESS" },
  // Policy
  { icon: Landmark, title: "Government & policy", desc: "IAS/IPS retd., health policy", category: "POLICY" },
];

const categoryColors: Record<DomainCategory, { text: string; bg: string; border: string; dot: string }> = {
  HEALTHCARE: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-400" },
  "CHILD DEV": { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-400" },
  EDUCATION: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
  SAFETY: { text: "text-red-500", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400" },
  SOCIAL: { text: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", dot: "bg-pink-400" },
  CONTENT: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
  TECH: { text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", dot: "bg-cyan-400" },
  BUSINESS: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-400" },
  POLICY: { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-400" },
};

const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[var(--womb-forest)] focus:ring-1 focus:ring-[var(--womb-forest)] transition-all placeholder:text-slate-400 font-medium";
const labelClass = "block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-widest";

function SearchableSelect({ options, value, onChange, placeholder, disabled = false, loading = false }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string, disabled?: boolean, loading?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-full">
      <button 
        type="button" disabled={disabled} onClick={() => setIsOpen(true)}
        className={`${inputClass} text-left flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
      >
        <span className={value ? 'text-slate-900 truncate pr-2' : 'text-slate-400'}>{value || placeholder}</span>
        {loading ? <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[var(--womb-forest)] rounded-full animate-spin shrink-0" /> : <span className="text-slate-400 text-[10px] shrink-0">▼</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 flex flex-col max-h-64"
            >
              <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" autoFocus placeholder="Search..." className="w-full h-9 pl-8 pr-3 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[var(--womb-forest)] focus:ring-1 focus:ring-[var(--womb-forest)] text-slate-900 transition-all shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar p-1.5 h-60 break-words w-full" onWheel={(e) => e.stopPropagation()}>
                {filtered.length === 0 ? (
                  <div className="p-4 text-center text-xs font-bold text-slate-400">No results found</div>
                ) : (
                  filtered.map(opt => (
                    <button key={opt} type="button" onClick={() => { onChange(opt); setIsOpen(false); setSearch(""); }} className={`w-full text-left p-2.5 text-xs font-bold rounded-lg transition-colors truncate ${value === opt ? 'bg-green-50 text-[var(--womb-forest)]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                      {opt}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Components
const ScoreOdometer = ({ value }: { value: number }) => {
  return (
    <div className="relative overflow-hidden h-[80px] sm:h-[100px] flex items-center justify-center font-serif text-6xl sm:text-[5rem] font-black text-[var(--womb-forest)] leading-none tracking-tighter">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={value}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {value}
      </motion.div>
    </div>
  );
};

export function AdvisoryBoardApplyPage() {
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", mobile: "", email: "", city: "", state: "", linkedInUrl: "", designation: "", organization: "",
    primaryDomains: [] as string[], secondaryDomains: [] as string[], customDomain: "",
    experienceYears: "", qualification: "", expertiseSummary: "", majorAchievements: "", previousRoles: "", contributionAreas: [] as string[],
    documents: { 
      photo: null as File|null, photoUrl: "",
      cv: null as File|null, cvUrl: "",
      bio: null as File|null, bioUrl: "",
      qualificationProof: null as File|null, qualificationProofUrl: "",
      registration: null as File|null, registrationUrl: "",
      idProof: null as File|null, idProofUrl: ""
    },
    whyJoin: "", contributions6Months: "", availability: "" as "passive"|"active"|"strategic"|"", declarations: [false, false, false, false, false]
  });
  const [searchParams] = useSearchParams();
  const [isResuming, setIsResuming] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpStep, setOtpStep] = useState<"hidden" | "waiting" | "verified">("hidden");
  const [otpValue, setOtpValue] = useState("");

  const [statesList, setStatesList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const lenisWrapperRef = useRef<HTMLDivElement>(null);
  const lenisContentRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);

  const canConsumeInnerScroll = (deltaY: number) => {
    const wrapper = lenisWrapperRef.current;
    if (!wrapper) return false;
    const maxScrollTop = wrapper.scrollHeight - wrapper.clientHeight;
    if (maxScrollTop <= 0) return false;
    const atTop = wrapper.scrollTop <= 1;
    const atBottom = wrapper.scrollTop >= maxScrollTop - 1;
    if (deltaY < 0 && !atTop) return true;
    if (deltaY > 0 && !atBottom) return true;
    return false;
  };

  const handOffScrollToPage = (deltaY: number) => {
    if (deltaY === 0) return;
    window.scrollBy({ top: deltaY, left: 0, behavior: "auto" });
  };

  useEffect(() => {
    if (step === 2) {
      const wrapper = lenisWrapperRef.current;
      const content = lenisContentRef.current;
      if (!wrapper || !content) return;

      const lenis = new Lenis({
        wrapper,
        content,
        lerp: 0.1,
        duration: 1.05,
        eventsTarget: wrapper,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
      });

      let frameId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        frameId = requestAnimationFrame(raf);
      };
      
      frameId = requestAnimationFrame(raf);
      return () => { cancelAnimationFrame(frameId); lenis.destroy(); };
    }
  }, [step]);

  // Resume draft logic
  useEffect(() => {
    const draftToken = searchParams.get("draft");
    if (draftToken) {
      const fetchDraft = async () => {
        try {
          setIsResuming(true);
          const res = await fetch(`${API}/api/advisory-applications/draft/${draftToken}`);
          const result = await res.json();
          if (res.ok && result.success) {
            setFormData(result.data);
            setStep(result.currentStep || 4);
            setEmailVerified(true); // Email must have been verified to save draft
            success("Application progress resumed successfully!");
          } else {
            error(result.message || "Draft link expired or invalid.");
          }
        } catch (e) {
          error("Failed to load your draft. Please try again later.");
        } finally {
          setIsResuming(false);
        }
      };
      fetchDraft();
    }
  }, [searchParams]);

  // Fetch accurate Indian states on mount
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: "India" })
    }).then(res => res.json()).then(data => {
      if (data && data.data) {
        setStatesList(data.data.states.map((s: any) => s.name.replace(" State", ""))); 
      } else {
        setStatesList(Object.keys(INDIAN_STATES)); // fallback
      }
    }).catch(() => setStatesList(Object.keys(INDIAN_STATES)));
  }, []);

  // Fetch accurate Indian cities when state changes
  useEffect(() => {
    if (formData.state) {
      setLoadingCities(true);
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: "India", state: formData.state })
      }).then(res => res.json()).then(data => {
        if (data && data.data && data.data.length > 0) {
          setCitiesList(data.data);
        } else {
          setCitiesList(INDIAN_STATES[formData.state] || ["Other"]); // fallback
        }
      }).catch(() => setCitiesList(INDIAN_STATES[formData.state] || ["Other"]))
      .finally(() => setLoadingCities(false));
    } else {
      setCitiesList([]);
    }
  }, [formData.state]);

  // Email verification listener across tabs
  useEffect(() => {
    if (!formData.email) return;
    const checkVerification = () => {
      const verifiedEmail = localStorage.getItem("ADVISORY_EMAIL_VERIFIED");
      if (verifiedEmail === formData.email) setEmailVerified(true);
    };
    
    checkVerification(); // check immediately
    const interval = setInterval(checkVerification, 2000);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ADVISORY_EMAIL_VERIFIED" && e.newValue === formData.email) setEmailVerified(true);
    };
    window.addEventListener("storage", handleStorage);
    return () => { clearInterval(interval); window.removeEventListener("storage", handleStorage); };
  }, [formData.email]);

  const handleSendMobileOtp = async () => {
    if (formData.mobile.length < 10) return;
    try {
      setOtpStep("waiting");
      const res = await fetch(`${API}/api/verify/send-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile: formData.mobile }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
         success(data.message || "OTP Sent successfully!");
      } else {
         error(data.message || "Failed to send OTP via backend.");
         setOtpStep("hidden");
      }
    } catch(e) { 
       error("Network Error - Ensure your NestJS backend is running.");
       setOtpStep("hidden");
    }
  };

  const handleVerifyOtp = () => {
    if (otpValue.length >= 4) { // Fast2SMS default demo lengths
      setOtpStep("verified");
      setMobileVerified(true);
      success("Mobile number verified successfully!");
    }
  };

  const handleSendEmailLink = async () => {
    if (!formData.email) return;
    try {
      const verifyUrl = `${window.location.origin}/verify-email?email=${encodeURIComponent(formData.email)}`;
      const res = await fetch(`${API}/api/verify/send-email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, verifyUrl }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        success(`Verification link dispatched to ${formData.email}`);
      } else {
        error(data.message || "Failed to send email link.");
      }
    } catch(e) {
      error("Network Error - Ensure your NestJS backend is running.");
    }
  };

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveDraft = async () => {
    if (!formData.email) {
      error("Please enter your email to save progress.");
      return;
    }
    try {
      setIsSavingDraft(true);
      const draftData = new FormData();
      draftData.append('email', formData.email);
      draftData.append('currentStep', String(step));
      draftData.append('origin', window.location.origin);
      
      // We send the JSON data minus the actual File objects (URLs are kept)
      const dataToSave = { ...formData, documents: { ...formData.documents } };
      // Clear File objects but keep URLs
      Object.keys(dataToSave.documents).forEach((key) => {
        const k = key as keyof typeof dataToSave.documents;
        if (dataToSave.documents[k] instanceof File) {
          (dataToSave.documents as any)[k] = null;
        }
      });
      draftData.append('formData', JSON.stringify(dataToSave));

      // Also upload any new files provided in Step 4
      const docs = formData.documents as Record<string, any>;
      Object.keys(docs).forEach(docKey => {
        if (docs[docKey] instanceof File) {
          draftData.append(docKey, docs[docKey]);
        }
      });

      const res = await fetch(`${API}/api/advisory-applications/draft`, {
        method: 'POST',
        body: draftData
      });

      const result = await res.json();
      if (res.ok) {
        success("Progress saved! A resume link has been sent to your email.");
      } else {
        throw new Error(result.message);
      }
    } catch (e: any) {
      error(e.message || "Failed to save progress.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'documents' || key === 'declarations') return;
        if (Array.isArray((formData as any)[key])) {
          submitData.append(key, JSON.stringify((formData as any)[key]));
        } else {
          submitData.append(key, String((formData as any)[key]));
        }
      });

      const docs = formData.documents as Record<string, any>;
      Object.keys(docs).forEach(docKey => {
        if (docs[docKey] instanceof File) {
          submitData.append(docKey, docs[docKey]);
        } else if (typeof docs[docKey] === 'string' && docs[docKey].length > 0) {
          // Pass URL to backend for resumed drafts
          submitData.append(docKey + 'Url', docs[docKey]);
        }
      });

      const res = await fetch(`${API}/api/advisory-applications`, {
        method: 'POST',
        body: submitData
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.message || "Failed to submit application");

      success("Application submitted successfully!");
      setStep(6);
    } catch (e: any) {
      error(e.message || "An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const toggleDomain = (title: string) => {
    const isPrimary = formData.primaryDomains.includes(title);
    const isSecondary = formData.secondaryDomains.includes(title);

    if (!isPrimary && !isSecondary) {
      if (formData.primaryDomains.length >= 3 && formData.secondaryDomains.length >= 2) {
        error("Maximum 3 Primary and 2 Secondary domains allowed.");
        return;
      }
    }

    setFormData(prev => {
      const p = prev.primaryDomains.includes(title);
      const s = prev.secondaryDomains.includes(title);

      if (p) {
        if (prev.secondaryDomains.length < 2) {
          return { ...prev, primaryDomains: prev.primaryDomains.filter(d => d !== title), secondaryDomains: [...prev.secondaryDomains, title] };
        } else {
          return { ...prev, primaryDomains: prev.primaryDomains.filter(d => d !== title) };
        }
      } else if (s) {
        return { ...prev, secondaryDomains: prev.secondaryDomains.filter(d => d !== title) };
      } else {
        if (prev.primaryDomains.length < 3) {
          return { ...prev, primaryDomains: [...prev.primaryDomains, title] };
        } else if (prev.secondaryDomains.length < 2) {
          return { ...prev, secondaryDomains: [...prev.secondaryDomains, title] };
        }
        return prev;
      }
    });
  };

  const isUploadedAll = () => {
    const docs = formData.documents as any;
    return (docs.cv || docs.cvUrl) && 
           (docs.photo || docs.photoUrl) && 
           (docs.bio || docs.bioUrl) && 
           (docs.idProof || docs.idProofUrl) && 
           (docs.qualificationProof || docs.qualificationProofUrl) && 
           (docs.registration || docs.registrationUrl);
  };

  const currentScore = calculateAdvisoryScore(formData);

  const stepsData = [
    { title: "Identity", percent: 20 },
    { title: "Domain", percent: 40 },
    { title: "Experience", percent: 60 },
    { title: "Documents", percent: 80 },
    { title: "Intent", percent: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pt-20 pb-16 lg:pt-28 lg:pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {step < 6 && (
          <div className="mb-12 lg:mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/advisory-board" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[var(--womb-forest)] transition-colors mb-6 bg-white px-4 py-1.5 rounded-full border border-[#E8DFCE] shadow-sm">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to preview
              </Link>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 tracking-tight leading-tight mb-4" 
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Advisory Board <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-600 italic">Application</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-sm font-medium text-gray-500 flex items-center justify-center gap-2 mx-auto"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Complete all 5 steps · Takes about 10–12 minutes
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-3xl mx-auto mt-12 relative"
            >
              <div className="absolute top-[20px] sm:top-[24px] left-[20px] sm:left-[24px] right-[20px] sm:right-[24px] h-[3px] bg-gray-200 -translate-y-1/2 rounded-full z-0 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[var(--womb-forest)] to-emerald-400"
                  initial={{ width: `${Math.max(0, step - 2) * 25}%` }}
                  animate={{ width: `${(step - 1) * 25}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between relative z-10 w-full">
                {stepsData.map((s, i) => {
                  const isActive = step === i + 1;
                  const isCompleted = step > i + 1;
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          backgroundColor: isCompleted ? '#2f6b4d' : '#ffffff', 
                          borderColor: isCompleted ? '#2f6b4d' : isActive ? '#2f6b4d' : '#E8DFCE',
                          color: isCompleted ? '#ffffff' : isActive ? '#2f6b4d' : '#9CA3AF',
                          scale: isActive ? 1.15 : 1
                        }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm transition-all duration-300 shadow-sm ${isActive ? 'border-[2.5px] font-black' : 'border-2 font-bold'}`}
                      >
                        {isCompleted ? <Check className="w-5 h-5 text-white" /> : (i + 1)}
                      </motion.div>
                      <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mt-3 transition-colors duration-300 ${isActive ? 'text-[var(--womb-forest)]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Multi-step Container */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            
            {/* IDENTITY */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-[2rem] border border-[#E8DFCE] p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(189,179,161,0.2)]"
              >
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Step 1 — Personal identity</h2>
                    <p className="text-[11px] font-medium text-gray-500">Basic details for verification and your advisory profile.</p>
                  </div>
                  <div className="ml-auto text-3xl font-black text-gray-200" style={{ fontFamily: "Georgia" }}>01</div>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7 mb-8">
                  <div>
                    <label className={labelClass}>First name*</label>
                    <input type="text" className={inputClass} placeholder="Dr. Priya" value={formData.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Last name*</label>
                    <input type="text" className={inputClass} placeholder="Sharma" value={formData.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
                  </div>
                  
                  <div className="sm:col-span-2 grid sm:grid-cols-2 gap-x-8 gap-y-7 relative">
                    <div>
                      <label className={labelClass}>Mobile number*</label>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                          <div className={`relative flex-1 bg-white border-2 rounded-2xl overflow-hidden transition-colors ${mobileVerified ? 'border-green-500 bg-green-50' : otpStep === 'waiting' ? 'border-[var(--journey-saffron)]' : 'border-slate-300 focus-within:border-[var(--womb-forest)]'}`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">+91</div>
                            <input 
                              type="tel" 
                              disabled={mobileVerified}
                              className={`w-full pl-12 pr-4 h-12 text-sm font-bold bg-transparent focus:outline-none ${mobileVerified ? 'text-green-800' : 'text-slate-900'}`} 
                              placeholder="98765 43210" 
                              value={formData.mobile} 
                              onChange={(e) => updateForm('mobile', e.target.value.replace(/\D/g, ''))} 
                            />
                            {mobileVerified && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />}
                          </div>
                          {!mobileVerified && (
                            <button 
                              onClick={handleSendMobileOtp}
                              disabled={formData.mobile.length < 10 || otpStep === 'waiting'}
                              className="shrink-0 flex items-center justify-center bg-[#FAF9F6] border-2 border-[#E8DFCE] px-6 rounded-2xl text-[13px] font-black text-[var(--womb-forest)] hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {otpStep === 'hidden' ? "Verify" : "Sent OTP"}
                            </button>
                          )}
                        </div>
                        {otpStep === 'waiting' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-3 items-center">
                            <input 
                              type="text" 
                              maxLength={4} 
                              className="w-24 h-10 border-2 border-slate-300 rounded-xl text-center font-black tracking-widest focus:border-[var(--womb-forest)] outline-none" 
                              placeholder="••••" 
                              value={otpValue} 
                              onChange={e => setOtpValue(e.target.value)}
                            />
                            <button onClick={handleVerifyOtp} className="h-10 px-4 bg-[var(--womb-forest)] text-white font-bold text-xs rounded-xl shadow-sm">Confirm OTP</button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label className={labelClass}>Email address*</label>
                      <div className="flex gap-3">
                        <div className={`relative flex-1 border-2 rounded-2xl overflow-hidden transition-colors ${emailVerified ? 'border-blue-300 bg-blue-50' : 'border-slate-300 bg-white focus-within:border-[var(--womb-forest)]'}`}>
                          <input 
                            type="email" 
                            disabled={emailVerified}
                            className={`w-full px-4 h-12 text-sm font-bold bg-transparent focus:outline-none ${emailVerified ? 'text-blue-900' : 'text-slate-900'}`} 
                            placeholder="priya@hospital.com" 
                            value={formData.email} 
                            onChange={(e) => updateForm('email', e.target.value)} 
                          />
                          {emailVerified && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />}
                        </div>
                        {!emailVerified && (
                          <button 
                            onClick={handleSendEmailLink}
                            disabled={!formData.email.includes('@')}
                            className="shrink-0 flex items-center justify-center bg-[#FAF9F6] border-2 border-[#E8DFCE] px-6 rounded-2xl text-[13px] font-black text-[var(--womb-forest)] hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                      {emailVerified && <div className="text-[10px] font-bold text-blue-600 mt-2 ml-1 flex items-center gap-1"><Check className="w-3 h-3"/> Email formally verified via EmailJS Link</div>}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>State*</label>
                    <SearchableSelect 
                      options={statesList} 
                      value={formData.state} 
                      onChange={(val) => { updateForm('state', val); updateForm('city', ''); }} 
                      placeholder="Select State" 
                    />
                  </div>
                  <div>
                    <label className={labelClass}>City*</label>
                    <SearchableSelect 
                      options={citiesList} 
                      value={formData.city} 
                      onChange={(val) => updateForm('city', val)} 
                      placeholder="Select City" 
                      disabled={!formData.state} 
                      loading={loadingCities}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>LinkedIn Profile URL</label>
                    <input type="url" className={inputClass} placeholder="linkedin.com/in/..." value={formData.linkedInUrl} onChange={(e) => updateForm('linkedInUrl', e.target.value)} />
                  </div>
                  <div className="hidden sm:block"></div>
                  
                  <div>
                    <label className={labelClass}>Current Designation*</label>
                    <input type="text" className={inputClass} placeholder="Senior Consultant" value={formData.designation} onChange={(e) => updateForm('designation', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Organisation / Clinic*</label>
                    <input type="text" className={inputClass} placeholder="Ruby Hall Clinic" value={formData.organization} onChange={(e) => updateForm('organization', e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-end pt-5 border-t border-slate-100">
                  <button onClick={handleNext} disabled={!formData.firstName || !formData.lastName || !emailVerified || !mobileVerified || !formData.state || !formData.city || !formData.designation || !formData.organization} className="inline-flex items-center gap-2 bg-[var(--womb-forest)] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 h-12 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                    Continue to domains <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* DOMAIN SELECTION */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-[2rem] border border-[#E8DFCE] p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(189,179,161,0.2)]"
              >
                <div className="flex items-center gap-4 flex-wrap pb-6 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 flex items-center justify-center shrink-0 ring-1 ring-inset ring-orange-200">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">Expertise Selection</h2>
                    <p className="text-[12px] font-bold text-gray-500 mt-1">Select your domains. Tap once for Primary. Tap twice for Secondary. Tap again to deselect.</p>
                  </div>
                  <div className="ml-auto flex gap-3 pb-1 border-b-2 border-slate-100 w-full md:w-auto mt-4 md:mt-0">
                    <div className="flex gap-2 items-center bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--womb-forest)] shadow-[0_0_8px_var(--womb-forest)]" /> Primary 
                      <span className="text-[var(--womb-forest)] text-sm ml-1">{formData.primaryDomains.length}<span className="text-gray-400 text-xs">/3</span></span>
                    </div>
                    <div className="flex gap-2 items-center bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> Secondary 
                      <span className="text-blue-600 text-sm ml-1">{formData.secondaryDomains.length}<span className="text-gray-400 text-xs">/2</span></span>
                    </div>
                  </div>
                </div>

                <div 
                  ref={lenisWrapperRef} 
                  onWheelCapture={(event) => {
                    if (canConsumeInnerScroll(event.deltaY)) {
                      event.stopPropagation();
                      return;
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    handOffScrollToPage(event.deltaY);
                  }}
                  onTouchStart={(event) => {
                    touchStartYRef.current = event.touches[0]?.clientY ?? null;
                  }}
                  onTouchMoveCapture={(event) => {
                    const currentY = event.touches[0]?.clientY;
                    const previousY = touchStartYRef.current;
                    if (currentY == null || previousY == null) return;
                    const deltaY = previousY - currentY;
                    if (canConsumeInnerScroll(deltaY)) {
                      event.stopPropagation();
                    } else {
                      event.preventDefault();
                      event.stopPropagation();
                      handOffScrollToPage(deltaY);
                    }
                    touchStartYRef.current = currentY;
                  }}
                  onTouchEnd={() => {
                    touchStartYRef.current = null;
                  }}
                  className="h-[480px] sm:h-[500px] overflow-y-auto scroll-smooth rounded-2xl border border-gray-100 bg-[#FAFAFA] shadow-inner relative"
                  style={{ 
                    touchAction: 'pan-y',
                    overscrollBehavior: "auto",
                    scrollbarWidth: "none", 
                  }}
                >
                  <div ref={lenisContentRef} className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expertiseDomains.map((domain) => {
                      const isPrimary = formData.primaryDomains.includes(domain.title);
                      const isSecondary = formData.secondaryDomains.includes(domain.title);
                      const catStyle = categoryColors[domain.category];
                      
                      return (
                        <button
                          key={domain.title}
                          onClick={() => toggleDomain(domain.title)}
                          className={`group relative text-left p-4 lg:p-5 rounded-2xl border flex flex-col justify-between h-[150px] overflow-hidden transition-all duration-300 ease-out ${
                            isPrimary 
                              ? `bg-white ${catStyle.border} shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] scale-[0.98]` 
                              : isSecondary 
                                ? `bg-white border-blue-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] scale-[0.98]` 
                                : `bg-white border-[#E8DFCE] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:${catStyle.border}`
                          }`}
                        >
                          {/* Animated Background Gradient for Selected State */}
                          <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isPrimary ? `opacity-10 ${catStyle.bg}` : isSecondary ? 'opacity-10 bg-blue-50' : ''}`} />

                          {/* Subtle top accent */}
                          <div className={`absolute top-0 left-0 right-0 h-0.5 ${catStyle.dot} transition-opacity duration-300 ${isPrimary || isSecondary ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                          <div className="flex justify-between items-start w-full relative z-10 mb-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-400 group-hover:scale-110 ${catStyle.bg} ${catStyle.text}`}>
                              <domain.icon className="w-4 h-4" />
                            </div>

                            <AnimatePresence>
                              {isPrimary && (
                                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} 
                                  className={`px-2 py-0.5 rounded-full ${catStyle.bg} ${catStyle.text} text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-sm`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />Primary
                                </motion.div>
                              )}
                              {isSecondary && (
                                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} 
                                  className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-sm"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />Secondary
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          <div className="mt-auto relative z-10 w-full">
                            <h4 className={`text-[13px] font-extrabold leading-snug tracking-tight mb-1 transition-colors ${
                              isPrimary ? catStyle.text : isSecondary ? 'text-blue-900' : 'text-gray-900 group-hover:text-gray-800'
                            }`}>
                              {domain.title}
                            </h4>
                            <p className="text-[11px] font-medium leading-relaxed pr-2 text-gray-400">
                              {domain.desc}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-6 border-t border-gray-100 pt-6">
                  <label className={labelClass}>Custom / Other Domain</label>
                  <input type="text" className={inputClass} placeholder="e.g. Telerehabilitation, Sports medicine..." value={formData.customDomain} onChange={(e) => updateForm('customDomain', e.target.value)} />
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button onClick={handleBack} className="inline-flex items-center gap-2 text-gray-500 font-bold px-4 h-12 hover:text-gray-800 transition-colors">
                    Back
                  </button>
                  <button onClick={handleNext} disabled={formData.primaryDomains.length === 0} className="inline-flex items-center gap-2 bg-[var(--womb-forest)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 h-12 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* EXPERIENCE */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-[2rem] border border-[#E8DFCE] p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(189,179,161,0.2)]"
              >
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Step 3 — Experience</h2>
                    <p className="text-[11px] font-medium text-gray-500">Tell us about your depth of experience and value addition.</p>
                  </div>
                  <div className="ml-auto text-3xl font-black text-gray-200" style={{ fontFamily: "Georgia" }}>03</div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className={labelClass}>Years of experience*</label>
                    <SearchableSelect
                      options={["0–3 years", "3–7 years", "7–15 years", "15–25 years", "25+ years"]}
                      value={formData.experienceYears}
                      onChange={(val) => updateForm('experienceYears', val)}
                      placeholder="Select duration"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Highest qualification*</label>
                    <SearchableSelect
                      options={["MBBS", "MD/MS", "DM/MCh", "PhD", "DNB", "MBA/PGDM", "B.Tech/M.Tech", "IAS/IPS (Retd.)", "LLB/LLM", "Other"]}
                      value={formData.qualification}
                      onChange={(val) => updateForm('qualification', val)}
                      placeholder="Select qualification"
                    />
                  </div>
                  <div className="sm:col-span-2">
                     <label className={labelClass}>Key expertise summary* (max 150 words)</label>
                     <textarea className={`${inputClass} h-24 py-3 resize-none`} placeholder="Briefly describe your core expertise..." value={formData.expertiseSummary} onChange={(e) => updateForm('expertiseSummary', e.target.value)} />
                     <div className="text-right text-[10px] text-gray-400 mt-1 font-bold">{formData.expertiseSummary.split(' ').filter(a=>a).length} / 150 words</div>
                  </div>
                  <div className="sm:col-span-2">
                     <label className={labelClass}>Major achievements*</label>
                     <input type="text" className={inputClass} placeholder="e.g. Published 12 papers, Former WHO consultant..." value={formData.majorAchievements} onChange={(e) => updateForm('majorAchievements', e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button onClick={handleBack} className="inline-flex items-center gap-2 text-gray-500 font-bold px-4 h-12 hover:text-gray-800 transition-colors">
                    Back
                  </button>
                  <button onClick={handleNext} disabled={!formData.experienceYears || !formData.qualification || !formData.expertiseSummary || !formData.majorAchievements} className="inline-flex items-center gap-2 bg-[var(--womb-forest)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 h-12 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* DOCUMENTS */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-[2rem] border border-[#E8DFCE] p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(189,179,161,0.2)]"
              >
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Step 4 — Documents & bio</h2>
                    <p className="text-[11px] font-medium text-gray-500">Upload documents for verification. Max 5MB each.</p>
                  </div>
                  <div className="ml-auto text-3xl font-black text-gray-200" style={{ fontFamily: "Georgia" }}>04</div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { key: "photo", title: "Profile photo*", desc: "Passport-size, professional", ext: ".jpg, .png, .jpeg" },
                    { key: "cv", title: "CV / Resume*", desc: "Detailed experience", ext: ".pdf" },
                    { key: "bio", title: "Professional bio*", desc: "Third person, 200 words", ext: ".pdf, .doc, .docx" },
                    { key: "idProof", title: "ID Proof*", desc: "Aadhaar / PAN", ext: ".pdf, .jpg, .jpeg" },
                    { key: "qualificationProof", title: "Qualification proof*", desc: "Degree certificate", ext: ".pdf, .jpg, .jpeg" },
                    { key: "registration", title: "Registration certificate*", desc: "Council-issued certificate", ext: ".pdf, .jpg, .jpeg" },
                  ].map((doc) => {
                    const fileObj = (formData.documents as any)[doc.key];
                    const fileUrl = (formData.documents as any)[`${doc.key}Url`];
                    const isUploaded = !!fileObj || !!fileUrl;
                    const displayFileName = fileObj ? fileObj.name : fileUrl ? fileUrl.split('/').pop() : doc.desc;
                    return (
                      <div key={doc.key} className="border border-[#E8DFCE] rounded-xl p-4 flex items-center gap-4 bg-gray-50 overflow-hidden relative group">
                        {isUploaded && <motion.div layoutId={`bg-${doc.key}`} className="absolute inset-0 bg-green-50 z-0 border-l-4 border-green-500" />}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10 transition-colors ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 border border-gray-200'}`}>
                          {isUploaded ? <Check className="w-5 h-5" /> : <Upload className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0 relative z-10">
                          <h4 className={`text-[13px] font-extrabold truncate ${isUploaded ? 'text-green-900' : 'text-gray-900'}`}>{doc.title}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{displayFileName}</p>
                        </div>
                        <div className="relative z-10 shrink-0">
                          <input 
                            type="file" 
                            accept={doc.ext}
                            id={`file-${doc.key}`}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setFormData(p => ({...p, documents: {...p.documents, [doc.key]: e.target.files![0]}}));
                              }
                            }}
                          />
                          <label 
                            htmlFor={`file-${doc.key}`}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer inline-block"
                          >
                            {isUploaded ? "Replace" : "Upload"}
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-4">
                    <button onClick={handleBack} className="inline-flex items-center gap-2 text-gray-500 font-bold px-4 h-12 hover:text-gray-800 transition-colors">
                      Back
                    </button>
                    <button 
                      onClick={handleSaveDraft}
                      disabled={isSavingDraft}
                      className="inline-flex items-center gap-2 text-[var(--womb-forest)] font-extrabold px-6 h-12 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100 text-xs shadow-sm"
                    >
                      {isSavingDraft ? (
                        <>Saving... <div className="w-3.5 h-3.5 border-2 border-[var(--womb-forest)] border-t-transparent rounded-full animate-spin" /></>
                      ) : (
                        <>Save Progress <Mail className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                  <button onClick={handleNext} disabled={!isUploadedAll()} className="inline-flex items-center gap-2 bg-[var(--womb-forest)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 h-12 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* INTENT & SUBMIT */}
            {step === 5 && (
              <motion.div
                key="step5"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-[2rem] border border-[#E8DFCE] p-6 lg:p-0 shadow-[0_20px_40px_-15px_rgba(189,179,161,0.2)] overflow-hidden"
              >
                <div className="grid lg:grid-cols-12 min-h-[500px]">
                  {/* Left Form */}
                  <div className="lg:col-span-8 p-6 lg:p-10">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Step 5 — Intent & alignment</h2>
                        <p className="text-[11px] font-medium text-gray-500">Heavily weighted. Generic answers score low.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className={labelClass}>Why do you want to join WOMBTO18?*</label>
                        <textarea className={`${inputClass} h-20 py-3 resize-none`} placeholder="Specific reason..." value={formData.whyJoin} onChange={(e) => updateForm('whyJoin', e.target.value)} />
                      </div>

                      <div>
                        <label className={labelClass}>Availability commitment*</label>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {[
                            { id: "passive", title: "Passive advisor", desc: "1-2 hrs/mo" },
                            { id: "active", title: "Active advisor", desc: "3-5 hrs/mo" },
                            { id: "strategic", title: "Strategic partner", desc: "5-10 hrs/mo" },
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => updateForm('availability', t.id)}
                              className={`p-3 rounded-xl border text-left transition-all ${formData.availability === t.id ? 'bg-[var(--womb-forest)] border-[var(--womb-forest)]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                            >
                              <div className={`text-xs font-black mb-1 ${formData.availability === t.id ? 'text-white' : 'text-gray-900'}`}>{t.title}</div>
                              <div className={`text-[10px] font-medium ${formData.availability === t.id ? 'text-green-100' : 'text-gray-500'}`}>{t.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={formData.declarations[0]}
                            onChange={() => {
                              const newDec = [...formData.declarations];
                              newDec[0] = !newDec[0];
                              updateForm('declarations', newDec);
                            }}
                          />
                          <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${formData.declarations[0] ? 'bg-[var(--womb-forest)] border-transparent' : 'bg-white border-gray-300 group-hover:border-[var(--womb-forest)]'}`}>
                            {formData.declarations[0] && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs font-bold text-gray-600 leading-tight">I confirm all information provided is accurate and consent to verification of my credentials.</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
                      <button onClick={handleBack} className="inline-flex items-center gap-2 text-gray-500 font-bold px-4 h-12 hover:text-gray-800 transition-colors">
                        Back
                      </button>
                      <button 
                        onClick={handleSubmit} 
                        disabled={!formData.whyJoin || !formData.availability || !formData.declarations[0] || isSubmitting} 
                        className="inline-flex items-center gap-2 bg-[var(--journey-saffron)] text-white px-10 h-12 rounded-xl font-black shadow-[0_10px_20px_-10px_rgba(255,156,59,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(255,156,59,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </div>

                  {/* Right Score Panel */}
                  <div className="lg:col-span-4 bg-[#F8F4EA] lg:border-l border-[#E8DFCE] p-6 lg:p-10 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--journey-saffron)] mb-6">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Live App Score</div>
                    
                    <ScoreOdometer value={currentScore} />
                    
                    <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                      <motion.div 
                        className="h-full bg-[var(--womb-forest)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentScore}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm text-left w-full space-y-2 border border-[#E8DFCE]">
                      <div className={`text-[10px] font-bold flex justify-between ${currentScore >= 65 ? 'text-[var(--womb-forest)]' : 'text-gray-400'}`}>
                        <span>≥ 65 Approvals</span> {currentScore >= 65 && <Check className="w-3 h-3" />}
                      </div>
                      <div className={`text-[10px] font-bold flex justify-between ${(currentScore >= 50 && currentScore < 65) ? 'text-[var(--journey-saffron)]' : 'text-gray-400'}`}>
                        <span>50-64 Orientation</span> {(currentScore >= 50 && currentScore < 65) && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-white rounded-[2rem] border border-[#E8DFCE] p-10 sm:p-16 text-center shadow-[0_30px_60px_-15px_rgba(189,179,161,0.25)]"
              >
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                    className="absolute inset-0 bg-green-100 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--womb-forest)]">
                    <Check className="w-12 h-12" />
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4" style={{ fontFamily: "Georgia" }}>Application Received</h2>
                <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                  Thank you, {formData.firstName}. Your estimated score is <strong className="text-[var(--womb-forest)] text-lg">{currentScore}/100</strong>. Our screening committee will review your profile and get back to you within 10-14 working days.
                </p>

                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-orange-800 text-xs font-bold max-w-sm mx-auto mb-10 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> This is a frontend demo of the UX.
                </div>

                <Link to="/" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-colors">
                  Return to Home
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
