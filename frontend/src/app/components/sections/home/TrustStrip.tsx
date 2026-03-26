import { motion } from "motion/react";
import { ShieldCheck, Receipt, Eye } from "lucide-react";

export function TrustStrip() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      desc: "Razorpay • PCI-DSS Level 1",
      color: "text-[var(--womb-forest)]",
      bg: "bg-[var(--womb-forest)]/10"
    },
    {
      icon: Receipt,
      title: "Instant 80G Certificate",
      desc: "Auto-emailed within 2 minutes",
      color: "text-[var(--journey-saffron)]",
      bg: "bg-[var(--journey-saffron)]/10"
    },
    {
      icon: Eye,
      title: "Full Fund Visibility",
      desc: "Your personalised donor dashboard",
      color: "text-[var(--future-sky)]",
      bg: "bg-[var(--future-sky)]/10"
    }
  ];

  return (
    <div className="py-14 lg:py-16 border-b border-gray-200" style={{ background: "linear-gradient(135deg, #faf8f5 0%, #f3f0eb 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Why Donors Trust Us
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Every donation is secure, certified, and fully transparent
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-default"
            >
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold mb-1">{card.title}</h4>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
