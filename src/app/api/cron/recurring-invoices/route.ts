// Batch job: generates an invoice for every active RecurringInvoice whose
// nextRunDate has arrived. Meant to be called by an external scheduler
// (e.g. Vercel Cron — add a `crons` entry in vercel.json pointing here on
// whatever cadence you want it checked, daily is plenty since interval
// granularity is weekly at the finest).
//
// Protected by a shared secret rather than session auth, since a cron
// scheduler isn't a logged-in user. Set CRON_SECRET in the environment and
// have the scheduler send it as `Authorization: Bearer <CRON_SECRET>`.
// Methods: GET (schedulers default to GET; POST also accepted)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceFromRecurring } from "@/lib/generateInvoiceFromRecurring";

function authorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed if it isn't configured yet
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function runDueRecurringInvoices() {
  const due = await prisma.recurringInvoice.findMany({
    where: { active: true, nextRunDate: { lte: new Date() } },
    select: { id: true },
  });

  const results = [];
  for (const { id } of due) {
    const invoice = await generateInvoiceFromRecurring(id);
    results.push({ recurringInvoiceId: id, invoiceId: invoice?.id ?? null });
  }
  return results;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const generated = await runDueRecurringInvoices();
  return NextResponse.json({ generated: generated.length, results: generated });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
