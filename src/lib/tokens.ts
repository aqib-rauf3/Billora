import { randomBytes } from "crypto";

export function generateToken() {
  return randomBytes(32).toString("hex");
}

export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h
