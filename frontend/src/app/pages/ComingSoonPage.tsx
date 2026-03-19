import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock3, Heart, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";

const featureContent = {
  donate: {
    eyebrow: "Donation Experience",
    title: "A more beautiful giving journey is on the way.",
    description:
      "We are polishing a warm, trust-building donation flow so supporters can contribute with more clarity, confidence, and joy.",
    accent: "from-amber-300 via-orange-300 to-rose-300",
    glow: "bg-orange-200/50",
  },
  donor: {
    eyebrow: "Donor Login",
    title: "Your new donor portal is arriving soon.",
    description:
      "We are crafting a smoother donor login experience with a cleaner dashboard, faster access, and a more premium feel.",
    accent: "from-sky-300 via-cyan-300 to-emerald-300",
    glow: "bg-cyan-200/50",
  },
} as const;

export function ComingSoonPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const feature =
    searchParams.get("feature") === "donor-login" || location.pathname.includes("/donor/")
      ? featureContent.donor
      : featureContent.donate;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(236,253,245,0.88)_38%,_rgba(248,250,252,1)_100%)] text-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute left-[10%] top-24 h-40 w-40 rounded-full blur-3xl ${feature.glow}`}
          animate={{ y: [0, -20, 0], x: [0, 16, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[12%] top-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl"
          animate={{ y: [0, 18, 0], x: [0, -14, 0], scale: [1.04, 0.94, 1.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/70 blur-3xl"
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-100/60 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              {feature.eyebrow}
            </div>

            <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {feature.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {feature.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/">
                <Button size="lg" className="bg-slate-900 px-7 text-white hover:bg-slate-800">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/impact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/80 bg-white/70 px-7 text-slate-700 backdrop-blur-sm hover:bg-white"
                >
                  See Our Impact
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-white/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-2xl shadow-emerald-100/70 backdrop-blur-xl sm:p-8">
              <motion.div
                className={`mb-6 inline-flex rounded-full bg-gradient-to-r ${feature.accent} p-[1px]`}
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  <Clock3 className="h-4 w-4 text-emerald-600" />
                  Coming Soon
                </div>
              </motion.div>

              <div className="space-y-4">
                {[
                  "Elegant motion and clearer storytelling",
                  "A softer, more delightful supporter journey",
                  "A polished launch experience worth the wait",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 + index * 0.12 }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Heart className="h-4 w-4 fill-current" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-6 rounded-[1.5rem] bg-slate-900 p-5 text-white"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/60">Message</p>
                <p className="mt-3 text-lg font-semibold leading-8">
                  Thank you for your patience. Something thoughtful, warm, and genuinely beautiful is almost ready.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
