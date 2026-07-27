// Get/update/delete a single recurring invoice template.
// Methods: GET, PATCH, DELETE

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { RECURRING_INTERVALS } from "@/lib/recurringInterval";

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  active: z.boolean().optional(),
  interval: z.enum(RECURRING_INTERVALS).optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  discountType: z.enum(["percent", "fixed"]).optional(),
  discountValue: z.number().min(0).optional(),
  note: z.string().trim().optional(),
});

async function findOwned(id: string, userId: string) {
  return prisma.recurringInvoice.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const recurringInvoice = await prisma.recurringInvoice.findFirst({
    where: { id, userId },
    include: {
      customer: true,
      items: true,
      invoices: { include: { items: true } , orderBy: { createdAt: "desc" } },
    },
  });
  if (!recurringInvoice) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ recurringInvoice });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwned(id, userId);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

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

  const recurringInvoice = await prisma.recurringInvoice.update({
    where: { id },
    data: parsed.data,
    include: { customer: true, items: true },
  });

  return NextResponse.json({ recurringInvoice });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwned(id, userId);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Generated invoices stay (a customer's billing history shouldn't
  // disappear because the template was cancelled) — just detach them.
  await prisma.$transaction([
    prisma.invoice.updateMany({ where: { recurringSourceId: id }, data: { recurringSourceId: null } }),
    prisma.recurringInvoiceItem.deleteMany({ where: { recurringInvoiceId: id } }),
    prisma.recurringInvoice.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
