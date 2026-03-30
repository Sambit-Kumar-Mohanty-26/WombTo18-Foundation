import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Building2, Users, Sparkles, Shield, FileText, BarChart3, Target } from "lucide-react";
import { DonateSidebar } from "./donate/DonateSidebar";
import { DonorForm } from "./donate/DonorForm";
import { PartnerForm } from "./donate/PartnerForm";
import { VolunteerForm } from "./donate/VolunteerForm";

const TABS = [
  { id: "donor" as const, label: "Donate", sublabel: "Individual Giving", icon: Heart, color: "#FF9900", bg: "from-[#FF9900] to-[#f97316]", lightBg: "bg-[#FF9900]/8" },
  { id: "partner" as const, label: "Sponsor", sublabel: "ESG / CSR Partner", icon: Building2, color: "#00AEEF", bg: "from-[#00AEEF] to-[#3b82f6]", lightBg: "bg-[#00AEEF]/8" },
  { id: "volunteer" as const, label: "Volunteer", sublabel: "Lend Your Expertise", icon: Users, color: "#1D6E3F", bg: "from-[#1D6E3F] to-[#10b981]", lightBg: "bg-[#1D6E3F]/8" },
];

type TabId = typeof TABS[number]["id"];

export function DonatePage() {
  const [activeTab, setActiveTab] = useState<TabId>("donor");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="bg-[#FFFDF7] min-h-screen">

      <section className="relative pt-20 pb-6 sm:pt-24 sm:pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0faf4] via-[#fef6ed]/40 to-[#FFFDF7]" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_65%)] opacity-[0.06] blur-[100px] rounded-full" />
          <div className="absolute bottom-[-30%] left-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_65%)] opacity-[0.05] blur-[100px] rounded-full" />
          <div className="absolute top-[20%] left-[40%] w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--future-sky)_0%,_transparent_65%)] opacity-[0.04] blur-[80px] rounded-full" />
        </div>

        {/* grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        {/* orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full"
              style={{
                width: 4 + Math.random() * 8, height: 4 + Math.random() * 8,
                top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%`,
                background: [activeTabData.color, "var(--womb-forest)", "var(--future-sky)"][i % 3],
                opacity: 0, filter: "blur(1px)",
              }}
              animate={{ opacity: [0, 0.5, 0], y: [0, -60, -120], scale: [0.3, 1, 0.3] }}
              transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase mb-5 border shadow-sm backdrop-blur-sm"
              style={{ color: activeTabData.color, borderColor: `${activeTabData.color}30`, background: `${activeTabData.color}08` }}
            >
              <Sparkles className="w-3 h-3" /> Make a Difference Today
            </motion.div>

            {/* Heading */}
            <h1 className="text-[2rem] sm:text-[3.5rem] md:text-[4rem] text-gray-900 mb-3 max-w-3xl" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              Support the{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeTabData.bg} drop-shadow-sm`}>
                {activeTab === "donor" ? "Mission" : activeTab === "partner" ? "Future" : "Cause"}.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed mb-7">
              Every action creates real, measurable impact for children across India.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex justify-center w-full"
          >
            <div className="relative flex max-w-full overflow-x-auto scroll-hide bg-white/80 backdrop-blur-xl rounded-2xl p-1 border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),_0_1px_3px_rgba(0,0,0,0.04)] items-center touch-pan-x">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center shrink-0 gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all duration-300 z-10 ${
                      isActive ? "text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.bg} shadow-lg`}
                        style={{ boxShadow: `0 4px 15px -3px ${tab.color}40` }}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      <span className="hidden sm:inline text-[9px] font-medium opacity-75 ml-0.5">({tab.sublabel})</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:order-1">
              <DonateSidebar activeColor={activeTabData.color} />
            </div>

            <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeTab === "donor" && <DonorForm />}
                  {activeTab === "partner" && <PartnerForm />}
                  {activeTab === "volunteer" && <VolunteerForm />}
                </motion.div>
              </AnimatePresence>

              <div className="lg:hidden w-full space-y-4">
                <button
                  type="button"
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-500 hover:text-gray-700 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all mx-auto"
                >
                  <BarChart3 className="w-4 h-4 text-[var(--journey-saffron)]" />
                  {showMobileSidebar ? "Hide Impact Details" : "View Live Impact & Donors"}
                </button>

                <AnimatePresence>
                  {showMobileSidebar && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden pb-4"
                    >
                      <DonateSidebar activeColor={activeTabData.color} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--womb-forest)]/[0.02] via-transparent to-[var(--future-sky)]/[0.02]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "2 min", label: "80G Certificate", icon: FileText, color: "#FF9900" },
              { value: "100%", label: "Ring-fenced Funds", icon: Shield, color: "#1D6E3F" },
              { value: "Live", label: "Impact Dashboard", icon: BarChart3, color: "#00AEEF" },
              { value: "32", label: "Programs to Support", icon: Target, color: "#FF9900" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col items-center gap-2.5 group cursor-default"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${item.color}10`, boxShadow: `0 0 0 1px ${item.color}15` }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-black text-gray-900">{item.value}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-semibold tracking-wide">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
