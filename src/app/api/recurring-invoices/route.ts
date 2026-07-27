// List + create recurring invoice templates. Creating one also generates
// the first invoice immediately (the customer gets billed right away, then
// again every `interval` after that).
// Methods: GET, POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { RECURRING_INTERVALS, advanceDate } from "@/lib/recurringInterval";
import { generateInvoiceFromRecurring } from "@/lib/generateInvoiceFromRecurring";

const itemSchema = z.object({
  desc: z.string().trim().min(1, "Item description is required."),
  qty: z.number().int().positive().default(1),
  rate: z.number().nonnegative(),
});

const createSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  interval: z.enum(RECURRING_INTERVALS),
  taxPercent: z.number().min(0).max(100).default(0),
  discountType: z.enum(["percent", "fixed"]).default("percent"),
  discountValue: z.number().min(0).default(0),
  note: z.string().trim().optional(),
  items: z.array(itemSchema).min(1, "Add at least one line item."),
}).refine(
  (data) => data.discountType !== "percent" || data.discountValue <= 100,
  { message: "Percentage discount can't exceed 100%.", path: ["discountValue"] }
);

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const recurringInvoices = await prisma.recurringInvoice.findMany({
    where: { userId },
    include: { customer: true, items: true, invoices: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ recurringInvoices });
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const customer = await prisma.customer.findFirst({ where: { id: data.customerId, userId } });
  if (!customer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  const now = new Date();
  const template = await prisma.recurringInvoice.create({
    data: {
      userId,
      customerId: data.customerId,
      interval: data.interval,
      taxPercent: data.taxPercent,
      discountType: data.discountType,
      discountValue: data.discountValue,
      note: data.note,
      // Placeholder — generateInvoiceFromRecurring() below overwrites this
      // with the real next date right after the first invoice goes out.
      nextRunDate: advanceDate(now, data.interval),
      items: { create: data.items.map((it) => ({ desc: it.desc, qty: it.qty, rate: it.rate })) },
    },
  });

  const firstInvoice = await generateInvoiceFromRecurring(template.id);

  const fresh = await prisma.recurringInvoice.findUnique({
    where: { id: template.id },
    include: { customer: true, items: true, invoices: { select: { id: true } } },
  });

  return NextResponse.json({ recurringInvoice: fresh, firstInvoice }, { status: 201 });
}
