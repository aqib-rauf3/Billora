// List + create estimates
// Methods: GET, POST
//
// Estimate now mirrors Invoice's shape (number/customer/amount) — schema
// extended in prisma/migrations/20260726045750_customer_company_estimate_shape
// so the Estimates page can show real client + value data instead of the
// old validUntil-only stub.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

const estimateSchema = z.object({
  customerId: z.string().min(1, "Select a customer.").optional(),
  number: z.string().trim().optional(),
  amount: z.number().nonnegative().default(0),
  validUntil: z.string().trim().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

async function nextEstimateNumber(userId: string) {
  const count = await prisma.estimate.count({ where: { userId } });
  return `EST-${String(count + 1).padStart(4, "0")}`;
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const estimates = await prisma.estimate.findMany({
    where: { userId },
    include: { customer: true },
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

  if (parsed.data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: parsed.data.customerId, userId },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }
  }

  const estimate = await prisma.estimate.create({
    data: {
      number: parsed.data.number || (await nextEstimateNumber(userId)),
      validUntil: parsed.data.validUntil,
      amount: parsed.data.amount,
      status: parsed.data.status,
      customerId: parsed.data.customerId,
      userId,
    },
    include: { customer: true },
  });

  return NextResponse.json({ estimate }, { status: 201 });
}
