import { useNavigate } from "react-router";
import { DonorLoginForm } from "../../components/donor-login/DonorLoginForm";

export function DonorLogin() {
  const navigate = useNavigate();

  const handleLoginSuccess = (eligible: boolean, identifier: string) => {
    if (eligible) {
      // Pass the identifier via state for the OTP page to use
      navigate("/donor/verify-otp", { state: { identifier } });
    } else {
      // Ineligible donors are redirected straight to receipts
      navigate("/dashboard/certificates"); 
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
