// Get/update/delete a single invoice
// Methods: GET, PATCH, DELETE

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { computeInvoiceTotal } from "@/lib/invoiceTotals";

// Next.js 15: dynamic route params are async now (a Promise), not a plain
// object like in Next 14 — every handler below awaits it.
type RouteContext = { params: Promise<{ id: string }> };

const invoiceItemSchema = z.object({
  desc: z.string().trim().min(1, "Item description is required."),
  qty: z.number().int().positive().default(1),
  rate: z.number().nonnegative(),
});

const updateSchema = z.object({
  customerId: z.string().min(1).optional(),
  number: z.string().trim().optional(),
  status: z.enum(["draft", "pending", "paid", "overdue"]).optional(),
  issueDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  discountType: z.enum(["percent", "fixed"]).optional(),
  discountValue: z.number().min(0).optional(),
  note: z.string().trim().optional(),
  // Sending `items` replaces the full line-item set (delete + recreate in
  // one transaction below) — simplest correct behavior for a small
  // invoice, avoids diffing individual rows.
  items: z.array(invoiceItemSchema).min(1).optional(),
}).refine(
  (data) => data.discountType !== "percent" || (data.discountValue ?? 0) <= 100,
  { message: "Percentage discount can't exceed 100%.", path: ["discountValue"] }
);

async function findOwnedInvoice(id: string, userId: string) {
  return prisma.invoice.findFirst({ where: { id, userId }, include: { items: true } });
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId },
    include: { items: true, customer: true, payments: { orderBy: { paidAt: "desc" } } },
  });
  if (!invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  const paid = invoice.payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);
  const total = computeInvoiceTotal(
    invoice.items,
    invoice.taxPercent,
    invoice.discountType as "percent" | "fixed",
    invoice.discountValue
  );

  return NextResponse.json({
    invoice: { ...invoice, total, paid, balance: Math.max(0, total - paid) },
  });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwnedInvoice(id, userId);
  if (!existing) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, userId },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }
  }

  const invoice = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.items) {
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
    }

    return tx.invoice.update({
      where: { id },
      data: {
        ...(data.number !== undefined && { number: data.number }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.issueDate !== undefined && { issueDate: data.issueDate }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
        ...(data.taxPercent !== undefined && { taxPercent: data.taxPercent }),
        ...(data.discountType !== undefined && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.note !== undefined && { note: data.note }),
        ...(data.customerId !== undefined && { customerId: data.customerId }),
        ...(data.items && {
          items: {
            create: data.items.map((item) => ({
              desc: item.desc,
              qty: item.qty,
              rate: item.rate,
            })),
          },
        }),
      },
      include: { items: true, customer: true },
    });
  });

  return NextResponse.json({
    invoice: {
      ...invoice,
      total: computeInvoiceTotal(
        invoice.items,
        invoice.taxPercent,
        invoice.discountType as "percent" | "fixed",
        invoice.discountValue
      ),
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwnedInvoice(id, userId);
  if (!existing) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  await prisma.$transaction([
    prisma.payment.deleteMany({ where: { invoiceId: id } }),
    prisma.invoiceItem.deleteMany({ where: { invoiceId: id } }),
    prisma.invoice.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
