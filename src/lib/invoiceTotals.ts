// Shared between /api/invoices (list) and /api/invoices/[id] (single) so
// the total math can't drift between the two responses.

export type DiscountType = "percent" | "fixed";

/**
 * Full breakdown — discount is applied to the subtotal first, tax is then
 * computed on the discounted amount. Used wherever the UI needs to show
 * each line (create page, detail page, PDF export) rather than just the
 * final number.
 */
export function computeInvoiceBreakdown(
  items: { qty: number; rate: number }[],
  taxPercent: number,
  discountType: DiscountType = "percent",
  discountValue = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const rawDiscount =
    discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;
  // Never let a fixed discount push the taxable amount below zero.
  const discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal);
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = discountedSubtotal * (taxPercent / 100);
  const total = Math.round((discountedSubtotal + taxAmount) * 100) / 100;

  return { subtotal, discountAmount, discountedSubtotal, taxAmount, total };
}

/** Kept for callers that only need the final number. */
export function computeInvoiceTotal(
  items: { qty: number; rate: number }[],
  taxPercent: number,
  discountType: DiscountType = "percent",
  discountValue = 0
): number {
  return computeInvoiceBreakdown(items, taxPercent, discountType, discountValue).total;
}
