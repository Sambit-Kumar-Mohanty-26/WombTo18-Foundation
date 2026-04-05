import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, Mail, Phone, Lock, ChevronRight, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { partnerApi } from "../../lib/api/partner";

type SignupStep = "info" | "email_otp" | "mobile_otp" | "success";

export function PartnerSignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>("info");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [otps, setOtps] = useState({
    email: "",
    mobile: "",
  });
  const [hashes, setHashes] = useState({
    email: "",
    mobile: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (type: "email" | "mobile", value: string) => {
    setOtps({ ...otps, [type]: value });
  };

  const startSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await partnerApi.sendEmailOtp(formData.email);
      if (!data.success) throw new Error(data.message || "Failed to send OTP");
      
      setHashes({ ...hashes, email: data.hash });
      setStep("email_otp");
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    setLoading(true);
    try {
      const data: any = await partnerApi.verifyOtp("email", hashes.email, otps.email);
      if (!data.success) throw new Error("Invalid OTP");

      const mobData: any = await partnerApi.sendMobileOtp(formData.mobile);
      if (!mobData.success) throw new Error(mobData.message || "Failed to send Mobile OTP");

      setHashes({ ...hashes, mobile: mobData.hash });
      setStep("mobile_otp");
      toast.success("Email verified. OTP sent to your mobile");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyMobileOtpAndSignup = async () => {
    setLoading(true);
    try {
      const data: any = await partnerApi.verifyOtp("mobile", hashes.mobile, otps.mobile);
      if (!data.success) throw new Error("Invalid OTP");

      const finalData: any = await partnerApi.signup(formData);
      if (!finalData.success) throw new Error(finalData.message || "Signup failed");

      setStep("success");
      toast.success("Account created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium";
  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1";

  return (
    <div className="relative w-full overflow-hidden min-h-[420px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {step === "info" && (
          <motion.form
            key="info"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            onSubmit={startSignup}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelStyle}>Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input name="organizationName" required value={formData.organizationName} onChange={handleChange} className={`${inputStyle} pl-11`} placeholder="eg. Global CSR Corp" />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelStyle}>Contact Person</label>
                <input name="contactPerson" required value={formData.contactPerson} onChange={handleChange} className={inputStyle} placeholder="Full Name" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelStyle}>Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input name="mobile" required type="tel" value={formData.mobile} onChange={handleChange} className={`${inputStyle} pl-11`} placeholder="9876543210" />
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelStyle}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input name="email" required type="email" value={formData.email} onChange={handleChange} className={`${inputStyle} pl-11`} placeholder="name@organization.com" />
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelStyle}>Set Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input name="password" required type="password" value={formData.password} onChange={handleChange} className={`${inputStyle} pl-11`} placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-sky-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Continue to Verification <ChevronRight className="w-4 h-4" /></>}
            </button>
          </motion.form>
        )}

        {step === "email_otp" && (
          <motion.div
            key="email_otp"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <div className="p-6 rounded-[2rem] bg-sky-50/50 border border-sky-100/50">
              <Mail className="w-12 h-12 text-sky-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Verify Email</h3>
              <p className="text-xs font-medium text-gray-500 px-4">
                We've sent a 4-digit code to <span className="text-sky-600 font-bold">{formData.email}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`email-otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={otps.email[index] || ""}
                  autoFocus={index === 0}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    const newOtp = otps.email.split("");
                    newOtp[index] = val;
                    const combined = newOtp.join("").slice(0, 4);
                    handleOtpChange("email", combined);
                    if (val && index < 3) {
                      document.getElementById(`email-otp-${index + 1}`)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otps.email[index] && index > 0) {
                      document.getElementById(`email-otp-${index - 1}`)?.focus();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
                    handleOtpChange("email", pasteData);
                  }}
                  className="w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 border-sky-100 bg-white focus:border-sky-500 outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={verifyEmailOtp} 
                disabled={loading || otps.email.length !== 4} 
                className="w-full py-4 rounded-2xl bg-sky-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify Email"}
              </button>
              <button disabled={loading} onClick={() => setStep("info")} className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-600 flex items-center justify-center gap-2 group border-none bg-transparent cursor-pointer">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Edit Details
              </button>
            </div>
          </motion.div>
        )}

        {step === "mobile_otp" && (
          <motion.div
            key="mobile_otp"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <div className="p-6 rounded-[2rem] bg-sky-50/50 border border-sky-100/50">
              <Phone className="w-12 h-12 text-sky-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Verify Mobile</h3>
              <p className="text-xs font-medium text-gray-500 px-4">
                Final step! We've sent an OTP to <span className="text-sky-600 font-bold">+91 {formData.mobile}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`mobile-otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={otps.mobile[index] || ""}
                  autoFocus={index === 0}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    const newOtp = otps.mobile.split("");
                    newOtp[index] = val;
                    const combined = newOtp.join("").slice(0, 4);
                    handleOtpChange("mobile", combined);
                    if (val && index < 3) {
                      document.getElementById(`mobile-otp-${index + 1}`)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otps.mobile[index] && index > 0) {
                      document.getElementById(`mobile-otp-${index - 1}`)?.focus();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
                    handleOtpChange("mobile", pasteData);
                  }}
                  className="w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 border-sky-100 bg-white focus:border-sky-500 outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={verifyMobileOtpAndSignup} 
                disabled={loading || otps.mobile.length !== 4} 
                className="w-full py-4 rounded-2xl bg-sky-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Complete Registration"}
              </button>
              <button disabled={loading} onClick={() => setStep("email_otp")} className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-600 flex items-center justify-center gap-2 group border-none bg-transparent cursor-pointer">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Email
              </button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-sky-50">
              <CheckCircle2 className="w-12 h-12 text-sky-600" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Welcome Aboard!</h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
              Your institutional account has been successfully verified. You can now access your partner dashboard.
            </p>
            <button
              onClick={() => navigate("/partner/login")}
              className="px-8 py-3.5 rounded-2xl bg-sky-600 text-white font-black uppercase tracking-widest shadow-xl shadow-sky-600/20 hover:bg-sky-700 transition-all active:scale-[0.95] border-none cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
