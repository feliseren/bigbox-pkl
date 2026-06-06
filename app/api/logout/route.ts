import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";

export async function POST(request: Request) {
  const response = NextResponse.redirect(toAppUrl("/", request.url));
  response.cookies.set(clearSessionCookie());
  response.cookies.set({
    name: "bb_remember",
    value: "0",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
