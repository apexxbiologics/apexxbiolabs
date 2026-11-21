// lib/admin-session.ts — server-only helper
import "server-only";

const COOKIE_NAME = "apexx_admin_auth";
export { COOKIE_NAME as ADMIN_COOKIE_NAME };
const MAX_AGE_MS = 8 * 60 * 60 * 1000;

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(payload: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

export async function createAdminToken(): Promise<string> {
  const payload = `admin:${Date.now() + MAX_AGE_MS}`;
  return `${payload}:${await sign(payload)}`;
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const match = /^admin:(\d{13}):([0-9a-f]{64})$/.exec(token);
  if (!match) return false;
  const expires = Number(match[1]);
  if (!Number.isSafeInteger(expires) || expires <= Date.now() || expires > Date.now() + MAX_AGE_MS) return false;
  const expected = await sign(`admin:${match[1]}`);
  const actual = match[2];
  // Constant-time comparison for correctly shaped hex signatures.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  return diff === 0;
}
