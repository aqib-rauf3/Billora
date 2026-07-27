import { jsPDF } from "jspdf";
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

export interface DocumentPdfInput {
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

// Billora brand palette (matches tailwind.config.ts navy/orange + the
// muted/text/border tones DocumentPreviewCard uses on screen), expressed
// as plain RGB tuples since jsPDF doesn't read CSS variables.
const NAVY: [number, number, number] = [11, 37, 69];
const ORANGE: [number, number, number] = [255, 75, 54];
const MUTED: [number, number, number] = [124, 134, 156];
const TEXT: [number, number, number] = [60, 70, 92];
const LINE: [number, number, number] = [230, 234, 245];

const money = (n: number) =>
  `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

/**
 * Generates a clean, single-page, brand-styled PDF that mirrors the
 * on-screen DocumentPreviewCard layout. Shared by the Invoice Generator,
 * Estimate Generator, and Receipt Maker free tools (see
 * DEVELOPMENT_RULES.md "avoid repeated code — extract reusable logic")
 * so "Download PDF" produces a real branded file instead of depending on
 * the browser's print-to-PDF dialog.
 */
export function generateDocumentPdf(input: DocumentPdfInput) {
  const {
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
  } = input;

  const template = getTemplate(templateId);
  const dense = templateId === "compact";

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  // Header — 5 treatments matching DocumentPreviewCard's headerStyle:
  // "mark" (default bracket + wordmark), "hairline" (grayscale, no
  // color), "band" / "block" (filled color bar, drawn as a full-width
  // rect before the margin math starts), "compact" (tighter, one line).
  if (template.headerStyle === "band") {
    pdf.setFillColor(...template.accentRgb);
    pdf.rect(0, 0, pageWidth, 74, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text("Billora", margin, 44);
    pdf.setFontSize(11);
    pdf.text(docTypeLabel, pageWidth - margin, 38, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(docNumber || "—", pageWidth - margin, 52, { align: "right" });
    y = 100;
  } else if (template.headerStyle === "block") {
    pdf.setFillColor(...NAVY);
    pdf.rect(0, 0, pageWidth, 84, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text("Billora", margin, 34);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(docTypeLabel, margin, 62);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(docNumber || "—", pageWidth - margin, 62, { align: "right" });
    y = 110;
  } else if (template.headerStyle === "hairline") {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(13);
    pdf.setTextColor(30, 34, 44);
    pdf.text("Billora", margin, y);
    pdf.setFontSize(9);
    pdf.text(docTypeLabel.toUpperCase(), pageWidth - margin, y, { align: "right" });
    y += 12;
    pdf.setTextColor(120, 124, 132);
    pdf.setFontSize(8.5);
    pdf.text(docNumber || "—", pageWidth - margin, y, { align: "right" });
    y += 10;
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.6);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 30;
  } else if (template.headerStyle === "compact") {
    pdf.setDrawColor(...template.accentRgb);
    pdf.setLineWidth(1.6);
    pdf.line(margin, y - 10, margin, y);
    pdf.line(margin, y - 10, margin + 8, y - 10);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...NAVY);
    pdf.text("Billora", margin + 12, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...MUTED);
    pdf.text(`${docTypeLabel} · ${docNumber || "—"}`, pageWidth - margin, y, { align: "right" });
    y += 20;
  } else {
    // "mark" — original default header
    pdf.setDrawColor(...template.accentRgb);
    pdf.setLineWidth(2.2);
    pdf.line(margin, y - 16, margin, y + 2);
    pdf.line(margin, y - 16, margin + 11, y - 16);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(...NAVY);
    pdf.text("Billora", margin, y + 14);

    pdf.setFontSize(12);
    pdf.text(docTypeLabel, pageWidth - margin, y, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...MUTED);
    pdf.text(docNumber || "—", pageWidth - margin, y + 14, { align: "right" });

    y += 44;
  }

  pdf.setDrawColor(...LINE);
  pdf.setLineWidth(0.75);
  pdf.line(margin, y, pageWidth - margin, y);
  y += dense ? 18 : 26;

  // From / To — two columns
  const colWidth = (pageWidth - margin * 2 - 24) / 2;
  const partyBlock = (party: PartyBlock, x: number) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    pdf.text(party.label.toUpperCase(), x, y);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(...NAVY);
    pdf.text(party.name || "—", x, y + 15);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...TEXT);
    const detailLines = pdf.splitTextToSize(party.detail || "", colWidth);
    pdf.text(detailLines, x, y + 29);
  };
  partyBlock(from, margin);
  partyBlock(to, margin + colWidth + 24);
  y += 64;

  // Date fields, laid out left to right
  pdf.setFontSize(9);
  let dateX = margin;
  dateFields.forEach((d) => {
    pdf.setTextColor(...MUTED);
    pdf.text(`${d.label}: `, dateX, y);
    const labelWidth = pdf.getTextWidth(`${d.label}: `);
    pdf.setTextColor(...NAVY);
    pdf.text(d.value || "—", dateX + labelWidth, y);
    dateX += labelWidth + pdf.getTextWidth(d.value || "—") + 26;
  });
  y += 18;

  pdf.setDrawColor(...LINE);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 18;

  // Line items table
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MUTED);
  pdf.text("DESCRIPTION", margin, y);
  pdf.text("AMOUNT", pageWidth - margin, y, { align: "right" });
  y += 14;

  const visibleItems = items.filter(
    (it: LineItem) => it.description.trim() !== "" || it.qty * it.rate > 0
  );

  pdf.setFontSize(10);
  if (visibleItems.length === 0) {
    pdf.setTextColor(...MUTED);
    pdf.text("No line items added.", margin, y);
    y += 16;
  } else {
    visibleItems.forEach((it: LineItem) => {
      // Wrap long descriptions instead of overflowing the page edge
      const label =
        mode === "qty-rate" && it.qty !== 1
          ? `${it.description || "Untitled item"}   x${it.qty}`
          : it.description || "Untitled item";
      const amountStr = money(it.qty * it.rate);
      const maxLabelWidth = pageWidth - margin * 2 - pdf.getTextWidth(amountStr) - 20;
      const lines = pdf.splitTextToSize(label, maxLabelWidth);

      pdf.setTextColor(...TEXT);
      pdf.text(lines, margin, y);
      pdf.text(amountStr, pageWidth - margin, y, { align: "right" });
      y += 14 * lines.length + 2;
    });
  }

  y += 6;
  pdf.setDrawColor(...LINE);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 22;

  // Totals block, right-aligned
  const rawDiscount = discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal);
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = discountedSubtotal * (taxPercent / 100);
  const total = discountedSubtotal + taxAmount;
  const labelX = pageWidth - margin - 150;

  const totalsRow = (label: string, value: string, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(bold ? 12 : 9.5);
    const [r, g, b] = bold ? NAVY : TEXT;
    pdf.setTextColor(r, g, b);
    pdf.text(label, labelX, y);
    pdf.text(value, pageWidth - margin, y, { align: "right" });
    y += bold ? 20 : 15;
  };

  if (taxPercent > 0 || discountAmount > 0) {
    totalsRow("Subtotal", money(subtotal));
  }
  if (discountAmount > 0) {
    totalsRow(
      `Discount${discountType === "percent" ? ` (${discountValue}%)` : ""}`,
      `-${money(discountAmount)}`
    );
  }
  if (taxPercent > 0) {
    totalsRow(`Tax (${taxPercent}%)`, money(taxAmount));
  }
  if (extraLine) totalsRow(extraLine.label, extraLine.value);

  if (dense) {
    // filled total chip, matching the on-screen compact template
    pdf.setFillColor(...NAVY);
    pdf.roundedRect(labelX - 10, y - 14, pageWidth - margin - (labelX - 10), 22, 3, 3, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text(totalLabel, labelX, y);
    pdf.text(money(total), pageWidth - margin - 10, y, { align: "right" });
    y += 20;
  } else {
    pdf.setDrawColor(...LINE);
    pdf.line(labelX, y - 4, pageWidth - margin, y - 4);
    totalsRow(totalLabel, money(total), true);
  }

  // Notes
  if (notes && notes.trim()) {
    y += 26;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    pdf.text("NOTES", margin, y);
    y += 13;
    pdf.setFontSize(9);
    pdf.setTextColor(...TEXT);
    const noteLines = pdf.splitTextToSize(notes, pageWidth - margin * 2);
    pdf.text(noteLines, margin, y);
  }

  // Footer credit line, subtle
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...MUTED);
  pdf.text(
    "Generated with Billora — billora.app",
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 28,
    { align: "center" }
  );

  const filenameSafe = (docNumber || docTypeLabel).replace(/[^a-z0-9-]+/gi, "_");
  pdf.save(`${filenameSafe}.pdf`);
}
