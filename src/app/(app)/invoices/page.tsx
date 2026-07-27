"use client";

// Invoice History
// Reference mockup: billora_invoice_history_page.png
// Status filter tabs + search + table, now backed by /api/invoices
// (Prisma) instead of src/lib/mockData.ts.

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch, IconFileInvoice, IconRepeat } from "@tabler/icons-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import SkeletonRows from "@/components/dashboard/SkeletonRows";
import { useApiData } from "@/hooks/useApiData";
import { money, dateFmt, type LiveInvoice, type InvoiceStatus } from "@/lib/liveData";

const TABS: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

export default function InvoiceHistoryPage() {
  const { data: invoices, loading, error, refetch } = useApiData<LiveInvoice>("/api/invoices", "invoices");
  const [tab, setTab] = useState<InvoiceStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter((inv) => {
      const matchesTab = tab === "all" || inv.status === tab;
      const matchesQuery =
        query.trim() === "" ||
        inv.customer.name.toLowerCase().includes(query.toLowerCase()) ||
        inv.number.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [invoices, tab, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Invoices</h1>
        <div className="flex items-center gap-2.5">
          <a
            href="/invoices/recurring"
            className="flex items-center gap-1.5 border border-border text-ink rounded-md px-4 py-2.5 text-sm hover:bg-bg transition-colors"
          >
            <IconRepeat size={15} />
            Recurring
          </a>
          <a
            href="/invoices/create"
            className="bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
          >
            New invoice
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-bg border border-border rounded-full p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                tab === t.value ? "bg-navy text-white" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search invoices"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm border border-border rounded-md pl-9 pr-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonRows />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={IconFileInvoice}
            title={invoices && invoices.length === 0 ? "No invoices yet" : "No invoices found"}
            description={
              invoices && invoices.length === 0
                ? "Create your first invoice to see it here."
                : "Try a different search or filter, or create a new invoice."
            }
            action={{ label: "Clear filters", onClick: () => { setTab("all"); setQuery(""); } }}
          />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs text-muted uppercase tracking-wide border-b border-border">
              <span>Client</span>
              <span>Invoice #</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="w-20 text-right">Status</span>
            </div>
            {filtered.map((inv) => (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg/60 transition-colors"
              >
                <p className="text-sm text-ink col-span-2 md:col-span-1 truncate">{inv.customer.name}</p>
                <p className="text-xs text-muted">{inv.number}</p>
                <p className="text-xs text-muted">{dateFmt(inv.issueDate)}</p>
                <p className="text-sm font-mono text-ink md:text-right">{money(inv.total)}</p>
                <div className="md:w-20 flex md:justify-end">
                  <StatusBadge status={inv.status} />
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
