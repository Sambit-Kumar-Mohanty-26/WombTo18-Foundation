import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { OTPVerification } from "../../components/donor-login/OTPVerification";

export function DonorVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;

  useEffect(() => {
    // If user tries to access this page directly without an identifier, redirect them back to login
    if (!identifier) {
      navigate("/donor/login", { replace: true });
    }
  }, [identifier, navigate]);

  const handleVerificationSuccess = () => {
    navigate("/dashboard", { replace: true }); // Prevent them from returning to the OTP screen via back button
  };

  const handleBack = () => {
    navigate("/donor/login");
  };

  if (!identifier) return null; // Prevent flicker before redirect

  return (
    <section className="py-20 min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-background via-emerald-950/50 to-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <OTPVerification 
          identifier={identifier} 
          onSuccess={handleVerificationSuccess} 
          onBack={handleBack} 
        />
      </div>
    </section>
  );
}
