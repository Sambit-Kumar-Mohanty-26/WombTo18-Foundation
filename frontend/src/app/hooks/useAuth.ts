import { useState, useEffect } from 'react';
import { authApi, LoginResponse, VerifyOtpResponse } from '../lib/api/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial session
    const session = localStorage.getItem('donor_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const login = async (email: string): Promise<LoginResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApi.login(email);
      return res;
    } catch (err: any) {
      const msg = err.message || 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApi.verifyOtp(email, otp);
      if (res.donor) {
        localStorage.setItem('donor_session', JSON.stringify(res.donor));
        setUser(res.donor);
      }
      return res;
    } catch (err: any) {
      const msg = err.message || 'Verification failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore logout errors, just clear local state
    } finally {
      localStorage.removeItem('donor_session');
      setUser(null);
      window.location.href = '/';
    }
  };

  return {
    user,
    loading,
    error,
    login,
    verifyOtp,
    logout,
    isAuthenticated: !!user,
  };
}
