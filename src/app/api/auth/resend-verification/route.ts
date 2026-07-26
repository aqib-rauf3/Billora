// Resend verification email — issues a fresh token for the signed-in user.
// Methods: POST

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";
import { sendMail, appUrl } from "@/lib/mailer";
import { generateToken, VERIFICATION_TOKEN_TTL_MS } from "@/lib/tokens";

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return unauthorized();

  if (user.emailVerified) {
    return NextResponse.json({ message: "Your email is already verified." });
  }

  const verificationToken = generateToken();
  const verificationTokenExpiry = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken, verificationTokenExpiry },
  });

  await sendMail({
    to: user.email,
    subject: "Verify your Billora email",
    actionLabel: "Verify link",
    actionUrl: appUrl(`/verify-email?token=${verificationToken}`),
  });

  return NextResponse.json({ message: "Verification email sent." });
}
