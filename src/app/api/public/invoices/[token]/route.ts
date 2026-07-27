// Public invoice lookup by share token — no auth, no listing endpoint,
// so a link is only useful to someone who already has it. Powers /i/[token].
// Methods: GET

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeInvoiceTotal } from "@/lib/invoiceTotals";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  const { token } = await params;
  if (!token) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  const invoice = await prisma.invoice.findUnique({
    where: { shareToken: token },
    include: {
      items: true,
      customer: { select: { name: true, email: true, company: true } },
      user: { select: { name: true, business: true } },
    },
  });
  if (!invoice) return NextResponse.json({ error: "This invoice link is invalid." }, { status: 404 });

  const total = computeInvoiceTotal(
    invoice.items,
    invoice.taxPercent,
    invoice.discountType as "percent" | "fixed",
    invoice.discountValue
  );

  // Deliberately narrow — no userId, no internal ids beyond what the
  // preview needs, nothing about payments.
  return NextResponse.json({
    invoice: {
      number: invoice.number,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      taxPercent: invoice.taxPercent,
      discountType: invoice.discountType,
      discountValue: invoice.discountValue,
      note: invoice.note,
      items: invoice.items.map((it: { id: string; desc: string; qty: number; rate: number }) => ({
        id: it.id,
        desc: it.desc,
        qty: it.qty,
        rate: it.rate,
      })),
      total,
      customer: invoice.customer,
      from: invoice.user.business || invoice.user.name,
    },
  });
}
