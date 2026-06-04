import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const remember = formData.get("remember") === "1";

    if (!email || !password) {
      return NextResponse.redirect(new URL("/login?error=1", request.url));
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.redirect(new URL("/login?error=1", request.url));
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.redirect(new URL("/login?error=1", request.url));
    }

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(createSessionCookie(user.id, remember));
    response.cookies.set({
      name: "bb_remember",
      value: remember ? "1" : "0",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    console.error("Customer login failed:", error);
    return NextResponse.redirect(new URL("/login?error=db", request.url));
  }
}
