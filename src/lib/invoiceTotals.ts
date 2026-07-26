// Shared between /api/invoices (list) and /api/invoices/[id] (single) so
// the total math can't drift between the two responses.

export function computeInvoiceTotal(
  items: { qty: number; rate: number }[],
  taxPercent: number
): number {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  return Math.round(subtotal * (1 + taxPercent / 100) * 100) / 100;
}
