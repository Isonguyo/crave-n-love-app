// Server-only admin session helpers. HMAC-signed cookies.
import { createHmac, timingSafeEqual } from "crypto";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const COOKIE_NAME = "cnl_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function issueAdminCookie(username: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${username}.${exp}`;
  const sig = sign(payload);
  setCookie(COOKIE_NAME, `${payload}.${sig}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearAdminCookie() {
  deleteCookie(COOKIE_NAME, { path: "/" });
}

export function readAdminCookie(): { username: string } | null {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [username, expStr, sig] = parts;
  const expected = sign(`${username}.${expStr}`);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  return { username };
}

export function assertAdmin(): { username: string } {
  const session = readAdminCookie();
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session;
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME;
  const p = process.env.ADMIN_PASSWORD;
  if (!u || !p) throw new Error("Admin credentials are not configured");
  const userOk = username.length === u.length && timingSafeEqual(Buffer.from(username), Buffer.from(u));
  const passOk = password.length === p.length && timingSafeEqual(Buffer.from(password), Buffer.from(p));
  return userOk && passOk;
}
