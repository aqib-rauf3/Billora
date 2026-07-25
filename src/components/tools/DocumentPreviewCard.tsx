import { LineItem } from "@/hooks/useLineItems";

interface PartyBlock {
  label: string;
  name: string;
  detail: string;
}

interface DateField {
  label: string;
  value: string;
}

interface DocumentPreviewCardProps {
  docTypeLabel: string;
  docNumber: string;
  dateFields: DateField[];
  from: PartyBlock;
  to: PartyBlock;
  items: LineItem[];
  mode: "qty-rate" | "amount-only";
  subtotal: number;
  taxPercent?: number;
  totalLabel: string;
  notes?: string;
  extraLine?: { label: string; value: string };
}

const money = (n: number) => `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

// Live preview + printable document used by all three free tools
// (invoice generator, estimate generator, receipt maker). Wrapped in
// #printable-area so the page's print stylesheet can isolate it.
export default function DocumentPreviewCard({
  docTypeLabel,
  docNumber,
  dateFields,
  from,
  to,
  items,
  mode,
  subtotal,
  taxPercent = 0,
  totalLabel,
  notes,
  extraLine,
}: DocumentPreviewCardProps) {
  const taxAmount = subtotal * (taxPercent / 100);
  const total = subtotal + taxAmount;

  return (
    <div id="printable-area" className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
          <p className="text-lg font-medium text-navy mt-1">Billora</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-navy">{docTypeLabel}</p>
          <p className="text-xs text-muted">{docNumber || "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">{from.label}</p>
          <p className="text-sm text-navy font-medium">{from.name || "—"}</p>
          <p className="text-xs text-text whitespace-pre-line">{from.detail}</p>
        </div>
        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">{to.label}</p>
          <p className="text-sm text-navy font-medium">{to.name || "—"}</p>
          <p className="text-xs text-text whitespace-pre-line">{to.detail}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 mb-5 text-xs">
        {dateFields.map((d) => (
          <div key={d.label}>
            <span className="text-muted">{d.label}: </span>
            <span className="text-navy">{d.value || "—"}</span>
          </div>
        ))}
      </div>

      <div className="border-y border-[#EEF1FB] py-3 mb-3 space-y-2">
        <div className="flex justify-between text-xs text-muted uppercase tracking-wide">
          <span>Description</span>
          <span>Amount</span>
        </div>
        {items
          .filter((it) => it.description.trim() !== "" || it.qty * it.rate > 0)
          .map((it) => (
            <div key={it.id} className="flex justify-between text-xs text-text">
              <span>
                {it.description || "Untitled item"}
                {mode === "qty-rate" && it.qty !== 1 && (
                  <span className="text-muted"> × {it.qty}</span>
                )}
              </span>
              <span className="font-mono">{money(it.qty * it.rate)}</span>
            </div>
          ))}
        {items.every((it) => it.description.trim() === "" && it.qty * it.rate === 0) && (
          <p className="text-xs text-muted italic">Add a line item to see it here.</p>
        )}
      </div>

      <div className="space-y-1.5 mb-4">
        {taxPercent > 0 && (
          <div className="flex justify-between text-xs text-text">
            <span>Subtotal</span>
            <span className="font-mono">{money(subtotal)}</span>
          </div>
        )}
        {taxPercent > 0 && (
          <div className="flex justify-between text-xs text-text">
            <span>Tax ({taxPercent}%)</span>
            <span className="font-mono">{money(taxAmount)}</span>
          </div>
        )}
        {extraLine && (
          <div className="flex justify-between text-xs text-text">
            <span>{extraLine.label}</span>
            <span className="font-mono">{extraLine.value}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-medium text-navy pt-1.5 border-t border-[#EEF1FB]">
          <span>{totalLabel}</span>
          <span className="font-mono">{money(total)}</span>
        </div>
      </div>

      {notes && (
        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Notes</p>
          <p className="text-xs text-text whitespace-pre-line">{notes}</p>
        </div>
      )}
    </div>
  );
}
