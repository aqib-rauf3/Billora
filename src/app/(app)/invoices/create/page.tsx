"use client";

// Create Invoice
// Reference mockup: billora_create_invoice_page.png
// Same line-items + live-preview engine as the free invoice-generator tool
// (useLineItems / LineItemsEditor / DocumentPreviewCard — reused rather
// than rebuilt, per COMPONENT_GUIDE.md). Customer list and the "Save
// invoice" action are now wired to /api/customers and /api/invoices.

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconPrinter, IconCheck, IconLoader2, IconAlertTriangle } from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";
import LineItemsEditor from "@/components/tools/LineItemsEditor";
import DocumentPreviewCard from "@/components/tools/DocumentPreviewCard";
import TemplatePicker from "@/components/tools/TemplatePicker";
import { useLineItems } from "@/hooks/useLineItems";
import { useApiData } from "@/hooks/useApiData";
import type { LiveCustomer } from "@/lib/liveData";
import { DEFAULT_TEMPLATE_ID, TemplateId } from "@/lib/invoiceTemplates";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function CreateInvoicePage() {
  const router = useRouter();
  const { items, update, add, remove, subtotal } = useLineItems(2);
  const { data: customers, loading: customersLoading } = useApiData<LiveCustomer>(
    "/api/customers",
    "customers"
  );

  const [customerId, setCustomerId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business.");
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_TEMPLATE_ID);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");

  const customer = useMemo(
    () => customers?.find((c) => c.id === customerId),
    [customers, customerId]
  );

  const handleSave = async () => {
    if (!customer || !issueDate || !dueDate) return;
    setSaveState("saving");
    setSaveError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          ...(invoiceNumber.trim() && { number: invoiceNumber.trim() }),
          status: "pending",
          issueDate,
          dueDate,
          taxPercent,
          note: notes,
          items: items.map((it) => ({ desc: it.description, qty: it.qty, rate: it.rate })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't save the invoice.");
      }
      setSaveState("saved");
      setTimeout(() => router.push("/invoices"), 900);
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Couldn't save the invoice.");
    }
  };

  const canSave =
    saveState === "idle" || saveState === "error"
      ? Boolean(customer && issueDate && dueDate && items.every((it) => it.description.trim()))
      : false;

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink mb-6">Create invoice</h1>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 print:block">
        <FadeInSection className="bg-surface border border-border rounded-lg p-6 print:hidden">
          <div className="mb-5">
            <label className={labelClass}>Bill to</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              disabled={customersLoading}
              className={inputClass}
            >
              <option value="">
                {customersLoading ? "Loading customers…" : "Select a customer"}
              </option>
              {customers?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.company ? ` — ${c.company}` : ""}
                </option>
              ))}
            </select>
            {customers && customers.length === 0 && !customersLoading && (
              <p className="text-xs text-muted mt-1.5">
                No customers yet — <a href="/customers" className="text-navy dark:text-[#8FA9E8] hover:underline">add one first</a>.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className={labelClass}>Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Auto-generated"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Issue date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className={labelClass}>Line items</label>
            <LineItemsEditor items={items} mode="qty-rate" onUpdate={update} onAdd={add} onRemove={remove} />
          </div>

          <div className="mb-5">
            <TemplatePicker value={templateId} onChange={setTemplateId} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelClass}>Tax (%)</label>
              <input
                type="number"
                min={0}
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClass}>Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {saveState === "error" && (
            <div className="flex items-start gap-2 bg-redBg text-red text-xs rounded-md px-3 py-2.5 mb-4">
              <IconAlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              {saveError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleSave}
              disabled={!canSave || saveState === "saving" || saveState === "saved"}
              className="flex-1 flex items-center justify-center gap-2 bg-orange text-white rounded-md py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saveState === "saving" && <IconLoader2 size={16} className="animate-spin" />}
              {saveState === "saved" && <IconCheck size={16} />}
              {(saveState === "idle" || saveState === "error") && "Save invoice"}
              {saveState === "saving" && "Saving..."}
              {saveState === "saved" && "Saved — redirecting"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 bg-navy text-white rounded-md py-2.5 text-sm hover:bg-navyLight transition-colors"
            >
              <IconPrinter size={16} />
              Print / Save as PDF
            </button>
          </div>
          {!customer && (
            <p className="text-xs text-muted mt-2.5">Select a customer and dates before saving.</p>
          )}
        </FadeInSection>

        <FadeInSection delay={0.1} className="print:block">
          <div className="lg:sticky lg:top-24">
            <DocumentPreviewCard
              docTypeLabel="Invoice"
              docNumber={invoiceNumber || "Auto-generated"}
              dateFields={[
                { label: "Issued", value: issueDate },
                { label: "Due", value: dueDate },
              ]}
              from={{ label: "From", name: "Your business", detail: "" }}
              to={{
                label: "Bill to",
                name: customer?.name ?? "",
                detail: customer ? `${customer.company ?? ""}\n${customer.email ?? ""}` : "",
              }}
              items={items}
              mode="qty-rate"
              subtotal={subtotal}
              taxPercent={taxPercent}
              totalLabel="Total due"
              notes={notes}
              templateId={templateId}
            />
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
