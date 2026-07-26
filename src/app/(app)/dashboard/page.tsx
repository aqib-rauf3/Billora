"use client";

// Dashboard
// Reference mockup: billora_dashboard_page.png
// Stat cards + recent invoices list — now backed by /api/invoices and
// /api/customers (Prisma), and the greeting uses the real signed-in user's
// name via useSession() instead of a hardcoded name.

import { useSession } from "next-auth/react";
import { IconTrendingUp, IconAlertCircle, IconFileInvoice, IconUsers } from "@tabler/icons-react";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ErrorState from "@/components/dashboard/ErrorState";
import { useApiData } from "@/hooks/useApiData";
import { money, type LiveInvoice, type LiveCustomer } from "@/lib/liveData";

export default function DashboardPage() {
  const { data: session } = useSession();
  const {
    data: invoices,
    loading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useApiData<LiveInvoice>("/api/invoices", "invoices");
  const { data: customers, loading: customersLoading } = useApiData<LiveCustomer>(
    "/api/customers",
    "customers"
  );

  const loading = invoicesLoading || customersLoading;
  const firstName = session?.user?.name?.split(" ")[0];

  const totalEarned = (invoices ?? [])
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);
  const outstanding = (invoices ?? [])
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.total, 0);
  const recentInvoices = [...(invoices ?? [])]
    .sort((a, b) => (a.issueDate < b.issueDate ? 1 : -1))
    .slice(0, 4);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-ink">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
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
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-5 h-[84px] animate-pulse" />
          ))
        ) : (
          <>
            <StatCard label="Total earned" value={money(totalEarned)} icon={IconTrendingUp} />
            <StatCard label="Outstanding" value={money(outstanding)} icon={IconAlertCircle} tone="warning" />
            <StatCard label="Invoices sent" value={String(invoices?.length ?? 0)} icon={IconFileInvoice} />
            <StatCard label="Active clients" value={String(customers?.length ?? 0)} icon={IconUsers} />
          </>
        )}
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-medium text-ink">Recent invoices</p>
          <a href="/invoices" className="text-xs text-navy dark:text-[#8FA9E8] font-medium hover:underline">
            View all
          </a>
        </div>
        <div>
          {invoicesLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-3.5 border-b border-border last:border-0 animate-pulse">
                <div className="h-3.5 bg-border/60 rounded w-1/3" />
              </div>
            ))
          ) : invoicesError ? (
            <ErrorState message={invoicesError} onRetry={refetchInvoices} />
          ) : recentInvoices.length === 0 ? (
            <p className="text-sm text-muted text-center py-10">
              No invoices yet —{" "}
              <a href="/invoices/create" className="text-navy dark:text-[#8FA9E8] hover:underline">
                create your first one
              </a>
              .
            </p>
          ) : (
            recentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border last:border-0"
              >
                <p className="text-sm text-ink flex-1 min-w-0 truncate">{inv.customer.name}</p>
                <p className="text-xs text-muted hidden sm:block w-20">{inv.number}</p>
                <p className="text-sm font-mono text-ink w-24 text-right">{money(inv.total)}</p>
                <div className="w-20 flex justify-end">
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
