import { FileText, CreditCard, ShieldCheck, Receipt, AlertTriangle, Mail, ArrowUp, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const sections = [
  { id: "payment-gateway", label: "Payment Gateway", icon: ShieldCheck },
  { id: "accepted-methods", label: "Accepted Methods", icon: CreditCard },
  { id: "refund-policy", label: "Refund Policy", icon: AlertTriangle },
  { id: "tax-certificates", label: "80G Certificates", icon: Receipt },
  { id: "disputes", label: "Disputes", icon: Mail },
];

const paymentMethods = [
  { name: "UPI", desc: "Google Pay, PhonePe, Paytm & more", emoji: "📱" },
  { name: "Net Banking", desc: "All major Indian banks supported", emoji: "🏦" },
  { name: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay", emoji: "💳" },
  { name: "Digital Wallets", desc: "Paytm Wallet, Amazon Pay & more", emoji: "👛" },
];

export function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState("payment-gateway");

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
      <section className="py-24 bg-gradient-to-b from-[#fef6ed] to-white overflow-hidden relative border-b border-gray-100">
        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_70%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--future-sky)_0%,_transparent_70%)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

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
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--journey-saffron)]/10 to-[var(--journey-saffron)]/5 flex items-center justify-center mb-6 border border-[var(--journey-saffron)]/20 shadow-sm"
            >
              <FileText className="w-10 h-10 text-[var(--journey-saffron)]" />
            </motion.div>

            <p className="inline-flex items-center gap-2 bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[var(--journey-saffron)]/20 mb-4 sm:mb-6 shadow-sm">
              <CreditCard className="w-3.5 h-3.5" /> Payment Terms
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] text-gray-900 mb-6" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              Terms of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--journey-saffron)] to-orange-400 drop-shadow-sm">
                Use & Payments
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-8">
              Transparent, secure, and compliant payment processing — because every rupee of your generosity deserves absolute clarity.
            </p>

            {/* Razorpay Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <div className="group px-5 py-3 rounded-xl border border-[var(--womb-forest)]/20 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3">
                <BadgeCheck className="w-5 h-5 text-[var(--womb-forest)]" />
                <div className="text-left">
                  <p className="text-xs font-black text-[var(--womb-forest)] tracking-wide">RAZORPAY</p>
                  <p className="text-[10px] text-gray-500 font-medium">PCI-DSS Level 1 Certified</p>
                </div>
              </div>
              <div className="group px-5 py-3 rounded-xl border border-[var(--future-sky)]/20 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--future-sky)]" />
                <div className="text-left">
                  <p className="text-xs font-black text-[var(--future-sky)] tracking-wide">AES-256</p>
                  <p className="text-[10px] text-gray-500 font-medium">Bank-Grade Encryption</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
                    ? "bg-[var(--journey-saffron)]/10 text-[var(--journey-saffron)] border border-[var(--journey-saffron)]/20 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </a>
            ))}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="px-4 py-4 rounded-xl bg-gradient-to-br from-[var(--journey-saffron)]/5 to-transparent border border-[var(--journey-saffron)]/10">
                <p className="text-xs font-bold text-gray-700 mb-1">Payment Issues?</p>
                <a href="mailto:accounts@wombto18.org" className="text-xs font-bold text-[var(--journey-saffron)] hover:underline">
                  accounts@wombto18.org
                </a>
              </div>
            </div>
          </nav>

          {/* Content Cards */}
          <div className="lg:col-span-9 space-y-10">
            {/* Payment Gateway */}
            <motion.div
              id="payment-gateway"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--womb-forest)]/10 flex items-center justify-center border border-[var(--womb-forest)]/20">
                    <ShieldCheck className="w-5 h-5 text-[var(--womb-forest)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Payment Gateway</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-base mb-6">
                  All payments are processed via <strong className="text-gray-900">Razorpay</strong>, a PCI-DSS Level 1 certified payment gateway — the highest level of security certification available in the payments industry.
                </p>
                <div className="p-5 rounded-xl bg-gradient-to-r from-[var(--womb-forest)]/5 to-[var(--future-sky)]/5 border border-[var(--womb-forest)]/10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
                    <BadgeCheck className="w-7 h-7 text-[var(--womb-forest)]" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-black text-gray-900">PCI-DSS Level 1 Certification</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Your card details, bank information, and transaction data are protected by enterprise-grade security protocols. We never store sensitive financial credentials on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Accepted Methods */}
            <motion.div
              id="accepted-methods"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--future-sky)]/10 flex items-center justify-center border border-[var(--future-sky)]/20">
                    <CreditCard className="w-5 h-5 text-[var(--future-sky)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Accepted Methods</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method, i) => (
                    <motion.div
                      key={method.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[var(--future-sky)]/30 hover:bg-[var(--future-sky)]/5 transition-all duration-300"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{method.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Refund Policy */}
            <motion.div
              id="refund-policy"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Refund Policy</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200/50">
                    <p className="text-sm text-amber-800 font-semibold leading-relaxed">
                      ⚠️ All donations are <strong>non-refundable</strong> unless there is a documented payment processing error.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      In case of a genuine payment processing error, please report the issue <strong className="text-gray-900">as soon as possible</strong>. Our finance team will verify and process eligible refunds <strong className="text-gray-900">expeditiously</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 80G Certificates */}
            <motion.div
              id="tax-certificates"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--womb-forest)]/10 flex items-center justify-center border border-[var(--womb-forest)]/20">
                    <Receipt className="w-5 h-5 text-[var(--womb-forest)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">80G Tax Certificates</h2>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--womb-forest)]/5 to-emerald-50 border border-[var(--womb-forest)]/10 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                      <span className="text-xl">⚡</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 mb-1">Instant Generation</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        80G certificates are <strong className="text-[var(--womb-forest)]">auto-generated and emailed within 2 minutes</strong> of successful payment. No manual follow-up required.
                      </p>
                    </div>
                  </div>
                </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Donations are eligible for tax benefits under Section 80G of the Income Tax Act, as per applicable rules. Certificates are valid for the financial year in which the donation is made.
                  </p>
              </div>
            </motion.div>

            {/* Disputes */}
            <motion.div
              id="disputes"
              className="scroll-mt-28 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--journey-saffron)]/10 flex items-center justify-center border border-[var(--journey-saffron)]/20">
                    <Mail className="w-5 h-5 text-[var(--journey-saffron)]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Payment Disputes</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-base mb-6">
                  If you experience any issues with a payment or believe a transaction was processed incorrectly, our dedicated accounts team is here to help.
                </p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--journey-saffron)]/5 border border-[var(--journey-saffron)]/15">
                  <Mail className="w-5 h-5 text-[var(--journey-saffron)] shrink-0" />
                  <p className="text-sm text-gray-700">
                    For payment disputes, contact:{" "}
                    <a href="mailto:accounts@wombto18.org" className="font-bold text-[var(--journey-saffron)] hover:underline">
                      accounts@wombto18.org
                    </a>
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  Please include your transaction ID, date of transaction, and a brief description of the issue. Our team will respond to your query as soon as possible.
                </p>
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
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--journey-saffron)] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center z-50"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
