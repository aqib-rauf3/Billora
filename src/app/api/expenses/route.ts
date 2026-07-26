// List + create expenses
// Methods: GET, POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

const expenseSchema = z.object({
  category: z.string().trim().min(1, "Category is required."),
  amount: z.number().positive("Amount must be greater than 0."),
  note: z.string().trim().optional(),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ expenses });
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

  const parsed = expenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const expense = await prisma.expense.create({
    data: { category: parsed.data.category, amount: parsed.data.amount, note: parsed.data.note, userId },
  });

  return NextResponse.json({ expense }, { status: 201 });
}
