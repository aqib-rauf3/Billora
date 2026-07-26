// Verify email — consume a verification token.
// Methods: POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ token: z.string().min(1, "Missing verification token.") });

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { token } = parsed.data;
  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  if (!user) {
    return NextResponse.json({ error: "This verification link is invalid." }, { status: 400 });
  }
  if (user.emailVerified) {
    return NextResponse.json({ message: "Email already verified." });
  }
  if (!user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
    return NextResponse.json(
      { error: "This verification link has expired. Request a new one." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verificationToken: null, verificationTokenExpiry: null },
  });

  return NextResponse.json({ message: "Email verified." });
}
