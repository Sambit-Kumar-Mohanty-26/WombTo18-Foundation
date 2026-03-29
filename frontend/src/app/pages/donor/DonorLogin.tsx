import { useNavigate } from "react-router";
import { DonorLoginForm } from "../../components/donor-login/DonorLoginForm";

export function DonorLogin() {
  const navigate = useNavigate();

  const handleLoginSuccess = (eligible: boolean, identifier: string, otpSent?: boolean) => {
    if (otpSent) {
      // Register flow → must verify OTP
      navigate("/donor/verify-otp", { state: { identifier, eligible } });
    } else {
      // Password login → already authenticated → go to dashboard
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <section className="py-20 min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-background via-[#0a3a1e]/50 to-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <DonorLoginForm onSuccess={handleLoginSuccess} />
      </div>
    </section>
  );
}
