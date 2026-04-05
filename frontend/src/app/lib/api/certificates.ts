import { client } from './client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6001';

export const certificateApi = {
  /** Download a donation receipt PDF by donationId */
  downloadReceipt: async (donationId: string) => {
    const blob = await client.get<Blob>(`/certificates/receipt/${donationId}`);
    triggerDownload(blob, `receipt-${donationId}.pdf`);
  },

  /** Download 80G certificate by certId (e.g. "80G-clxxx...") */
  download80G: async (certId: string) => {
    const blob = await client.get<Blob>(`/certificates/download/${certId}`);
    triggerDownload(blob, `${certId}.pdf`);
  },

  /** Download certificate from a pre-generated file URL */
  downloadFromUrl: async (fileUrl: string, filename?: string) => {
    // fileUrl is like "/public/certificates/80G-xxx.pdf"
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_BASE}${fileUrl}`;
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    triggerDownload(blob, filename || 'certificate.pdf');
  },

  /** Generate and download 80G certificate by donationId */
  download80GByDonation: async (donationId: string) => {
    const blob = await client.get<Blob>(`/certificates/80g/${donationId}`);
    triggerDownload(blob, `80G_Certificate_${donationId}.pdf`);
  },

  /** Verify a certificate by its printed ID */
  verifyCertificate: async (certId: string) => {
    return client.get(`/certificates/verify/${certId}`);
  },

  /** Get all certificates for a donor by donorId string */
  getByDonor: async (donorId: string) => {
    return client.get<any[]>(`/certificates/by-donor/${donorId}`);
  },

  /** Get all certificates for a user */
  list: async (recipientType: string, userId: string) => {
    return client.get<any[]>(`/certificates/list?recipientType=${recipientType}&userId=${userId}`);
  },

  /** Download volunteer appreciation certificate */
  downloadVolunteerCert: async (volunteerId: string) => {
    const blob = await client.get<Blob>(`/certificates/volunteer/${volunteerId}`);
    triggerDownload(blob, `volunteer-cert-${volunteerId}.pdf`);
  },

  /** Download camp participation certificate */
  downloadCampCert: async (volunteerId: string, campId: string) => {
    const blob = await client.get<Blob>(`/certificates/camp/${volunteerId}/${campId}`);
    triggerDownload(blob, `camp-cert-${campId}.pdf`);
  },

  /** Download partner certificate */
  downloadPartnerCert: async (partnerId: string) => {
    const blob = await client.get<Blob>(`/certificates/partner/${partnerId}`);
    triggerDownload(blob, `partner-cert-${partnerId}.pdf`);
  },
};

function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
