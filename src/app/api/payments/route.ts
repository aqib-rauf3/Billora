// List + record payments (Phase 2 module — a ledger against invoices).
// Recording a payment that brings an invoice's paid total to/above its
// total automatically flips that invoice's status to "paid", and always
// logs a "payment received" notification (see /api/notifications).
// Methods: GET, POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { computeInvoiceTotal } from "@/lib/invoiceTotals";

const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Select an invoice."),
  amount: z.number().positive("Amount must be greater than 0."),
  method: z.enum(["bank_transfer", "cash", "card", "other"]).default("bank_transfer"),
  note: z.string().trim().optional(),
  paidAt: z.coerce.date().optional(),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const payments = await prisma.payment.findMany({
    where: { userId },
    include: { invoice: { include: { customer: true } } },
    orderBy: { paidAt: "desc" },
  });

  return NextResponse.json({ payments });
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const invoice = await prisma.invoice.findFirst({
    where: { id: data.invoiceId, userId },
    include: { items: true, payments: true, customer: true },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const payment = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const created = await tx.payment.create({
      data: {
        amount: data.amount,
        method: data.method,
        note: data.note,
        paidAt: data.paidAt ?? new Date(),
        invoiceId: data.invoiceId,
        userId,
      },
    });

    const total = computeInvoiceTotal(invoice.items, invoice.taxPercent);
    const paidSoFar = invoice.payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0) + data.amount;
    if (paidSoFar >= total && invoice.status !== "paid") {
      await tx.invoice.update({ where: { id: invoice.id }, data: { status: "paid" } });
    }

    await tx.notification.create({
      data: {
        type: "payment_received",
        message: `Payment of Rs. ${data.amount.toLocaleString()} received for invoice ${invoice.number} (${invoice.customer.name}).`,
        link: `/invoices/${invoice.id}`,
        userId,
      },
    });

    return created;
  });

  return NextResponse.json({ payment }, { status: 201 });
}
