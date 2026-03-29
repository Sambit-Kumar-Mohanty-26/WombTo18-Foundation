import { useNavigate } from "react-router";
import { DonorLoginForm } from "../../components/donor-login/DonorLoginForm";

export function DonorLogin() {
  const navigate = useNavigate();

  const handleLoginSuccess = (eligible: boolean, identifier: string, otpSent?: boolean) => {
    if (otpSent) {
      navigate("/donor/verify-otp", { state: { identifier, eligible } });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#FFFDF7] relative overflow-hidden py-10">
      {/* Ambient Premium Light Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--womb-forest)] opacity-[0.04] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[60%] rounded-full bg-[var(--future-sky)] opacity-[0.04] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1D6E3F 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
        <DonorLoginForm onSuccess={handleLoginSuccess} />
      </div>
    </section>
  );
}
