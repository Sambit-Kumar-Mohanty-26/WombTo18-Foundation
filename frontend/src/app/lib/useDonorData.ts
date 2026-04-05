/**
 * useDonorData — shared hook that fetches dashboard + donation data
 * for the currently logged-in donor. Results are cached in module state
 * so sub-pages don't re-fetch unnecessarily.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { client } from "./api/client";

export interface DonorProfile {
  id: string;
  name: string | null;
  donorId: string;
  email: string;
  mobile: string | null;
  tier: string;
  totalDonated: number;
  impactScore?: number;
  joinedDate: string;
  createdAt?: string;
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
  impactScore: number;
  donationCount: number;
  avgDonation: number;
  refetch: () => void;
}

// Module-level cache to share data between Layout header and Page content
let cachedProfile: DonorProfile | null = null;
let cachedDonations: DonationRecord[] = [];
let isFetching = false;
let listeners: (() => void)[] = [];

export function useDonorData(): DonorData {
  const { state } = useAuth();
  const identifier = state.user?.identifier;
  const [, setTick] = useState(0);

  const [profile, setProfile] = useState<DonorProfile | null>(cachedProfile);
  const [donations, setDonations] = useState<DonationRecord[]>(cachedDonations);
  const [loading, setLoading] = useState(!cachedProfile);

  const fetchData = async (id: string) => {
    if (isFetching) return;
    isFetching = true;
    setLoading(true);
    const enc = encodeURIComponent(id);

    try {
      const [dashRes, donaRes] = await Promise.allSettled([
        client.get<{ donor: DonorProfile }>(`/donors/dashboard?donorId=${enc}`),
        client.get<DonationRecord[]>(`/donors/donations?donorId=${enc}`),
      ]);

      if (dashRes.status === "fulfilled") {
        const d = dashRes.value.donor;
        cachedProfile = {
          ...d,
          joinedDate: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'
        };
      }
      if (donaRes.status === "fulfilled") cachedDonations = donaRes.value ?? [];

      isFetching = false;
      setProfile(cachedProfile);
      setDonations(cachedDonations);
      listeners.forEach(l => l());
    } catch {
      isFetching = false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    const onUpdate = () => {
      setProfile(cachedProfile);
      setDonations(cachedDonations);
      setLoading(false);
    };
    listeners.push(onUpdate);

    if (!cachedProfile && !isFetching) {
      fetchData(identifier);
    } else {
      setLoading(false);
    }

    return () => {
      listeners = listeners.filter(l => l !== onUpdate);
    };
  }, [identifier]);

  const refetch = () => {
    if (!identifier) return;
    cachedProfile = null;
    cachedDonations = [];
    setTick(t => t + 1);
    fetchData(identifier);
  };

  const totalDonated = profile?.totalDonated ?? 0;
  const impactScore = profile?.impactScore ?? 0;
  const donationCount = donations.length;
  const avgDonation = donationCount > 0 ? Math.round(totalDonated / donationCount) : 0;

  return { profile, donations, loading, totalDonated, impactScore, donationCount, avgDonation, refetch };
}

