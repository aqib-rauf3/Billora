"use client";

// Invoice detail — Phase 2 gap fix (the list page had no way to open a
// single invoice). Shows the line items/totals, lets you change status,
// record a payment against it (mirrors the flow on /payments), and delete
// it. Backed by GET/PATCH/DELETE /api/invoices/[id], which also returns
// `payments`/`paid`/`balance` alongside the invoice.

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconTrash,
  IconPlus,
  IconAlertTriangle,
  IconFileInvoice,
  IconDownload,
  IconLink,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ErrorState from "@/components/dashboard/ErrorState";
import Modal from "@/components/ui/Modal";
import { money, dateFmt, type LiveInvoice, type InvoiceStatus, type PaymentMethod } from "@/lib/liveData";
import { generateDocumentPdf } from "@/lib/generateDocumentPdf";

const STATUSES: InvoiceStatus[] = ["draft", "pending", "paid", "overdue"];
const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
];
const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const router = useRouter();

  const [invoice, setInvoice] = useState<LiveInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [note, setNote] = useState("");
  const [paySaving, setPaySaving] = useState(false);
  const [payError, setPayError] = useState("");
  const [businessName, setBusinessName] = useState("Your business");

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (body?.user?.business) setBusinessName(body.user.business);
      })
      .catch(() => {});
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't load this invoice.");
      }
      const body = await res.json();
      setInvoice(body.invoice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const changeStatus = async (status: InvoiceStatus) => {
    if (!invoice) return;
    setStatusSaving(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await load();
    } finally {
      setStatusSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/invoices");
    } finally {
      setDeleting(false);
    }
  };

  const openPayModal = () => {
    setAmount(invoice ? String(invoice.balance ?? invoice.total) : "");
    setMethod("bank_transfer");
    setNote("");
    setPayError("");
    setPayModalOpen(true);
  };

  const handleRecordPayment = async () => {
    if (!amount || Number(amount) <= 0) return;
    setPaySaving(true);
    setPayError("");
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: id, amount: Number(amount), method, note }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't record the payment.");
      }
      setPayModalOpen(false);
      await load();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Couldn't record the payment.");
    } finally {
      setPaySaving(false);
    }
  };

  const shareUrl = invoice?.shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/i/${invoice.shareToken}`
    : "";

  const openShareModal = () => {
    setShareCopied(false);
    setShareModalOpen(true);
  };

  const handleGenerateLink = async () => {
    setShareLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}/share`, { method: "POST" });
      if (res.ok) await load();
    } finally {
      setShareLoading(false);
    }
  };

  const handleRevokeLink = async () => {
    setShareLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}/share`, { method: "DELETE" });
      if (res.ok) await load();
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!invoice) return;
    generateDocumentPdf({
      docTypeLabel: "Invoice",
      docNumber: invoice.number,
      dateFields: [
        { label: "Issued", value: dateFmt(invoice.issueDate) },
        { label: "Due", value: dateFmt(invoice.dueDate) },
      ],
      from: { label: "From", name: businessName, detail: "" },
      to: {
        label: "Bill to",
        name: invoice.customer.name,
        detail: `${invoice.customer.company ?? ""}\n${invoice.customer.email ?? ""}`,
      },
      items: invoice.items.map((it) => ({ id: it.id, description: it.desc, qty: it.qty, rate: it.rate })),
      mode: "qty-rate",
      subtotal: invoice.items.reduce((s, item) => s + item.qty * item.rate, 0),
      taxPercent: invoice.taxPercent,
      discountType: invoice.discountType,
      discountValue: invoice.discountValue,
      totalLabel: "Total due",
      notes: invoice.note ?? undefined,
      templateId: "classic",
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="h-8 w-40 bg-surface border border-border rounded-md animate-pulse mb-6" />
        <div className="h-64 bg-surface border border-border rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-3xl bg-surface border border-border rounded-lg">
        <ErrorState message={error ?? "Invoice not found."} onRetry={load} />
      </div>
    );
  }

  const subtotal = invoice.items.reduce((s, item) => s + item.qty * item.rate, 0);
  const rawDiscount =
    invoice.discountType === "percent"
      ? subtotal * (invoice.discountValue / 100)
      : invoice.discountValue;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal);
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = discountedSubtotal * (invoice.taxPercent / 100);

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.push("/invoices")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-4"
      >
        <IconArrowLeft size={15} />
        Back to invoices
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-medium text-ink">{invoice.number}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="text-sm text-muted">{invoice.customer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={invoice.status}
            disabled={statusSaving}
            onChange={(e) => changeStatus(e.target.value as InvoiceStatus)}
            className="text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy bg-surface disabled:opacity-60"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Mark as {s}
              </option>
            ))}
          </select>
          <button
            onClick={openShareModal}
            className="flex items-center gap-1.5 border border-border text-ink rounded-md px-3.5 py-2 text-sm hover:bg-bg transition-colors"
          >
            <IconLink size={15} />
            Share
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 bg-navy text-white rounded-md px-3.5 py-2 text-sm hover:bg-navyLight transition-colors"
          >
            <IconDownload size={15} />
            PDF
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete invoice"
            className="p-2 text-muted hover:text-red border border-border rounded-md transition-colors"
          >
            <IconTrash size={16} />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-xs text-muted mb-1">Total</p>
          <p className="text-lg font-medium text-ink">{money(invoice.total)}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-xs text-muted mb-1">Paid</p>
          <p className="text-lg font-medium text-green">{money(invoice.paid ?? 0)}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-xs text-muted mb-1">Balance</p>
          <p className={`text-lg font-medium ${(invoice.balance ?? 0) > 0 ? "text-red" : "text-ink"}`}>
            {money(invoice.balance ?? 0)}
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Line items</p>
          <div className="text-xs text-muted">
            Issued {dateFmt(invoice.issueDate)} · Due {dateFmt(invoice.dueDate)}
          </div>
        </div>
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 text-xs text-muted uppercase tracking-wide border-b border-border">
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Amount</span>
        </div>
        {invoice.items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-x-4 gap-y-1 px-5 py-3 border-b border-border last:border-0"
          >
            <p className="text-sm text-ink col-span-2 md:col-span-1">{item.desc}</p>
            <p className="text-xs text-muted md:text-right">{item.qty}</p>
            <p className="text-xs text-muted md:text-right">{money(item.rate)}</p>
            <p className="text-sm font-mono text-ink md:text-right">{money(item.qty * item.rate)}</p>
          </div>
        ))}
        <div className="px-5 py-3 space-y-1 bg-bg/40">
          <div className="flex justify-between text-xs text-muted">
            <span>Subtotal</span>
            <span className="font-mono">{money(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-xs text-muted">
              <span>
                Discount {invoice.discountType === "percent" ? `(${invoice.discountValue}%)` : ""}
              </span>
              <span className="font-mono">-{money(discountAmount)}</span>
            </div>
          )}
          {invoice.taxPercent > 0 && (
            <div className="flex justify-between text-xs text-muted">
              <span>Tax ({invoice.taxPercent}%)</span>
              <span className="font-mono">{money(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-medium text-ink pt-1">
            <span>Total</span>
            <span className="font-mono">{money(invoice.total)}</span>
          </div>
        </div>
        {invoice.note && (
          <div className="px-5 py-3 border-t border-border text-xs text-muted">{invoice.note}</div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Payments</p>
          {(invoice.balance ?? 0) > 0 && (
            <button
              onClick={openPayModal}
              className="flex items-center gap-1 text-xs text-navy dark:text-[#8FA9E8] font-medium hover:underline"
            >
              <IconPlus size={13} />
              Record payment
            </button>
          )}
        </div>
        {!invoice.payments || invoice.payments.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <IconFileInvoice size={20} className="text-muted mx-auto mb-2" />
            <p className="text-xs text-muted">No payments recorded yet.</p>
          </div>
        ) : (
          invoice.payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm text-ink capitalize">{p.method.replace("_", " ")}</p>
                <p className="text-xs text-muted">{dateFmt(p.paidAt)}{p.note ? ` · ${p.note}` : ""}</p>
              </div>
              <p className="text-sm font-mono text-green">+{money(p.amount)}</p>
            </div>
          ))
        )}
      </div>

      <Modal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Record payment"
        footer={
          <>
            <button
              onClick={() => setPayModalOpen(false)}
              className="text-sm text-muted hover:text-ink px-3 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRecordPayment}
              disabled={paySaving}
              className="bg-navy text-white rounded-md px-4 py-2 text-sm hover:bg-navyLight transition-colors disabled:opacity-60"
            >
              {paySaving ? "Recording…" : "Record"}
            </button>
          </>
        }
      >
        {payError && (
          <div className="flex items-start gap-2 bg-redBg text-red text-xs rounded-md px-3 py-2.5 mb-3.5">
            <IconAlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            {payError}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className={labelClass}>Amount (Rs.)</label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} className={inputClass}>
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

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this invoice?"
        footer={
          <>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-muted hover:text-ink px-3 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red text-white rounded-md px-4 py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-sm text-text">
          This permanently deletes invoice {invoice.number} and its recorded payments. This can&apos;t be undone.
        </p>
      </Modal>

      <Modal open={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share invoice">
        <p className="text-xs text-muted mb-4">
          Anyone with this link can view (and download) this invoice — no login required. They
          can&apos;t edit it or see your other data.
        </p>
        {invoice.shareToken ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 text-xs border border-border rounded-md px-3 py-2.5 bg-bg text-muted font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 bg-navy text-white rounded-md px-3 py-2.5 text-sm hover:bg-navyLight transition-colors flex-shrink-0"
              >
                {shareCopied ? <IconCheck size={15} /> : <IconCopy size={15} />}
                {shareCopied ? "Copied" : "Copy"}
              </button>
            </div>
            <button
              onClick={handleRevokeLink}
              disabled={shareLoading}
              className="text-xs text-red hover:underline disabled:opacity-60"
            >
              {shareLoading ? "Revoking…" : "Revoke this link"}
            </button>
          </>
        ) : (
          <button
            onClick={handleGenerateLink}
            disabled={shareLoading}
            className="w-full flex items-center justify-center gap-1.5 bg-navy text-white rounded-md px-4 py-2.5 text-sm hover:bg-navyLight transition-colors disabled:opacity-60"
          >
            <IconLink size={15} />
            {shareLoading ? "Generating…" : "Generate share link"}
          </button>
        )}
      </Modal>
    </div>
  );
}
