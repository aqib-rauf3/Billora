// List + create invoices
// TODO: connect to Prisma (src/lib/prisma.ts) once schema is migrated to Neon
// Methods to implement: GET, POST

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "TODO: implement List + create invoices" });
}
