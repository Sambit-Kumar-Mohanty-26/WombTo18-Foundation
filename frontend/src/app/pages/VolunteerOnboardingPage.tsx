import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { auth } from "../lib/auth";
import { VolunteerForm } from "./donate/VolunteerForm";
import { VolunteerOnboarding } from "./volunteer/VolunteerOnboarding";

export function VolunteerOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = auth.getSession();
  const hasDonationContext = Boolean(
    searchParams.get("amount") ||
    searchParams.get("name") ||
    searchParams.get("email") ||
    searchParams.get("mobile")
  );

  useEffect(() => {
    if (!session && !hasDonationContext) {
      navigate("/donor/login", { replace: true });
      return;
    }

    if (session?.role === "VOLUNTEER" && session.profileCompleted && !hasDonationContext) {
      navigate(`/volunteer/${session.volunteerId || session.donorId}/dashboard`, { replace: true });
    }
  }, [session, hasDonationContext, navigate]);

  if (!session && !hasDonationContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] text-gray-500 font-bold uppercase tracking-widest text-xs">
        Redirecting to donor login...
      </div>
    );
  }

  if (session?.role === "VOLUNTEER" && session.profileCompleted && !hasDonationContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] text-gray-500 font-bold uppercase tracking-widest text-xs">
        Loading volunteer dashboard...
      </div>
    );
  }

  if (hasDonationContext) {
    return <VolunteerForm />;
  }

  return <VolunteerOnboarding />;
}
