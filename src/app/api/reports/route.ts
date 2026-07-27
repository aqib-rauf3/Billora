// Reports — aggregates existing Invoice/Expense/Payment data. No new
// storage of its own; every number here is computed from records the other
// modules already created.
// Methods: GET

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { computeInvoiceTotal } from "@/lib/invoiceTotals";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

// Last 6 calendar months including the current one, oldest first.
function lastSixMonthKeys(): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    keys.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  }
  return keys;
}

type ReportInvoice = {
  id: string;
  status: string;
  issueDate: Date;
  customerId: string;
  customer: { name: string };
  items: { qty: number; rate: number }[];
  taxPercent: number;
};

type ReportExpense = {
  id: string;
  category: string;
  amount: number;
  createdAt: Date;
};

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const [invoices, expenses, customers]: [ReportInvoice[], ReportExpense[], number] =
    await Promise.all([
      prisma.invoice.findMany({ where: { userId }, include: { items: true, customer: true } }),
      prisma.expense.findMany({ where: { userId } }),
      prisma.customer.count({ where: { userId } }),
    ]);

  const invoicesWithTotal: (ReportInvoice & { total: number })[] = invoices.map((inv) => ({
    ...inv,
    total: computeInvoiceTotal(inv.items, inv.taxPercent),
  }));

  // Revenue by month — paid invoices only, bucketed by issueDate.
  const monthKeys = lastSixMonthKeys();
  const revenueByMonth = new Map(monthKeys.map((k) => [k, 0]));
  const expensesByMonth = new Map(monthKeys.map((k) => [k, 0]));

  for (const inv of invoicesWithTotal) {
    if (inv.status !== "paid") continue;
    const key = monthKey(new Date(inv.issueDate));
    if (revenueByMonth.has(key)) revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + inv.total);
  }
  for (const exp of expenses) {
    const key = monthKey(new Date(exp.createdAt));
    if (expensesByMonth.has(key)) expensesByMonth.set(key, (expensesByMonth.get(key) ?? 0) + exp.amount);
  }

  const revenueSeries = monthKeys.map((key) => ({
    month: monthLabel(key),
    revenue: Math.round((revenueByMonth.get(key) ?? 0) * 100) / 100,
    expenses: Math.round((expensesByMonth.get(key) ?? 0) * 100) / 100,
  }));

  // Expenses by category.
  const byCategory = new Map<string, number>();
  for (const exp of expenses) {
    byCategory.set(exp.category, (byCategory.get(exp.category) ?? 0) + exp.amount);
  }
  const expensesByCategory = Array.from(byCategory.entries())
    .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 }))
    .sort((a, b) => b.amount - a.amount);

  // Outstanding vs paid.
  const totalPaid = invoicesWithTotal.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalOutstanding = invoicesWithTotal
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i) => s + i.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  // Top customers by paid revenue.
  const byCustomer = new Map<string, { name: string; total: number }>();
  for (const inv of invoicesWithTotal) {
    if (inv.status !== "paid") continue;
    const prev = byCustomer.get(inv.customerId) ?? { name: inv.customer.name, total: 0 };
    prev.total += inv.total;
    byCustomer.set(inv.customerId, prev);
  }
  const topCustomers = Array.from(byCustomer.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((c) => ({ ...c, total: Math.round(c.total * 100) / 100 }));

  return NextResponse.json({
    summary: {
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalOutstanding: Math.round(totalOutstanding * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netProfit: Math.round((totalPaid - totalExpenses) * 100) / 100,
      invoiceCount: invoices.length,
      customerCount: customers,
    },
    revenueSeries,
    expensesByCategory,
    topCustomers,
  });
}
