import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { OTPVerification } from "../../components/donor-login/OTPVerification";
import { useAuth } from "../../context/AuthContext";

export function DonorVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const identifier = location.state?.identifier;
  const eligible: boolean = location.state?.eligible ?? true;

  useEffect(() => {
    if (!identifier) {
      navigate("/donor/login", { replace: true });
    }
  }, [identifier, navigate]);

  const handleVerificationSuccess = (name?: string) => {
    login(identifier, eligible, name);
    navigate("/dashboard", { replace: true });
  };

  const handleBack = () => {
    navigate("/donor/login");
  };

  if (!identifier) return null; // Prevent flicker before redirect

  return (
    <section className="py-20 min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-background via-[#0a3a1e]/50 to-background">
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
