import { useState, useEffect } from 'react';
import { programApi, Program } from '../lib/api/programs';

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        setLoading(true);
        const res = await programApi.getPrograms();
        setPrograms(res);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch programs');
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  return { programs, loading, error };
}
