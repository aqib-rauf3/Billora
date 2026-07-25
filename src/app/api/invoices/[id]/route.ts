// Get/update/delete a single invoice
// TODO: connect to Prisma (src/lib/prisma.ts) once schema is migrated to Neon
// Methods to implement: GET, PATCH, DELETE

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "TODO: implement Get/update/delete a single invoice" });
}
