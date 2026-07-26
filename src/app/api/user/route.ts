// Signed-in user's own profile — powers the Account Settings page.
// GET returns the profile (never the password hash). PATCH updates
// name/business, and optionally the password when currentPassword +
// newPassword are both provided.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  business: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal("")),
  currentPassword: z.string().optional().or(z.literal("")),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters.")
    .optional()
    .or(z.literal("")),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, business: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { name, business, currentPassword, newPassword } = parsed.data;

  const data: { name: string; business: string | null; password?: string } = {
    name,
    business: business || null,
  };

  // Password change is opt-in: only touch it when both fields are present,
  // and only after verifying the current password against the stored hash.
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Enter your current password to set a new one." },
        { status: 400 }
      );
    }
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, existing.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    data.password = await bcrypt.hash(newPassword, 10);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, business: true, createdAt: true },
  });

  return NextResponse.json({ user });
}
