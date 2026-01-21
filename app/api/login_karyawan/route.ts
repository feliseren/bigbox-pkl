import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEmployeeSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const employeeId = String(formData.get("employeeId") || "").trim();
  const password = String(formData.get("password") || "");

  if (!employeeId || !password) {
    return NextResponse.redirect(
      new URL("/login_karyawan?error=1", request.url),
    );
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) {
    return NextResponse.redirect(
      new URL("/login_karyawan?error=1", request.url),
    );
  }

  const isValid = await verifyPassword(password, employee.password);
  if (!isValid) {
    return NextResponse.redirect(
      new URL("/login_karyawan?error=1", request.url),
    );
  }

  const response = NextResponse.redirect(
    new URL("/dashboard_karyawan", request.url),
  );
  response.cookies.set(createEmployeeSessionCookie(employee.id));
  return response;
}
