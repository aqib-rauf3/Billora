"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { LineItem } from "@/hooks/useLineItems";

interface LineItemsEditorProps {
  items: LineItem[];
  mode: "qty-rate" | "amount-only";
  onUpdate: (id: string, patch: Partial<LineItem>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  addLabel?: string;
}

// Editable table of line items shared by the invoice generator, estimate
// generator, and receipt maker. In "qty-rate" mode both quantity and rate
// are editable and amount is derived; in "amount-only" mode (receipts)
// quantity is fixed at 1 and only description + amount are shown.
//
// Mobile: a 12-col grid can't fit description + qty + rate + delete at a
// usable width, so below md each row becomes a small bordered card (label
// above each field, description full width, qty/rate side by side). At md+
// it collapses back into the original single-line grid table via
// `md:contents` on the field groups.
export default function LineItemsEditor({
  items,
  mode,
  onUpdate,
  onAdd,
  onRemove,
  addLabel = "Add line item",
}: LineItemsEditorProps) {
  const inputClass =
    "w-full text-sm border border-border rounded-md px-2.5 py-1.5 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
  const mobileLabelClass = "text-[10px] text-muted uppercase tracking-wide mb-1 md:hidden";

  return (
    <div>
      <div className="hidden md:grid md:grid-cols-12 gap-2 text-xs text-muted uppercase tracking-wide mb-2 px-1">
        <span className="col-span-6">Description</span>
        {mode === "qty-rate" ? (
          <>
            <span className="col-span-2">Qty</span>
            <span className="col-span-3">Rate</span>
          </>
        ) : (
          <span className="col-span-5">Amount</span>
        )}
        <span className="col-span-1" />
      </div>

      <div className="space-y-2.5 md:space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-lg p-3 md:border-0 md:rounded-none md:p-0 md:grid md:grid-cols-12 md:gap-2 md:items-center"
          >
            <div className="flex items-start gap-2 mb-2 md:mb-0 md:contents">
              <div className="flex-1 md:col-span-6">
                <label className={mobileLabelClass}>Description</label>
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => onUpdate(item.id, { description: e.target.value })}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={items.length === 1}
                aria-label="Remove line item"
                className="md:hidden mt-4 flex-shrink-0 p-1.5 -mr-1.5 text-muted hover:text-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <IconTrash size={16} />
              </button>
            </div>

            {mode === "qty-rate" ? (
              <div className="flex gap-2 md:contents">
                <div className="flex-1 md:col-span-2">
                  <label className={mobileLabelClass}>Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) => onUpdate(item.id, { qty: Number(e.target.value) || 0 })}
                    className={inputClass}
                  />
                </div>
                <div className="flex-1 md:col-span-3">
                  <label className={mobileLabelClass}>Rate</label>
                  <input
                    type="number"
                    min={0}
                    value={item.rate}
                    onChange={(e) => onUpdate(item.id, { rate: Number(e.target.value) || 0 })}
                    className={inputClass}
                  />
                </div>
              </div>
            ) : (
              <div className="md:col-span-5">
                <label className={mobileLabelClass}>Amount</label>
                <input
                  type="number"
                  min={0}
                  value={item.rate}
                  onChange={(e) => onUpdate(item.id, { rate: Number(e.target.value) || 0, qty: 1 })}
                  className={inputClass}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={items.length === 1}
              aria-label="Remove line item"
              className="hidden md:col-span-1 md:flex justify-center text-muted hover:text-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex items-center gap-1.5 text-xs text-ink hover:text-inkLight transition-colors"
      >
        <IconPlus size={14} />
        {addLabel}
      </button>
    </div>
  );
}
