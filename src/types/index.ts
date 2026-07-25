// Shared TypeScript types for Billora
// TODO: derive these from Prisma's generated types where possible

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";
export type EstimateStatus = "pending" | "approved" | "rejected";
