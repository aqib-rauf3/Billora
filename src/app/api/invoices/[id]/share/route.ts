// Generate or revoke the shareable public link for one invoice.
// Methods: POST (generate/return existing), DELETE (revoke)

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { generateToken } from "@/lib/tokens";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const invoice = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  // Idempotent — re-clicking "Share" shouldn't invalidate a link someone
  // already has open.
  const shareToken = invoice.shareToken ?? generateToken();
  if (!invoice.shareToken) {
    await prisma.invoice.update({ where: { id }, data: { shareToken } });
  }

  return NextResponse.json({ shareToken });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const invoice = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  await prisma.invoice.update({ where: { id }, data: { shareToken: null } });
  return NextResponse.json({ success: true });
}
