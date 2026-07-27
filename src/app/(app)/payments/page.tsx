"use client";

// Payments — ledger of every payment recorded against an invoice (Phase 2
// module). "Record payment" picks an unpaid/overdue invoice, and the API
// auto-flips that invoice to "paid" once its full total is covered — see
// src/app/api/payments/route.ts.

import { useMemo, useState } from "react";
import { IconSearch, IconCash, IconPlus, IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import SkeletonRows from "@/components/dashboard/SkeletonRows";
import Modal from "@/components/ui/Modal";
import { useApiData } from "@/hooks/useApiData";
import { money, dateFmt, type LivePayment, type LiveInvoice, type PaymentMethod } from "@/lib/liveData";

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

export default function PaymentsPage() {
  const { data: payments, loading, error, refetch } = useApiData<LivePayment>(
    "/api/payments",
    "payments"
  );
  const { data: invoices } = useApiData<LiveInvoice>("/api/invoices", "invoices");

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const unpaidInvoices = useMemo(
    () => (invoices ?? []).filter((inv) => inv.status !== "paid" && inv.status !== "draft"),
    [invoices]
  );

  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!payments) return [];
    if (query.trim() === "") return payments;
    const q = query.toLowerCase();
    return payments.filter(
      (p) =>
        p.invoice?.number.toLowerCase().includes(q) ||
        p.invoice?.customer.name.toLowerCase().includes(q)
    );
  }, [payments, query]);

  const total = (payments ?? []).reduce((s, p) => s + p.amount, 0);

  const openModal = () => {
    setInvoiceId(unpaidInvoices[0]?.id ?? "");
    setAmount("");
    setMethod("bank_transfer");
    setNote("");
    setFormError("");
    setModalOpen(true);
  };

  const handleAdd = async () => {
    if (!invoiceId || !amount || Number(amount) <= 0) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, amount: Number(amount), method, note }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't record the payment.");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't record the payment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
      if (res.ok) refetch();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Payments</h1>
        <button
          onClick={openModal}
          disabled={unpaidInvoices.length === 0}
          title={unpaidInvoices.length === 0 ? "No unpaid invoices to record a payment against" : undefined}
          className="flex items-center gap-1.5 bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
        >
          <IconPlus size={16} />
          Record payment
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total received" value={money(total)} />
        <StatCard label="Payments logged" value={String(payments?.length ?? 0)} />
        <StatCard label="Invoices still unpaid" value={String(unpaidInvoices.length)} />
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:w-64">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by invoice or client"
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
            icon={IconCash}
            title={payments && payments.length === 0 ? "No payments yet" : "No payments found"}
            description={
              payments && payments.length === 0
                ? "Record a payment against an invoice to see it here."
                : "Try a different search."
            }
            action={
              unpaidInvoices.length > 0
                ? { label: "Record payment", onClick: openModal }
                : undefined
            }
          />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs text-muted uppercase tracking-wide border-b border-border">
              <span>Client / Invoice</span>
              <span>Method</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="w-8" />
            </div>
            {filtered.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg/60 transition-colors"
              >
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-ink truncate">{p.invoice?.customer.name ?? "—"}</p>
                  <p className="text-xs text-muted">{p.invoice?.number ?? "—"}</p>
                </div>
                <p className="text-xs text-muted capitalize">{p.method.replace("_", " ")}</p>
                <p className="text-xs text-muted">{dateFmt(p.paidAt)}</p>
                <p className="text-sm font-mono text-green md:text-right">+{money(p.amount)}</p>
                <div className="md:w-8 flex md:justify-end">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    aria-label="Delete payment"
                    className="text-muted hover:text-red transition-colors disabled:opacity-50"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record payment"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="text-sm text-muted hover:text-ink px-3 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-navy text-white rounded-md px-4 py-2 text-sm hover:bg-navyLight transition-colors disabled:opacity-60"
            >
              {saving ? "Recording…" : "Record"}
            </button>
          </>
        }
      >
        {formError && (
          <div className="flex items-start gap-2 bg-redBg text-red text-xs rounded-md px-3 py-2.5 mb-3.5">
            <IconAlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            {formError}
          </div>
        )}
        <div className="mb-3.5">
          <label className={labelClass}>Invoice</label>
          <select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} className={inputClass}>
            {unpaidInvoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.number} — {inv.customer.name} ({money(inv.total)})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className={labelClass}>Amount (Rs.)</label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className={inputClass}
            >
              {METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
            placeholder="Reference number, etc."
          />
        </div>
      </Modal>
    </div>
  );
}
