"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

// Wraps the app so any client component can call useSession()/signIn()/
// signOut() (login page, Sidebar/AppTopBar account menu, etc.) without each
// one needing its own fetch to /api/auth/session.
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
