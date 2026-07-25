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
export default function LineItemsEditor({
  items,
  mode,
  onUpdate,
  onAdd,
  onRemove,
  addLabel = "Add line item",
}: LineItemsEditorProps) {
  const inputClass =
    "w-full text-sm border border-border rounded-md px-2.5 py-1.5 outline-none focus:border-navy bg-white";

  return (
    <div>
      <div className="grid grid-cols-12 gap-2 text-xs text-muted uppercase tracking-wide mb-2 px-1">
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

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              type="text"
              placeholder="Item description"
              value={item.description}
              onChange={(e) => onUpdate(item.id, { description: e.target.value })}
              className={`col-span-6 ${inputClass}`}
            />
            {mode === "qty-rate" ? (
              <>
                <input
                  type="number"
                  min={0}
                  value={item.qty}
                  onChange={(e) => onUpdate(item.id, { qty: Number(e.target.value) || 0 })}
                  className={`col-span-2 ${inputClass}`}
                />
                <input
                  type="number"
                  min={0}
                  value={item.rate}
                  onChange={(e) => onUpdate(item.id, { rate: Number(e.target.value) || 0 })}
                  className={`col-span-3 ${inputClass}`}
                />
              </>
            ) : (
              <input
                type="number"
                min={0}
                value={item.rate}
                onChange={(e) => onUpdate(item.id, { rate: Number(e.target.value) || 0, qty: 1 })}
                className={`col-span-5 ${inputClass}`}
              />
            )}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={items.length === 1}
              aria-label="Remove line item"
              className="col-span-1 flex justify-center text-muted hover:text-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex items-center gap-1.5 text-xs text-navy hover:text-navyLight transition-colors"
      >
        <IconPlus size={14} />
        {addLabel}
      </button>
    </div>
  );
}
