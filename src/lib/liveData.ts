// Shared types + formatters for real (Prisma-backed) data returned by
// src/app/api/*. Replaces the per-page `money`/`dateFmt` duplicates and the
// Mock* interfaces in src/lib/mockData.ts now that the pages fetch live
// data. Field names mirror prisma/schema.prisma exactly.

export interface LiveCustomer {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
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
  note: string | null;
  items: LiveInvoiceItem[];
  total: number;
  createdAt: string;
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

export const money = (n: number) =>
  `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
