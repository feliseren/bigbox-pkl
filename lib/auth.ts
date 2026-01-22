import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bb_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const EMPLOYEE_SESSION_COOKIE = "bb_employee";

function getSecret() {
  return process.env.AUTH_SECRET || "change-me";
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionCookie(userId: string) {
  const value = `${userId}.${sign(userId)}`;
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function readSessionUserId() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  const [id, sig] = cookie.split(".");
  if (!id || !sig) return null;
  if (sign(id) !== sig) return null;
  return id;
}

export function createEmployeeSessionCookie(employeeId: string) {
  const value = `${employeeId}.${sign(employeeId)}`;
  return {
    name: EMPLOYEE_SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function clearEmployeeSessionCookie() {
  return {
    name: EMPLOYEE_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function readEmployeeSessionId() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(EMPLOYEE_SESSION_COOKIE)?.value;
  if (!cookie) return null;
  const [id, sig] = cookie.split(".");
  if (!id || !sig) return null;
  if (sign(id) !== sig) return null;
  return id;
}
