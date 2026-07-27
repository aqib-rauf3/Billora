// Protects the authenticated app shell (Dashboard, Invoices, Estimates,
// Expenses, Customers) — a signed-out visitor gets bounced to /login with
// a callbackUrl instead of hitting a blank/broken dashboard. Marketing
// pages, tools, and /login itself stay public. Runs at the edge, so it
// checks the JWT directly rather than hitting Prisma.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = [
  "/dashboard",
  "/invoices",
  "/estimates",
  "/expenses",
  "/customers",
  "/products",
  "/payments",
  "/reports",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Mandatory email verification — signed in but hasn't clicked the
  // verification link yet, so bounce to the "check your email" screen
  // instead of letting them into the app.
  if (!token.emailVerified) {
    return NextResponse.redirect(new URL("/verify-email?pending=1", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/invoices/:path*",
    "/estimates/:path*",
    "/expenses/:path*",
    "/customers/:path*",
    "/products/:path*",
    "/payments/:path*",
    "/reports/:path*",
  ],
};
