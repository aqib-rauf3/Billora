// Manually generate the next invoice from a recurring template right now,
// instead of waiting for its nextRunDate / the cron job.
// Methods: POST

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { generateInvoiceFromRecurring } from "@/lib/generateInvoiceFromRecurring";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const template = await prisma.recurringInvoice.findFirst({ where: { id, userId } });
  if (!template) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const invoice = await generateInvoiceFromRecurring(id);
  return NextResponse.json({ invoice }, { status: 201 });
}
