import { LineItem } from "@/hooks/useLineItems";
import { DEFAULT_TEMPLATE_ID, TemplateId, getTemplate } from "@/lib/invoiceTemplates";

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
  discountType?: "percent" | "fixed";
  discountValue?: number;
  totalLabel: string;
  notes?: string;
  extraLine?: { label: string; value: string };
  templateId?: TemplateId;
}

const money = (n: number) => `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

// Live preview + printable document used by all four document-building
// pages (invoice generator, estimate generator, receipt maker, and the
// dashboard's Invoices > Create). Wrapped in #printable-area so the page's
// print stylesheet can isolate it.
//
// `templateId` swaps the header treatment and total-row emphasis between
// the 5 templates defined in src/lib/invoiceTemplates.ts — see the "mark /
// hairline / band / block / compact" header variants below. The line-item
// table and party/date blocks stay structurally identical across
// templates on purpose (COMPONENT_GUIDE.md "one responsibility per
// component" — 5 templates should feel like 5 dressings on one reliable
// layout, not 5 separate components to maintain).
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
  discountType = "percent",
  discountValue = 0,
  totalLabel,
  notes,
  extraLine,
  templateId = DEFAULT_TEMPLATE_ID,
}: DocumentPreviewCardProps) {
  const rawDiscount = discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal);
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = discountedSubtotal * (taxPercent / 100);
  const total = discountedSubtotal + taxAmount;
  const dense = templateId === "compact";
  // headerStyle is a separate enum from templateId (see invoiceTemplates.ts —
  // e.g. the "modern" template uses the "band" header treatment). Look it up
  // instead of comparing templateId directly against header-style values.
  const headerStyle = getTemplate(templateId).headerStyle;

  return (
    <div id="printable-area" className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header — 5 distinct treatments sharing the same content */}
      {headerStyle === "band" && (
        <div className="bg-orange px-6 py-5 flex justify-between items-start">
          <p className="text-lg font-medium text-white">Billora</p>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{docTypeLabel}</p>
            <p className="text-xs text-white/80">{docNumber || "—"}</p>
          </div>
        </div>
      )}
      {headerStyle === "block" && (
        <div className="bg-navy px-6 py-6 flex justify-between items-end">
          <div>
            <p className="text-xs text-white/60 mb-1">Billora</p>
            <p className="text-2xl font-medium text-white leading-none">{docTypeLabel}</p>
          </div>
          <p className="text-xs text-white/70">{docNumber || "—"}</p>
        </div>
      )}

      <div className={dense ? "p-4" : "p-6"}>
        {headerStyle === "mark" && (
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
        )}
        {headerStyle === "hairline" && (
          <div className="mb-8 pb-4 border-b border-ink/20">
            <div className="flex justify-between items-baseline">
              <p className="text-base font-medium text-ink">Billora</p>
              <p className="text-xs text-ink/70 uppercase tracking-wide">{docTypeLabel}</p>
            </div>
            <p className="text-xs text-ink/50 mt-1">{docNumber || "—"}</p>
          </div>
        )}
        {headerStyle === "compact" && (
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-4 border-2 border-orange border-r-0" />
              <p className="text-sm font-medium text-navy">Billora</p>
            </div>
            <p className="text-xs text-muted">
              {docTypeLabel} · {docNumber || "—"}
            </p>
          </div>
        )}

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${dense ? "mb-3" : "mb-5"}`}>
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

        <div className={`flex flex-wrap gap-x-6 gap-y-1 text-xs ${dense ? "mb-3" : "mb-5"}`}>
          {dateFields.map((d) => (
            <div key={d.label}>
              <span className="text-muted">{d.label}: </span>
              <span className="text-navy">{d.value || "—"}</span>
            </div>
          ))}
        </div>

        <div className={`border-y border-[#EEF1FB] space-y-2 ${dense ? "py-2 mb-2" : "py-3 mb-3"}`}>
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

        <div className={`space-y-1.5 ${dense ? "mb-2" : "mb-4"}`}>
          {(taxPercent > 0 || discountAmount > 0) && (
            <div className="flex justify-between text-xs text-text">
              <span>Subtotal</span>
              <span className="font-mono">{money(subtotal)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-xs text-text">
              <span>
                Discount {discountType === "percent" ? `(${discountValue}%)` : ""}
              </span>
              <span className="font-mono">-{money(discountAmount)}</span>
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
          {templateId === "compact" ? (
            <div className="flex justify-between text-base font-medium text-white bg-navy rounded-md px-3 py-2 mt-2">
              <span>{totalLabel}</span>
              <span className="font-mono">{money(total)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-base font-medium text-navy pt-1.5 border-t border-[#EEF1FB]">
              <span>{totalLabel}</span>
              <span className="font-mono">{money(total)}</span>
            </div>
          )}
        </div>

        {notes && (
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-1">Notes</p>
            <p className="text-xs text-text whitespace-pre-line">{notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
