// List + create products (the price/service library used when building
// invoices — Phase 2 module)
// Methods: GET, POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().trim().optional(),
  price: z.number().nonnegative("Price can't be negative."),
  unit: z.string().trim().optional(),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const products = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
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

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: { ...parsed.data, userId },
  });

  return NextResponse.json({ product }, { status: 201 });
}
