// Sample data for Dashboard, Invoices, Estimates, Expenses, Customers.
// TODO: replace every export here with real fetches once the API routes
// (src/app/api/*) are wired to Prisma — field names below intentionally
// mirror prisma/schema.prisma (Invoice.status/issueDate/dueDate,
// InvoiceItem.desc/qty/rate, Expense.category/amount/note, etc.) so that
// swap is a rename, not a redesign. A few UI-only fields (customerName,
// amount on Estimate) aren't in the current schema yet — marked below.

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  company: string; // UI-only — schema has no company field yet
  createdAt: string;
}

export interface MockInvoiceItem {
  id: string;
  desc: string;
  qty: number;
  rate: number;
}

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

export interface MockInvoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  customerId: string;
  customerName: string; // denormalized for display; real data would join Customer
  issueDate: string;
  dueDate: string;
  taxPercent: number;
  items: MockInvoiceItem[];
}

export type EstimateStatus = "pending" | "approved" | "rejected";

export interface MockEstimate {
  id: string;
  number: string; // UI-only — not in schema yet
  customerName: string; // UI-only — not in schema yet
  amount: number; // UI-only — not in schema yet
  status: EstimateStatus;
  validUntil: string;
  createdAt: string;
}

export interface MockExpense {
  id: string;
  category: string;
  amount: number;
  note: string;
  createdAt: string;
}

export const CUSTOMERS: MockCustomer[] = [
  { id: "c1", name: "Northline Traders", email: "billing@northline.pk", company: "Northline Traders", createdAt: "2026-03-02" },
  { id: "c2", name: "Zara Ahmed", email: "zara@zaradesigns.com", company: "Zara Designs", createdAt: "2026-03-18" },
  { id: "c3", name: "Blue Harbor Cafe", email: "accounts@bluharbor.pk", company: "Blue Harbor Cafe", createdAt: "2026-04-05" },
  { id: "c4", name: "Devko Traders", email: "finance@devko.pk", company: "Devko Traders", createdAt: "2026-04-22" },
  { id: "c5", name: "Coral Studio", email: "hello@coralstudio.io", company: "Coral Studio", createdAt: "2026-05-10" },
  { id: "c6", name: "Meherbaan Textiles", email: "ops@meherbaan.pk", company: "Meherbaan Textiles", createdAt: "2026-05-29" },
  { id: "c7", name: "Sana Tariq", email: "sana@freelance.dev", company: "Independent", createdAt: "2026-06-14" },
  { id: "c8", name: "Prime Logistics", email: "billing@primelogistics.pk", company: "Prime Logistics", createdAt: "2026-06-30" },
  { id: "c9", name: "Aqib Rauf Studio", email: "studio@aqibrauf.com", company: "Aqib Rauf Studio", createdAt: "2026-07-08" },
];

export const INVOICES: MockInvoice[] = [
  { id: "i1", number: "INV-0231", status: "pending", customerId: "c1", customerName: "Northline Traders", issueDate: "2026-07-18", dueDate: "2026-08-01", taxPercent: 0, items: [{ id: "ii1", desc: "Landing page redesign", qty: 1, rate: 45000 }, { id: "ii2", desc: "API integration (x6)", qty: 6, rate: 3500 }] },
  { id: "i2", number: "INV-0230", status: "paid", customerId: "c2", customerName: "Zara Designs", issueDate: "2026-07-12", dueDate: "2026-07-26", taxPercent: 0, items: [{ id: "ii3", desc: "Brand identity package", qty: 1, rate: 29000 }] },
  { id: "i3", number: "INV-0229", status: "overdue", customerId: "c3", customerName: "Blue Harbor Cafe", issueDate: "2026-06-30", dueDate: "2026-07-14", taxPercent: 0, items: [{ id: "ii4", desc: "Menu + signage design", qty: 1, rate: 18000 }] },
  { id: "i4", number: "INV-0228", status: "paid", customerId: "c4", customerName: "Devko Traders", issueDate: "2026-06-22", dueDate: "2026-07-06", taxPercent: 5, items: [{ id: "ii5", desc: "Inventory dashboard", qty: 1, rate: 49600 }] },
  { id: "i5", number: "INV-0227", status: "paid", customerId: "c5", customerName: "Coral Studio", issueDate: "2026-06-15", dueDate: "2026-06-29", taxPercent: 0, items: [{ id: "ii6", desc: "Illustration set (x5)", qty: 5, rate: 4900 }] },
  { id: "i6", number: "INV-0226", status: "overdue", customerId: "c6", customerName: "Meherbaan Textiles", issueDate: "2026-06-02", dueDate: "2026-06-16", taxPercent: 0, items: [{ id: "ii7", desc: "Product photography", qty: 1, rate: 33200 }] },
  { id: "i7", number: "INV-0225", status: "pending", customerId: "c8", customerName: "Prime Logistics", issueDate: "2026-07-20", dueDate: "2026-08-03", taxPercent: 0, items: [{ id: "ii8", desc: "Fleet tracking UI", qty: 1, rate: 61000 }] },
  { id: "i8", number: "INV-0224", status: "paid", customerId: "c9", customerName: "Aqib Rauf Studio", issueDate: "2026-05-28", dueDate: "2026-06-11", taxPercent: 0, items: [{ id: "ii9", desc: "Portfolio site", qty: 1, rate: 21000 }] },
];

export const ESTIMATES: MockEstimate[] = [
  { id: "e1", number: "EST-0041", customerName: "Prime Logistics", amount: 84000, status: "pending", validUntil: "2026-08-10", createdAt: "2026-07-20" },
  { id: "e2", number: "EST-0040", customerName: "Coral Studio", amount: 15600, status: "approved", validUntil: "2026-07-30", createdAt: "2026-07-14" },
  { id: "e3", number: "EST-0039", customerName: "Northline Traders", amount: 52000, status: "rejected", validUntil: "2026-07-22", createdAt: "2026-07-05" },
  { id: "e4", number: "EST-0038", customerName: "Zara Designs", amount: 27500, status: "approved", validUntil: "2026-07-18", createdAt: "2026-06-28" },
  { id: "e5", number: "EST-0037", customerName: "Meherbaan Textiles", amount: 39000, status: "pending", validUntil: "2026-08-05", createdAt: "2026-07-22" },
];

export const EXPENSES: MockExpense[] = [
  { id: "x1", category: "Software", amount: 4500, note: "Figma team plan — July", createdAt: "2026-07-21" },
  { id: "x2", category: "Contractors", amount: 32000, note: "Freelance illustrator — Coral job", createdAt: "2026-07-17" },
  { id: "x3", category: "Travel", amount: 8200, note: "Client meeting, Lahore-Karachi", createdAt: "2026-07-10" },
  { id: "x4", category: "Office", amount: 3100, note: "Printer ink + stationery", createdAt: "2026-07-06" },
  { id: "x5", category: "Software", amount: 1800, note: "Domain renewals", createdAt: "2026-06-29" },
  { id: "x6", category: "Marketing", amount: 12000, note: "Instagram ads — June", createdAt: "2026-06-20" },
];

export const invoiceTotal = (inv: Pick<MockInvoice, "items" | "taxPercent">) => {
  const subtotal = inv.items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  return subtotal + subtotal * (inv.taxPercent / 100);
};
