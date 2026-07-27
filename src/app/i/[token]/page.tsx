"use client";

// Public shared-invoice view — /i/[token]
// No auth, no dashboard chrome (outside (app), so middleware.ts never
// touches this route). Reuses DocumentPreviewCard for the exact same
// visual document a customer would see as a downloaded PDF, plus a
// minimal Billora header/footer so it still reads as branded, not bare.

import { Suspense, useEffect, useState, use as usePromise } from "react";
import { motion } from "framer-motion";
import { IconDownload, IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import DocumentPreviewCard from "@/components/tools/DocumentPreviewCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { generateDocumentPdf } from "@/lib/generateDocumentPdf";
import { dateFmt } from "@/lib/liveData";

interface PublicInvoice {
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  taxPercent: number;
  discountType: "percent" | "fixed";
  discountValue: number;
  note: string | null;
  items: { id: string; desc: string; qty: number; rate: number }[];
  total: number;
  customer: { name: string; email: string | null; company: string | null };
  from: string;
}

function SharedInvoiceContent({ token }: { token: string }) {
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/invoices/${token}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "This invoice link is invalid.");
        setInvoice(body.invoice);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong."))
      .finally(() => setLoading(false));
  }, [token]);

  const items = invoice?.items.map((it) => ({ id: it.id, description: it.desc, qty: it.qty, rate: it.rate })) ?? [];
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);

  const handleDownload = () => {
    if (!invoice) return;
    generateDocumentPdf({
      docTypeLabel: "Invoice",
      docNumber: invoice.number,
      dateFields: [
        { label: "Issued", value: dateFmt(invoice.issueDate) },
        { label: "Due", value: dateFmt(invoice.dueDate) },
      ],
      from: { label: "From", name: invoice.from, detail: "" },
      to: {
        label: "Bill to",
        name: invoice.customer.name,
        detail: `${invoice.customer.company ?? ""}\n${invoice.customer.email ?? ""}`,
      },
      items,
      mode: "qty-rate",
      subtotal,
      taxPercent: invoice.taxPercent,
      discountType: invoice.discountType,
      discountValue: invoice.discountValue,
      totalLabel: "Total due",
      notes: invoice.note ?? undefined,
      templateId: "classic",
    });
  };

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2">
          <span className="inline-block w-3 h-5 border-2 border-orange border-r-0" />
          <span className="text-sm font-medium text-ink tracking-tight">Billora</span>
        </a>
        {invoice && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-navy text-white rounded-md px-3.5 py-2 text-sm hover:bg-navyLight transition-colors"
          >
            <IconDownload size={15} />
            Download PDF
          </button>
        )}
      </header>

      <div className="flex-1 px-6 py-10">
        {loading && (
          <div className="max-w-2xl mx-auto flex flex-col items-center py-20">
            <IconLoader2 size={24} className="animate-spin text-muted" />
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-12 h-12 rounded-full bg-redBg flex items-center justify-center mx-auto mb-4">
              <IconAlertTriangle size={22} className="text-red" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Link not found</p>
            <p className="text-xs text-muted">{error}</p>
          </div>
        )}

        {!loading && invoice && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted">Invoice from {invoice.from}</p>
              <StatusBadge status={invoice.status} />
            </div>
            <DocumentPreviewCard
              docTypeLabel="Invoice"
              docNumber={invoice.number}
              dateFields={[
                { label: "Issued", value: dateFmt(invoice.issueDate) },
                { label: "Due", value: dateFmt(invoice.dueDate) },
              ]}
              from={{ label: "From", name: invoice.from, detail: "" }}
              to={{
                label: "Bill to",
                name: invoice.customer.name,
                detail: `${invoice.customer.company ?? ""}\n${invoice.customer.email ?? ""}`,
              }}
              items={items}
              mode="qty-rate"
              subtotal={subtotal}
              taxPercent={invoice.taxPercent}
              discountType={invoice.discountType}
              discountValue={invoice.discountValue}
              totalLabel="Total due"
              notes={invoice.note ?? undefined}
              templateId="classic"
            />
          </motion.div>
        )}
      </div>

      <footer className="border-t border-border px-6 py-5 text-center">
        <p className="text-xs text-muted">
          Sent with{" "}
          <a href="/" className="text-orange hover:underline">
            Billora
          </a>{" "}
          — create your own invoices in minutes.
        </p>
      </footer>
    </main>
  );
}

export default function SharedInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = usePromise(params);
  return (
    <Suspense fallback={null}>
      <SharedInvoiceContent token={token} />
    </Suspense>
  );
}
