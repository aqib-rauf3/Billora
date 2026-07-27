// List notifications + mark all as read (Phase 2 module — bell icon in
// AppTopBar). There's no background job runner in this project, so instead
// of a cron marking invoices overdue, GET lazily checks for invoices past
// their dueDate that aren't paid yet and creates one "invoice_overdue"
// notification per invoice the first time it's seen this way (the
// [userId, type, entityId] unique constraint on Notification makes this
// idempotent — a second GET won't duplicate it).
// Methods: GET, PATCH (mark all read)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

async function generateOverdueNotifications(userId: string) {
  const overdueInvoices = await prisma.invoice.findMany({
    where: { userId, status: { in: ["pending", "overdue"] }, dueDate: { lt: new Date() } },
    include: { customer: true },
  });

  for (const invoice of overdueInvoices) {
    if (invoice.status !== "overdue") {
      await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "overdue" } });
    }
    await prisma.notification.upsert({
      where: {
        userId_type_entityId: { userId, type: "invoice_overdue", entityId: invoice.id },
      },
      update: {},
      create: {
        userId,
        type: "invoice_overdue",
        entityId: invoice.id,
        message: `Invoice ${invoice.number} for ${invoice.customer.name} is now overdue.`,
        link: `/invoices/${invoice.id}`,
      },
    });
  }
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  await generateOverdueNotifications(userId);

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ notifications });
}

export async function PATCH(_req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  return NextResponse.json({ success: true });
}
