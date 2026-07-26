// Shared by every /api/* route that needs to know which user is calling.
// Route handlers stay thin: `const userId = await getSessionUserId(); if
// (!userId) return unauthorized();`

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
