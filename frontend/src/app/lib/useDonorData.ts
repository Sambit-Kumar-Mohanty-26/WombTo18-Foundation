/**
 * useDonorData — shared hook that fetches dashboard + donation data
 * for the currently logged-in donor. Results are cached in module state
 * so sub-pages don't re-fetch unnecessarily.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { client } from "./api/client";

export interface DonorProfile {
  name: string | null;
  donorId: string;
  tier: string;
  totalDonated: number;
}

export interface DonationRecord {
  id?: string;
  amount: number;
  program: string;
  date: string;
  status: string;
}

interface DonorData {
  profile: DonorProfile | null;
  donations: DonationRecord[];
  loading: boolean;
  totalDonated: number;
  donationCount: number;
  avgDonation: number;
}

export function useDonorData(): DonorData {
  const { state } = useAuth();
  const identifier = state.user?.identifier;

  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    const enc = encodeURIComponent(identifier);

    Promise.allSettled([
      client.get<{ donor: DonorProfile }>(`/donors/dashboard?donorId=${enc}`),
      client.get<DonationRecord[]>(`/donors/donations?donorId=${enc}`),
    ]).then(([dashRes, donaRes]) => {
      if (dashRes.status === "fulfilled") setProfile(dashRes.value.donor);
      if (donaRes.status === "fulfilled") setDonations(donaRes.value ?? []);
    }).finally(() => setLoading(false));
  }, [identifier]);

  const totalDonated = profile?.totalDonated ?? 0;
  const donationCount = donations.length;
  const avgDonation = donationCount > 0 ? Math.round(totalDonated / donationCount) : 0;

  return { profile, donations, loading, totalDonated, donationCount, avgDonation };
}
