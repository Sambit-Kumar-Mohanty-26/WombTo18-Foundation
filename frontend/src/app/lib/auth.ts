export interface DonorSession {
  identifier: string;
  eligible: boolean;
  token: string;
}

export const auth = {
  async login(identifier: string): Promise<{ eligible: boolean; otpSent: boolean }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple mock logic: If email includes "elite", they are a "high-tier" donor with >= ₹5000
    // Otherwise, they are a standard donor with < ₹5000
    const isEligible = identifier.toLowerCase().includes("elite");

    return {
      eligible: isEligible,
      otpSent: isEligible, // Only send OTP if they are eligible for the full dashboard
    };
  },

  async verifyOtp(identifier: string, otp: string): Promise<{ success: boolean; token?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock verification: standard OTP is 123456
    if (otp === "123456") {
      const token = `mock-jwt-${Date.now()}`;
      const session: DonorSession = {
        identifier,
        eligible: true,
        token,
      };
      
      localStorage.setItem("donor_session", JSON.stringify(session));
      return { success: true, token };
    }

    return { success: false };
  },

  setReceiptOnlySession(identifier: string) {
    const session: DonorSession = {
      identifier,
      eligible: false,
      token: `mock-receipt-token-${Date.now()}`,
    };
    localStorage.setItem("donor_session", JSON.stringify(session));
  },

  getSession(): DonorSession | null {
    const sessionStr = localStorage.getItem("donor_session");
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr) as DonorSession;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem("donor_session");
  },
};
