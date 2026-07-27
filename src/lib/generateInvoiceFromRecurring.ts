import { prisma } from "@/lib/prisma";
import { advanceDate, type RecurringInterval } from "@/lib/recurringInterval";

export async function nextInvoiceNumber(userId: string) {
  const count = await prisma.invoice.count({ where: { userId } });
  return `INV-${String(count + 1).padStart(4, "0")}`;
}

// Creates one Invoice from a RecurringInvoice template, links it back via
// recurringSourceId, and advances the template's nextRunDate. Shared by:
//  - POST /api/recurring-invoices (generates the first invoice immediately)
//  - POST /api/recurring-invoices/[id]/generate (manual "Generate now")
//  - GET /api/cron/recurring-invoices (batch, for an external scheduler)
export async function generateInvoiceFromRecurring(recurringId: string) {
  const template = await prisma.recurringInvoice.findUnique({
    where: { id: recurringId },
    include: { items: true },
  });
  if (!template) return null;

  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14); // fixed 2-week terms for generated invoices

  const number = await nextInvoiceNumber(template.userId);

  const invoice = await prisma.invoice.create({
    data: {
      number,
      status: "pending",
      issueDate,
      dueDate,
      taxPercent: template.taxPercent,
      discountType: template.discountType,
      discountValue: template.discountValue,
      note: template.note,
      customerId: template.customerId,
      userId: template.userId,
      recurringSourceId: template.id,
      items: {
        create: template.items.map((it: { desc: string; qty: number; rate: number }) => ({
          desc: it.desc,
          qty: it.qty,
          rate: it.rate,
        })),
      },
    },
    include: { items: true, customer: true },
  });

  await prisma.recurringInvoice.update({
    where: { id: template.id },
    data: {
      lastRunDate: issueDate,
      nextRunDate: advanceDate(issueDate, template.interval as RecurringInterval),
    },
  });

  return invoice;
}
