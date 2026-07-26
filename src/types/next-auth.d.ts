// Module augmentation so `session.user.id` and JWT `token.id` are typed
// instead of falling back to `any` (DEVELOPMENT_RULES.md: avoid `any`).

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      emailVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    emailVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: boolean;
  }
}
