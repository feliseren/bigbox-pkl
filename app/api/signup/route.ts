import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, hashPassword } from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const agreement = formData.get("agreement") === "1";

  if (!fullName || !email || !password || !confirmPassword) {
    return NextResponse.redirect(toAppUrl("/signup?error=1", request.url));
  }
  if (password !== confirmPassword) {
    return NextResponse.redirect(
      toAppUrl("/signup?error=password_mismatch", request.url),
    );
  }
  if (!agreement) {
    return NextResponse.redirect(toAppUrl("/signup?error=terms", request.url));
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.redirect(toAppUrl("/signup?error=exists", request.url));
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      password: hashed,
      hasLocalPassword: true,
    },
  });

  const response = NextResponse.redirect(toAppUrl("/", request.url));
  response.cookies.set(createSessionCookie(user.id));
  return response;
}
