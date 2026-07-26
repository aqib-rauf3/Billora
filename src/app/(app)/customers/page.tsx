"use client";

// Customer Management
// Reference mockup: billora_customer_management_page.png
// Search + grid of customer cards, "Add customer" quick-add modal — now
// backed by /api/customers and /api/invoices (Prisma) instead of mock data.

import { useMemo, useState } from "react";
import { IconSearch, IconUsers, IconPlus, IconMail, IconAlertTriangle } from "@tabler/icons-react";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import Modal from "@/components/ui/Modal";
import { useApiData } from "@/hooks/useApiData";
import { money, type LiveCustomer, type LiveInvoice } from "@/lib/liveData";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function CustomerManagementPage() {
  const { data: customers, loading, error, refetch } = useApiData<LiveCustomer>(
    "/api/customers",
    "customers"
  );
  const { data: invoices } = useApiData<LiveInvoice>("/api/invoices", "invoices");

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    if (!customers) return [];
    if (query.trim() === "") return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    );
  }, [customers, query]);

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setFormError("");
  };

  const handleAdd = async () => {
    if (name.trim().length < 2) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), company: company.trim(), email: email.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't add the customer.");
      }
      resetForm();
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't add the customer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Customers</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          <IconPlus size={16} />
          Add customer
        </button>
      </div>

      <div className="mb-5">
        <div className="relative w-full sm:w-64">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search customers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm border border-border rounded-md pl-9 pr-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-5 h-[148px] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-surface border border-border rounded-lg">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg">
          <EmptyState
            icon={IconUsers}
            title={customers && customers.length === 0 ? "No customers yet" : "No customers found"}
            description={
              customers && customers.length === 0
                ? "Add your first customer to start invoicing."
                : "Try a different search, or add a new customer."
            }
            action={{ label: "Add customer", onClick: () => setModalOpen(true) }}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const customerInvoices = (invoices ?? []).filter((inv) => inv.customerId === c.id);
            const billed = customerInvoices
              .filter((inv) => inv.status === "paid")
              .reduce((sum, inv) => sum + inv.total, 0);

            return (
              <div
                key={c.id}
                className="bg-surface border border-border rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-full bg-navy text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                    <p className="text-xs text-muted truncate">{c.company || "—"}</p>
                  </div>
                </div>

                {c.email && (
                  <p className="flex items-center gap-1.5 text-xs text-muted mb-3.5 truncate">
                    <IconMail size={13} className="flex-shrink-0" />
                    {c.email}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wide">Invoices</p>
                    <p className="text-sm text-ink font-mono">{customerInvoices.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted uppercase tracking-wide">Total paid</p>
                    <p className="text-sm text-ink font-mono">{money(billed)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add customer"
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
              {saving ? "Adding…" : "Add"}
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
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Client or contact name"
          />
        </div>
        <div className="mb-3.5">
          <label className={labelClass}>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
            placeholder="Business name (optional)"
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="client@company.com"
          />
        </div>
      </Modal>
    </div>
  );
}
