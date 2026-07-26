// Dashboard
// Reference mockup: billora_dashboard_page.png
// Stat cards + recent invoices list. Uses src/lib/mockData.ts until the API
// routes are wired to Prisma (DEVELOPMENT_RULES.md) — see that file's header
// comment for how the swap maps field-for-field onto the real schema.

import { IconTrendingUp, IconAlertCircle, IconFileInvoice, IconUsers } from "@tabler/icons-react";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { INVOICES, CUSTOMERS, invoiceTotal } from "@/lib/mockData";

const money = (n: number) => `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function DashboardPage() {
  const totalEarned = INVOICES.filter((i) => i.status === "paid").reduce(
    (sum, i) => sum + invoiceTotal(i),
    0
  );
  const outstanding = INVOICES.filter((i) => i.status === "pending" || i.status === "overdue").reduce(
    (sum, i) => sum + invoiceTotal(i),
    0
  );
  const recentInvoices = [...INVOICES]
    .sort((a, b) => (a.issueDate < b.issueDate ? 1 : -1))
    .slice(0, 4);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-ink">Welcome back, Aqib</h1>
          <p className="text-sm text-muted mt-1">Here&apos;s how your business is doing this month.</p>
        </div>
        <a
          href="/invoices/create"
          className="bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          New invoice
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total earned" value={money(totalEarned)} icon={IconTrendingUp} />
        <StatCard label="Outstanding" value={money(outstanding)} icon={IconAlertCircle} tone="warning" />
        <StatCard label="Invoices sent" value={String(INVOICES.length)} icon={IconFileInvoice} />
        <StatCard label="Active clients" value={String(CUSTOMERS.length)} icon={IconUsers} />
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-medium text-ink">Recent invoices</p>
          <a href="/invoices" className="text-xs text-navy dark:text-[#8FA9E8] font-medium hover:underline">
            View all
          </a>
        </div>
        <div>
          {recentInvoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border last:border-0"
            >
              <p className="text-sm text-ink flex-1 min-w-0 truncate">{inv.customerName}</p>
              <p className="text-xs text-muted hidden sm:block w-20">{inv.number}</p>
              <p className="text-sm font-mono text-ink w-24 text-right">{money(invoiceTotal(inv))}</p>
              <div className="w-20 flex justify-end">
                <StatusBadge status={inv.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
