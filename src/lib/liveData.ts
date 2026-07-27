// Shared types + formatters for real (Prisma-backed) data returned by
// src/app/api/*. Replaces the per-page `money`/`dateFmt` duplicates and the
// Mock* interfaces in src/lib/mockData.ts now that the pages fetch live
// data. Field names mirror prisma/schema.prisma exactly.

export interface LiveCustomer {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
}

export interface LiveInvoiceItem {
  id: string;
  desc: string;
  qty: number;
  rate: number;
}

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

export interface LiveInvoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  customerId: string;
  customer: LiveCustomer;
  issueDate: string;
  dueDate: string;
  taxPercent: number;
  discountType: "percent" | "fixed";
  discountValue: number;
  note: string | null;
  items: LiveInvoiceItem[];
  total: number;
  createdAt: string;
  // Only present on the /api/invoices/[id] detail response, not the list.
  payments?: LivePayment[];
  paid?: number;
  balance?: number;
  shareToken?: string | null;
}

export type EstimateStatus = "pending" | "approved" | "rejected";

export interface LiveEstimate {
  id: string;
  number: string | null;
  amount: number;
  status: EstimateStatus;
  validUntil: string | null;
  customerId: string | null;
  customer: LiveCustomer | null;
  createdAt: string;
}

export interface LiveExpense {
  id: string;
  category: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

export interface LiveProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
  createdAt: string;
}

export type PaymentMethod = "bank_transfer" | "cash" | "card" | "other";

export interface LivePayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  note: string | null;
  paidAt: string;
  invoiceId: string;
  invoice?: { id: string; number: string; customer: { name: string } };
  createdAt: string;
}

export type NotificationType = "welcome" | "payment_received" | "invoice_overdue";

export interface LiveNotification {
  id: string;
  type: NotificationType;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export const money = (n: number) =>
  `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
