import { Link } from "react-router";
import { Button } from "../ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-emerald-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mb-6">
              <Heart className="h-3.5 w-3.5 fill-primary" />
              <span>Every child deserves a chance</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-6" style={{ fontWeight: 800, lineHeight: 1.1 }}>
              Nurturing Lives from{" "}
              <span className="text-primary">Womb</span> to{" "}
              <span className="text-accent">18</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              We support mothers and children with healthcare, nutrition, education, and empowerment — from prenatal care through age 18.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold shadow-lg shadow-orange-500/20">
                  <Heart className="h-4 w-4 mr-2 fill-current" /> Donate Now
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-gray-300 bg-white hover:bg-gray-100 text-gray-700">
                  Learn More <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8">
              {[
                { value: "15K+", label: "Children Supported" },
                { value: "200+", label: "Communities" },
                { value: "98%", label: "Funds Utilized" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1584376003963-e1aa9a61c0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMEluZGlhJTIwTkdPfGVufDF8fHx8MTc3MzEzNDAyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Children learning together"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-white backdrop-blur-md rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-primary fill-current" />
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-bold">12,450 Lives</p>
                  <p className="text-xs text-gray-600 font-medium">Impacted this year</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
