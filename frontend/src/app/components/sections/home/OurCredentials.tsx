import { motion } from "motion/react";
import { Landmark, FileText, Globe, Building2 } from "lucide-react";

const credentials = [
  {
    icon: Landmark,
    title: "80G Certified",
    subtitle: "Tax-Deductible Donations",
    description:
      "All contributions are eligible for income tax deduction under Section 80G",
    accentColor: "var(--womb-forest, #1D6E3F)",
    bgColor: "rgba(29, 110, 63, 0.08)",
  },
  {
    icon: FileText,
    title: "12A Certified",
    subtitle: "Legally Recognised Non-Profit",
    description:
      "Registered and certified under Section 12A of the Income Tax Act",
    accentColor: "var(--journey-saffron, #FF9900)",
    bgColor: "rgba(255, 153, 0, 0.08)",
  },
  {
    icon: Globe,
    title: "TechSoup India",
    subtitle: "Validated NGO",
    description:
      "Verified by TechSoup India — the global standard for NGO technology access",
    accentColor: "var(--future-sky, #00AEEF)",
    bgColor: "rgba(0, 174, 239, 0.08)",
  },
  {
    icon: Building2,
    title: "Section 8",
    subtitle: "Registered Foundation",
    description:
      "Incorporated as a Section 8 Company under the Companies Act, 2013",
    accentColor: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.08)",
  },
];

export function OurCredentials() {
  return (
    <section className="relative py-20 lg:py-28 bg-gray-50 overflow-hidden">
      {/* Subtle decorative background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--womb-forest, #1D6E3F) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--future-sky, #00AEEF) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 lg:mb-16"
        >
          <p
            className="text-sm font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--womb-forest, #1D6E3F)" }}
          >
            Our Credentials
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Trusted, Transparent & <br className="hidden sm:block" />
            Legally Compliant
          </h2>
          <div
            className="mt-4 w-16 h-1 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--womb-forest, #1D6E3F), var(--future-sky, #00AEEF))",
            }}
          />
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {credentials.map((cred, idx) => (
            <motion.div
              key={cred.title}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: idx * 0.12,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
                transition: { duration: 0.25 },
              }}
              className="group relative bg-white rounded-2xl p-7 lg:p-8 border border-gray-100 shadow-sm hover:border-gray-200 transition-colors duration-300 cursor-default"
            >
              {/* Top-right status dot */}
              <div
                className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cred.accentColor }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: cred.bgColor }}
              >
                <cred.icon
                  className="w-6 h-6"
                  style={{ color: cred.accentColor }}
                />
              </div>

              {/* Title */}
              <h3
                className="text-xl lg:text-2xl font-bold mb-1.5 transition-colors duration-300"
                style={{ color: cred.accentColor }}
              >
                {cred.title}
              </h3>

              {/* Subtitle */}
              <p className="text-sm font-bold text-gray-900 mb-2">
                {cred.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {cred.description}
              </p>

              {/* Bottom accent bar on hover */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl origin-left"
                style={{ backgroundColor: cred.accentColor }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
