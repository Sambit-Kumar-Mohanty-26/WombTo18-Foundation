import { client } from './client';

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  donationId: string;
  donorId: string;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  donationId: string;
}

export const donationApi = {
  createOrder: (payload: Record<string, unknown>) =>
    client.post<CreateOrderResponse>('/donations/create', payload),

  verifyPayment: (payload: PaymentVerificationPayload) => 
    client.post<{ success: boolean }>('/donations/verify', payload),
};
