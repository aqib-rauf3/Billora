// Signup — create User row, hash password
// Methods: POST

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail, appUrl } from "@/lib/mailer";
import { generateToken, VERIFICATION_TOKEN_TTL_MS } from "@/lib/tokens";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  business: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { name, email, password, business } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateToken();
  const verificationTokenExpiry = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      business,
      verificationToken,
      verificationTokenExpiry,
    },
    select: { id: true, name: true, email: true, business: true },
  });

  await sendMail({
    to: user.email,
    subject: "Verify your Billora email",
    actionLabel: "Verify link",
    actionUrl: appUrl(`/verify-email?token=${verificationToken}`),
  });

  // Password never leaves this route. The client signs the user in
  // separately via next-auth's signIn("credentials", ...) right after this
  // succeeds — see src/app/(auth)/login/page.tsx. The account exists but
  // is unverified; middleware.ts blocks (app) routes until the link above
  // is clicked.
  return NextResponse.json({ user }, { status: 201 });
}
