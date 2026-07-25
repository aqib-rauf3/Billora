"use client";

// Receipt Maker Tool
// Reference mockup: billora_receipt_maker_tool.png
// Free tool — client-side form + live receipt preview. "Download PDF" uses
// the browser's native print dialog (Save as PDF) since there's no backend yet.

import { useState } from "react";
import { IconPrinter } from "@tabler/icons-react";
import Navbar from "@/components/layout/Navbar";
import FadeInSection from "@/components/motion/FadeInSection";
import LineItemsEditor from "@/components/tools/LineItemsEditor";
import DocumentPreviewCard from "@/components/tools/DocumentPreviewCard";
import { useLineItems } from "@/hooks/useLineItems";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy bg-white";
const labelClass = "text-xs text-text block mb-1.5";

const PAYMENT_METHODS = ["Cash", "Bank transfer", "Card", "Other"];

export default function ReceiptMakerTool() {
  const { items, update, add, remove, subtotal } = useLineItems(1);

  const [fromName, setFromName] = useState("");
  const [fromDetail, setFromDetail] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerDetail, setPayerDetail] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("RCPT-0001");
  const [paidDate, setPaidDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState("Payment received in full.");

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      <section className="px-7 py-12 max-w-6xl mx-auto">
        <FadeInSection>
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
            Free tool
          </span>
          <h1 className="text-2xl md:text-[28px] font-medium text-navy mb-2">
            Receipt Maker
          </h1>
          <p className="text-sm text-text mb-8 max-w-lg">
            Confirm a payment with a clean, professional receipt. No sign-up needed — print or
            save as PDF when you&apos;re done.
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 print:block">
          <FadeInSection className="bg-white rounded-xl p-6 print:hidden">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={labelClass}>From</label>
                <input
                  type="text"
                  placeholder="Your business name"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className={`${inputClass} mb-2`}
                />
                <textarea
                  placeholder="Email, address..."
                  rows={2}
                  value={fromDetail}
                  onChange={(e) => setFromDetail(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Received from</label>
                <input
                  type="text"
                  placeholder="Payer name"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className={`${inputClass} mb-2`}
                />
                <textarea
                  placeholder="Email, address..."
                  rows={2}
                  value={payerDetail}
                  onChange={(e) => setPayerDetail(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className={labelClass}>Receipt #</label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Date paid</label>
                <input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Payment method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={inputClass}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>Items paid for</label>
              <LineItemsEditor
                items={items}
                mode="amount-only"
                onUpdate={update}
                onAdd={add}
                onRemove={remove}
                addLabel="Add item"
              />
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

            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 bg-navy text-white rounded-md py-2.5 text-sm hover:bg-navyLight transition-colors"
            >
              <IconPrinter size={16} />
              Print / Save as PDF
            </button>
          </FadeInSection>

          <FadeInSection delay={0.1} className="print:block">
            <div className="md:sticky md:top-24">
              <DocumentPreviewCard
                docTypeLabel="Receipt"
                docNumber={receiptNumber}
                dateFields={[{ label: "Paid on", value: paidDate }]}
                from={{ label: "From", name: fromName, detail: fromDetail }}
                to={{ label: "Received from", name: payerName, detail: payerDetail }}
                items={items}
                mode="amount-only"
                subtotal={subtotal}
                totalLabel="Amount received"
                notes={notes}
                extraLine={{ label: "Payment method", value: paymentMethod }}
              />
            </div>
          </FadeInSection>
        </div>
      </section>
    </main>
  );
}
