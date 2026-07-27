// Get/update/delete a single customer
// Methods: GET, PATCH, DELETE

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

// Next.js 15: dynamic route params are async now (a Promise), not a plain
// object like in Next 14 — every [id] route handler below awaits it.
type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").optional(),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

async function findOwnedCustomer(id: string, userId: string) {
  return prisma.customer.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const customer = await findOwnedCustomer(id, userId);
  if (!customer) return NextResponse.json({ error: "Customer not found." }, { status: 404 });

  return NextResponse.json({ customer });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwnedCustomer(id, userId);
  if (!existing) return NextResponse.json({ error: "Customer not found." }, { status: 404 });

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

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...(parsed.data.name !== undefined && { name: parsed.data.name }),
      ...(parsed.data.email !== undefined && { email: parsed.data.email || null }),
      ...(parsed.data.company !== undefined && { company: parsed.data.company || null }),
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes || null }),
      ...(parsed.data.tags !== undefined && { tags: parsed.data.tags }),
    },
  });

  return NextResponse.json({ customer });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const existing = await findOwnedCustomer(id, userId);
  if (!existing) return NextResponse.json({ error: "Customer not found." }, { status: 404 });

  try {
    await prisma.customer.delete({ where: { id } });
  } catch {
    // Prisma throws on the FK constraint if this customer still has
    // invoices/estimates pointing at them — friendlier than a raw 500.
    return NextResponse.json(
      { error: "This customer has invoices or estimates on file — delete or reassign those first." },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true });
}
