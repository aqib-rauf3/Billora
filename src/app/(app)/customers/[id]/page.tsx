"use client";

// Customer detail — Phase 2 gap fix (the list page had no way to open a
// single customer). Shows contact info (inline-editable), their invoice
// history, and billed/outstanding totals. Backed by GET/PATCH/DELETE
// /api/customers/[id]; invoices come from /api/invoices filtered
// client-side by customerId, same as the stat shown on the list cards.

import { useEffect, useMemo, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconMail,
  IconBuilding,
  IconTrash,
  IconCheck,
  IconAlertTriangle,
  IconFileInvoice,
} from "@tabler/icons-react";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ErrorState from "@/components/dashboard/ErrorState";
import EmptyState from "@/components/dashboard/EmptyState";
import Modal from "@/components/ui/Modal";
import TagInput from "@/components/ui/TagInput";
import { useApiData } from "@/hooks/useApiData";
import { money, dateFmt, type LiveCustomer, type LiveInvoice } from "@/lib/liveData";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const router = useRouter();

  const [customer, setCustomer] = useState<LiveCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: invoices } = useApiData<LiveInvoice>("/api/invoices", "invoices");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/customers/${id}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't load this customer.");
      }
      const body = await res.json();
      setCustomer(body.customer);
      setName(body.customer.name);
      setCompany(body.customer.company ?? "");
      setEmail(body.customer.email ?? "");
      setNotes(body.customer.notes ?? "");
      setTags(body.customer.tags ?? []);
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

  const customerInvoices = useMemo(
    () => (invoices ?? []).filter((inv) => inv.customerId === id),
    [invoices, id]
  );
  const billed = customerInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const outstanding = customerInvoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i) => s + i.total, 0);

  const handleSave = async () => {
    if (name.trim().length < 1) return;
    setSaving(true);
    setFormError("");
    setSaved(false);
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), company, email, notes, tags }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't save changes.");
      }
      const body = await res.json();
      setCustomer(body.customer);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't delete this customer.");
      }
      router.push("/customers");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't delete this customer.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="h-8 w-40 bg-surface border border-border rounded-md animate-pulse mb-6" />
        <div className="h-48 bg-surface border border-border rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="max-w-3xl bg-surface border border-border rounded-lg">
        <ErrorState message={error ?? "Customer not found."} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.push("/customers")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-4"
      >
        <IconArrowLeft size={15} />
        Back to customers
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-navy text-white text-sm font-medium flex items-center justify-center flex-shrink-0">
            {initials(customer.name)}
          </div>
          <div>
            <h1 className="text-2xl font-medium text-ink">{customer.name}</h1>
            {customer.company && <p className="text-sm text-muted">{customer.company}</p>}
          </div>
        </div>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-red border border-border rounded-md px-3 py-2 transition-colors"
        >
          <IconTrash size={15} />
          Delete
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Invoices" value={String(customerInvoices.length)} />
        <StatCard label="Total billed" value={money(billed)} />
        <StatCard label="Outstanding" value={money(outstanding)} tone={outstanding > 0 ? "warning" : "default"} />
      </div>

      <div className="bg-surface border border-border rounded-lg p-5 mb-6">
        <p className="text-sm font-medium text-ink mb-4">Contact details</p>
        {formError && (
          <div className="flex items-start gap-2 bg-redBg text-red text-xs rounded-md px-3 py-2.5 mb-3.5">
            <IconAlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            {formError}
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className={labelClass}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>
              <IconBuilding size={11} className="inline mr-1 -mt-0.5" />
              Company
            </label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="mb-4">
          <label className={labelClass}>
            <IconMail size={11} className="inline mr-1 -mt-0.5" />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="mb-4">
          <label className={labelClass}>Tags</label>
          <TagInput tags={tags} onChange={setTags} placeholder="e.g. VIP, retainer…" />
        </div>
        <div className="mb-4">
          <label className={labelClass}>Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Anything worth remembering about this client"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-navy text-white rounded-md px-4 py-2 text-sm hover:bg-navyLight transition-colors disabled:opacity-60"
        >
          {saved ? (
            <>
              <IconCheck size={15} />
              Saved
            </>
          ) : saving ? (
            "Saving…"
          ) : (
            "Save changes"
          )}
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-sm font-medium text-ink">Invoices</p>
        </div>
        {customerInvoices.length === 0 ? (
          <EmptyState
            icon={IconFileInvoice}
            title="No invoices yet"
            description="Invoices for this customer will show up here."
          />
        ) : (
          customerInvoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/invoices/${inv.id}`}
              className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg/60 transition-colors"
            >
              <div>
                <p className="text-sm text-ink">{inv.number}</p>
                <p className="text-xs text-muted">{dateFmt(inv.issueDate)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-mono text-ink">{money(inv.total)}</p>
                <StatusBadge status={inv.status} />
              </div>
            </Link>
          ))
        )}
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this customer?"
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
        {deleteError && (
          <div className="flex items-start gap-2 bg-redBg text-red text-xs rounded-md px-3 py-2.5 mb-3.5">
            <IconAlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            {deleteError}
          </div>
        )}
        <p className="text-sm text-text">
          This permanently deletes {customer.name} from your customer list. This can&apos;t be undone.
        </p>
      </Modal>
    </div>
  );
}
