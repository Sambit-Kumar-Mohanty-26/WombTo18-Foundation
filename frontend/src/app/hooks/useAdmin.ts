import { useState, useEffect } from "react";
import { adminApi, AdminStats } from "../lib/api/admin";

export function useAdmin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [donors, setDonors] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, donorsRes, donationsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getDonors(),
        adminApi.getDonations(),
      ]);
      
      setStats(statsRes);
      setDonors(donorsRes);
      setDonations(donationsRes);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { stats, donors, donations, loading, error, refresh: fetchData };
}
