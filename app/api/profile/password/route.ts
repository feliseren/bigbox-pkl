import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  clearSessionCookie,
  hashPassword,
  readSessionUserId,
  verifyPassword,
} from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";

export async function POST(request: Request) {
  const userId = await readSessionUserId();
  if (!userId) {
    return NextResponse.redirect(toAppUrl("/login", request.url));
  }

  const formData = await request.formData();
  const currentPassword = String(formData.get("currentPassword") || "").trim();
  const newPassword = String(formData.get("newPassword") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (!newPassword || !confirmPassword) {
    return NextResponse.redirect(toAppUrl("/profile?error=1", request.url));
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.redirect(toAppUrl("/profile?error=2", request.url));
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.redirect(toAppUrl("/login", request.url));
  }

  const wasLocal = user.hasLocalPassword;
  if (wasLocal) {
    if (!currentPassword) {
      return NextResponse.redirect(toAppUrl("/profile?error=1", request.url));
    }
    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.redirect(toAppUrl("/profile?error=3", request.url));
    }
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed, hasLocalPassword: true },
  });

  const response = NextResponse.redirect(
    toAppUrl("/login?reset=2", request.url),
  );
  response.cookies.set(clearSessionCookie());
  return response;
}
