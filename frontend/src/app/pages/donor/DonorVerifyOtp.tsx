import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { OTPVerification } from "../../components/donor-login/OTPVerification";
import { DualOtpVerification } from "../auth/DualOtpVerification";
import { useAuth } from "../../context/AuthContext";

export function DonorVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const identifier = location.state?.identifier;
  const eligible: boolean = location.state?.eligible ?? true;
  const requiresMobileOtp: boolean = location.state?.requiresMobileOtp ?? false;
  const role = location.state?.role || 'DONOR';

  useEffect(() => {
    if (!identifier) {
      navigate("/donor/login", { replace: true });
    }
  }, [identifier, navigate]);

  const handleVerificationSuccess = (name?: string, givenRole?: string, payload?: any) => {
    const finalRole = givenRole || role;
    // login call is already handled mostly by OTPVerification, but we ensure contextual state update
    login(identifier, eligible, name, finalRole, payload);
    
    const targetId = payload?.volunteerId || payload?.donorId || 'legacy';
    
    if (finalRole === 'VOLUNTEER') navigate(`/volunteer/${targetId}/dashboard`, { replace: true });
    else if (finalRole === 'PARTNER') navigate(`/partner/${targetId}/dashboard`, { replace: true });
    else navigate(`/donor/${targetId}/dashboard`, { replace: true });
  };

  const handleBack = () => {
    navigate("/donor/login");
  };

  if (!identifier) return null;

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#FFFDF7] relative overflow-hidden py-10">
      {/* Ambient Premium Light Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--womb-forest)] opacity-[0.04] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[60%] rounded-full bg-[var(--future-sky)] opacity-[0.04] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
        {requiresMobileOtp ? (
          <DualOtpVerification
            identifier={identifier}
            role={role}
            requiresMobileOtp={requiresMobileOtp}
            onSuccess={handleVerificationSuccess}
            onBack={handleBack}
          />
        ) : (
          <OTPVerification
            identifier={identifier}
            onSuccess={handleVerificationSuccess}
            onBack={handleBack}
          />
        )}
      </div>
    </section>
  );
}
