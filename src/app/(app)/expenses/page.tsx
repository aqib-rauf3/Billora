"use client";

// Expenses
// List + "Add expense" modal, now backed by /api/expenses (Prisma) instead
// of mock data. Categories match Expense.category in prisma/schema.prisma.

import { useMemo, useState } from "react";
import { IconSearch, IconReceipt2, IconPlus, IconAlertTriangle } from "@tabler/icons-react";
import StatCard from "@/components/dashboard/StatCard";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import SkeletonRows from "@/components/dashboard/SkeletonRows";
import Modal from "@/components/ui/Modal";
import { useApiData } from "@/hooks/useApiData";
import { money, dateFmt, type LiveExpense } from "@/lib/liveData";

const CATEGORIES = ["Software", "Contractors", "Travel", "Office", "Marketing", "Other"];

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

export default function ExpensesPage() {
  const { data: expenses, loading, error, refetch } = useApiData<LiveExpense>(
    "/api/expenses",
    "expenses"
  );
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    if (!expenses) return [];
    if (query.trim() === "") return expenses;
    return expenses.filter(
      (x) =>
        (x.note ?? "").toLowerCase().includes(query.toLowerCase()) ||
        x.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [expenses, query]);

  const total = (expenses ?? []).reduce((s, x) => s + x.amount, 0);

  const resetForm = () => {
    setCategory(CATEGORIES[0]);
    setAmount("");
    setNote("");
    setFormError("");
  };

  const handleAdd = async () => {
    if (!amount || Number(amount) <= 0) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount: Number(amount), note: note || category }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't add the expense.");
      }
      resetForm();
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't add the expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Expenses</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          <IconPlus size={16} />
          Add expense
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total spent" value={money(total)} />
        <StatCard label="Entries logged" value={String(expenses?.length ?? 0)} />
        <StatCard label="Categories" value={String(CATEGORIES.length)} />
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:w-64">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search expenses"
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
            icon={IconReceipt2}
            title={expenses && expenses.length === 0 ? "No expenses yet" : "No expenses found"}
            description={
              expenses && expenses.length === 0
                ? "Log your first expense to see it here."
                : "Try a different search, or log a new expense."
            }
            action={{ label: "Add expense", onClick: () => setModalOpen(true) }}
          />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs text-muted uppercase tracking-wide border-b border-border">
              <span>Note</span>
              <span>Category</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
            </div>
            {filtered.map((x) => (
              <div
                key={x.id}
                className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg/60 transition-colors"
              >
                <p className="text-sm text-ink col-span-2 md:col-span-1 truncate">{x.note}</p>
                <p className="text-xs text-muted">
                  <span className="bg-bg border border-border rounded px-2 py-0.5">{x.category}</span>
                </p>
                <p className="text-xs text-muted">{dateFmt(x.createdAt)}</p>
                <p className="text-sm font-mono text-ink md:text-right">{money(x.amount)}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add expense"
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
          <label className={labelClass}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3.5">
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
          <label className={labelClass}>Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
            placeholder="What was this for?"
          />
        </div>
      </Modal>
    </div>
  );
}
