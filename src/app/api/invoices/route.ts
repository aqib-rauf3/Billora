// List + create invoices
// Methods: GET, POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { computeInvoiceTotal } from "@/lib/invoiceTotals";

const invoiceItemSchema = z.object({
  desc: z.string().trim().min(1, "Item description is required."),
  qty: z.number().int().positive().default(1),
  rate: z.number().nonnegative(),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  number: z.string().trim().optional(),
  status: z.enum(["draft", "pending", "paid", "overdue"]).default("draft"),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  taxPercent: z.number().min(0).max(100).default(0),
  note: z.string().trim().optional(),
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item."),
});

async function nextInvoiceNumber(userId: string) {
  const count = await prisma.invoice.count({ where: { userId } });
  return `INV-${String(count + 1).padStart(4, "0")}`;
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" },
  });

  type InvoiceWithRelations = { items: { qty: number; rate: number }[]; taxPercent: number };

  const withTotals = invoices.map((invoice: InvoiceWithRelations) => ({
    ...invoice,
    total: computeInvoiceTotal(invoice.items, invoice.taxPercent),
  }));

  return NextResponse.json({ invoices: withTotals });
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

  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Ownership check — a customerId belonging to a different user must fail
  // the same way a missing one does, so this can't be used to probe IDs.
  const customer = await prisma.customer.findFirst({
    where: { id: data.customerId, userId },
  });
  if (!customer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  const number = data.number || (await nextInvoiceNumber(userId));

  const invoice = await prisma.invoice.create({
    data: {
      number,
      status: data.status,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      taxPercent: data.taxPercent,
      note: data.note,
      customerId: data.customerId,
      userId,
      items: {
        create: data.items.map((item) => ({
          desc: item.desc,
          qty: item.qty,
          rate: item.rate,
        })),
      },
    },
    include: { items: true, customer: true },
  });

  return NextResponse.json(
    { invoice: { ...invoice, total: computeInvoiceTotal(invoice.items, invoice.taxPercent) } },
    { status: 201 }
  );
}
