// List + create estimates
// Methods: GET, POST
//
// Note: the current Estimate model (prisma/schema.prisma) only has
// validUntil + status — no customer/items/amount like Invoice has. Wiring
// it as-is for now; flag to Aqib if estimates should mirror the Invoice
// shape (customer + line items) once the Estimate Generator UI is built.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

const estimateSchema = z.object({
  validUntil: z.string().trim().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const estimates = await prisma.estimate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ estimates });
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

  const parsed = estimateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const estimate = await prisma.estimate.create({
    data: { validUntil: parsed.data.validUntil, status: parsed.data.status, userId },
  });

  return NextResponse.json({ estimate }, { status: 201 });
}
