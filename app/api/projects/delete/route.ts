import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const projectId = String(formData.get("projectId") || "").trim();

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url));
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { role: true },
  });
  if (!employee || employee.role !== "PROJECT_MANAGEMENT") {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-projek?error=forbidden", request.url),
    );
  }

  if (!projectId) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-projek?error=1", request.url),
    );
  }

  await prisma.project.delete({ where: { id: projectId } });

  return NextResponse.redirect(new URL("/dashboard_karyawan/daftar-projek", request.url));
}
