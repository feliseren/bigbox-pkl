import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { toAppUrl } from "@/lib/app-url";
import { normalizeEmployeeRole } from "@/lib/employee-role";
import { isProjectDateRangeValid } from "@/lib/project-date-validation";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("projectId") || "").trim();
  const startLabel = String(formData.get("startLabel") || "").trim();
  const targetLabel = String(formData.get("targetLabel") || "").trim();
  const status = String(formData.get("status") || "").trim();

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(toAppUrl("/login_karyawan", request.url));
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, select: { role: true },
  });
  const roleName = normalizeEmployeeRole(employee?.role);
  if (
    !employee ||
    (roleName !== "project manager" && roleName !== "project_management")
  ) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-projek?error=forbidden", request.url),
    );
  }

  if (!id || !startLabel || !targetLabel || !status) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-projek?error=1", request.url),
    );
  }

  if (!isProjectDateRangeValid(startLabel, targetLabel)) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-projek?error=date", request.url),
    );
  }

  const existingProject = await prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });

  if (existingProject) {
    return NextResponse.redirect(
      toAppUrl("/dashboard_karyawan/daftar-projek?error=duplicate-id", request.url),
    );
  }

  try {
    await prisma.project.create({
      data: {
        id,
        employeeId,
        startLabel,
        targetLabel,
        status,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.redirect(
        toAppUrl("/dashboard_karyawan/daftar-projek?error=duplicate-id", request.url),
      );
    }

    throw error;
  }

  return NextResponse.redirect(toAppUrl("/dashboard_karyawan/daftar-projek", request.url));
}


