import { authApi, LoginResponse } from "./api/auth";

export interface DonorSession {
  identifier: string;
  eligible: boolean;
  token: string;
  name?: string;
  donorId?: string;
  role: 'DONOR' | 'PARTNER' | 'ADMIN';
}

export const auth = {
  async login(
    identifier: string,
    flags?: { isVolunteer?: boolean; isNonDonor?: boolean; name?: string; mobile?: string; password?: string; referredById?: string }
  ): Promise<LoginResponse> {
    const response = await authApi.login(identifier, flags);
    return response;
  },

  async verifyOtp(identifier: string, otp: string): Promise<{ success: boolean; token?: string; name?: string; donorId?: string; role?: string }> {
    const response = await authApi.verifyOtp(identifier, otp);
    
    if (response.success && response.token) {
      const role = (response as any).role || 'DONOR';
      const session: DonorSession = {
        identifier,
        eligible: true,
        token: response.token,
        name: response.name,
        donorId: response.donorId,
        role: role as any,
      };
      
      localStorage.setItem("donor_session", JSON.stringify(session));
      return { success: true, token: response.token, name: response.name, donorId: response.donorId, role };
    }

    return { success: false };
  },


  setReceiptOnlySession(identifier: string) {
    const session: DonorSession = {
      identifier,
      eligible: false,
      token: `mock-receipt-token-${Date.now()}`,
      role: 'DONOR',
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

