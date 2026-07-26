// Document templates — used by DocumentPreviewCard (on-screen + print) and
// generateDocumentPdf (downloaded PDF) so the same 5 choices are available
// everywhere a document is built: the Invoice Generator, Estimate
// Generator, and Receipt Maker free tools, and the dashboard's
// Invoices > Create page. Reference: "How it works" step 1 on the feature
// pages ("Pick a template") — this is what that copy refers to.
//
// Kept as plain data (no components) so both the DOM preview (Tailwind
// classes) and the jsPDF export (RGB tuples) can read the same source of
// truth without duplicating the palette, per DEVELOPMENT_RULES.md "avoid
// repeated code — extract reusable logic".

export type TemplateId = "classic" | "minimal" | "modern" | "bold" | "compact";

export interface InvoiceTemplate {
  id: TemplateId;
  name: string;
  description: string;
  /** Accent RGB used by the PDF export (jsPDF doesn't read CSS vars). */
  accentRgb: [number, number, number];
  /** Header treatment, shared meaning between the DOM preview and PDF. */
  headerStyle: "mark" | "hairline" | "band" | "block" | "compact";
}

export const NAVY_RGB: [number, number, number] = [11, 37, 69];
export const ORANGE_RGB: [number, number, number] = [255, 75, 54];

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Navy wordmark, orange bracket mark — Billora's default look.",
    accentRgb: ORANGE_RGB,
    headerStyle: "mark",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Grayscale, no color accents, extra whitespace.",
    accentRgb: NAVY_RGB,
    headerStyle: "hairline",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Orange header band, reversed white text.",
    accentRgb: ORANGE_RGB,
    headerStyle: "band",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Full navy header block, large doc title.",
    accentRgb: NAVY_RGB,
    headerStyle: "block",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Tighter spacing, filled total row — fits more on one page.",
    accentRgb: NAVY_RGB,
    headerStyle: "compact",
  },
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "classic";

export function getTemplate(id: TemplateId): InvoiceTemplate {
  return INVOICE_TEMPLATES.find((t) => t.id === id) ?? INVOICE_TEMPLATES[0];
}
