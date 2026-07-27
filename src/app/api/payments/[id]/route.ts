// Delete a payment (correcting a mistaken entry). If the invoice had been
// auto-marked "paid" because of this payment and is no longer fully paid
// afterward, it's stepped back down to "pending" so the two stay honest.
// Methods: DELETE

import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { computeInvoiceTotal } from "@/lib/invoiceTotals";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const payment = await prisma.payment.findFirst({ where: { id, userId } });
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.payment.delete({ where: { id } });

    const invoice = await tx.invoice.findUnique({
      where: { id: payment.invoiceId },
      include: { items: true, payments: true },
    });
    if (!invoice) return;

    const total = computeInvoiceTotal(invoice.items, invoice.taxPercent);
    const paidSoFar = invoice.payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);
    if (paidSoFar < total && invoice.status === "paid") {
      await tx.invoice.update({ where: { id: invoice.id }, data: { status: "pending" } });
    }
  });

  return NextResponse.json({ success: true });
}
