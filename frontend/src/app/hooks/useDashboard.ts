import { useState, useEffect } from 'react';
import { donorApi, DonorDashboard, DonorDonation } from '../lib/api/donor';

export function useDashboard() {
  const [data, setData] = useState<DonorDashboard | null>(null);
  const [donations, setDonations] = useState<DonorDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const [dashboardRes, donationsRes] = await Promise.all([
          donorApi.getDashboard(),
          donorApi.getDonations(),
        ]);
        setData(dashboardRes);
        setDonations(donationsRes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return { data, donations, loading, error };
}
