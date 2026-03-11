import { client } from './client';

export const certificateApi = {
  downloadReceipt: async (donationId: string) => {
    const blob = await client.get<Blob>(`/donor/receipts/download/${donationId}`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${donationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
  
  downloadCertificate: async (donationId: string) => {
    const blob = await client.get<Blob>(`/certificates/download/${donationId}`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-80G-${donationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
