import { client } from './client';

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string; // Razorpay Key ID
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  donationId: string;
}

export const donationApi = {
  createOrder: (amount: number, programId: string, donorDetails: any) => 
    client.post<CreateOrderResponse>('/donations/create', { amount, programId, ...donorDetails }),
    
  verifyPayment: (payload: PaymentVerificationPayload) => 
    client.post<{ success: boolean }>('/donations/verify', payload),
};
