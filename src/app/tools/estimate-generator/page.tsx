"use client";

// Estimate Generator Tool
// Reference mockup: billora_estimate_generator_tool.png
// Free tool — client-side line items + live preview. "Download PDF" uses the
// browser's native print dialog (Save as PDF) since there's no backend yet.

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

export default function EstimateGeneratorTool() {
  const { items, update, add, remove, subtotal } = useLineItems(2);

  const [fromName, setFromName] = useState("");
  const [fromDetail, setFromDetail] = useState("");
  const [toName, setToName] = useState("");
  const [toDetail, setToDetail] = useState("");
  const [estimateNumber, setEstimateNumber] = useState("EST-0001");
  const [issueDate, setIssueDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [notes, setNotes] = useState("This estimate is valid until the date above.");

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      <section className="px-7 py-12 max-w-6xl mx-auto">
        <FadeInSection>
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
            Free tool
          </span>
          <h1 className="text-2xl md:text-[28px] font-medium text-navy mb-2">
            Estimate Generator
          </h1>
          <p className="text-sm text-text mb-8 max-w-lg">
            Build a polished estimate in minutes. No sign-up needed — print or save as PDF when
            you&apos;re ready to send it.
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
                <label className={labelClass}>Prepared for</label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className={`${inputClass} mb-2`}
                />
                <textarea
                  placeholder="Email, address..."
                  rows={2}
                  value={toDetail}
                  onChange={(e) => setToDetail(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className={labelClass}>Estimate #</label>
                <input
                  type="text"
                  value={estimateNumber}
                  onChange={(e) => setEstimateNumber(e.target.value)}
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
                <label className={labelClass}>Valid until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>Line items</label>
              <LineItemsEditor
                items={items}
                mode="qty-rate"
                onUpdate={update}
                onAdd={add}
                onRemove={remove}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
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
                docTypeLabel="Estimate"
                docNumber={estimateNumber}
                dateFields={[
                  { label: "Issued", value: issueDate },
                  { label: "Valid until", value: validUntil },
                ]}
                from={{ label: "From", name: fromName, detail: fromDetail }}
                to={{ label: "Prepared for", name: toName, detail: toDetail }}
                items={items}
                mode="qty-rate"
                subtotal={subtotal}
                taxPercent={taxPercent}
                totalLabel="Estimated total"
                notes={notes}
              />
            </div>
          </FadeInSection>
        </div>
      </section>
    </main>
  );
}
