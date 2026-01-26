import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { findValidToken } from "@/lib/password-reset";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "").trim();
  const password = String(formData.get("password") || "");

  if (!token || !password) {
    return NextResponse.redirect(new URL("/reset-password?error=1", request.url));
  }

  const tokenRecord = await findValidToken(token);
  if (!tokenRecord) {
    return NextResponse.redirect(new URL("/reset-password?error=2", request.url));
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.update({
    where: { id: tokenRecord.id },
    data: { usedAt: new Date() },
  });

  return NextResponse.redirect(new URL("/login?reset=2", request.url));
}
