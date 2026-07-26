// Catch-all NextAuth route — handles /api/auth/session, /api/auth/csrf,
// /api/auth/callback/credentials, /api/auth/signout, etc. This is what the
// client-side signIn()/signOut()/useSession() calls in the login page and
// AuthProvider talk to. The old /api/auth/login stub is gone — this route
// is where credential login actually happens now.

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
