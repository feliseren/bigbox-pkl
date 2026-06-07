import { NextResponse } from "next/server";
import { deleteWhatsNew } from "@/lib/whats-new-db";
import { toAppUrl } from "@/lib/app-url";
import { prisma } from "@/lib/prisma";
import { readEmployeeSessionId } from "@/lib/auth";
import { normalizeEmployeeRole } from "@/lib/employee-role";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("id") || "").trim();
  const redirectTo = String(
    formData.get("redirect") || "/dashboard_karyawan/whats-new",
  );

  const employeeId = await readEmployeeSessionId();
  if (!employeeId) {
    return NextResponse.redirect(toAppUrl("/login_karyawan", request.url), 303);
  }
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, select: { role: true },
  });
  const roleName = normalizeEmployeeRole(employee?.role);
  if (!employee || roleName !== "marketing") {
    return NextResponse.redirect(
      toAppUrl(`${redirectTo}?error=forbidden`, request.url),
      303,
    );
  }

  if (!id) {
    return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
  }

  try {
    await deleteWhatsNew(id, employeeId);
  } catch (error) {
    console.error("Failed to delete whats new:", error);
    return NextResponse.redirect(
      toAppUrl(`${redirectTo}?error=1`, request.url),
      303,
    );
  }

  return NextResponse.redirect(toAppUrl(redirectTo, request.url), 303);
}

