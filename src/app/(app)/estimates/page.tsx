"use client";

// Estimates
// No dedicated app mockup exists for this yet, so it mirrors the Invoice
// History pattern (status tabs + search + table) for design consistency —
// same StatusBadge/EmptyState components, different status set
// (pending/approved/rejected, per prisma/schema.prisma's Estimate model).
// "New estimate" reuses the free Estimate Generator tool rather than
// duplicating a second line-item builder for a feature with no schema
// fields (amount/customer/items) yet.

import { useMemo, useState } from "react";
import { IconSearch, IconClipboardText } from "@tabler/icons-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { ESTIMATES } from "@/lib/mockData";
import type { EstimateStatus } from "@/lib/mockData";

const money = (n: number) => `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const TABS: { label: string; value: EstimateStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function EstimatesPage() {
  const [tab, setTab] = useState<EstimateStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return ESTIMATES.filter((est) => {
      const matchesTab = tab === "all" || est.status === tab;
      const matchesQuery =
        query.trim() === "" ||
        est.customerName.toLowerCase().includes(query.toLowerCase()) ||
        est.number.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  const approvedValue = ESTIMATES.filter((e) => e.status === "approved").reduce((s, e) => s + e.amount, 0);
  const pendingValue = ESTIMATES.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Estimates</h1>
        <a
          href="/tools/estimate-generator"
          className="bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          New estimate
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Awaiting response" value={money(pendingValue)} />
        <StatCard label="Approved value" value={money(approvedValue)} />
        <StatCard label="Total estimates" value={String(ESTIMATES.length)} />
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
            placeholder="Search estimates"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm border border-border rounded-md pl-9 pr-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={IconClipboardText}
            title="No estimates found"
            description="Try a different search or filter, or create a new estimate."
            action={{ label: "Clear filters", onClick: () => { setTab("all"); setQuery(""); } }}
          />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs text-muted uppercase tracking-wide border-b border-border">
              <span>Client</span>
              <span>Estimate #</span>
              <span>Valid until</span>
              <span className="text-right">Amount</span>
              <span className="w-20 text-right">Status</span>
            </div>
            {filtered.map((est) => (
              <div
                key={est.id}
                className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg/60 transition-colors"
              >
                <p className="text-sm text-ink col-span-2 md:col-span-1 truncate">{est.customerName}</p>
                <p className="text-xs text-muted">{est.number}</p>
                <p className="text-xs text-muted">{dateFmt(est.validUntil)}</p>
                <p className="text-sm font-mono text-ink md:text-right">{money(est.amount)}</p>
                <div className="md:w-20 flex md:justify-end">
                  <StatusBadge status={est.status} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
