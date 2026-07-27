// Mark a single notification as read
// Methods: PATCH

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/apiAuth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const notification = await prisma.notification.findFirst({ where: { id, userId } });
  if (!notification) {
    return NextResponse.json({ error: "Notification not found." }, { status: 404 });
  }

  const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
  return NextResponse.json({ notification: updated });
}
