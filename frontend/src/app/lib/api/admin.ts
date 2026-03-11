import { client } from "./client";

export interface AdminStats {
  totalDonations: number;
  totalDonors: number;
  totalPrograms: number;
  recentDonations: any[];
}

export const adminApi = {
  getStats: () => 
    client.get<AdminStats>("/admin/stats"),
  
  getDonors: () => 
    client.get<any[]>("/admin/donors"),
  
  getDonations: () => 
    client.get<any[]>("/admin/donations"),
    
  updateProgram: (id: string, data: any) =>
    client.post(`/admin/programs/${id}`, data),
};
