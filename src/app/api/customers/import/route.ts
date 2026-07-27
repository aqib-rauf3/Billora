// Bulk-create customers (used by the "Import CSV" flow on the customers
// page — the client parses the CSV and sends structured rows here so
// validation stays server-side, consistent with the single-create route).
// Methods: POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

const rowSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().optional().or(z.literal("")),
  company: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

const bodySchema = z.object({ rows: z.array(rowSchema).min(1).max(500) });

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  // Row-level failures (e.g. a bad email a schema check upstream missed)
  // shouldn't sink the whole import — collect and report instead.
  let imported = 0;
  const failed: number[] = [];

  for (let i = 0; i < parsed.data.rows.length; i++) {
    const row = parsed.data.rows[i];
    try {
      await prisma.customer.create({
        data: {
          name: row.name,
          email: row.email || null,
          company: row.company || null,
          tags: row.tags ?? [],
          userId,
        },
      });
      imported++;
    } catch {
      failed.push(i + 1);
    }
  }

  return NextResponse.json({ imported, failedRows: failed });
}
