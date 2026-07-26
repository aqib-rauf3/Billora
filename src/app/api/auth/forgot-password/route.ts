// Forgot password — issue a reset token if the email exists.
// Methods: POST

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail, appUrl } from "@/lib/mailer";
import { generateToken, RESET_TOKEN_TTL_MS } from "@/lib/tokens";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

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

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Same response whether or not the account exists, so this endpoint
  // can't be used to check which emails are registered.
  if (user) {
    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendMail({
      to: user.email,
      subject: "Reset your Billora password",
      actionLabel: "Reset link",
      actionUrl: appUrl(`/reset-password?token=${resetToken}`),
    });
  }

  return NextResponse.json({
    message: "If an account exists for that email, a reset link has been sent.",
  });
}
