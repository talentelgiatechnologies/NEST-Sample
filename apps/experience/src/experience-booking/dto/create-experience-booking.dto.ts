import { ExperienceBookingTypeEnum } from "database/enitity/ExperienceDaySlots.entity";
import { WOMPI_STATUS } from "database/enitity/ExperiencePayout.entity";

export class ExperienceBookingDto {
    id: string;
    userId: string;
    date: string;
    isPrivate: boolean;
    guests: number;
    message: string;
    from: number;
    to: number;
    bookingType: ExperienceBookingTypeEnum;
    promoCode?: string;
    companyName?: string;
    companyNIT?: string;
    companyPhone?: string;
    companyEmail?: string;
}

export class ExperiencePayRequestBookingDto {
    id: string;
}

export interface TransactionUpdatedEvent {
    event: "transaction.updated" | "nequi_token.updated" | "bancolombia_transfer_token.updated	"; // e.g. "transaction.updated"
    data: {
        transaction: Transaction;
    };
    sent_at: string; // ISO date string
    timestamp: number;
    signature: Signature;
    environment: string; // e.g. "test"
}

export interface Transaction {
    id: string;
    created_at: string; // ISO date string
    finalized_at: string; // ISO date string
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string; // e.g. "COP"
    payment_method_type: string; // e.g. "CARD"
    payment_method: PaymentMethod | null;
    status: string; // e.g. "APPROVED"
    status_message: string | null;
    shipping_address: ShippingAddress | null;
    redirect_url: string;
    payment_source_id: string | null;
    payment_link_id: string | null;
    customer_data: CustomerData | null;
    billing_data: BillingData | null;
    origin: string | null;
}

export interface PaymentMethod {
    type?: string; // e.g. "CARD"
    extra?: Record<string, any>; // You can replace with specific fields if known
}

export interface ShippingAddress {
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    region?: string;
}

export interface CustomerData {
    full_name?: string;
    phone_number?: string;
    legal_id?: string;
    legal_id_type?: string;
}

export interface BillingData {
    full_name?: string;
    phone_number?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    country?: string;
}

export interface Signature {
    checksum: string;
    properties: string[];
}

export interface PayoutUpdatedEvent {
  event: 'payout.updated';
  data: {
    payout: {
      id: string;
      reference: string;
      amountInCents: number;
      paymentType: 'PAYROLL' | string; // extend if more types exist
      status: WOMPI_STATUS
      totalTransactions: number;
      currency: string;
    };
  };
  signature: {
    properties: string[];
    checksum: string;
  };
  timestamp: number;
  sentAt: string; // ISO date string
}
