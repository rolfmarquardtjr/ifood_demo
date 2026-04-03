import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = () => process.env.JWT_SECRET!;
const JWT_EXPIRY = "8h";

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function verifyLogin(username: string, password: string): Promise<boolean> {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPassword) return false;
  if (!safeCompare(username, adminUser)) return false;
  return safeCompare(password, adminPassword);
}

export function createToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET(), { expiresIn: JWT_EXPIRY });
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return false;
    jwt.verify(token, JWT_SECRET());
    return true;
  } catch {
    return false;
  }
}

export function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}
