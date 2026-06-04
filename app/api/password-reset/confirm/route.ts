import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import {
  completePasswordResetRequest,
  findValidPasswordResetRequestToken,
} from "@/lib/password-reset-requests";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "").trim();
  const password = String(formData.get("password") || "");
  const type = String(formData.get("type") || "customer").trim();

  if (!token || !password) {
    return NextResponse.redirect(new URL("/reset-password?error=1", request.url));
  }

  const tokenRecord = await findValidPasswordResetRequestToken(token);
  if (!tokenRecord) {
    return NextResponse.redirect(new URL("/reset-password?error=2", request.url));
  }

  const hashedPassword = await hashPassword(password);
  if (tokenRecord.userId) {
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword, hasLocalPassword: true },
    });
  } else if (tokenRecord.employeeId) {
    await prisma.employee.update({
      where: { id: tokenRecord.employeeId },
      data: { password: hashedPassword },
    });
  } else {
    return NextResponse.redirect(new URL("/reset-password?error=2", request.url));
  }

  await completePasswordResetRequest(tokenRecord.id);

  const destination = type === "employee" ? "/login_karyawan?reset=2" : "/login?reset=2";
  return NextResponse.redirect(new URL(destination, request.url));
}
