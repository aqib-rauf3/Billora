"use client";

// Recurring Invoices — manage templates created from the "Make this a
// recurring invoice" toggle on Invoices > Create. Reuses the same
// list-page shape as invoices/page.tsx (useApiData + EmptyState/ErrorState/
// SkeletonRows) per COMPONENT_GUIDE.md.

import { useState } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconRepeat,
  IconPlayerPlay,
  IconPlayerPause,
  IconTrash,
  IconBolt,
} from "@tabler/icons-react";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import SkeletonRows from "@/components/dashboard/SkeletonRows";
import Modal from "@/components/ui/Modal";
import { useApiData } from "@/hooks/useApiData";
import { money, dateFmt } from "@/lib/liveData";
import { INTERVAL_LABELS, type RecurringInterval } from "@/lib/recurringInterval";

interface RecurringInvoiceRow {
  id: string;
  interval: RecurringInterval;
  active: boolean;
  nextRunDate: string;
  lastRunDate: string | null;
  taxPercent: number;
  discountType: "percent" | "fixed";
  discountValue: number;
  customer: { id: string; name: string; company: string | null } | null;
  items: { id: string; desc: string; qty: number; rate: number }[];
  invoices: { id: string }[];
}

export default function RecurringInvoicesPage() {
  const { data, loading, error, refetch } = useApiData<RecurringInvoiceRow>(
    "/api/recurring-invoices",
    "recurringInvoices"
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const toggleActive = async (row: RecurringInvoiceRow) => {
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/recurring-invoices/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !row.active }),
      });
      if (res.ok) await refetch();
    } finally {
      setBusyId(null);
    }
  };

  const generateNow = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/recurring-invoices/${id}/generate`, { method: "POST" });
      if (res.ok) await refetch();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setBusyId(confirmDeleteId);
    try {
      const res = await fetch(`/api/recurring-invoices/${confirmDeleteId}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmDeleteId(null);
        await refetch();
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <Link
        href="/invoices"
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-4 w-fit"
      >
        <IconArrowLeft size={15} />
        Back to invoices
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-medium text-ink">Recurring invoices</h1>
          <p className="text-sm text-muted mt-1">
            Templates that automatically bill a customer on a schedule.
          </p>
        </div>
        <a
          href="/invoices/create"
          className="bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          New recurring invoice
        </a>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonRows />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={IconRepeat}
            title="No recurring invoices yet"
            description='Turn on "Make this a recurring invoice" while creating an invoice to bill a customer automatically.'
            action={{ label: "Create an invoice", onClick: () => (window.location.href = "/invoices/create") }}
          />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs text-muted uppercase tracking-wide border-b border-border">
              <span>Client</span>
              <span>Repeats</span>
              <span>Next invoice</span>
              <span>Generated</span>
              <span className="w-44 text-right">Actions</span>
            </div>
            {data.map((row) => {
              const total = row.items.reduce((s, it) => s + it.qty * it.rate, 0);
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-2 px-5 py-3.5 border-b border-border last:border-0 items-center"
                >
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-sm text-ink truncate">{row.customer?.name ?? "—"}</p>
                    <p className="text-xs text-muted font-mono">{money(total)} / cycle</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs bg-bg border border-border rounded-full px-2.5 py-1">
                      <IconRepeat size={11} />
                      {INTERVAL_LABELS[row.interval]}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    {row.active ? dateFmt(row.nextRunDate) : "Paused"}
                  </p>
                  <p className="text-xs text-muted">{row.invoices.length} invoice{row.invoices.length === 1 ? "" : "s"}</p>
                  <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => generateNow(row.id)}
                      disabled={busyId === row.id}
                      title="Generate an invoice now"
                      className="p-2 text-muted hover:text-orange border border-border rounded-md transition-colors disabled:opacity-50"
                    >
                      <IconBolt size={15} />
                    </button>
                    <button
                      onClick={() => toggleActive(row)}
                      disabled={busyId === row.id}
                      title={row.active ? "Pause" : "Resume"}
                      className="p-2 text-muted hover:text-ink border border-border rounded-md transition-colors disabled:opacity-50"
                    >
                      {row.active ? <IconPlayerPause size={15} /> : <IconPlayerPlay size={15} />}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(row.id)}
                      title="Delete"
                      className="p-2 text-muted hover:text-red border border-border rounded-md transition-colors"
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <Modal
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete this recurring invoice?"
        footer={
          <>
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="text-sm text-muted hover:text-ink px-3 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={busyId === confirmDeleteId}
              className="bg-red text-white rounded-md px-4 py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {busyId === confirmDeleteId ? "Deleting…" : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-sm text-text">
          This stops future invoices from being generated. Invoices already created from this
          template are kept.
        </p>
      </Modal>
    </div>
  );
}
