import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const projectId = String(formData.get("projectId") || "").trim();
  const startLabel = String(formData.get("startLabel") || "").trim();
  const targetLabel = String(formData.get("targetLabel") || "").trim();
  const status = String(formData.get("status") || "").trim();

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(new URL("/login_karyawan", request.url));
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { role: { select: { name: true } } },
  });
  if (!employee || employee.role.name !== "PROJECT_MANAGEMENT") {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-projek?error=forbidden", request.url),
    );
  }

  if (!projectId || !startLabel || !targetLabel || !status) {
    return NextResponse.redirect(
      new URL("/dashboard_karyawan/daftar-projek?error=1", request.url),
    );
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      startLabel,
      targetLabel,
      employeeId,
      status,
    },
  });

  return NextResponse.redirect(new URL("/dashboard_karyawan/daftar-projek", request.url));
}

