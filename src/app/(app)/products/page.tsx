"use client";

// Products & Services — the price/service library used when building
// invoices (Phase 2 module). List + "Add product" modal, same pattern as
// Expenses, backed by /api/products.

import { useMemo, useState } from "react";
import { IconSearch, IconBox, IconPlus, IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import SkeletonRows from "@/components/dashboard/SkeletonRows";
import Modal from "@/components/ui/Modal";
import { useApiData } from "@/hooks/useApiData";
import { money, type LiveProduct } from "@/lib/liveData";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

export default function ProductsPage() {
  const { data: products, loading, error, refetch } = useApiData<LiveProduct>(
    "/api/products",
    "products"
  );
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("item");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (query.trim() === "") return products;
    return products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [products, query]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setUnit("item");
    setDescription("");
    setFormError("");
  };

  const handleAdd = async () => {
    if (!name.trim() || !price || Number(price) < 0) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), unit, description }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't add the product.");
      }
      resetForm();
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't add the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) refetch();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Products &amp; Services</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          <IconPlus size={16} />
          Add product
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Items in library" value={String(products?.length ?? 0)} />
        <StatCard
          label="Average price"
          value={
            products && products.length > 0
              ? money(products.reduce((s, p) => s + p.price, 0) / products.length)
              : money(0)
          }
        />
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:w-64">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search products"
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
            icon={IconBox}
            title={products && products.length === 0 ? "No products yet" : "No products found"}
            description={
              products && products.length === 0
                ? "Add a product or service so it's one click away when building an invoice."
                : "Try a different search, or add a new product."
            }
            action={{ label: "Add product", onClick: () => setModalOpen(true) }}
          />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs text-muted uppercase tracking-wide border-b border-border">
              <span>Name</span>
              <span>Unit</span>
              <span className="text-right">Price</span>
              <span className="w-8" />
            </div>
            {filtered.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg/60 transition-colors"
              >
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-ink truncate">{p.name}</p>
                  {p.description && (
                    <p className="text-xs text-muted truncate">{p.description}</p>
                  )}
                </div>
                <p className="text-xs text-muted">{p.unit || "—"}</p>
                <p className="text-sm font-mono text-ink md:text-right">{money(p.price)}</p>
                <div className="md:w-8 flex md:justify-end">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    aria-label={`Delete ${p.name}`}
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
        title="Add product"
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
            placeholder="e.g. Logo design"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className={labelClass}>Price (Rs.)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className={inputClass}
              placeholder="item, hour, project…"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            placeholder="Short note for your own reference"
          />
        </div>
      </Modal>
    </div>
  );
}
