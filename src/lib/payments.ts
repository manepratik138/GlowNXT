export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cash";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface PaymentIntent {
  bookingId?: string;
  amount: number;
  method: PaymentMethod;
  currency: "INR";
}

export interface PaymentRecord extends PaymentIntent {
  id: string;
  status: PaymentStatus;
  provider?: string;
  providerTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGateway {
  createPaymentIntent(intent: PaymentIntent): Promise<{ clientSecret: string }>;
  confirmPayment(clientSecret: string): Promise<PaymentRecord>;
  refundPayment(paymentId: string, amount?: number): Promise<PaymentRecord>;
}

export class PaymentGatewayNotConfiguredError extends Error {
  constructor() {
    super("Payment gateway is not configured. Add the provider server credentials before accepting online payments.");
    this.name = "PaymentGatewayNotConfiguredError";
  }
}

export const paymentGateway: PaymentGateway = {
  async createPaymentIntent() {
    throw new PaymentGatewayNotConfiguredError();
  },
  async confirmPayment() {
    throw new PaymentGatewayNotConfiguredError();
  },
  async refundPayment() {
    throw new PaymentGatewayNotConfiguredError();
  },
};