import { authApi } from "./api/auth";

export interface DonorSession {
  identifier: string;
  eligible: boolean;
  token: string;
}

export const auth = {
  async login(identifier: string): Promise<{ eligible: boolean; otpSent: boolean; devOtp?: string }> {
    const response = await authApi.login(identifier);
    return response;
  },

  async verifyOtp(identifier: string, otp: string): Promise<{ success: boolean; token?: string }> {
    const response = await authApi.verifyOtp(identifier, otp);
    
    if (response.success && response.token) {
      const session: DonorSession = {
        identifier,
        eligible: true,
        token: response.token,
      };
      
      localStorage.setItem("donor_session", JSON.stringify(session));
      return { success: true, token: response.token };
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

