"use client";

// Invoice History
// Reference mockup: billora_invoice_history_page.png
// Status filter tabs + search + table. See src/lib/mockData.ts for the
// TODO on swapping this to a real fetch.

import { useMemo, useState } from "react";
import { IconSearch, IconFileInvoice } from "@tabler/icons-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EmptyState from "@/components/dashboard/EmptyState";
import { INVOICES, invoiceTotal } from "@/lib/mockData";
import type { InvoiceStatus } from "@/lib/mockData";

const money = (n: number) => `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const TABS: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

export default function InvoiceHistoryPage() {
  const [tab, setTab] = useState<InvoiceStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return INVOICES.filter((inv) => {
      const matchesTab = tab === "all" || inv.status === tab;
      const matchesQuery =
        query.trim() === "" ||
        inv.customerName.toLowerCase().includes(query.toLowerCase()) ||
        inv.number.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Invoices</h1>
        <a
          href="/invoices/create"
          className="bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          New invoice
        </a>
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
        {filtered.length === 0 ? (
          <EmptyState
            icon={IconFileInvoice}
            title="No invoices found"
            description="Try a different search or filter, or create a new invoice."
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
              <div
                key={inv.id}
                className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg/60 transition-colors"
              >
                <p className="text-sm text-ink col-span-2 md:col-span-1 truncate">{inv.customerName}</p>
                <p className="text-xs text-muted">{inv.number}</p>
                <p className="text-xs text-muted">{dateFmt(inv.issueDate)}</p>
                <p className="text-sm font-mono text-ink md:text-right">{money(invoiceTotal(inv))}</p>
                <div className="md:w-20 flex md:justify-end">
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
