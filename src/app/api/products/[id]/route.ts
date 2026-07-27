// Get/update/delete a single product
// Methods: GET, PATCH, DELETE

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").optional(),
  description: z.string().trim().optional(),
  price: z.number().nonnegative("Price can't be negative.").optional(),
  unit: z.string().trim().optional(),
});

async function findOwnedProduct(id: string, userId: string) {
  return prisma.product.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const product = await findOwnedProduct(id, userId);
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwnedProduct(id, userId);
  if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });

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

  const product = await prisma.product.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwnedProduct(id, userId);
  if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
