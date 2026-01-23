import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, readEmployeeSessionId, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url));
  }

  const formData = await request.formData();
  const currentPassword = String(formData.get("currentPassword") || "").trim();
  const newPassword = String(formData.get("newPassword") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/profile?error=1", request.url),
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/profile?error=2", request.url),
    );
  }

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url));
  }

  const isValid = await verifyPassword(currentPassword, employee.password);
  if (!isValid) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/profile?error=3", request.url),
    );
  }

  const hashed = await hashPassword(newPassword);
  await prisma.employee.update({
    where: { id: employeeId },
    data: { password: hashed },
  });

  return NextResponse.redirect(
    new URL("/dashboard_karyawan/profile?success=1", request.url),
  );
}
