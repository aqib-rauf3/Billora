// List + create customers
// Methods: GET, POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

const customerSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
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

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const customers = await prisma.customer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ customers });
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

  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      company: parsed.data.company || null,
      notes: parsed.data.notes || null,
      tags: parsed.data.tags ?? [],
      userId,
    },
  });

  return NextResponse.json({ customer }, { status: 201 });
}
