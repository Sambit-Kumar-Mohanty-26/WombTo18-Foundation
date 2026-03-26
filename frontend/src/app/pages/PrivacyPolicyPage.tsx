import { Shield, Lock, Database, UserCheck, Eye, Mail, ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const sections = [
  { id: "commitment", label: "Our Commitment", icon: Shield },
  { id: "data-collected", label: "Data Collected", icon: Database },
  { id: "data-security", label: "Data Security", icon: Lock },
  { id: "third-party", label: "Third-Party Sharing", icon: Eye },
  { id: "your-rights", label: "Your Rights", icon: UserCheck },
];

const complianceBadges = [
  { label: "DPDPA", full: "Digital Personal Data Protection Act, India 2023", color: "var(--womb-forest)" },
  { label: "GDPR", full: "General Data Protection Regulation (EU)", color: "var(--future-sky)" },
  { label: "HIPAA", full: "Health Insurance Portability and Accountability Act (US)", color: "var(--journey-saffron)" },
];

export function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("commitment");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="bg-[#FFFDF7] min-h-screen">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="py-24 bg-gradient-to-b from-[#fef6ed] to-white overflow-hidden relative border-b border-gray-100">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_70%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--womb-forest)]/10 to-[var(--womb-forest)]/5 flex items-center justify-center mb-6 border border-[var(--womb-forest)]/20 shadow-sm"
            >
              <Shield className="w-10 h-10 text-[var(--womb-forest)]" />
            </motion.div>

            <p className="inline-flex items-center gap-2 bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--womb-forest)]/20 mb-4 sm:mb-6 shadow-sm">
              <Lock className="w-3.5 h-3.5" /> Data Protection
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] text-gray-900 mb-6" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              Privacy & Data{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500 drop-shadow-sm">
                Protection Policy
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-8">
              Your trust is the foundation of our mission. We are committed to safeguarding the personal data of every donor, volunteer, beneficiary, and visitor.
            </p>

            {/* Compliance Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center"
            >
              {complianceBadges.map((badge, index) => (
                <div
                  key={badge.label}
                  className={`group relative px-4 py-2.5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-default ${
                    index === complianceBadges.length - 1 ? "col-span-2 mx-auto w-full max-w-[180px] sm:col-span-1 sm:mx-0 sm:w-auto sm:max-w-none" : ""
                  }`}
                  style={{ borderColor: `${badge.color}30` }}
                >
                  <p className="text-xs font-black tracking-widest uppercase" style={{ color: badge.color }}>
                    {badge.label}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5 max-w-[180px] leading-tight">
                    {badge.full}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ CONTENT ═══════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Sticky Sidebar */}
          <nav className="lg:col-span-3 sticky top-28 hidden lg:block space-y-1">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4 px-4">On This Page</p>
            {sections.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeSection === id
                    ? "bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] border border-[var(--womb-forest)]/20 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </a>
            ))}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="px-4 py-4 rounded-xl bg-gradient-to-br from-[var(--womb-forest)]/5 to-transparent border border-[var(--womb-forest)]/10">
                <p className="text-xs font-bold text-gray-700 mb-1">Questions?</p>
                <a href="mailto:privacy@wombto18.org" className="text-xs font-bold text-[var(--journey-saffron)] hover:underline">
                  privacy@wombto18.org
                </a>
              </div>
            </div>
          </nav>

          {/* Content Cards */}
          <div className="lg:col-span-9 space-y-10">
            {/* Commitment */}
            <motion.div
              id="commitment"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--womb-forest)]/10 flex items-center justify-center border border-[var(--womb-forest)]/20">
                    <Shield className="w-5 h-5 text-[var(--womb-forest)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Our Commitment</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">
                  WOMBTO18 Foundation is committed to protecting the personal data of every donor, volunteer, beneficiary, and visitor. We operate in compliance with:
                </p>
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  {complianceBadges.map((badge) => (
                    <div
                      key={badge.label}
                      className="p-4 rounded-xl border bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all duration-300"
                      style={{ borderColor: `${badge.color}20` }}
                    >
                      <p className="text-sm font-black" style={{ color: badge.color }}>{badge.label}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{badge.full}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Data Collected */}
            <motion.div
              id="data-collected"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--future-sky)]/10 flex items-center justify-center border border-[var(--future-sky)]/20">
                    <Database className="w-5 h-5 text-[var(--future-sky)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Data Collected</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-base mb-6">
                  We collect the following personal data strictly for operational and legal compliance purposes:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["Name", "Email Address", "Phone Number", "PAN (for 80G)", "Donation History"].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-[var(--future-sky)]/30 hover:bg-[var(--future-sky)]/5 transition-all duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-[var(--future-sky)]" />
                      <span className="text-sm font-semibold text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200/50">
                  <p className="text-sm text-amber-800 font-semibold">
                    ⚠️ We never sell, share, or licence donor data to third parties for commercial purposes.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Data Security */}
            <motion.div
              id="data-security"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--womb-forest)]/10 flex items-center justify-center border border-[var(--womb-forest)]/20">
                    <Lock className="w-5 h-5 text-[var(--womb-forest)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Data Security</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--womb-forest)]/5 to-transparent border border-[var(--womb-forest)]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--womb-forest)]/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-[var(--womb-forest)]" />
                      </div>
                      <p className="text-sm font-black text-[var(--womb-forest)]">In Transit</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      All data is encrypted in transit using <strong className="text-gray-900">TLS/HTTPS</strong> protocols, ensuring secure communication between your browser and our servers.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--future-sky)]/5 to-transparent border border-[var(--future-sky)]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--future-sky)]/10 flex items-center justify-center">
                        <Database className="w-4 h-4 text-[var(--future-sky)]" />
                      </div>
                      <p className="text-sm font-black text-[var(--future-sky)]">At Rest</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Stored data is protected with <strong className="text-gray-900">AES-256 encryption</strong>, the same standard used by financial institutions worldwide.
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">Role-based access controls</strong> govern all internal data access, ensuring only authorised personnel can view sensitive information.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Third-Party Sharing */}
            <motion.div
              id="third-party"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <Eye className="w-5 h-5 text-red-500" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Third-Party Sharing</h2>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
                  <p className="text-base text-gray-700 leading-relaxed font-medium">
                    We <strong className="text-red-600 font-black">never sell, share, or licence</strong> donor data to third parties for commercial purposes.
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                  Data is only shared with statutory authorities as required by applicable law for tax-exemption verification and regulatory compliance.
                </p>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              id="your-rights"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--journey-saffron)]/10 flex items-center justify-center border border-[var(--journey-saffron)]/20">
                    <UserCheck className="w-5 h-5 text-[var(--journey-saffron)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Rights</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-base mb-6">
                  You have the right to exercise control over your personal data. To request any of the following, please contact us:
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { title: "Access", desc: "Request a copy of all data we hold about you", icon: "👁️" },
                    { title: "Correction", desc: "Update or correct any inaccurate information", icon: "✏️" },
                    { title: "Deletion", desc: "Request permanent removal of your data", icon: "🗑️" },
                  ].map((right, i) => (
                    <motion.div
                      key={right.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                      className="group p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[var(--journey-saffron)]/30 hover:bg-[var(--journey-saffron)]/5 transition-all duration-300 text-center"
                    >
                      <span className="text-2xl mb-3 block">{right.icon}</span>
                      <p className="text-sm font-bold text-gray-900 mb-1">{right.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{right.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--journey-saffron)]/5 border border-[var(--journey-saffron)]/15">
                  <Mail className="w-5 h-5 text-[var(--journey-saffron)] shrink-0" />
                  <p className="text-sm text-gray-700">
                    Contact us at{" "}
                    <a href="mailto:privacy@wombto18.org" className="font-bold text-[var(--journey-saffron)] hover:underline">
                      privacy@wombto18.org
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <div className="text-center pt-6 pb-4">
              <p className="text-xs text-gray-400 font-medium">Last Updated: March 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--womb-forest)] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center z-50"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
