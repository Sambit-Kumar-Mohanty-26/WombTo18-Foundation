import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Linkedin,
  Loader2,
  Sparkles,
  Target,
  UserRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../lib/auth";
import { client } from "../../lib/api/client";
import { VOLUNTEER_SKILLS } from "../donate/donateData";
import { Button } from "../../components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SNjaYRsZlPUZpp";
const MIN_CONTRIBUTION = 500;
const MAX_CONTRIBUTION = 2000;

type OnboardingStep = 1 | 2 | 3;

type FormState = {
  city: string;
  profession: string;
  skills: string[];
  availability: string;
  linkedIn: string;
  motivation: string;
};

const AVAILABILITY_OPTIONS = [
  "Weekdays (9am-5pm)",
  "Weekday Evenings",
  "Weekends Only",
  "Flexible / Remote",
  "Full-time Volunteer",
];

export function VolunteerOnboarding() {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
  const session = auth.getSession();
  const donorId = session?.donorId || state.user?.donorId || "";
  const identifier = session?.identifier || state.user?.identifier || "";
  const contactName = session?.name || state.user?.name || identifier || "Volunteer";
  const contactMobile = session?.mobile || state.user?.mobile || "";

  const [step, setStep] = useState<OnboardingStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [contributionAmount, setContributionAmount] = useState<number | "">(MIN_CONTRIBUTION);
  const [form, setForm] = useState<FormState>({
    city: "",
    profession: "",
    skills: [],
    availability: "",
    linkedIn: "",
    motivation: "",
  });

  useEffect(() => {
    if (!session && !donorId) {
      navigate("/donor/login", { replace: true });
      return;
    }

    if (session?.role === "VOLUNTEER" && session.profileCompleted) {
      navigate(`/volunteer/${session.volunteerId || session.donorId}/dashboard`, { replace: true });
    }
  }, [session, donorId, navigate]);

  const selectedCount = form.skills.length;

  const canMoveNext = useMemo(() => {
    if (step === 1) {
      return !!form.city.trim() && !!form.profession.trim() && !!form.availability;
    }
    if (step === 2) {
      return form.skills.length > 0;
    }
    return !!form.motivation.trim();
  }, [step, form.city, form.profession, form.availability, form.skills.length, form.motivation]);

  const paymentAmount = useMemo(() => {
    const amount = Number(contributionAmount);
    return Number.isFinite(amount) && amount >= MIN_CONTRIBUTION && amount <= MAX_CONTRIBUTION
      ? amount
      : MIN_CONTRIBUTION;
  }, [contributionAmount]);

  const paymentCredits = useMemo(() => paymentAmount.toLocaleString("en-IN"), [paymentAmount]);

  const canSubmit = canMoveNext && !!donorId && !!identifier && paymentAmount >= MIN_CONTRIBUTION && paymentAmount <= MAX_CONTRIBUTION;

  const setField = (key: keyof FormState, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((item) => item !== skill)
        : [...prev.skills, skill],
    }));
  };

  const createVolunteerProfile = async () => {
    if (!donorId) {
      throw new Error("We could not find your donor profile. Please sign in again.");
    }

    const response = await client.post<any>("/volunteers/onboard", {
      donorId,
      city: form.city.trim(),
      profession: form.profession.trim(),
      skills: form.skills,
      availability: form.availability,
      linkedIn: form.linkedIn.trim() || undefined,
      motivation: form.motivation.trim(),
    });

    const currentSession = auth.getSession();
    auth.saveVolunteerSession({
      identifier,
      donorId,
      volunteerId: response?.volunteerId || undefined,
      name: currentSession?.name || state.user?.name || contactName,
      mobile: currentSession?.mobile || state.user?.mobile || contactMobile || undefined,
      profileCompleted: true,
    });

    dispatch({
      type: "UPDATE_ROLE",
      payload: {
        role: "VOLUNTEER",
        donorId,
        volunteerId: response?.volunteerId,
        profileCompleted: true,
      },
    });

    return response;
  };

  const handlePaymentAndSubmit = async () => {
    if (!form.city.trim() || !form.profession.trim() || !form.skills.length || !form.availability || !form.motivation.trim()) {
      toast.error("Please complete all onboarding fields.");
      return;
    }

    if (form.linkedIn.trim()) {
      try {
        new URL(form.linkedIn.trim());
      } catch {
        toast.error("Please enter a valid LinkedIn URL.");
        return;
      }
    }

    if (!donorId) {
      toast.error("We could not find your donor profile. Please sign in again.");
      navigate("/donor/login", { replace: true });
      return;
    }

    if (!identifier) {
      toast.error("We need your email or mobile details to start the payment.");
      return;
    }

    if (paymentAmount < MIN_CONTRIBUTION || paymentAmount > MAX_CONTRIBUTION) {
      toast.error(`Contribution must be between ₹${MIN_CONTRIBUTION} and ₹${MAX_CONTRIBUTION}.`);
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay) {
      toast.error("The secure payment gateway is still loading. Please try again in a moment.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await client.post<any>("/donations/create", {
        amount: paymentAmount,
        email: identifier,
        name: contactName,
        mobile: contactMobile,
        donorType: "INDIVIDUAL",
        programName: "Volunteer Membership",
        notes: `Volunteer onboarding contribution for ${form.motivation.trim()}`,
      });

      const options = {
        key: order.keyId || RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Womb-to18 Foundation",
        description: "Impact Volunteer Membership",
        order_id: order.orderId,
        prefill: {
          name: contactName,
          email: identifier,
          contact: contactMobile || undefined,
        },
        theme: { color: "#1D6E3F" },
        handler: async (response: any) => {
          try {
            const verifyRes = await client.post<{ success: boolean }>("/donations/verify", response);

            if (!verifyRes.success) {
              throw new Error("Payment verification failed.");
            }

            const profileResponse = await createVolunteerProfile();

            toast.success("Payment complete. Your volunteer profile is now active!");
            toast.success(`Welcome bonus unlocked: ${paymentCredits} credits added.`, {
              description: "Your volunteer onboarding is complete and ready to review.",
              duration: 6000,
            });

            navigate(`/volunteer/${profileResponse?.volunteerId || donorId}/dashboard`, { replace: true });
          } catch (error: any) {
            console.error("Volunteer payment verification failed:", error);
            toast.error(error?.message || "We could not verify your payment.");
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled.");
            setSubmitting(false);
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (error: any) {
      console.error("Volunteer payment initiation failed:", error);
      toast.error(error?.message || "We could not start the payment flow.");
      setSubmitting(false);
    }
  };

  const stepTitle =
    step === 1 ? "Professional background" : step === 2 ? "Skills and network" : "Motivation and contribution";

  const stepDescription =
    step === 1
      ? "Tell us where you work, where you are based, and when you can help."
      : step === 2
        ? "Choose the skills you want to contribute and share your LinkedIn profile."
        : "Share why you want to join, then complete the contribution to unlock your volunteer profile.";

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24 pb-12 sm:pt-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0faf4] via-[#fef6ed]/40 to-[#FFFDF7] pointer-events-none" />
      <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_65%)] opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[8%] w-[35%] h-[45%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_65%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
          <div className="lg:col-span-4 xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="sticky lg:top-32 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase border shadow-sm backdrop-blur-sm bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] border-[var(--womb-forest)]/20">
                <Sparkles className="w-3.5 h-3.5" /> Volunteer onboarding
              </div>

              <div>
                <h1 className="text-[2.3rem] sm:text-4xl lg:text-5xl text-gray-900 mb-4" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                  Complete your{" "}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500">
                    volunteer profile
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We will use this information to create your volunteer record and unlock your personalized volunteer dashboard.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Where you help", desc: "City, profession, and availability" },
                  { title: "What you bring", desc: "Skills and LinkedIn profile" },
                  { title: "Contribution & launch", desc: "Motivation, payment, and final profile setup" },
                ].map((item, index) => {
                  const active = step === index + 1;
                  return (
                    <div
                      key={item.title}
                      className={`p-4 rounded-2xl border transition-all duration-300 ${
                        active ? "bg-white shadow-[0_12px_30px_-20px_rgba(0,0,0,0.2)] border-emerald-200" : "bg-white/70 border-gray-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-[var(--womb-forest)] text-white" : "bg-gray-100 text-gray-500"}`}>
                          {active ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-gray-900">{item.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3">Signed in as</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-800">
                    <UserRound className="w-4 h-4 text-[var(--womb-forest)]" />
                    <span className="font-bold">{contactName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Globe className="w-4 h-4 text-amber-500" />
                    <span className="truncate">{identifier}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8 xl:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--womb-forest)]">Step {step} of 3</p>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1">{stepTitle}</h2>
                  <p className="text-sm text-gray-500 mt-1">{stepDescription}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  <Target className="w-4 h-4 text-amber-500" />
                  Full profile required
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${step >= s ? "bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500" : "bg-gray-100"}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.28 }}
                  className="space-y-5"
                >
                  {step === 1 && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="space-y-1.5">
                          <span className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">City</span>
                          <input
                            value={form.city}
                            onChange={(e) => setField("city", e.target.value)}
                            placeholder="Mumbai"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none transition-all"
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">Profession</span>
                          <input
                            value={form.profession}
                            onChange={(e) => setField("profession", e.target.value)}
                            placeholder="Doctor, engineer, teacher..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none transition-all"
                          />
                        </label>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-gray-400 tracking-wide uppercase mb-2">Availability</p>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABILITY_OPTIONS.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setField("availability", item)}
                              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                                form.availability === item
                                  ? "bg-[var(--womb-forest)] text-white border-[var(--womb-forest)] shadow-sm"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-[var(--womb-forest)]/30 hover:bg-[var(--womb-forest)]/5"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">Skills</p>
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-700">{selectedCount} selected</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {VOLUNTEER_SKILLS.map((skill) => {
                            const active = form.skills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                                  active
                                    ? "bg-[var(--womb-forest)] text-white border-[var(--womb-forest)] shadow-sm"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-[var(--womb-forest)]/30 hover:bg-[var(--womb-forest)]/5"
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <label className="space-y-1.5 block">
                        <span className="text-[11px] font-bold text-gray-400 tracking-wide uppercase flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn profile
                        </span>
                        <input
                          value={form.linkedIn}
                          onChange={(e) => setField("linkedIn", e.target.value)}
                          placeholder="https://www.linkedin.com/in/yourname"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none transition-all"
                        />
                      </label>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <label className="space-y-1.5 block">
                        <span className="text-[11px] font-bold text-gray-400 tracking-wide uppercase">Why do you want to join?</span>
                        <textarea
                          rows={6}
                          value={form.motivation}
                          onChange={(e) => setField("motivation", e.target.value)}
                          placeholder="Tell us what draws you to the mission and how you want to contribute."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:border-[var(--womb-forest)] focus:ring-2 focus:ring-[var(--womb-forest)]/10 outline-none transition-all resize-none"
                        />
                      </label>

                      <div className="grid sm:grid-cols-4 gap-3">
                        <div className="rounded-2xl bg-emerald-50/80 border border-emerald-100 p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-700/60">City</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{form.city || "—"}</p>
                        </div>
                        <div className="rounded-2xl bg-amber-50/80 border border-amber-100 p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-700/60">Availability</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{form.availability || "—"}</p>
                        </div>
                        <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-700/60">Skills</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{form.skills.length ? `${form.skills.length} selected` : "—"}</p>
                        </div>
                        <div className="rounded-2xl bg-violet-50/80 border border-violet-100 p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-violet-700/60">Contribution</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">₹{paymentCredits}</p>
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-[1.9rem] border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                        <div className="absolute right-0 top-0 rounded-bl-2xl bg-amber-500 px-4 py-1.5 text-[11px] font-black tracking-[0.16em] text-white">
                          100% WELCOME BONUS
                        </div>

                        <div className="p-5 sm:p-6 pt-8">
                          <div className="mb-5 flex items-center gap-3 pt-2">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                              <Zap className="h-5 w-5 fill-current" />
                            </div>
                            <div>
                              <h3 className="text-[17px] sm:text-lg font-black text-gray-900">Active Membership One-time Contribution</h3>
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">
                                Min: ₹{MIN_CONTRIBUTION} • Max: ₹{MAX_CONTRIBUTION}
                              </p>
                            </div>
                          </div>

                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">₹</span>
                            <input
                              type="number"
                              min={MIN_CONTRIBUTION}
                              max={MAX_CONTRIBUTION}
                              value={contributionAmount}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  setContributionAmount("");
                                  return;
                                }

                                setContributionAmount(Number(value));
                              }}
                              className="w-full pl-9 pr-4 py-4 rounded-xl border border-gray-100 bg-[#FAFAF8] text-xl font-black text-gray-900 outline-none transition-all focus:bg-white focus:border-amber-200 focus:ring-4 focus:ring-amber-50"
                              placeholder="500"
                            />
                          </div>

                          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-900/60 uppercase">Instant Bonus Credits</span>
                            <span className="text-lg font-black text-amber-600">{paymentCredits} Credits</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between gap-3 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1) as OnboardingStep)}
                  disabled={step === 1 || submitting}
                  className="rounded-xl h-11 px-5 border-gray-200 font-bold"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep((prev) => Math.min(3, prev + 1) as OnboardingStep)}
                    disabled={!canMoveNext || submitting}
                    className="rounded-xl h-11 px-6 bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500 text-white font-black shadow-[0_10px_20px_-12px_rgba(29,110,63,0.45)]"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handlePaymentAndSubmit}
                    disabled={submitting || !canSubmit}
                    className="rounded-2xl h-14 px-7 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-black shadow-[0_18px_34px_-18px_rgba(37,99,235,0.6)] hover:shadow-[0_20px_40px_-16px_rgba(37,99,235,0.65)]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing payment...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2 fill-current" />
                        Pay ₹{paymentCredits} & Complete Profile
                      </>
                    )}
                  </Button>
                )}
              </div>

              {step === 3 && (
                <p className="mt-4 text-center text-[11px] text-gray-400">
                  Secure payment is processed through Razorpay and your volunteer profile is created immediately after successful verification.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
