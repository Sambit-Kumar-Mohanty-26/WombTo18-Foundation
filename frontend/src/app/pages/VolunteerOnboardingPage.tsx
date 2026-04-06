import { motion } from "motion/react";
import { VolunteerForm } from "./donate/VolunteerForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function VolunteerOnboardingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("donor_session");
    if (!session) {
      navigate("/volunteer/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24 pb-12 sm:pt-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0faf4] via-[#fef6ed]/40 to-[#FFFDF7] pointer-events-none" />
      <div className="absolute top-[-30%] right-[-15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--womb-forest)_0%,_transparent_65%)] opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[5%] w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--journey-saffron)_0%,_transparent_65%)] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase mb-6 border shadow-sm backdrop-blur-sm bg-[var(--womb-forest)]/10 text-[var(--womb-forest)] border-[var(--womb-forest)]/20">
                Next Steps
              </div>

              <h1 className="text-[2.2rem] sm:text-4xl lg:text-5xl text-gray-900 mb-5" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
                Complete Your{" "}
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[var(--womb-forest)] to-emerald-500 drop-shadow-sm">
                  Volunteer Profile
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-10">
                Your generous donation is already creating impact. We are thrilled that you also want to dedicate your time and skills to our mission.
              </p>

              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-100/50 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Tell us about yourself</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Share your skills and availability so we can match you perfectly.</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-100/50 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Join the Network</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Get invited to specialized groups and community projects.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8 order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-3 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <VolunteerForm />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
