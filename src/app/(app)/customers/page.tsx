"use client";

// Customer Management
// Reference mockup: billora_customer_management_page.png
// Search + grid of customer cards, "Add customer" quick-add modal — now
// backed by /api/customers and /api/invoices (Prisma) instead of mock data.

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconUsers,
  IconPlus,
  IconMail,
  IconAlertTriangle,
  IconDownload,
  IconUpload,
  IconTag,
  IconLoader2,
} from "@tabler/icons-react";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import Modal from "@/components/ui/Modal";
import TagInput from "@/components/ui/TagInput";
import { useApiData } from "@/hooks/useApiData";
import { money, type LiveCustomer, type LiveInvoice } from "@/lib/liveData";
import { buildCsv, downloadCsv, parseCsv } from "@/lib/csv";

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
  const [tagFilter, setTagFilter] = useState("");
  const [outstandingOnly, setOutstandingOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; failedRows: number[] } | null>(null);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    (customers ?? []).forEach((c) => c.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [customers]);

  const outstandingCustomerIds = useMemo(() => {
    const ids = new Set<string>();
    (invoices ?? []).forEach((inv) => {
      if (inv.status === "pending" || inv.status === "overdue") ids.add(inv.customerId);
    });
    return ids;
  }, [invoices]);

  const filtered = useMemo(() => {
    if (!customers) return [];
    return customers.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q);
      const matchesTag = tagFilter === "" || (c.tags ?? []).includes(tagFilter);
      const matchesOutstanding = !outstandingOnly || outstandingCustomerIds.has(c.id);
      return matchesQuery && matchesTag && matchesOutstanding;
    });
  }, [customers, query, tagFilter, outstandingOnly, outstandingCustomerIds]);

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setNotes("");
    setTags([]);
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
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          notes: notes.trim(),
          tags,
        }),
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

  const handleExport = () => {
    const rows = filtered.map((c) => [
      c.name,
      c.email ?? "",
      c.company ?? "",
      (c.tags ?? []).join(";"),
      c.notes ?? "",
    ]);
    const csv = buildCsv(["Name", "Email", "Company", "Tags", "Notes"], rows);
    downloadCsv(`billora-customers-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleImportFile = async (file: File) => {
    setImporting(true);
    setImportError("");
    setImportResult(null);
    try {
      const text = await file.text();
      const [header, ...dataRows] = parseCsv(text);
      if (!header) throw new Error("The file looks empty.");

      const col = (label: string) =>
        header.findIndex((h) => h.trim().toLowerCase() === label.toLowerCase());
      const nameIdx = col("Name");
      const emailIdx = col("Email");
      const companyIdx = col("Company");
      const tagsIdx = col("Tags");

      if (nameIdx === -1) {
        throw new Error('Couldn\'t find a "Name" column — check the CSV headers match the export format.');
      }

      const rows = dataRows
        .filter((r) => (r[nameIdx] ?? "").trim())
        .map((r) => ({
          name: r[nameIdx]?.trim() ?? "",
          email: emailIdx >= 0 ? r[emailIdx]?.trim() : "",
          company: companyIdx >= 0 ? r[companyIdx]?.trim() : "",
          tags: tagsIdx >= 0 ? (r[tagsIdx] ?? "").split(";").map((t) => t.trim()).filter(Boolean) : [],
        }));

      if (rows.length === 0) throw new Error("No valid rows found in that file.");

      const res = await fetch("/api/customers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Import failed.");

      setImportResult(body);
      refetch();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Customers</h1>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 border border-border text-ink rounded-md px-3.5 py-2.5 text-sm hover:bg-bg transition-colors"
          >
            <IconUpload size={15} />
            Import
          </button>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 border border-border text-ink rounded-md px-3.5 py-2.5 text-sm hover:bg-bg transition-colors disabled:opacity-50"
          >
            <IconDownload size={15} />
            Export
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
          >
            <IconPlus size={16} />
            Add customer
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
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

        {allTags.length > 0 && (
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy bg-surface transition-colors"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <label className="flex items-center gap-1.5 text-sm text-text cursor-pointer select-none">
          <input
            type="checkbox"
            checked={outstandingOnly}
            onChange={(e) => setOutstandingOnly(e.target.checked)}
            className="w-4 h-4 accent-orange"
          />
          Outstanding balance only
        </label>

        {(query || tagFilter || outstandingOnly) && (
          <button
            onClick={() => {
              setQuery("");
              setTagFilter("");
              setOutstandingOnly(false);
            }}
            className="text-xs text-muted hover:text-ink transition-colors"
          >
            Clear filters
          </button>
        )}
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
              <Link
                key={c.id}
                href={`/customers/${c.id}`}
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

                {c.tags && c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3.5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-bg text-muted text-[10px] rounded-full px-2 py-0.5"
                      >
                        <IconTag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>
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
              </Link>
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
        <div className="mb-3.5">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="client@company.com"
          />
        </div>
        <div className="mb-3.5">
          <label className={labelClass}>Tags</label>
          <TagInput tags={tags} onChange={setTags} placeholder="e.g. VIP, retainer…" />
        </div>
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Anything worth remembering about this client (optional)"
          />
        </div>
      </Modal>

      <Modal
        open={importOpen}
        onClose={() => {
          setImportOpen(false);
          setImportResult(null);
          setImportError("");
        }}
        title="Import customers"
        footer={
          <button
            onClick={() => {
              setImportOpen(false);
              setImportResult(null);
              setImportError("");
            }}
            className="text-sm text-muted hover:text-ink px-3 py-2 transition-colors"
          >
            {importResult ? "Done" : "Cancel"}
          </button>
        }
      >
        {importResult ? (
          <div className="text-center py-4">
            <p className="text-sm font-medium text-ink mb-1">
              Imported {importResult.imported} customer{importResult.imported === 1 ? "" : "s"}
            </p>
            {importResult.failedRows.length > 0 && (
              <p className="text-xs text-amber">
                Rows {importResult.failedRows.join(", ")} couldn&apos;t be imported.
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-muted mb-4">
              CSV with a <code className="text-[11px] bg-bg px-1 py-0.5 rounded">Name</code> column
              (required) and optional{" "}
              <code className="text-[11px] bg-bg px-1 py-0.5 rounded">Email</code>,{" "}
              <code className="text-[11px] bg-bg px-1 py-0.5 rounded">Company</code>,{" "}
              <code className="text-[11px] bg-bg px-1 py-0.5 rounded">Tags</code> columns — same
              format as the Export button produces.
            </p>
            {importError && (
              <div className="flex items-start gap-2 bg-redBg text-red text-xs rounded-md px-3 py-2.5 mb-3.5">
                <IconAlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                {importError}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-md py-6 text-sm text-muted hover:text-ink hover:border-navy transition-colors disabled:opacity-60"
            >
              {importing ? (
                <>
                  <IconLoader2 size={16} className="animate-spin" />
                  Importing…
                </>
              ) : (
                <>
                  <IconUpload size={16} />
                  Choose a CSV file
                </>
              )}
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
